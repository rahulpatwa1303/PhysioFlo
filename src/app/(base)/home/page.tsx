import Visit from "@/app/Models/visits";
import VisitTabs from "@/app/components/VisitTabs";
import connectDB from "@/app/lib/connectDB";
import { getServerSession } from "next-auth";
import "../../globals.css";
import NewCalender from "./NewCalender";

interface VisitFiltering {
  completed: boolean;
  cancel: boolean;
}

async function Home({ searchParams }: { searchParams: any }) {
  const session = await getServerSession();
  await connectDB();

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

  const activeVisits = plainVisits.filter(
    (v: VisitFiltering) => !v.completed && !v.cancel
  );
  const completedVisits = plainVisits.filter(
    (v: VisitFiltering) => v.completed
  );
  const pendingVisits = plainVisits.filter(
    (v: VisitFiltering) => !v.completed && !v.cancel
  );

  const totalCount = plainVisits && visits.length;
  const allComplete = completedVisits.length === plainVisits.length;
  const allPending = pendingVisits.length === plainVisits.length;

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
        allComplete={allComplete}
        allPending={allPending}
      />
    </div>
  );
}

export default Home;
