"use client";
import "@/app/globals.css";
import { cn } from "@/app/utils/generelUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function NewCalender({ visits }: { visits: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const CalenderDays = (props: {
    changeCurrentDay: (day: {
      currentMonth: boolean;
      date: Date;
      month: number;
      number: number;
      selected: boolean;
      year: number;
    }) => void;
    day: Date;
  }) => {
    let firstDayOfMonth = new Date(
      props.day.getFullYear(),
      props.day.getMonth(),
      1
    );
    let weekdayOfFirstDay = firstDayOfMonth.getDay();
    let currentDays = [];

    for (let day = 0; day < 42; day++) {
      if (day === 0 && weekdayOfFirstDay === 0) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
      } else if (day === 0) {
        firstDayOfMonth.setDate(
          firstDayOfMonth.getDate() + (day - weekdayOfFirstDay)
        );
      } else {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
      }

      let calendarDay = {
        currentMonth: firstDayOfMonth.getMonth() === props.day.getMonth(),
        date: new Date(firstDayOfMonth),
        month: firstDayOfMonth.getMonth(),
        number: firstDayOfMonth.getDate(),
        selected: firstDayOfMonth.toDateString() === props.day.toDateString(),
        year: firstDayOfMonth.getFullYear(),
      };

      currentDays.push(calendarDay);
    }

    return (
      <div className="table-content flex grow flex-wrap justify-center text-sm">
        {currentDays.map((day, index) => {
          return (
            <div
              key={index}
              className={
                "relative calendar-day w-[45px] h-[35px] flex justify-center items-center font-semibold " +
                (day.currentMonth ? "current  " : "opacity-20") +
                (day.selected
                  ? "selected bg-teal-400 rounded-full text-teal-100"
                  : "")
              }
              onClick={() => props.changeCurrentDay(day)}
            >
              <p className="absolute text-sm">{day.number}</p>
              <div className="grid grid-cols-4 absolute bottom-0 gap-1 flex-wrap ">
                {visits.map((v: any, i: number) => {
                  return (
                    new Date(v.visit_start_date).toLocaleDateString() ===
                      new Date(day.date).toLocaleDateString() && (
                      <p
                        className={cn(`h-1 w-1 rounded-full flex-[1 0 21%]`)}
                        key={`${new Date(
                          v.visit_start_date
                        ).toLocaleDateString()}-${i}`}
                        style={{ background: v.patient_color }}
                      ></p>
                    )
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [toggleOpen, setToggleOpen] = useState(false);

  const changeCurrentDay = (day: {
    currentMonth: boolean;
    date: Date;
    month: number;
    number: number;
    selected: boolean;
    year: number;
  }) => {
    setCurrentDate(new Date(day.year, day.month, day.number));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    router.push(
      pathname +
        "?" +
        createQueryString("date", currentDate.toLocaleDateString())
    );
  }, [currentDate]);

  return (
    <details
      className={`[&_svg]:open:rotate-180 transition-all transform text-teal-600 text-sm`}
    >
      <summary className="flex items-center gap-4">
        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-down "
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </summary>
      <div className="flex justify-between w-full mb-2 text-teal-500 mt-2">
        <button
          onClick={goToToday}
          className="border border-teal-400 px-4 py-2 rounded-lg text-xs"
        >
          Today
        </button>
        <div className="space-x-8">
          <button onClick={goToPreviousMonth}>
            <ChevronRight />
          </button>
          <button onClick={goToNextMonth}>
            <ChevronLeft />
          </button>
        </div>
      </div>

      <div className="flex flex-col w-[22rem] items-center">
        <div className="divide-y w-full h-[0.05rem] bg-teal-200" />
        <div className="flex flex-col mt-2">
          <div className="flex grow flex-wrap justify-center gap-5 text-sm">
            {weekdays.map((weekday, index) => {
              return (
                <div key={index} className="weekday">
                  <p>{weekday}</p>
                </div>
              );
            })}
          </div>
          <CalenderDays day={currentDate} changeCurrentDay={changeCurrentDay} />
        </div>
      </div>
    </details>
  );
}

export default NewCalender;
