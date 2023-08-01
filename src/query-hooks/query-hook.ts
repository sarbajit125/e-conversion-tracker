import {
  APISuccessResp,
  APiErrorResp,
  PDFFormSchema,
} from "@/layouts/ComponentsStyle";
import axiosInstance from "@/networking/axiosInstance";
import { useMutation } from "@tanstack/react-query";
export const useCreateTicket = () =>
  useMutation({
    mutationKey: ["create-ticket"],
    mutationFn: (data: PDFFormSchema) => {
        console.log("coming here")
      return axiosInstance
        .post<APISuccessResp>("/api/create-ticket", data)
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          throw handleAPIError(err);
        });
    },
  });

const handleAPIError = (err: unknown) => {
  if (err instanceof APiErrorResp) {
    return err;
  } else {
    return new APiErrorResp("Something went wrong");
  }
};
