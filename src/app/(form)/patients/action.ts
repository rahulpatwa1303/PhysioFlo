"use server";

import Form from "@/app/Models/patient";
import Visit from "@/app/Models/visits";
import connectDB from "@/app/lib/connectDB";
import { google } from "googleapis";

const colorNames: any = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
  "indigo",
  "teal",
  "cyan",
  "lime",
  "orange",
  "amber",
  "rose",
  "emerald",
];

const shades = [400, 500, 600, 700, 800, 900];

function generateTailwindColorClasses() {
  const colorClasses: any = [];

  colorNames.forEach((color: string) => {
    shades.forEach((shade) => {
      colorClasses.push(`bg-${color}-${shade}`);
    });
  });

  return colorClasses;
}

// function generateRandomColor() {
//   const randomIndex = Math.floor(Math.random() * tailwindColorClasses.length);
//   return tailwindColorClasses[randomIndex];
// }

// Generate the color classes array
const tailwindColorClasses = generateTailwindColorClasses();

function generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
}

const createVisitsForDateRange = async ({
  doctorEmail,
  newData,
  startDate,
  endDate,
  patientColor,
}: any) => {
  // Function to add days to a date
  const addDays = (date: any, days: any) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const documentsToInsert = [];

  // Generate documents for each date in the range
  for (let dt = startDate; dt <= endDate; dt = addDays(dt, 1)) {
    documentsToInsert.push({
      doctor_email: doctorEmail,
      name: newData.name,
      phone_number: newData.phone_number,
      address: newData.address,
      visit_timing: newData.visit_timing,
      visit_start_date: dt,
      patient_color: patientColor,
    });
  }
  await Visit.insertMany(documentsToInsert);
};

export const createPatient = async (data: any, session: any) => {
  await connectDB();
  const newData = { ...data };

  if (newData.fee) {
    newData.fee = parseFloat(newData.fee);
  }

  let visitEndData = new Date();

  if (newData.repeat_visit_toggle) {
    if (newData.end_on === "date") {
      visitEndData = new Date(newData.sessions);
    } else {
      const today = new Date();
      today.setDate(today.getDate() + parseInt(newData.sessions));
      visitEndData = today;
    }
  }
  const startDate = newData.repeat_visit_toggle
    ? new Date(newData?.visit_start_date)
    : new Date().toLocaleString();

  const patientColor = generateRandomColor();
  try {
    await Form.create({
      userEmail: session?.user?.email,
      name: newData.name,
      phone_number: newData.phone_number,
      birth_year: newData?.birth_year,
      address: newData?.address,
      reason_for_visit: newData.reason_for_visit,
      start_of_issue: newData.start_of_issue,
      level_of_pain: newData.level_of_pain,
      pain_radiate: newData.pain_radiate,
      pain_radiate_desc: newData.pain_radiate_desc,
      injuries: newData.injuries,
      injuries_desc: newData.injuries_desc,
      underlying_health_condition: newData.underlying_health_condition,
      underlying_health_condition_desc:
        newData.underlying_health_condition_desc,
      fee: newData.fee,
      repeat_visit_toggle: newData.repeat_visit_toggle,
      repeat_interval: newData.repeat_interval,
      visit_timing: newData.visit_timing,
      visit_start_date: startDate,
      visit_end: new Date(visitEndData),
      color: patientColor,
    });

    await createVisitsForDateRange({
      doctorEmail: session?.user?.email,
      newData: newData,
      startDate: new Date(startDate),
      endDate: visitEndData,
      patientColor: patientColor,
    });
    // await Visit.create({
    //   name: newData.name,
    //   phone_number: newData.phone_number,
    //   address: newData?.address,
    //   visit_timing: newData?.visit_timing,
    //   visit_start_date: startDate,
    //   visit_end: visitEndData,
    // });

    if (newData.repeat_visit_toggle) {
      const summary = `${newData.name} visit`;
      const description = `Address ${newData.address}`;
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const oAuth2Client = new google.auth.OAuth2();
      oAuth2Client.setCredentials({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
        id_token: session.idToken,
      });

      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

      const event: any = {
        summary,
        description,
        start: {
          dateTime: new Date(newData.visit_start_date),
          timeZone: timeZone,
        },
        end: {
          dateTime: visitEndData,
          timeZone: timeZone,
        },
        attendees: [{ email: session?.user?.email }],
      };

      try {
        calendar.events.insert({
          calendarId: "primary",
          requestBody: event,
        });
      } catch (error) {
        console.error("Error creating event", error);
      }
    }
    return { success: true, isCalender: newData.repeat_visit_toggle };
  } catch (e) {
    return { success: false };
  }
};
