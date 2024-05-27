import Visit from "@/app/Models/visits";
import VisitTabs from "@/app/components/VisitTabs";
import connectDB from "@/app/lib/connectDB";
import { getServerSession } from "next-auth";
import "../../globals.css";
import NewCalender from "./NewCalender";

async function Home({ searchParams }: { searchParams: any }) {
  const session = await getServerSession();
  await connectDB();
  console.log("searchParams", searchParams);
  console.log("gte", new Date(searchParams.date).setHours(0, 0, 0, 0));
  console.log("lte", new Date(searchParams.date).setHours(23, 59, 59, 59));
  const searchDate = new Date(searchParams.date);

  const startMonth = new Date(
    searchDate.getFullYear(),
    searchDate.getMonth(),
    1
  ).setHours(0, 0, 0, 0);

  const endMonth = new Date(
    searchDate.getFullYear(),
    searchDate.getMonth() + 1,
    0
  ).setHours(23, 59, 59, 59);
  console.log("startMonth", startMonth);
  console.log("endMonth", endMonth);
  const query = {
    doctor_email: session?.user?.email,
    visit_start_date: {
      $gte: new Date(searchParams.date).setHours(0, 0, 0, 0),
      $lt: new Date(searchParams.date).setHours(23, 59, 59, 59),
    },
  };

  const queryForCount = {
    doctor_email: session?.user?.email,
    visit_start_date: {
      $gte: new Date(startMonth),
      $lt: new Date(endMonth),
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
  const allComplete = completedCount === totalCount;
  const allPending = completedCount === pendingCount;

  return (
    <div
      className="px-4 pt-16 h-full pb-[60px] space-y-4 overflow-auto backdrop-blur-3xl"
      key={`${totalCount}-${pendingCount}-visit`}
    >
      <NewCalender visits={plainVisitsMonthly} />
      <VisitTabs
        visits={plainVisits}
        completedCount={completedCount}
        pendingCount={pendingCount}
        totalCount={totalCount}
      />
    </div>
  );
}

export default Home;
