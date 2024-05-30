import React from "react";
import UserPhoto from "../components/profile/UserPhoto";
import SignOut from "../(base)/SignOut";
import { getServerSession } from "next-auth";
import connectDB from "../lib/connectDB";
import Form from "../Models/patient";
import Visit from "../Models/visits";

async function Dashboard() {
  const session = await getServerSession();
  await connectDB();

  const executeQueryToGetActivePatientVsit = await Form.countDocuments({
    userEmail: session?.user?.email,
    active_visit: true,
  });

  const executeQueryToGetCompletedVsit = await Visit.find({
    doctor_email: session?.user?.email,
    visit_start_date: {
      $gte: new Date().setHours(0, 0, 0, 0),
      $lt: new Date().setHours(23, 59, 59, 59),
    },
  });

  const plainVisits = JSON.parse(JSON.stringify(executeQueryToGetCompletedVsit));

  const completedCount =
  plainVisits && executeQueryToGetCompletedVsit.filter((v) => v.completed).length;
const cancelledCount =
  plainVisits && executeQueryToGetCompletedVsit.filter((v) => v.cancel).length;
  

  return (
    <div className="px-4 pt-16 h-full pb-[60px] space-y-4 overflow-auto backdrop-blur-3xl">
      <div className="flex justify-between">
        <div className="flex flex-col text-right">
          <p className="text-4xl text-brand-700 font-bold">
            {executeQueryToGetActivePatientVsit || 0}
          </p>
          <p className="text-sm text-brand-700">Current patient visits</p>
        </div>
        <div className="flex flex-col text-right">
          <p className="text-4xl text-brand-700 font-bold">
            {completedCount || 0}
          </p>
          <p className="text-sm text-brand-700">Current patient visits</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
