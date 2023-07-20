import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

export interface RegularTextfieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  additionalStyle?: RegularTextfieldStyles;
  isError?: boolean;
  errMsg?: string;
  register: UseFormRegister<FieldValues>; // declare register props
}
interface RegularTextfieldStyles {
  div?: string;
  input?: string;
  label?: string;
}
