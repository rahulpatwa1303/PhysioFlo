import { ChangeEvent } from "react";

export interface events {
  title: string;
  start: Date;
  end?: Date;
  color?: string;
  id: number;
}

export interface stepper {
  steps: { label: string; completed: boolean; error?: boolean }[];
  activeStep: number;
}

type inputTypes = string | "text";

export interface inputProps {
  label: string;
  placeholder?: string;
  type?: inputTypes;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  required: boolean;
  width?: string;
  placement?: string;
  error?: boolean;
  range?: number;
  left?: string;
  right?: string;
  isVisible?: string;
  radioChange?: (event: ChangeEvent<HTMLInputElement>, key: string) => void;
  value?: {};
  default?: boolean | string | number;
  options: { title: string; value: string | number }[];
  showAlert?: boolean;
  alertMessage?: string;
  minValue?: number | string;
}

export interface MyError {
  [key: string]: boolean; // Keys can be any string, values are booleans
}

export interface VisitInfo {
  name: string;
  phone_number: string;
  patient_color: string;
}
export interface VisitCardProps {
  visit: VisitInfo;
  idx: string;
  handleVisitUpdate: (
    visit: VisitInfo,
    action: string,
    setIsLoading: any
  ) => {};
  viewType: string;
}
