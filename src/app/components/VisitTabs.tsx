"use client";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { cn } from "../utils/generelUtils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Phone, X, Undo, CircleHelp } from "lucide-react";
import VisitCard from "./VisitCard";
import { VisitInfo } from "@/Types";
import { toast } from "sonner";
import { Popover, Transition } from "@headlessui/react";

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

  const handleVisitUpdate = async (
    visit: VisitInfo,
    action: string,
    setLoading: any
  ) => {
    const response = await fetch("/api/update-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visit, action }),
    });
    if (response.status === 201) {
      const toastMsg =
        action === "undo"
          ? `${visit.name}'s visit has been successfully undone.`
          : `${visit.name}'s visit has been marked as ${action}`;
      toast(toastMsg);
      router.refresh();
      setLoading({ loading: false, type: action });
    } else {
      setLoading({ loading: false, type: action });
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
    <div>
      <div
        className={`w-full border border-brand-300  rounded-lg py-2 px-1 pb-0 font-bold flex justify-around mb-4`}
      >
        {tabsMenu.map((t, idx) => {
          return <Tabs {...t} key={idx} />;
        })}
      </div>
      <div className="space-y-4">
        <Popover>
          <Popover.Button>
            <CircleHelp size={20} />
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 top-[10rem] text-start bg-brand-100 w-screen max-w-80 text-xs rounded-lg drop-shadow-lg py-1 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-xl">
                {activeView === "visit-log"
                  ? "You can view all the unfinished visits in this tab."
                  : activeView === "completed"
                  ? "You can view all the completed visits in this tab."
                  : "You can view all the visits here."}
              </Popover.Panel>
            </Transition>
          </Popover.Button>
        </Popover>
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
                idx={`${visit.name}-${visit.patient_color}-${idx}`}
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
                idx={`${visit.name}-${visit.patient_color}-${idx}`}
                handleVisitUpdate={handleVisitUpdate}
                viewType={"completed"}
              />
            );
          } else if (activeView === "full-log") {
            return (
              <VisitCard
                visit={visit}
                key={`${visit.name}-${idx}`}
                idx={`${visit.name}-${visit.patient_color}-${idx}`}
                handleVisitUpdate={handleVisitUpdate}
                viewType={"full-log"}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default VisitTabs;
