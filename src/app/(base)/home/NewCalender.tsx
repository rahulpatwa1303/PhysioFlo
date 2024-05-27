"use client";
import "@/app/globals.css";
import { cn } from "@/app/utils/generelUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";

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

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  const changeCurrentDay = (
    event: React.MouseEvent,
    day: {
      currentMonth: boolean;
      date: Date;
      month: number;
      number: number;
      selected: boolean;
      year: number;
    }
  ) => {
    event.stopPropagation();
    const newDate = new Date(day.year, day.month, day.number);
    setSelectedDate(newDate);
    router.push(
      pathname + "?" + createQueryString("date", newDate.toLocaleDateString())
    );
  };

  const goToPreviousMonth = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    router.push(
      pathname +
        "?" +
        createQueryString(
          "date",
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            1
          ).toLocaleDateString()
        )
    );
  };

  const goToNextMonth = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    router.push(
      pathname +
        "?" +
        createQueryString(
          "date",
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            1
          ).toLocaleDateString()
        )
    );
  };

  const goToToday = (event: React.MouseEvent) => {
    event.stopPropagation();
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    router.push(
      pathname + "?" + createQueryString("date", today.toLocaleDateString())
    );
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
    const queryDate = searchParams.get("date");
    if (queryDate) {
      const newDate = new Date(queryDate);
      if (currentDate.toLocaleDateString() !== newDate.toLocaleDateString()) {
        setCurrentDate(newDate);
        setSelectedDate(newDate);
      }
    }
  }, [currentDate, searchParams]);

  const calendarDays = useMemo(() => {
    let firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    let weekdayOfFirstDay = firstDayOfMonth.getDay();
    let days = [];

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
        currentMonth: firstDayOfMonth.getMonth() === currentDate.getMonth(),
        date: new Date(firstDayOfMonth),
        month: firstDayOfMonth.getMonth(),
        number: firstDayOfMonth.getDate(),
        selected:
          firstDayOfMonth.toDateString() === selectedDate.toDateString(),
        year: firstDayOfMonth.getFullYear(),
      };

      days.push(calendarDay);
    }

    return days;
  }, [currentDate, selectedDate]);

  return (
    <div className="text-brand-600 text-sm">
      <div
        onClick={toggleDetails}
        className="flex items-center gap-4 cursor-pointer"
      >
        {selectedDate.getDate()} {months[selectedDate.getMonth()]}{" "}
        {selectedDate.getFullYear()}
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
          className={`lucide lucide-chevron-down transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </div>
      {isOpen && (
        <div>
          <div className="flex items-center justify-between w-full mb-2 text-brand-500 mt-2">
            <button
              onClick={goToToday}
              className="border border-brand-400 bg-brand-400 text-brand-100 font-semibold px-4 py-2 rounded-lg text-md"
            >
              Today
            </button>
            <div className="space-x-8">
              <button onClick={goToPreviousMonth}>
                <ChevronLeft />
              </button>
              <button onClick={goToNextMonth}>
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="flex flex-col w-[22rem] items-center">
            <div className="divide-y w-full h-[0.05rem] bg-brand-200" />
            <div className="flex flex-col mt-2">
              <div className="flex grow flex-wrap justify-center gap-5 text-sm">
                {weekdays.map((weekday, index) => (
                  <div key={index} className="weekday">
                    <p>{weekday}</p>
                  </div>
                ))}
              </div>
              <div className="table-content flex grow flex-wrap justify-center text-sm">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`relative calendar-day w-[45px] h-[35px] flex justify-center items-center font-semibold ${
                      day.currentMonth ? "current " : "opacity-20"
                    } ${
                      day.selected
                        ? "selected bg-brand-400 rounded-full text-brand-100"
                        : ""
                    }`}
                    onClick={(e) => changeCurrentDay(e, day)}
                  >
                    <p className="absolute text-sm">{day.number}</p>
                    <div className="grid grid-cols-4 absolute bottom-0 gap-1 flex-wrap ">
                      {visits.map((v: any, i: number) => {
                        const dataMatch =
                          new Date(v.visit_start_date).toLocaleDateString() ===
                          new Date(day.date).toLocaleDateString();
                        return (
                          dataMatch && (
                            <div
                              className={cn(
                                `h-1 w-1 rounded-full flex-[1 0 21%] ${v.patient_color}`
                              )}
                              key={`${new Date(
                                v.visit_start_date
                              ).toLocaleDateString()}-${i}`}
                            />
                          )
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewCalender;
