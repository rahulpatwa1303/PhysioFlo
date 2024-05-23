"use client";
import React, { useCallback, useEffect } from "react";
import { cn } from "../utils/generelUtils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Phone, X, Undo } from "lucide-react";

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

  const handleVisitUpdate = async (visit: any, action: string) => {
    const response = await fetch("/api/update-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visit, action }),
    });
    router.refresh();
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
        className={`w-full border border-teal-300  rounded-lg py-2 px-1 pb-0 font-bold flex justify-around `}
      >
        {tabsMenu.map((t, idx) => {
          return <Tabs {...t} key={idx}/>;
        })}
      </div>
      {visits.map((visit: any, idx: number) => {
        if (
          activeView === "visit-log" &&
          !visit.completed &&
          visit.cancel === false
        ) {
          return (
            <div
              className="py-4 px-4 border border-teal-400 rounded-xl flex items-center justify-between"
              key={`${visit.name}-${idx}`}
            >
              <div
                className="border-l-2 pl-2"
                style={{ borderColor: visit.patient_color }}
              >
                <p className="font-bold text-teal-800">{visit.name}</p>
                <a
                  href={`tel:+91${visit.phone_number}`}
                  className="flex items-center gap-2 text-xs text-teal-700"
                >
                  Connect with Patient <Phone size={18} />
                </a>
              </div>
              <div className="flex justify-between items-center gap-4">
                <button
                  className="bg-teal-400 text-teal-700 p-1 rounded-lg"
                  onClick={() => handleVisitUpdate(visit, "complete")}
                >
                  <Check size={18} />
                </button>
                <button
                  className="border border-rose-400 text-rose-500 p-1 rounded-lg"
                  onClick={() => handleVisitUpdate(visit, "cancel")}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          );
        } else if (
          activeView === "completed" &&
          visit.completed &&
          !visit.cancel
        ) {
          return (
            <div
              className="py-4 px-4 border border-teal-400 rounded-xl flex items-center justify-between"
              key={`${visit.name}-${idx}`}
            >
              <div
                className="border-l-2 pl-2"
                style={{ borderColor: visit.patient_color }}
              >
                <p className="font-bold text-teal-800">{visit.name}</p>
                <a
                  href={`tel:+91${visit.phone_number}`}
                  className="flex items-center gap-2 text-xs text-teal-700"
                >
                  Connect with Patient <Phone size={18} />
                </a>
              </div>
              <div className="flex justify-between items-center gap-4">
                <button
                  className="bg-teal-400 text-teal-700 p-1 rounded-lg"
                  onClick={() => handleVisitUpdate(visit, "undo")}
                >
                  <Undo size={18} />
                </button>
              </div>
            </div>
          );
        } else if (activeView === "full-log") {
          return (
            <div
              className="py-4 px-4 border border-teal-400 rounded-xl flex items-center justify-between"
              key={`${visit.name}-${idx}`}
            >
              <div
                className="border-l-2 pl-2"
                style={{ borderColor: visit.patient_color }}
              >
                <p className="font-bold text-teal-800">{visit.name}</p>
                <a
                  href={`tel:+91${visit.phone_number}`}
                  className="flex items-center gap-2 text-xs text-teal-700"
                >
                  Connect with Patient <Phone size={18} />
                </a>
              </div>
            </div>
          );
        }
      })}
    </>
  );
}

export default VisitTabs;
