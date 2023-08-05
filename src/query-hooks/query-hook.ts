import { DashboardResp } from "@/app/api/route";
import {
  APISuccessResp,
  APiErrorResp,
  PDFFormSchema,
} from "@/layouts/ComponentsStyle";
import axiosInstance from "@/networking/axiosInstance";
import { AxiosError } from "axios";

const handleAPIError = (err: unknown) => {
  console.log("Coming Error 2");
  if (err instanceof AxiosError) {
    console.log("Coming Error 3");
    const errObj = new APiErrorResp(err.response?.data.userMsg)
    return errObj;
  } else {
    console.log("Coming Error 4");
    return new APiErrorResp("Something went wrong");
  }
};

export const createConversionTicket = async (
  data: PDFFormSchema
): Promise<APISuccessResp> => {
  try {
    const response = await axiosInstance.post<APISuccessResp>(
      "/api/create-ticket",
      data
    );
    return response.data;
  } catch (error) {
    console.log("Coming Error 1");
    throw handleAPIError(error);
  }
};

export const axiosDashboardData = async (): Promise<DashboardResp> => {
  try {
    const response = await axiosInstance.get<DashboardResp>('/api');
    return response.data
  } catch (error) {
    throw handleAPIError(error);
  }
}
export const fetchDashboardData = async (): Promise<DashboardResp> => {
  try {
    const response = await fetch('http://localhost:3000/api')
    if(!response.ok) {
      throw new APiErrorResp('Response code not matching');
    } else {
      return  await response.json() as Promise<DashboardResp>
    }
  } catch (error) {
    throw handleAPIError(error);
  }
}