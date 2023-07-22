import  { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from "react";

export interface RegularTextfieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  additionalStyle?: RegularTextfieldStyles;
  leftView?: ReactNode
}
export interface RegularTextfieldStyles {
  div?: string;
  input?: string;
  label?: string;
}