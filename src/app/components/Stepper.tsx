import React from "react";
import { Check } from "lucide-react";
import { stepper } from "@/Types";

function Stepper({ steps, activeStep }: stepper) {

  return (
    <ol className="flex items-center justify-center">
      {steps?.map((step, index) => (
        <div
          className={`flex flex-col text-teal-800 text-ellipsis transition ${
            index !== steps.length - 1 ? "w-full" : "w-2/4"
          }`}
          key={`${step.label}-${index}`}
        >
          <li
            className={`flex items-center w-full after:h-1 after:rounded-xl after:w-full after:mx-1  ${
              index !== steps.length - 1 ? "" : "after:hidden"
            } ${
              activeStep === index
                ? "after:bg-teal-600 transition"
                : "after:bg-teal-300 transition"
            } transition-all ease-in`}
          >
            <span className="flex items-center flex-col">
              <span
                className={`flex border-2 border-teal-400 ${
                  step?.error && "border-rose-500"
                } items-center justify-center ${
                  activeStep === index
                    ? "w-4 h-4 border-8 !border-teal-500"
                    : "w-4 h-4"
                } ${step.completed && "!border-teal-500"} rounded-full`}
              >
                {activeStep === index ? (
                  <span />
                ) : (
                  step.completed && <Check className="w-4 h-4 text-teal-800" />
                )}
              </span>
            </span>
          </li>
          <span
            className={`text-transparent ${
              activeStep === index && "!text-teal-800"
            } lg:block truncate text-xs`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </ol>
  );
}

export default Stepper;
