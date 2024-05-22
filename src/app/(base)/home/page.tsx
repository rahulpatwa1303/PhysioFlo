import { events } from "@/Types";
import "../../globals.css";
import Calender from "./Calender";
import SpeedDial from "./SpeedDial";
import connectDB from "@/app/lib/connectDB";
import NewCalender from "./NewCalender";
import { getServerSession } from "next-auth";
import Visit from "@/app/Models/visits";
import VisitTabs from "@/app/components/VisitTabs";

async function Home({ searchParams }: { searchParams: any }) {
  const session = await getServerSession();
  await connectDB();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const query = {
    doctor_email: session?.user?.email,
    visit_start_date: {
      $gte: new Date(searchParams.date).setHours(0, 0, 0, 0),
      $lt: new Date(searchParams.date).setHours(23, 59, 59, 59),
    },
  };

  const searchDate = new Date(searchParams.date);

  const queryForCount = {
    doctor_email: session?.user?.email,
    visit_start_date: {
      $gte: new Date(
        searchDate.getFullYear(),
        searchDate.getMonth(),
        1
      ).setHours(0, 0, 0, 0),
      $lt: new Date(
        searchDate.getFullYear(),
        searchDate.getMonth() + 1,
        0
      ).setHours(23, 59, 59, 59),
    },
  };

  const visits = await Visit.find(query);
  const visitsForMonth = await Visit.find(queryForCount);
  const plainVisits = JSON.parse(JSON.stringify(visits));
  const plainVisitsMonthly = JSON.parse(JSON.stringify(visitsForMonth));

  const completedCount =
    plainVisits && visits.filter((v) => v.completed).length;
  const pendingCount =
    plainVisits && visits.filter((v) => !v.completed && !v.cancel).length;
  const totalCount = plainVisits && visits.length;

  return (
    <div className=" px-4 pt-16 h-screen space-y-4  backdrop-blur-3xl">
      <NewCalender visits={plainVisitsMonthly} />
      <VisitTabs
        visits={plainVisits}
        completedCount={completedCount}
        pendingCount={pendingCount}
        totalCount={totalCount}
      />
      <SpeedDial />
    </div>
  );
}

export default Home;
