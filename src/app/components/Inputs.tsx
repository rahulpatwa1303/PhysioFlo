import { inputProps } from "@/Types";
import "@/app/globals.css";
import { RadioGroup } from "@headlessui/react";
import { cn } from "../utils/generelUtils";

const repearEvery = [
  {
    key: "day",
    title: "Days",
  },
  {
    key: "weeks",
    title: "Weeks",
  },
  {
    key: "month",
    title: "Months",
  },
];

function isElementVisible(isVisibleCondition: any, value: any) {
  if (!isVisibleCondition) {
    return true;
  }
  return Object.keys(isVisibleCondition).every(
    (key) => value.hasOwnProperty(key) && value[key] === isVisibleCondition[key]
  );
}

function Inputs(props: inputProps) {
  const showVisible = isElementVisible(
    props.isVisible && JSON.parse(props.isVisible),
    props.value!
  );
  const inputField = `block w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-teal-400 focus-visible:outline-teal-600 focus:ring-teal-500 focus:text-teal-800 ${props?.width} `;
  const visibleClass = `${showVisible ? "block" : "hidden"} transition-all `;
  return (
    <div key={`${props.label}-${props.type}`} className={cn(`w-full`)}>
      {props.type !== "checkbox" &&
      props.type !== "repeats" &&
      props.type !== "radio" &&
      props.type !== "select" ? (
        <div className={cn(`w-full mt-2 ${visibleClass}`)}>
          <label
            className={`block text-teal-800 truncate max-w-1/2 ${
              props.error && "!text-rose-600"
            } font-semibold text-sm`}
          >
            {props.label}
          </label>
          <div className="mt-1">
            <input
              key={`${props.name}-${props.type}`}
              type={props.type}
              name={props.name}
              value={(props.value as { [key: string]: string })[props.name]}
              onChange={props.onChange}
              placeholder={props.placeholder}
              min={props.minValue}
              className={cn(
                `w-full accent-teal-400 border-teal-200  ${
                  props.type !== "range" && inputField
                }
                ${props.error && "!ring-rose-500"}
                `
              )}
            />
            {props.type === "range" && (
              <div
                aria-hidden="true"
                className="flex accent-teal-400 text-teal-800  font-semibold text-sm justify-between px-1"
              >
                {Array.from(Array(props.range).keys()).map((ran, index) => (
                  <span key={`${ran}-${index}`}>{ran + 1}</span>
                ))}
              </div>
            )}
          </div>
          {props.error && (
            <label className="pt-1 block text-rose-500 text-sm">
              {props?.helperText}
            </label>
          )}
        </div>
      ) : props.type === "select" ? (
        <div className={cn(`mt-2 ${visibleClass}`)}>
          <label
            className={`block text-teal-800 truncate max-w-1/2 ${
              props.error && "!text-rose-600"
            } font-semibold text-sm`}
          >
            {props.label}
          </label>
          <select
            className={cn(
              `${inputField} !text-left capitalize !bg-transparent mt-1`
            )}
            data-show-alert={props.showAlert}
          >
            {props.options.map((option, index) => (
              <option
                value={option.value}
                key={`${option.title}-${index}`}
                className="mt-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                {option.title}
              </option>
            ))}
          </select>
        </div>
      ) : props.type === "radio" ? (
        <div className={cn(`w-full mt-2 ${visibleClass}`)}>
          <RadioGroup
            onChange={(event: any) => props?.radioChange!(event, "end_on")}
            name="end_on"
            value={(props.value as { [key: string]: string })["end_on"]}
          >
            <RadioGroup.Label
              className={`block text-teal-800 ${
                props.error && "!text-rose-600"
              } font-semibold text-sm mt-2`}
            >
              Ends
            </RadioGroup.Label>
            <RadioGroup.Option value="date">
              {({ checked }) => (
                <div className="flex items-center gap-4 justify-between">
                  <span className="flex items-center gap-4">
                    <div
                      className={cn(
                        `h-4 w-4 rounded-full border-2 ${
                          checked && "bg-teal-600"
                        } border-teal-600`
                      )}
                    />
                    <label className="block text-teal-900 font-semibold text-md">
                      On
                    </label>
                  </span>
                  <input
                    type="date"
                    className={cn(`mt-1 ${inputField} max-w-[300px]`)}
                    placeholder="Set time"
                    onChange={props.onChange}
                    value={
                      (props.value as { [key: string]: string })["sessions"]
                    }
                    name="sessions"
                  />
                </div>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="session">
              {({ checked }) => (
                <div className="flex items-center gap-4 mt-2 justify-between">
                  <span className="flex items-center gap-4">
                    <div
                      className={cn(
                        `h-4 w-4 rounded-full border-2 ${
                          checked && "bg-teal-600"
                        } border-teal-600`
                      )}
                    />
                    <label className="block text-teal-900 font-semibold text-md">
                      After
                    </label>
                  </span>
                  <div
                    className={cn(
                      `mt-1 !flex gap-4 ${inputField} max-w-[300px]`
                    )}
                  >
                    <input
                      type="number"
                      name="sessions"
                      value={parseInt(
                        (props.value as { [key: string]: string })["sessions"]
                      )}
                      onChange={props.onChange}
                      className={cn(
                        `w-12 focus-visible:outline-0 focus-visible:border-b focus-visible:border-teal-400 `
                      )}
                      placeholder="Set time"
                    />
                    <span className="text-teal-800 font-semibold text-md">
                      Visits
                    </span>
                  </div>
                </div>
              )}
            </RadioGroup.Option>
          </RadioGroup>
        </div>
      ) : (
        <div className={cn(`w-full mt-2 ${visibleClass}`)}>
          <label
            className={`block text-teal-800  ${
              props.error && "!text-rose-600"
            } font-semibold text-sm`}
          >
            {props.label}
          </label>
          <label className="inline-flex  items-center space-x-4 cursor-pointer text-teal-800 mt-2">
            <span>{props.left}</span>
            <span className="relative">
              <input
                type={props?.type}
                name={props?.name}
                onChange={props.onChange}
                placeholder={props.placeholder}
                className="hidden peer"
                checked={
                  (props.value as { [key: string]: boolean })[props.name]
                }
                value={(props?.value as { [key: string]: string })[props?.name]}
                defaultValue={
                  (props?.value as { [key: string]: string })[props?.name]
                }
                data-show-alert={props?.showAlert}
                data-alert-message={props?.alertMessage}
              />
              <div className="w-10 h-6 rounded-full shadow-inner bg-teal-400/30 peer-checked:dark:bg-teal-400"></div>
              <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto bg-teal-800"></div>
            </span>
            <span>{props?.right}</span>
          </label>
          {props?.error && (
            <label className="pt-1 block text-rose-500 text-sm">
              {props?.helperText}
            </label>
          )}
        </div>
      )}
    </div>
  );
}

export default Inputs;
