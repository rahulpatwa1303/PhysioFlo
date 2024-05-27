import { VisitCardProps } from "@/Types";
import { Check, LoaderCircle, Phone, Undo, X } from "lucide-react";
import { cn } from "../utils/generelUtils";
import { useState } from "react";

function VisitCard({
  visit,
  idx,
  handleVisitUpdate,
  viewType,
}: VisitCardProps) {
  const [isLoading, setIsLoading] = useState({ loading: false, type: "" });

  const handleButtonClick = async (status: string) => {
    setIsLoading({ loading: true, type: status });
    handleVisitUpdate(visit, status, setIsLoading);
  };

  const color = visit.patient_color;
  return (
    <div
      className="py-4 px-4 border border-brand-400 rounded-xl flex items-center justify-between"
      key={`${visit.name}-${idx}`}
    >
      <div className="flex flex-row ">
        <div className={cn(`w-1 rounded-xl h-10 rotate-180 ${color}`)} />
        <div className={cn(`pl-2 `)}>
          <p className="font-bold text-brand-800">{visit.name}</p>
          <a
            href={`tel:+91${visit.phone_number}`}
            className="flex items-center gap-2 text-xs text-brand-700"
          >
            Connect with Patient <Phone size={18} />
          </a>
        </div>
      </div>
      {viewType === "visit-log" && (
        <div className="flex justify-between items-center gap-4">
          <button
            className="bg-brand-400 text-brand-700 p-1 rounded-lg disabled:opacity-50"
            onClick={() => handleButtonClick("complete")}
            disabled={isLoading.loading}
          >
            {isLoading.loading && isLoading.type === "complete" ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Check size={18} />
            )}
          </button>
          <button
            className="border border-rose-400 text-rose-500 p-1 rounded-lg disabled:opacity-50"
            onClick={() => handleButtonClick("cancel")}
            disabled={isLoading.loading}
          >
            {isLoading.loading && isLoading.type === "cancel" ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <X size={18} />
            )}
          </button>
        </div>
      )}
      {viewType === "completed" && (
        <div className="flex justify-between items-center gap-4">
          <button
            className="bg-brand-400 text-brand-700 p-1 rounded-lg disabled:opacity-50"
            onClick={() => handleButtonClick("undo")}
            disabled={isLoading.loading}
          >
            {isLoading.loading && isLoading.type === "undo" ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Undo size={18} />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default VisitCard;
