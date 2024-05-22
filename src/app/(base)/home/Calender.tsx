"use client";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Dialog, Listbox } from "@headlessui/react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { events } from "@/Types";
import { EventDialog } from "./EventDialog";
import { SeriesDeleteDialog } from "./SeriesDeleteDialog";

// TODO, need to have the calender render by fetching details from URL

const calenderView = [
  { id: 1, name: "Month", value: "dayGridMonth" },
  { id: 2, name: "Week", value: "timeGridWeek" },
  { id: 3, name: "Day", value: "timeGridDay" },
];

function Calender({ events }: { events: events[] }) {
  const calenderRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(calenderView[2]);
  const [viewData, setViewData] = useState("");

  const [open, setOpen] = useState({
    open: false,
  });
  const [deleteVisitDialog, setDeleteVisitDialog] = useState({
    open: false,
  });

  const changeView = (event) => {
    const { value } = event;
    calenderRef.current.getApi().changeView(value);
    setSelectedPerson(event);
  };
  const chaneToToday = () => {
    calenderRef.current.getApi().today();
  };

  const handleIncrementView = (type: string) => {
    if (type === "next") {
      calenderRef.current.getApi().next();
    } else if (type === "prev") {
      calenderRef.current.getApi().prev();
    }
    setViewData(calenderRef.current.getApi().currentData.viewTitle);
  };

  useEffect(() => {
    setViewData(calenderRef?.current?.getApi().currentData.viewTitle);
  }, []);

  const handleSeriesDelete = () => {
    const dialogState = {
      open: true,
      setDeleteVisitDialog: setDeleteVisitDialog,
    };
    setDeleteVisitDialog(dialogState);
  };

  const handleDialog = (e) => {
    const dialogState = {
      open: true,
      setOpen: setOpen,
      handleSeriesDelete: handleSeriesDelete,
    };
    setOpen(dialogState);
  };

  const viewOptions = {
    view: ["dayGridMonth", "timeGridWeek", "timeGridDay"],
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="flex mr-1">
            <button
              className=" bg-teal-100 px-4 py-2 rounded-lg"
              onClick={chaneToToday}
            >
              Today
            </button>
            <button onClick={() => handleIncrementView("prev")}>
              <ChevronLeft />
            </button>
            <button onClick={() => handleIncrementView("next")}>
              <ChevronRight />
            </button>
          </div>
          <p>{viewData}</p>
        </div>
        <Listbox value={selectedPerson} onChange={changeView}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-teal-100 py-2 pl-3 pr-10 text-left border border-LightestGray focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{selectedPerson.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown
                  className="h-5 w-5 text-gray-400 ui-open:rotate-180 transition ease-in"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 z-10 overflow-auto rounded-md bg-teal-200 py-1 text-base shadow-lg  ring-black/5 focus:outline-none sm:text-sm cursor-pointer">
              {calenderView.map((view, index) => (
                <Listbox.Option
                  key={`${view.id}-${index}`}
                  value={view}
                  className={"ui-selected:bg-MidnightMystery/10  px-4 py-2"}
                >
                  {view.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
      <FullCalendar
        headerToolbar={{
          left: "",
          center: "",
          right: " ",
        }}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView={"timeGridDay"}
        views={viewOptions}
        ref={calenderRef}
        height={"42rem"}
        events={events}
        eventClick={handleDialog}
        slotDuration={{
          hours: 1,
        }}
      />
      {open?.open && <EventDialog {...open} />}
      {deleteVisitDialog?.open && <SeriesDeleteDialog {...open} />}
    </>
  );
}

export default Calender;
