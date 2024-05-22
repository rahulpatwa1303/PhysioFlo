import { Dialog,Transition } from "@headlessui/react";
import { X, Pencil, Trash2, TimerIcon } from "lucide-react";
import "./styles.css";
import { Fragment } from "react";

export const EventDialog = (props: any) => {
  const { open, setOpen, handleSeriesDelete, ...rest } = props;
  return (
    <>
    <Transition show={open} as={Fragment}>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        as="div"
        className="relative z-10"
      >
        <Dialog.Panel className="fixed top-1/4 m-4 py-4 px-4 overflow-y-auto bg-teal-100 rounded-xl drop-shadow-xl custom-width">
          <Dialog.Title>
            <div className="flex justify-between">
              <div className="flex items-center gap-4 w-full">
                <span className="w-6 h-6 bg-teal-500 rounded-md" />
                <span>
                  <p>Test1</p>
                </span>
              </div>
              <div className="flex gap-3">
                <button>
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleSeriesDelete()}>
                  <Trash2 size={16} />
                </button>
                <button>
                  <X size={16} />
                </button>
              </div>
            </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="flex items-center gap-4 w-full mt-6">
              <TimerIcon />
              <span>
                <p>Test1</p>
                <p className="text-xs">Test2</p>
              </span>
            </div>
          </Dialog.Description>
          <div className="w-full flex gap-6 mt-8 flex-row-reverse border-t-2 pt-2 border-teal-900/20">
            <button onClick={() => setOpen(false)}>Mark complete</button>
            <button onClick={() => setOpen(false)}>Cancel visit</button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </Transition>
    </>
  );
};
