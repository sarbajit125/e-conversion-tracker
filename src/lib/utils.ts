import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum UploadType {
  Entry=0,
  Acknowledgement=1,
  Conversion=2
}

export const getCurrencySymbol = (code: string): string => {
  switch (code) {
    case "INR":
      return "₹";
    default:
      return "$";
  }
}
export const recentDateDisplayFormat = 'MMMM DD, YYYY'

export function formatAmount(amount: number, currency: string) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
  
  return formattedAmount;
}
// [
//   "Application Details",
//   "",
//   "District :",
//   "Khurda",
//   " ",
//   "Tahasil :",
//   "Bhubaneswar",
//   "",
//   "Applica",
//   "Ɵ",
//   "on No. :",
//   "2022200211924",
//   " ",
//   "Date :",
//   " ",
//   "17/12/2022",
//   "",
//   "Applicant Name :",
//   "Sushil Dev Rout",
//   "",
//   "Father's/Husband's Name :",
//   "Shatrughan Rout",
//   "",
//   "LAND SCHEDULE",
//   "",
//   "Village Name",
//   " ",
//   "Khata No",
//   " ",
//   "Plot No",
//   " ",
//   "Area (in Acres)",
//   " ",
//   "Area (in Hectares)",
//   "",
//   "େଗାଠପଟଣା",
//   " ",
//   "683/1490",
//   " ",
//   "668",
//   " ",
//   "0.2000",
//   " ",
//   "0.0809",
//   "",
//   "N.B: Please quote the Applica",
//   "Ɵ",
//   "on No. for future correspondence.",
//   "",
//   "Firefox",
//   " ",
//   "about:blank",
//   "",
//   "1 of 1",
//   " ",
//   "17/12/2022, 18:49"
// ]