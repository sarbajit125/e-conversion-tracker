"use client";
import RegularDatePicker from "@/components/RegularDatePicker";
import RegularTextfield from "@/components/RegularTextfield";
import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { Formik, Form } from "formik";
import { UploadType } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  APiErrorResp,
  PDFFormSchema,
  validationSchema,
} from "@/layouts/ComponentsStyle";
import { createConversionTicket } from "@/query-hooks/query-hook";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import CustomOverlay from "@/components/CustomOverlay";
import { IntlMessages } from "../../get-localization";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function CreateTicket({ localizeDict }: CreateTicketProps) {
  const [formInitalValues, setInitalValues] = useState<PDFFormSchema>({
    applicant_name: "",
    application_id: "",
    mouza: "",
    tahsil: "",
    khata: "",
    application_transaction_id: "",
    application_entry_date: "",
    application_fees_amount: "",
    conversion_case_no: "",
    conversion_transaction_id: "",
    conversion_transaction_amount: "",
    conversion_transaction_date: "",
    ready_for_conversion: false,
  });
  const { toast } = useToast();
  const { push } = useRouter();
  const pdfMutation = useMutation({
    mutationKey: ["create-ticket"],
    mutationFn: (data: PDFFormSchema) => createConversionTicket(data),
    onError(error, variables, context) {
      console.log("Error coming here");
      toast({
        title: "Error",
        description: error instanceof APiErrorResp ? error.userMsg : "",
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });
      push("/");
    },
  });
  const [showConversionDiv, setConversionDiv] = useState<boolean>(false);
  const onSubmit = (values: PDFFormSchema) => pdfMutation.mutate(values);
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    uploadType: UploadType
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      handleReadPdfText(file, uploadType);
    }
  };
  const handleReadPdfText = async (
    uploadedFile: File,
    uploadType: UploadType
  ) => {
    try {
      const fileArrayBuffer = await uploadedFile.arrayBuffer();
      const typedArray = new Uint8Array(fileArrayBuffer);
      const pdf = await pdfjs.getDocument(typedArray).promise;
      const pageTextPromises = Array.from({ length: 1 }, (_, i) =>
        pdf.getPage(i + 1).then((page) => page.getTextContent())
      );
      const pageTexts = await Promise.all(pageTextPromises);
      // console.log(pageTexts[0].items);
      const extractedTextStr: string[] = pageTexts[0].items.map((item) =>
        "str" in item ? item.str : ""
      );
      console.log(extractedTextStr);
      if (extractedTextStr.length != 0 && uploadType == UploadType.Entry) {
        fillPersonalDetails(extractedTextStr);
      } else if (
        extractedTextStr.length != 0 &&
        uploadType == UploadType.Acknowledgement
      ) {
        fillEntryTransactionDetails(extractedTextStr);
      } else if (
        extractedTextStr.length != 0 &&
        uploadType == UploadType.Conversion
      ) {
        fillConversionDetails(extractedTextStr);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fillPersonalDetails = (textArr: string[]) => {
    const applicantNameidx = textArr.findIndex(
      (item) => item === "Applicant Name :"
    );
    const applicantNameStr = textArr[applicantNameidx + 1];
    const applicationIdIdx = textArr.findIndex((item) => item === "on No. :");
    const applicationNumberStr = textArr[applicationIdIdx + 1];
    const mouzaIdx = textArr.findIndex((item) => item === "Area (in Hectares)");
    const mouzaStr = textArr[mouzaIdx + 2];
    const tahsilIdx = textArr.findIndex((item) => item === "Tahasil :");
    const tahsilStr = textArr[tahsilIdx + 1];
    const dateIdx = textArr.findIndex((item) => item === "Date :");
    const entryDate = textArr[dateIdx + 2];
    const khataStr = textArr[mouzaIdx + 4];
    setInitalValues((prevValue) => ({
      ...prevValue,
      applicant_name: applicantNameStr,
      application_id: applicationNumberStr,
      application_entry_date: entryDate,
      khata: khataStr,
      mouza: mouzaStr,
      tahsil: tahsilStr,
    }));
  };
  const fillEntryTransactionDetails = (textArr: string[]) => {
    const transactionIdIdx = textArr.findIndex(
      (item) => item === "Transaction ID :"
    );
    const transactionIdStr = textArr[transactionIdIdx + 2];
    const transactionAmtIdx = textArr.findIndex(
      (item) => item === "Amount Deposited :"
    );
    const transactionAmtStr = textArr[transactionAmtIdx + 2];
    setInitalValues((prevValue) => ({
      ...prevValue,
      application_transaction_id: transactionIdStr,
      application_fees_amount: transactionAmtStr,
    }));
  };
  const fillConversionDetails = (textArr: string[]) => {
    const transactionIdIdx = textArr.findIndex(
      (item) => item === "Transaction ID :"
    );
    const transactionIdStr = textArr[transactionIdIdx + 2];
    const transactionAmtIdx = textArr.findIndex(
      (item) => item === "Amount Deposited :"
    );
    const transactionAmtStr = textArr[transactionAmtIdx + 2];
    const dateIdx = textArr.findIndex((item) => item === "Date :");
    const entryDate = textArr[dateIdx + 2];
    const conversionIdx = textArr.findIndex(
      (item) => item === "Conversion Case No :"
    );
    const converisonCaseStr = textArr[conversionIdx + 1];
    setInitalValues((prevValue) => ({
      ...prevValue,
      conversion_transaction_id: transactionIdStr,
      conversion_transaction_amount: transactionAmtStr,
      conversion_transaction_date: entryDate,
      conversion_case_no: converisonCaseStr,
      ready_for_conversion: true,
    }));
  };
  return (
    <main className="container max-w-screen-lg mx-auto lg: ml-60">
      {<CustomOverlay isVisible={pdfMutation.isLoading} />}
      <div className="px-4 p-4">
        <h2 className="font-semibold text-xl text-gray-600">
          {localizeDict["createTicket"].conversion_tracker_form_title}
        </h2>
        <p className="text-gray-500 mb-6">
          {localizeDict["createTicket"].conversion_tracker_form_description}
        </p>
      </div>
      <Formik
        initialValues={formInitalValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue, isSubmitting, handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                  <div className="text-gray-600">
                    <p className="font-medium text-lg">
                      {localizeDict["createTicket"].upload_receipts_title}
                    </p>
                    <p>
                      {localizeDict["createTicket"].upload_receipts_description}
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {
                            localizeDict["createTicket"]
                              .application_details_slip_label
                          }
                        </label>
                        <input
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          id="file_input"
                          accept=".pdf"
                          type="file"
                          onChange={(event) =>
                            handleFileChange(event, UploadType.Entry)
                          }
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {
                            localizeDict["createTicket"]
                              .acknowledge_payment_receipt_label
                          }
                        </label>
                        <input
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          id="file_input"
                          accept=".pdf"
                          type="file"
                          onChange={(event) =>
                            handleFileChange(event, UploadType.Acknowledgement)
                          }
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          {
                            localizeDict["createTicket"]
                              .conversion_payment_acknowledge_slip_label
                          }
                        </label>
                        <input
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          id="file_input"
                          accept=".pdf"
                          type="file"
                          onChange={(event) =>
                            handleFileChange(event, UploadType.Conversion)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                  <div className="text-gray-600">
                    <p className="font-medium text-lg">
                      {localizeDict["createTicket"].personalDetails_heading}
                    </p>
                    <p>{localizeDict["createTicket"].personalDetails_desc}</p>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <RegularTextfield
                        label={
                          localizeDict["createTicket"].applicant_name_label
                        }
                        id={"applicant_name"}
                        additionalStyle={{ div: "md:col-span-5" }}
                      />
                      <RegularTextfield
                        label={
                          localizeDict["createTicket"].application_id_label
                        }
                        id={"application_id"}
                        additionalStyle={{ div: "md:col-span-5" }}
                      />
                      <RegularTextfield
                        label={localizeDict["createTicket"].mouza_label}
                        id={"mouza"}
                        additionalStyle={{ div: "md:col-span-2" }}
                      />
                      <RegularTextfield
                        label={localizeDict["createTicket"].tahsil_label}
                        id={"tahsil"}
                        additionalStyle={{ div: "md:col-span-2" }}
                      />
                      <RegularTextfield
                        label={localizeDict["createTicket"].khata_no_label}
                        id={"khata"}
                        additionalStyle={{ div: "md:col-span-1" }}
                      />
                      <RegularTextfield
                        label={
                          localizeDict["createTicket"].application_fees_id_label
                        }
                        id={"application_transaction_id"}
                        additionalStyle={{ div: "md:col-span-2" }}
                      />
                      <RegularDatePicker
                        label={
                          localizeDict["createTicket"].application_date_label
                        }
                        id={"application_entry_date"}
                        additionalStyle={{ div: "md:col-span-2" }}
                      />
                      <RegularTextfield
                        label={
                          localizeDict["createTicket"].application_fees_label
                        }
                        id={"application_fees_amount"}
                        additionalStyle={{ div: "md:col-span-2" }}
                        leftView={
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        }
                      />
                    </div>
                    <div className="md:col-span-5">
                      <div className="inline-flex items-center mt-4">
                        <input
                          type="checkbox"
                          name="ready_for_conversion"
                          id="ready_for_conversion"
                          checked={values.ready_for_conversion}
                          className="form-checkbox"
                          onChange={(event) => {
                            setFieldValue(
                              "ready_for_conversion",
                              event.target.checked
                            );
                            setConversionDiv(event.target.checked);
                          }}
                        />
                        <label htmlFor="ready_for_conversion" className="ml-2">
                          {
                            localizeDict["createTicket"]
                              .ready_for_conversion_label
                          }
                        </label>
                      </div>
                    </div>
                    {!showConversionDiv ? (
                      <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end">
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            {localizeDict["createTicket"].submit_button_label}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {showConversionDiv ? (
                <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                    <div className="text-gray-600">
                      <p className="font-medium text-lg">
                        {localizeDict["createTicket"].conversion_details_title}
                      </p>
                      <p>
                        {
                          localizeDict["createTicket"]
                            .conversion_details_description
                        }
                      </p>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                        <RegularTextfield
                          label={
                            localizeDict["createTicket"]
                              .conversion_case_no_label
                          }
                          id={"conversion_case_no"}
                          additionalStyle={{ div: "md:col-span-3" }}
                        />
                        <RegularDatePicker
                          label={
                            localizeDict["createTicket"].deposit_date_label
                          }
                          id={"conversion_transaction_date"}
                          additionalStyle={{ div: "md:col-span-2" }}
                        />
                        <RegularTextfield
                          label={
                            localizeDict["createTicket"]
                              .conversion_transaction_id_label
                          }
                          id={"conversion_transaction_id"}
                          additionalStyle={{ div: "md:col-span-3" }}
                        />
                        <RegularTextfield
                          label={
                            localizeDict["createTicket"]
                              .conversion_amount_deposited_label
                          }
                          id={"conversion_transaction_amount"}
                          additionalStyle={{ div: "md:col-span-2" }}
                          leftView={
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          }
                        />
                      </div>
                    </div>
                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          {localizeDict["createTicket"].submit_button_label}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </main>
  );
}

export default CreateTicket;

interface CreateTicketProps {
  localizeDict: IntlMessages;
}
