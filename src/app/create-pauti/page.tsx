"use client";
import React, { useState } from "react";
import {
  FileInput,
  NumberInput,
  Radio,
  TextInput,
  Select,
} from "@mantine/core";
import { pdfjs } from "react-pdf";
import { DateInput, TimeInput } from "@mantine/dates";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
function CreateSlot() {
  const [documentType, setDocumentType] = useState<string>("pauti");
  const handleFileChange = (file: File | null) => {
    if (file != null) {
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
       console.log(pageTexts);
      const extractedTextStr: string[] = pageTexts[0].items.map((item) =>
        "str" in item ? item.str : ""
      );
      if (documentType === "slotBooking") {
        fillDetailsForSlot(extractedTextStr);
      } else {
        fillDetailsForPauti(extractedTextStr);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fillDetailsForSlot = (textArr: string[]) => {
    console.log(textArr)
  };
  const fillDetailsForPauti = (textArr: string[]) => {
    console.log(textArr)
  };
  return (
    <main className="container max-w-screen-lg mx-auto lg: ml-60">
      <div className="px-4 p-4">
        <h2 className="font-semibold text-xl text-gray-600">
          Registry Slot Details/Pauti Deposits
        </h2>
        <p className="text-gray-500 mb-6">
          Take note of upcoming Registry or filed Tax.
        </p>
      </div>
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="text-gray-600">
            <p className="font-medium text-lg">Document selection</p>
            <p>Upload document to fill form</p>
          </div>
          <div className="lg:col-span-2">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-5">
                <Radio.Group
                  value={documentType}
                  onChange={setDocumentType}
                  name="documentSelection"
                  label="Select your document type"
                  withAsterisk
                >
                  <Radio
                    value="pauti"
                    label="Pauti"
                    className="p-3"
                    checked
                  />
                  <Radio
                    value="slotBooking"
                    className="p-3"
                    label="Slot booking"
                  />
                </Radio.Group>
              </div>
              <div className="md:col-span-5">
                <FileInput
                  label="Upload document"
                  placeholder="tap to upload document"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {documentType == "slotBooking" ? (
        <form>
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Slot Booking</p>
                <p>Please fill out all the fields.</p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-5">
                    <TextInput
                      label="First party"
                      placeholder="Enter first party name"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <TextInput
                      label="Second party"
                      placeholder="Enter second party name"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <TextInput
                      label="District"
                      placeholder="Enter district name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput
                      label="Registration Office"
                      placeholder="Enter office name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <DateInput
                      valueFormat="DD/MM/YYYY"
                      label="Slot date"
                      placeholder="Enter slot appointment date here"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TimeInput label="Appointment time slot" />
                  </div>
                  <div className="md:col-span-5">
                    <TextInput
                      label="Application Id"
                      placeholder="Enter Slot appointment reference number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form>
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">E-Pauti</p>
                <p>Please fill out all the fields.</p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-5">
                    <TextInput
                      label="Applicant name"
                      placeholder="Enter khata owner name"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <TextInput
                      label="Reference Id"
                      placeholder="Enter Receipt number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput label="Tahsil" placeholder="Enter tahsil name" />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput label="Mouza" placeholder="Enter mouza name" />
                  </div>
                  <div className="md:col-span-1">
                    <TextInput label="Khata" placeholder="Enter khata number" />
                  </div>
                  <div className="md:col-span-2">
                    <DateInput
                      valueFormat="DD/MM/YYYY"
                      label="Transaction date"
                      placeholder="Enter slot transaction date here"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Select
                      label="Financial year"
                      placeholder="Enter year for which pauti deposited"
                      data={["2023-24", "2022-23", "2021-22"]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <NumberInput
                      label="Pauti Amount"
                      min={0}
                      thousandsSeparator=","
                      precision={2}
                      prefix="$"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}

export default CreateSlot;
