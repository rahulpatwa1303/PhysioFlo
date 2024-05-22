"use client";
import Inputs from "@/app/components/Inputs";
import Stepper from "@/app/components/Stepper";
import { cn } from "@/app/utils/generelUtils";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createPatient } from "../action";

const buttonVariant = {
  default:
    "bg-teal-600 px-4 py-2 rounded-lg disabled:bg-teal-100 disabled:text-teal-800",
  outline:
    "border border-teal-600 px-4 py-2 rounded-lg text-teal-600 disabled:bg-teal-100 disabled:text-teal-800",
};

function Onboard() {
  const [steps, setSteps] = useState([
    {
      label: "Patient Information",
      id: 1,
      key: "patient_info",
      completed: false,
      error: false,
    },
    {
      label: "Visit Reason",
      id: 2,
      key: "reason_for_visit",
      completed: false,
      error: false,
    },
    {
      label: "Pain Assessment",
      id: 3,
      key: "pain_assessment",
      completed: false,
      error: false,
    },
    {
      label: "Treatment Information",
      id: 4,
      key: "treatment_info",
      completed: false,
      error: false,
    },
  ]);
  const route = useRouter()
  const [submitLoader, setLoader] = useState(false);

  const [state, setState] = useState({
    name: "",
    phone_number: "",
    birth_year: "",
    address: "",
    reason_for_visit: "",
    start_of_issue: "",
    surgeries: "",
    level_of_pain: 1,
    pain_radiate: false,
    fee: 0,
    injuries: false,
  });
  const [error, setError] = useState<any>({});
  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setState((prev) => ({ ...prev, [event.target.name]: value }));
    if (event.target.dataset.showAlert) {
      toast(event.target.dataset.alertMessage);
    }
  };

  const handleChangeRadio = (event: Event, key: string) => {
    const value = event;
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const form = {
    patient_info: [
      {
        label: "Full name",
        name: "name",
        placeholder: "Full name of the patient",
        helperText: "Full name is required",
        required: true,
        value: state.name,
      },
      [
        {
          label: "Phone number",
          name: "phone_number",
          type: "tel",
          placeholder: "Phone number of the patient",
          helperText: "Phone number is required",
          required: true,
          value: state.phone_number,
        },
        {
          label: "Birth Year",
          name: "birth_year",
          type: "date",
          placeholder: "Birth year of the patient",
          helperText: "Birth year is required",
          required: false,
          value: state.birth_year,
        },
      ],
      {
        label: "Address",
        name: "address",
        type: "textarea",
        placeholder: "Address of the patient",
        helperText: "Address is required",
        required: false,
        value: state.address,
      },
    ],
    reason_for_visit: [
      {
        label: "Briefly describe the reason for your visit today",
        name: "reason_for_visit",
        placeholder: "Reason for visit",
        helperText: "Reason for visit is required",
        required: true,
        value: state.reason_for_visit,
      },
      {
        label: "When did the issue begin?",
        name: "start_of_issue",
        placeholder: "When did the issue begin?",
        helperText: "This is requied",
        required: true,
        value: state.start_of_issue,
      },
    ],
    pain_assessment: [
      {
        label: "Level of pain",
        name: "level_of_pain",
        type: "range",
        range: 10,
        placeholder: "Reason for visit",
        helperText: "Reason for visit is required",
        required: false,
        value: state.level_of_pain,
      },
      [
        {
          label: "Does the pain radiate?",
          type: "checkbox",
          name: "pain_radiate",
          left: "No",
          right: "Yes",
          placeholder: "When did the issue begin?",
          helperText: "This is requied",
          default: false,
          required: false,
          value: state.pain_radiate,
        },
        {
          label: "Please describe",
          type: "text",
          name: "pain_radiate_desc",
          left: "No",
          right: "Yes",
          placeholder: "Pain radiate des",
          helperText: "This is requied",
          default: false,
          required: false,
          value: state?.pain_radiate_desc,
          isVisible: '{"pain_radiate":true}',
        },
      ],
      [
        {
          label: "Any injuries/surgeries?",
          type: "checkbox",
          name: "injuries",
          left: "No",
          right: "Yes",
          placeholder: "When did the issue begin?",
          helperText: "This is requied",
          default: false,
          required: false,
          value: state.injuries,
        },
        {
          label: "Please describe",
          type: "text",
          name: "injuries_desc",
          left: "No",
          right: "Yes",
          placeholder: "Injuries can be added comma seprated",
          helperText: "This is requied",
          default: false,
          required: false,
          value: state?.injuries_desc,
          isVisible: '{"injuries":true}',
        },
      ],
      [
        {
          label: "Underlying health condition?",
          type: "checkbox",
          name: "underlying_health_condition",
          left: "No",
          right: "Yes",
          placeholder: "When did the issue begin?",
          helperText: "This is requied",
          default: false,
          required: false,
          value: state.injuries,
        },
        {
          label: "Please describe",
          type: "text",
          name: "underlying_health_condition_desc",
          left: "No",
          right: "Yes",
          placeholder: "Pain radiate des",
          helperText: "This is requied",
          default: false,
          required: false,
          value: state?.underlying_health_condition_desc,
          isVisible: '{"underlying_health_condition":true}',
        },
      ],
    ],
    treatment_info: [
      [
        {
          label: "Fee",
          name: "fee",
          type: "number",
          placeholder: "Fee per visit",
          helperText: "Fee is required",
          required: true,
          value: state.fee,
          minValue: 100,
        },
      ],
      {
        label: "Set visit timing",
        name: "visit_timing",
        type: "time",
        placeholder: "Visit timing",
        required: true,
        value: state?.visit_timing,
      },
      {
        label: "Repeat visit",
        name: "repeat_visit_toggle",
        type: "checkbox",
        left: "No",
        right: "Yes",
        placeholder: "Would repeat the visit on your calender",
        required: false,
        value: state.fee,
        showAlert: true,
        alertMessage:
          "Enabling this would add the visit to your google calender based on the options you select",
      },
      {
        label: "Repeat Every",
        name: "repeat_interval",

        type: "select",
        options: [
          {
            title: "Days",
            value: "days",
          },
          {
            title: "Week",
            value: "week",
          },
          {
            title: "Month",
            value: "month",
          },
        ],
        placeholder: "Would repeat the visit on your calender",
        required: false,
        value: state.fee,
        isVisible: '{"repeat_visit_toggle":true}',
      },
      {
        label: "Start from",
        name: "visit_start_date",
        type: "date",
        placeholder: "When would the visit",
        required: false,
        value: state?.visit_start_date,
        isVisible: '{"repeat_visit_toggle":true}',
      },
      {
        label: "Visit end",
        name: "visit_end",
        type: "radio",
        placeholder: "When would the visit",
        required: false,
        value: state?.visit_start_date,
        isVisible: '{"repeat_visit_toggle":true}',
      },
    ],
  };

  const validateStep = (stepIndex: number) => {
    const currentStep = steps[stepIndex];
    const formFields = form[currentStep.key];
    let isValid = true;
    let newError: {} = { ...error };

    formFields.forEach((field: any) => {
      if (Array.isArray(field)) {
        field.forEach((subField) => {
          if (subField.required && !state[subField.name]) {
            if (subField.type === "checkbox") {
              if (
                typeof state[subField.name] === "undefined" ||
                !state[subField.name]
              ) {
                return;
              }
            }
            isValid = false;
            newError[subField.name] = true;
          } else {
            newError[subField.name] = false;
          }
        });
      } else {
        if (field.required && !state[field.name]) {
          if (field.type === "checkbox") {
            if (
              typeof state[field.name] === "undefined" ||
              !state[field.name]
            ) {
              return;
            }
          }
          isValid = false;
          newError[field.name] = true;
        } else {
          newError[field.name] = false;
        }
      }
    });

    setError(newError);
    // setSteps((prevSteps) =>
    //   prevSteps.map((step, index) =>
    //     index === stepIndex ? { ...step, error: !isValid } : step
    //   )
    // );

    if (!isValid) {
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === stepIndex ? { ...step, error: !isValid } : step
        )
      );
    }

    return isValid;
  };
  const session = useSession();

  const handleSubmit = async () => {
    const lastStepValid = validateStep(steps.length - 1);
    const allComplete = steps.every((step) => step.completed || lastStepValid);
    if (allComplete) {
      const sessionData = session.data;
      setLoader(true);
      const submitData = await createPatient(state, sessionData);
      if (submitData.success === true) {
        setLoader(false);
        toast(`The patient has been successfully onboarded.`);
        route.replace('/home')
        submitData?.isCalender === true &&
          toast("The visit will appear in your Google Calendar shortly.");
      }
    } else {
      console.log("Please complete all required fields.");
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === activeStep ? { ...step, completed: true } : step
        )
      );
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="mt-14 px-4">
      <Stepper steps={steps} activeStep={activeStep} />
      <span className="text-xl my-8 text-teal-800 font-semibold">
        {steps[activeStep]?.label}
      </span>
      {form[steps[activeStep]?.key].map((field: any, index: number) => {
        if (Array.isArray(field)) {
          return (
            <div key={index} className="flex w-full gap-4">
              {field.map((subField, subIndex) => (
                <Inputs
                  key={`${subField}-${subIndex}`}
                  {...subField}
                  error={error[subField?.name]}
                  onChange={handleChange}
                  radioChange={handleChangeRadio}
                  value={state}
                />
              ))}
            </div>
          );
        } else {
          return (
            <Inputs
              key={`${field}-${index}`}
              {...field}
              error={error[field?.name]}
              onChange={handleChange}
              radioChange={handleChangeRadio}
              value={state}
            />
          );
        }
      })}
      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <button
            className={cn(buttonVariant.default)}
            disabled={activeStep === 0}
            onClick={handlePrevious}
          >
            Previous
          </button>
          <button
            className={cn(buttonVariant.default)}
            disabled={activeStep === steps.length - 1}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className={cn(`flex gap-2 ${buttonVariant.default}`)}
            disabled={activeStep !== steps.length - 1 || submitLoader}
            onClick={handleSubmit}
          >
            Submit {submitLoader && <LoaderCircle className="animate-spin" />}
          </button>
          <button className={cn(buttonVariant.outline)} onClick={() => route.back()}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Onboard;
