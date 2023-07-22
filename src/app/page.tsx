"use client";
import RegularDatePicker from "@/components/RegularDatePicker";
import RegularTextfield from "@/components/RegularTextfield";
import React, { useState } from "react";
import { pdfjs } from "react-pdf";
import { Formik, Form } from "formik";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export default function Home() {
  const [pdfText, setPdfText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const initialValues = {
    applicant_name: "",
    application_id: "",
    mouza: "",
    khata: "",
    application_transaction_id: "",
    application_entry_date: "",
    application_fees_amount: "",
  };
  const onSubmit = (values) => console.log("Form data", values);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      console.log("coming here 1");
      handleReadPdfText(file);
    }
  };
  const handleReadPdfText = async (uploadedFile: File) => {
    try {
      const fileArrayBuffer = await uploadedFile.arrayBuffer();
      const typedArray = new Uint8Array(fileArrayBuffer);
      const pdf = await pdfjs.getDocument(typedArray).promise;
      const pageTextPromises = Array.from({ length: 1 }, (_, i) =>
        pdf.getPage(i + 1).then((page) => page.getTextContent())
      );
      const pageTexts = await Promise.all(pageTextPromises);
      console.log(pageTexts[0].items);
      const applicantNameidx = pageTexts[0].items.findIndex(
        (item) => item.str === "Applicant Name :"
      );
      const applicantNameStr = pageTexts[0].items[applicantNameidx + 1];
      console.log(applicantNameStr);
      const extractedText = pageTexts
        .flatMap((pageText) => pageText.items.map((item) => item.str))
        .join(" ");
      console.log(extractedText);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="container">
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="text-gray-600">
            <p className="font-medium text-lg">Upload Receipts</p>
            <p>You can directly upload receipts to auto fill form</p>
          </div>
          <div className="lg:col-span-2">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Upload application receipt
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  accept=".pdf"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="md:col-span-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Upload conversion receipt
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  accept=".pdf"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                  <div className="text-gray-600">
                    <p className="font-medium text-lg">Personal Details</p>
                    <p>Please fill out all the fields.</p>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <RegularTextfield
                        label={"Applicant Name"}
                        id={"applicant_name"}
                        additionalStyle={{ div: "md:col-span-5" }}
                      />
                      <RegularTextfield
                        label={"Application Id"}
                        id={"application_id"}
                        value={""}
                        additionalStyle={{ div: "md:col-span-5" }}
                      />
                      <RegularTextfield
                        label={"Mouza"}
                        id={"mouza"}
                        value={""}
                        additionalStyle={{ div: "md:col-span-3" }}
                      />
                      <RegularTextfield
                        label={"Khata No."}
                        id={"khata"}
                        value={""}
                        additionalStyle={{ div: "md:col-span-2" }}
                      />
                      <RegularTextfield
                        label={"Application Fees Id"}
                        id={"application_transaction_id"}
                        value={""}
                        additionalStyle={{ div: "md:col-span-2" }}
                      />
                      <RegularDatePicker
                        selectDate={function (date: string): void {
                          throw new Error("Function not implemented.");
                        }}
                        label={"Application Date"}
                        id={"application_entry_date"}
                        value={""}
                        additionalStyle={{ div: "md:col-span-1" }}
                      />
                      <RegularTextfield
                        label={"Application Fees"}
                        id={"application_fees_amount"}
                        value={""}
                        additionalStyle={{ div: "md:col-span-1" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </main>
  );
}
