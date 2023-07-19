"use client";
import RegularDatePicker from "@/components/RegularDatePicker";
import RegularTextfield from "@/components/RegularTextfield";
import React, { useState } from "react";
import { pdfjs } from "react-pdf";
import { useForm } from "react-hook-form";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export default function Home() {
  const [pdfText, setPdfText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);

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
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          accept=".pdf"
          type="file"
          onChange={handleFileChange}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                value={""}
                onTextChange={function (
                  event: React.ChangeEvent<HTMLInputElement>
                ): void {
                  throw new Error("Function not implemented.");
                }}
                additionalStyle={{ div: "md:col-span-5" }}
              />
              <RegularTextfield
                label={"Application Id"}
                id={"application_id"}
                value={""}
                onTextChange={function (
                  event: React.ChangeEvent<HTMLInputElement>
                ): void {
                  throw new Error("Function not implemented.");
                }}
                additionalStyle={{ div: "md:col-span-5" }}
              />
              <RegularTextfield
                label={"Mouza"}
                id={"mouza"}
                value={""}
                onTextChange={function (
                  event: React.ChangeEvent<HTMLInputElement>
                ): void {
                  throw new Error("Function not implemented.");
                }}
                additionalStyle={{ div: "md:col-span-3" }}
              />
              <RegularTextfield
                label={"Khata No."}
                id={"khata"}
                value={""}
                onTextChange={function (
                  event: React.ChangeEvent<HTMLInputElement>
                ): void {
                  throw new Error("Function not implemented.");
                }}
                additionalStyle={{ div: "md:col-span-2" }}
              />
              <RegularTextfield
                label={"Application Fees Id"}
                id={"application_transaction_id"}
                value={""}
                onTextChange={function (
                  event: React.ChangeEvent<HTMLInputElement>
                ): void {
                  throw new Error("Function not implemented.");
                }}
                additionalStyle={{ div: "md:col-span-2" }}
              />
              <RegularDatePicker
                selectDate={function (date: string): void {
                  throw new Error("Function not implemented.");
                }}
                label={"Application Date"}
                id={"application_entry_date"}
                value={""}
                onTextChange={function (
                  event: React.ChangeEvent<HTMLInputElement>
                ): void {
                  throw new Error("Function not implemented.");
                }}
                additionalStyle={{ div: "md:col-span-1" }}
              />
              <RegularTextfield
                label={"Application Fees"}
                id={"application_fees_amount"}
                value={""}
                onTextChange={function (
                  event: React.ChangeEvent<HTMLInputElement>
                ): void {
                  throw new Error("Function not implemented.");
                }}
                additionalStyle={{ div: "md:col-span-1" }}
              />
            </div>
          </div>
        </div>
      </div>
      </form>
    </main>
  );
}
