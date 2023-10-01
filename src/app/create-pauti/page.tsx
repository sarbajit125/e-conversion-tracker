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
import { useForm, yupResolver } from "@mantine/form";
import {
  APiErrorResp,
  EPautiFormValidation,
  SlotTicketFormSchema,
  SlotTicktFormValidation,
} from "@/layouts/ComponentsStyle";
import CustomOverlay from "@/components/CustomOverlay";
import { useMutation } from "@tanstack/react-query";
import { addSaleDeedSlot } from "@/query-hooks/query-hook";
import { useToast } from "@/components/ui/use-toast";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
function CreateSlot() {
  const [documentType, setDocumentType] = useState<string>("pauti");
  const { toast } = useToast();
  const slotMutation = useMutation({
    mutationKey: ['create-pauti'],
    mutationFn: (request: SlotTicketFormSchema) => addSaleDeedSlot(request),
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof APiErrorResp ? error.userMsg : "",
        variant: "destructive",
      });
      slotForm.reset()
    },
    onSuccess(data, variables, context) {
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });
    },
  })
  const slotForm = useForm({
    initialValues: {
      firstParty: "",
      secondParty: "",
      district: "",
      officeName: "",
      slotDate: "",
      time: "",
      application_id: "",
    },
    validateInputOnBlur: true,
    validate: yupResolver(SlotTicktFormValidation),
  });
  const pautiForm = useForm({
    initialValues: {
      applicant_name: "",
      applicant_id: "",
      tahsil: "",
      mouza: "",
      khata: "",
      transaction_date: "",
      financial_year: "",
      transaction_amount: 0,
    },
    validateInputOnBlur: true,
    validate: yupResolver(EPautiFormValidation),
  });
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
    console.log(textArr);
  };
  const fillDetailsForPauti = (textArr: string[]) => {
    console.log(textArr);
  };
  return (
    <main className="container max-w-screen-lg mx-auto lg: ml-60">
      <CustomOverlay isVisible={slotMutation.isLoading} />
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
                  <Radio value="pauti" label="Pauti" className="p-3" checked />
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
        <form onSubmit={slotForm.onSubmit((values) => {
          const createRequest: SlotTicketFormSchema = {
            application_id: values.application_id,
            district: values.district,
            firstParty: values.firstParty,
            officeName: values.officeName,
            secondParty: values.officeName,
            time: values.time,
            slotDate: new Date(values.slotDate)
          }
          slotMutation.mutate(createRequest)
        })}>
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
                      {...slotForm.getInputProps("firstParty")}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <TextInput
                      label="Second party"
                      placeholder="Enter second party name"
                      {...slotForm.getInputProps("secondParty")}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <TextInput
                      label="District"
                      placeholder="Enter district name"
                      {...slotForm.getInputProps("district")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput
                      label="Registration Office"
                      placeholder="Enter office name"
                      {...slotForm.getInputProps("officeName")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <DateInput
                      valueFormat="DD/MM/YYYY"
                      label="Slot date"
                      placeholder="Enter slot appointment date here"
                      {...slotForm.getInputProps("slotDate")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TimeInput
                      label="Appointment time slot"
                      {...slotForm.getInputProps("time")}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <TextInput
                      label="Application Id"
                      placeholder="Enter Slot appointment reference number"
                      {...slotForm.getInputProps("application_id")}
                    />
                  </div>
                </div>
                <div className="md:col-span-5 text-right mt-3">
                  <div className="inline-flex items-end">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={pautiForm.onSubmit((values) => console.log(values))}>
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
                      {...pautiForm.getInputProps("applicant_name")}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <TextInput
                      label="Reference Id"
                      placeholder="Enter Receipt number"
                      {...pautiForm.getInputProps("applicant_id")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput
                      label="Tahsil"
                      placeholder="Enter tahsil name"
                      {...pautiForm.getInputProps("tahsil")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput
                      label="Mouza"
                      placeholder="Enter mouza name"
                      {...pautiForm.getInputProps("mouza")}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <TextInput
                      label="Khata"
                      placeholder="Enter khata number"
                      {...pautiForm.getInputProps("khata")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <DateInput
                      valueFormat="DD/MM/YYYY"
                      label="Transaction date"
                      placeholder="Enter slot transaction date here"
                      {...pautiForm.getInputProps("transaction_date")}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Select
                      label="Financial year"
                      placeholder="Enter year for which pauti deposited"
                      data={["2023-24", "2022-23", "2021-22"]}
                      {...pautiForm.getInputProps("financial_year")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <NumberInput
                      label="Pauti Amount"
                      min={0}
                      thousandsSeparator=","
                      precision={2}
                      prefix="$"
                      {...pautiForm.getInputProps("transaction_amount")}
                    />
                  </div>
                </div>
                <div className="md:col-span-5 text-right mt-3">
                  <div className="inline-flex items-end">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Submit
                    </button>
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
