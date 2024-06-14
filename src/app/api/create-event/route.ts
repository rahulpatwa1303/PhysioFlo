import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "../auth/[...nextauth]/auth";

async function getAccessToken(session: any) {
  if (Date.now() < session.accessTokenExpires) {
    return session.accessToken;
  }
  const refreshedToken = await refreshAccessToken(session);
  session.accessToken = refreshedToken.accessToken;
  session.accessTokenExpires = refreshedToken.accessTokenExpires;

  return session.accessToken;
}

export async function POST(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const body = await req.json();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" });
  }

  const accessToken = await getAccessToken(session);

  const parseDateWithTime = (
    dateString: string | Date,
    timeString: string
  ): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const visitTiming = body.visit_timing || "14:48";

  // Start Date
  const startDate = body?.state?.repeat_visit_toggle
    ? parseDateWithTime(body.state.visit_start_date, visitTiming).toISOString()
    : parseDateWithTime(new Date(), visitTiming).toISOString();

  // End Date
  let visitEndData: string;

  if (body?.state?.repeat_visit_toggle) {
    if (body.state.end_on === "date") {
      visitEndData = parseDateWithTime(
        body.state.sessions,
        visitTiming
      ).toISOString();
    } else {
      const today = new Date();
      today.setDate(today.getDate() + parseInt(body.state.sessions));
      visitEndData = parseDateWithTime(today, visitTiming).toISOString();
    }
  } else {
    visitEndData = parseDateWithTime(new Date(), visitTiming).toISOString();
  }

  const event = {
    summary: `${body?.state?.name} visit`,
    location: body?.state?.address || "",
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: startDate,
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: visitEndData,
      timeZone: "America/Los_Angeles",
    },
    attendees: [{ email: session.email }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 10 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  const data = await response.json();
  if (response.ok) {
    return NextResponse.json(data);
  } else {
    return NextResponse.json(data);
  }
}
