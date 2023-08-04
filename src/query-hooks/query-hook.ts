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
