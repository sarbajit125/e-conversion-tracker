import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

export interface RegularTextfieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  additionalStyle?: RegularTextfieldStyles;
}
interface RegularTextfieldStyles {
  div?: string;
  input?: string;
  label?: string;
}