import  { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from "react";
import * as Yup from "yup";
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
export const validationSchema: Yup.Schema<PDFFormSchema> = Yup.object().shape({
  applicant_name: Yup.string().required("Mandatory field"),
  application_id: Yup.string().required("Mandatory field"),
  mouza: Yup.string().required("Mandatory field"),
  tahsil: Yup.string().required("Mandatory field"),
  khata: Yup.string().required("Mandatory field"),
  application_transaction_id: Yup.string().required("Mandatory field"),
  application_entry_date: Yup.string(),
  application_fees_amount: Yup.string(),
  conversion_case_no: Yup.string(),
  conversion_transaction_id: Yup.string(),
  conversion_transaction_amount: Yup.string(),
  conversion_transaction_date: Yup.string(),
  ready_for_conversion: Yup.boolean().required(),
});

export class APiErrorResp extends Error {
    userMsg: string
    timeStamp: string
    constructor(userMsg: string, timeStamp: string = Date(), message?: string) {
      super(message)
      this.userMsg = userMsg
      this.timeStamp = timeStamp
    }
}
export interface APISuccessResp {
  message: string
  timeStamp: string
}
export interface SearchFormSchema {
  application_id: string;
  category: string;
  sort: boolean
}
export interface DeleteTicketSchema {
  application_id: string;
  category: string;
}
export const DeleteValidation: Yup.Schema<DeleteTicketSchema> = Yup.object().shape({
  application_id: Yup.string().required("Mandatory field"),
  category: Yup.string().oneOf(['conversion', 'pauti']).required("Mandatory field"),
})

export const SearchValidation: Yup.Schema<SearchFormSchema> = Yup.object().shape({
  application_id: Yup.string().required("Mandatory field"),
  category: Yup.string().oneOf(['conversion', 'pauti']).required("Mandatory field"),
  sort: Yup.boolean().default(true)
})
export interface SearchTableResp {
  id: string,
  name: string,
  category: string,
  status: string
}
export interface EditTicketFormSchema {
  conversion_case_no: string;
  conversion_transaction_id: string;
  conversion_transaction_amount: string;
  conversion_transaction_date: string;
}
export const EditTicketValidation: Yup.Schema<EditTicketFormSchema> = Yup.object().shape({
  application_fees_amount: Yup.string().required("Mandatory field"),
  conversion_case_no: Yup.string().required("Mandatory field"),
  conversion_transaction_id: Yup.string().required("Mandatory field"),
  conversion_transaction_amount: Yup.string().required("Mandatory field"),
  conversion_transaction_date: Yup.string().required("Mandatory field"),
})