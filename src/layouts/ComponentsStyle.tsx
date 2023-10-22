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
  category: Yup.string().oneOf(['conversion', 'pauti', 'slot']).required("Mandatory field"),
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
  conversion_transaction_amount: number;
  conversion_transaction_date: string;
}
export const EditTicketValidation: Yup.Schema<EditTicketFormSchema> = Yup.object().shape({
  conversion_case_no: Yup.string().required("Mandatory field"),
  conversion_transaction_id: Yup.string().required("Mandatory field"),
  conversion_transaction_amount: Yup.number().required("Mandatory field").typeError('Must be number'),
  conversion_transaction_date: Yup.string().required("Mandatory field"),
})
export interface EditTicketRequestSchema {
  application_id: string
  conversion_case_no: string;
  conversion_transaction_id: string;
  conversion_transaction_amount: string;
  conversion_transaction_date: string;
}

export const EditTicketRequestValidation: Yup.Schema<EditTicketRequestSchema> = Yup.object().shape({
  conversion_case_no: Yup.string().required("Mandatory field"),
  conversion_transaction_id: Yup.string().required("Mandatory field"),
  conversion_transaction_amount: Yup.string().required("Mandatory field"),
  conversion_transaction_date: Yup.string().required("Mandatory field"),
  application_id: Yup.string().required("Mandatory field"),
})

export interface SlotTicketFormSchema {
  firstParty: string;
  secondParty: string;
  district: string;
  officeName: string;
  slotDate: Date;
  time: string;
  application_id: string;
}
export const SlotTicktFormValidation: Yup.Schema<SlotTicketFormSchema> = Yup.object().shape({
  firstParty: Yup.string().required("Mandatory field"),
  secondParty: Yup.string().required("Mandatory field"),
  district: Yup.string().required("Mandatory field"),
  officeName: Yup.string().required("Mandatory field"),
  time: Yup.string().required("Mandatory field"),
  application_id: Yup.string().required("Mandatory field"),
  slotDate: Yup.date().required("Mandatory field"),
})

export interface EPautiFormSchema {
  applicant_name: string;
  applicant_id: string;
  tahsil: string;
  mouza: string;
  khata: string;
  transaction_date: Date;
  financial_year: string;
  transaction_amount: Number;
}

export const EPautiFormValidation: Yup.Schema<EPautiFormSchema> = Yup.object().shape({
  applicant_name: Yup.string().required("Mandatory field"),
  applicant_id: Yup.string().required("Mandatory field"),
  tahsil: Yup.string().required("Mandatory field"),
  mouza: Yup.string().required("Mandatory field"),
  khata: Yup.string().required("Mandatory field"),
  financial_year: Yup.string().required("Mandatory field"),
  transaction_date: Yup.date().required("Mandatory field"),
  transaction_amount: Yup.number().required("Mandatory field").min(0 , "amount cannot be less than zero")
})

export interface UploadFileRequest {
  filename: string,
  file: File
}

export interface DownloadFileRequest {
  filename: string,
  type: string
}