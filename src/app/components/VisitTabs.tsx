"use client";
import React, { useCallback, useEffect } from "react";
import { cn } from "../utils/generelUtils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Phone, X, Undo } from "lucide-react";
import VisitCard from "./VisitCard";
import { VisitInfo } from "@/Types";
import { toast } from "sonner";

const buttonVariant = {
  default:
    "border-b-2 flex items-center gap-2 cursor-pointer w-full h-full justify-center py-2 pt-0 px-1 border-transparent text-sm",
};
const BadgeVariant = {
  default: "h-6 w-6 text-sm rounded-full flex items-center justify-center p-2",
};

function VisitTabs({
  visits,
  completedCount,
  pendingCount,
  totalCount,
}: {
  visits: any;
  completedCount: number;
  pendingCount: number;
  totalCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const activeView = searchParams.get("visits_for") || "today";

  const Tabs = ({
    Title,
    visitCount,
    dataActiveAttri,
    value,
    badgeColor,
    textColor,
  }: {
    Title: string;
    visitCount: number;
    dataActiveAttri: string;
    value: string;
    badgeColor: string;
    textColor: string;
  }) => {
    return (
      <div
        className={cn(
          `${buttonVariant.default} ${dataActiveAttri} ${textColor}`
        )}
        data-active={activeView === value}
        onClick={() => {
          router.push(pathname + "?" + createQueryString("visits_for", value));
        }}
      >
        {Title}
        <div className={cn(`${BadgeVariant.default} ${badgeColor}`)}>
          {visitCount}
        </div>
      </div>
    );
  };

  const tabsMenu = [
    {
      Title: "Visit Log",
      visitCount: pendingCount,
      value: "visit-log",
      dataActiveAttri: "data-[active=true]:border-teal-500",
      textColor: "text-teal-500",
      badgeColor: "bg-teal-500/10 text-teal-600",
    },
    {
      Title: "Completed",
      visitCount: completedCount,
      value: "completed",
      dataActiveAttri: "data-[active=true]:border-green-500",
      textColor: "text-green-500",
      badgeColor: "bg-green-500/10 text-green-600",
    },
    {
      Title: "Full Log",
      visitCount: totalCount,
      value: "full-log",
      dataActiveAttri: "data-[active=true]:border-rose-500",
      textColor: "text-rose-500",
      badgeColor: "bg-rose-500/10 text-rose-600",
    },
  ];

  const handleVisitUpdate = async (visit: VisitInfo, action: string) => {
    const response = await fetch("/api/update-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visit, action }),
    });
    if (response.status === 201) {
      console.log("response", response);
      const toastMsg =
        action === "undo"
          ? `${visit.name}visit has been successfully undone.`
          : `${visit.name}'s visit has been marked as ${action}`;
      toast(toastMsg);
      router.refresh();
    }
  };

  useEffect(() => {
    const isQuery = searchParams.get("visits_for");
    if (!isQuery) {
      router.push(
        pathname + "?" + createQueryString("visits_for", "visit-log")
      );
    }
  }, []);

  return (
    <>
      <div
        className={`w-full border border-brand-300  rounded-lg py-2 px-1 pb-0 font-bold flex justify-around `}
      >
        {tabsMenu.map((t, idx) => {
          return <Tabs {...t} key={idx} />;
        })}
      </div>
      {visits.map((visit: any, idx: number) => {
        if (
          activeView === "visit-log" &&
          !visit.completed &&
          visit.cancel === false
        ) {
          return (
            <VisitCard
              visit={visit}
              key={`${visit.name}-${idx}`}
              idx={`${visit.name}-${idx}`}
              handleVisitUpdate={handleVisitUpdate}
              viewType={"visit-log"}
            />
          );
        } else if (
          activeView === "completed" &&
          visit.completed &&
          !visit.cancel
        ) {
          return (
            <VisitCard
              visit={visit}
              key={`${visit.name}-${idx}`}
              idx={`${visit.name}-${idx}`}
              handleVisitUpdate={handleVisitUpdate}
              viewType={"completed"}
            />
          );
        } else if (activeView === "full-log") {
          return (
            <VisitCard
              visit={visit}
              key={`${visit.name}-${idx}`}
              idx={`${visit.name}-${idx}`}
              handleVisitUpdate={handleVisitUpdate}
              viewType={"full-log"}
            />
          );
        }
      })}
    </>
  );
}

export default VisitTabs;
