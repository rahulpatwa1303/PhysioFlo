import { Dialog } from "@headlessui/react";
import { X, Pencil, Trash2, TimerIcon } from "lucide-react";
import "./styles.css";

const RadioGroup = ({ title }: { title: string }) => {
  return (
    <label className="relative flex items-center cursor-pointer">
      <input
        checked={true}
        className="sr-only peer"
        name="futuristic-radio"
        type="radio"
      />
      <div className="w-6 h-6 bg-transparent border-2 border-teal-500 rounded-full peer-checked:bg-teal-500 peer-checked:border-teal-500 peer-hover:shadow-lg peer-hover:shadow-teal-500/50  peer-checked:shadow-teal-500/50 transition duration-300 ease-in-out"></div>
      <span className="ml-2 text-teal-950">{title}</span>
    </label>
  );
};

export const SeriesDeleteDialog = (props: any) => {

  const { open, setDeleteVisitDialog, ...rest } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setDeleteVisitDialog({ open: false })}
      as="div"
      className="relative z-10 "
    >
      <div className="fixed top-1/3 left-4 m-4 py-4 px-4 overflow-y-auto bg-teal-200 rounded-xl drop-shadow-xl custom-width-series">
        <Dialog.Panel>
          <Dialog.Title>
            <div className="flex justify-between">
              <p>Delete repeating visit</p>
            </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="flex flex-col space-y-4 p-5">
              <RadioGroup title={"Remove this"} />
              <RadioGroup title={"Remove all"} />
            </div>
          </Dialog.Description>
          <div className="w-full flex gap-6 flex-row border-t-2 pt-2 border-teal-900/20">
            <button onClick={() => setDeleteVisitDialog({ open: false })} className="text-teal-800/40">
              Cancel
            </button>
            <button onClick={() => setDeleteVisitDialog({ open: false })} className="text-sky-800">
              Ok
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
