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

export interface PDFFormSchema {
  applicant_name: string;
  application_id: string;
  mouza: string;
  tahsil: string;
  khata: string;
  application_transaction_id: string;
  ready_for_conversion:boolean
  application_entry_date?: string;
  application_fees_amount?: string;
  conversion_case_no?: string;
  conversion_transaction_id?: string;
  conversion_transaction_amount?: string;
  conversion_transaction_date?: string;
}
