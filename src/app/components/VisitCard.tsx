import { VisitCardProps } from "@/Types";
import { Check, Phone, Undo, X } from "lucide-react";

function VisitCard({
  visit,
  idx,
  handleVisitUpdate,
  viewType,
}: VisitCardProps) {
  return (
    <div
      className="py-4 px-4 border border-brand-400 rounded-xl flex items-center justify-between"
      key={`${visit.name}-${idx}`}
    >
      <div
        className="border-l-2 pl-2"
        style={{ borderColor: visit.patient_color }}
      >
        <p className="font-bold text-brand-800">{visit.name}</p>
        <a
          href={`tel:+91${visit.phone_number}`}
          className="flex items-center gap-2 text-xs text-brand-700"
        >
          Connect with Patient <Phone size={18} />
        </a>
      </div>
      {viewType === "visit-log" && (
        <div className="flex justify-between items-center gap-4">
          <button
            className="bg-brand-400 text-brand-700 p-1 rounded-lg"
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
      )}
      {viewType === "completed" && (
        <div className="flex justify-between items-center gap-4">
          <button
            className="bg-brand-400 text-brand-700 p-1 rounded-lg"
            onClick={() => handleVisitUpdate(visit, "undo")}
          >
            <Undo size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default VisitCard;
