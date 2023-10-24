"use client";
import React, { useEffect, useState } from "react";
import {
  FileInput,
  NumberInput,
  Radio,
  TextInput,
  Select,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import {
  APiErrorResp,
  EPautiFormValidation,
  SlotTicketFormSchema,
  SlotTicktFormValidation,
  UploadFileRequest,
} from "@/layouts/ComponentsStyle";
import CustomOverlay from "@/components/CustomOverlay";
import { useMutation } from "@tanstack/react-query";
import { addSaleDeedSlot, uploadSlot } from "@/query-hooks/query-hook";
import { useToast } from "@/components/ui/use-toast";
import { createWorker } from "tesseract.js";
import { pdfjs } from "react-pdf";
import { IntlMessages } from "../../get-localization";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function CreatePauti({ localizeDict }: CreatePautiProps) {
  const [documentType, setDocumentType] = useState<string>("pauti");
  const [ocrLoading, setOcrloading] = useState<boolean>(false);
  const [uploadImg, setUploadFile] = useState<File | null>(null);
  const { toast } = useToast();
  const slotMutation = useMutation({
    mutationKey: ["create-pauti"],
    mutationFn: (request: SlotTicketFormSchema) => addSaleDeedSlot(request),
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof APiErrorResp ? error.userMsg : "",
        variant: "destructive",
      });
      slotForm.reset();
    },
    onSuccess(data, variables, context) {
      if (uploadImg) {
        uploadMutation.mutate({
          file: uploadImg,
          filename: variables.application_id,
        });
      } else {
        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
      }
    },
  });
  const uploadMutation = useMutation({
    mutationKey: ["upload-slot"],
    mutationFn: (request: UploadFileRequest) => uploadSlot(request),
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof APiErrorResp ? error.userMsg : "",
        variant: "destructive",
      });
      slotForm.reset();
    },
    onSuccess(data, variables, context) {
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });
    },
  });
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
  useEffect(() => {
    if (uploadImg) {
      //uploadMutation.mutate({file:uploadImg, filename:'1234'})
      handleReadPdfText(uploadImg);
    }
  }, [uploadImg]);
  const handleFileChange = (file: File | null) => {
    if (file != null) {
      setUploadFile(file);
    }
  };
  const convertPDFtoImage = async (uploadedFile: File) => {
    try {
      const fileArrayBuffer = await uploadedFile.arrayBuffer();
      const typedArray = new Uint8Array(fileArrayBuffer);
      const pdf = await pdfjs.getDocument(typedArray).promise;
      const page = await pdf.getPage(1);
      var viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.setAttribute("className", "canv");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const canvasContext = canvas.getContext("2d");
      if (canvasContext) {
        await page.render({
          canvasContext: canvasContext,
          viewport: viewport,
        }).promise;
        let img = canvas.toDataURL("image/png");
        // handleReadPdfText(img)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleReadPdfText = async (uploadedFile: File) => {
    try {
      setOcrloading(true);
      const worker = await createWorker("eng", 1, {
        logger: (m) => console.log(m), // Add logger here
      });
      await worker.load();
      const {
        data: { text },
      } = await worker.recognize(uploadedFile);
      console.log(text);
      const extractedTextStr: string[] = text.split("\n");
      if (documentType === "slotBooking") {
        fillDetailsForSlot(extractedTextStr);
      } else {
        fillDetailsForPauti(extractedTextStr);
      }
    } catch (error) {
      setOcrloading(false);
      console.log(error);
    }
  };
  const fillDetailsForSlot = (textArr: string[]) => {
    const firstPartyName = findValueByLabel(textArr, "First Party Name");
    const secondPartyName = findValueByLabel(textArr, "Second Party Name");
    const applicationId = findValueByLabel(
      textArr,
      "Slot Appointment Reference No."
    );
    const slotDate = findValueByLabel(textArr, "Slot Appointment Date");
    const districtLine = textArr.find((item) => item.includes("DISTRICT"));

    if (firstPartyName) {
      console.log("First Party Name:", firstPartyName);
      slotForm.setFieldValue("firstParty", firstPartyName);
    }
    if (secondPartyName) {
      console.log("Second Party Name:", secondPartyName);
      slotForm.setFieldValue("secondParty", secondPartyName);
    }
    if (applicationId) {
      console.log("Slot Appointment Reference No.:", applicationId);
      slotForm.setFieldValue("application_id", applicationId);
    }
    if (slotDate) {
      console.log("Slot Appointment Date:", slotDate);
      const formattedDate = new Date(slotDate);
      slotForm.setFieldValue("slotDate", formattedDate);
    }
    if (districtLine) {
      const { district, regOffice } = parseDistrict(districtLine);
      console.log("District:", district);
      console.log("Registration Office:", regOffice);
      slotForm.setFieldValue("district", district);
      slotForm.setFieldValue("officeName", regOffice);
    }
    setOcrloading(false);
  };
  const findValueByLabel = (
    textArr: string[],
    label: string
  ): string | undefined => {
    const index = textArr.findIndex((item) => item.includes(label));
    if (index !== -1) {
      const item = textArr[index];
      const value = item.slice(item.indexOf(":") + 1).trim();
      return value;
    }
    return undefined;
  };
  const parseDistrict = (
    districtLine: string
  ): { district: string; regOffice: string } => {
    const districtArr = districtLine.split(" ");
    const firstColonIdx = districtArr.indexOf(":");
    const lastColonIdx = districtArr.lastIndexOf(":");
    const district = districtArr[firstColonIdx + 1].trim();
    const regOffice = districtArr[lastColonIdx + 1].trim();
    return { district, regOffice };
  };

  const fillDetailsForPauti = (textArr: string[]) => {
    console.log(textArr);
  };
  return (
    <main className="container max-w-screen-lg mx-auto lg: ml-60">
      <CustomOverlay isVisible={slotMutation.isLoading || ocrLoading} />
      <div className="px-4 p-4">
        <h2 className="font-semibold text-xl text-gray-600">
          {localizeDict["createPauti"].container_title}
        </h2>
        <p className="text-gray-500 mb-6">
          {localizeDict["createPauti"].container_description}
        </p>
      </div>
      <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
          <div className="text-gray-600">
            <p className="font-medium text-lg">
              {localizeDict["createPauti"].document_selection_title}
            </p>
            <p>{localizeDict["createPauti"].document_selection_description}</p>
          </div>
          <div className="lg:col-span-2">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-5">
                <Radio.Group
                  value={documentType}
                  onChange={setDocumentType}
                  name="documentSelection"
                  label={localizeDict["createPauti"].document_type_label}
                  withAsterisk
                >
                  <Radio
                    value="pauti"
                    label={localizeDict["createPauti"].document_type_pauti}
                    className="p-3"
                    checked
                  />
                  <Radio
                    value="slotBooking"
                    className="p-3"
                    label={
                      localizeDict["createPauti"].document_type_slot_booking
                    }
                  />
                </Radio.Group>
              </div>
              <div className="md:col-span-5">
                <FileInput
                  label={localizeDict["createPauti"].upload_document_label}
                  placeholder={
                    localizeDict["createPauti"].upload_document_placeholder
                  }
                  accept="image/png,image/jpeg"
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {documentType == "slotBooking" ? (
        <form
          onSubmit={slotForm.onSubmit((values) => {
            const createRequest: SlotTicketFormSchema = {
              application_id: values.application_id,
              district: values.district,
              firstParty: values.firstParty,
              officeName: values.officeName,
              secondParty: values.secondParty,
              time: values.time,
              slotDate: new Date(values.slotDate),
            };
            slotMutation.mutate(createRequest);
          })}
        >
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">
                  {localizeDict["createPauti"].slot_booking_title}
                </p>
                <p>{localizeDict["createPauti"].slot_booking_description}</p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-5">
                    <TextInput
                      label={localizeDict["createPauti"].first_party_label}
                      placeholder={
                        localizeDict["createPauti"].first_party_placeholder
                      }
                      {...slotForm.getInputProps("firstParty")}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <TextInput
                      label={localizeDict["createPauti"].second_party_label}
                      placeholder={
                        localizeDict["createPauti"].second_party_placeholder
                      }
                      {...slotForm.getInputProps("secondParty")}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <TextInput
                      label={localizeDict["createPauti"].district_label}
                      placeholder={
                        localizeDict["createPauti"].district_placeholder
                      }
                      {...slotForm.getInputProps("district")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput
                      label={localizeDict["createPauti"].office_name_label}
                      placeholder={
                        localizeDict["createPauti"].office_name_placeholder
                      }
                      {...slotForm.getInputProps("officeName")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <DateInput
                      valueFormat="DD/MM/YYYY"
                      label={localizeDict["createPauti"].slot_date_label}
                      placeholder={
                        localizeDict["createPauti"].slot_date_placeholder
                      }
                      {...slotForm.getInputProps("slotDate")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TimeInput
                      label={localizeDict["createPauti"].appointment_time_label}
                      {...slotForm.getInputProps("time")}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <TextInput
                      label={localizeDict["createPauti"].application_id_label}
                      placeholder={
                        localizeDict["createPauti"].application_id_placeholder
                      }
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
                      {localizeDict["createPauti"].submit_button}
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
                <p className="font-medium text-lg">
                  {localizeDict["createPauti"].e_pauti_title}
                </p>
                <p>{localizeDict["createPauti"].e_pauti_description}</p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-5">
                    <TextInput
                      label={localizeDict["createPauti"].applicant_name_label}
                      placeholder={
                        localizeDict["createPauti"].applicant_name_placeholder
                      }
                      {...pautiForm.getInputProps("applicant_name")}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <TextInput
                      label={localizeDict["createPauti"].reference_id_label}
                      placeholder={
                        localizeDict["createPauti"].reference_id_placeholder
                      }
                      {...pautiForm.getInputProps("applicant_id")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput
                      label={localizeDict["createPauti"].tahsil_label}
                      placeholder={
                        localizeDict["createPauti"].tahsil_placeholder
                      }
                      {...pautiForm.getInputProps("tahsil")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextInput
                      label={localizeDict["createPauti"].mouza_label}
                      placeholder={
                        localizeDict["createPauti"].mouza_placeholder
                      }
                      {...pautiForm.getInputProps("mouza")}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <TextInput
                      label={localizeDict["createPauti"].khata_label}
                      placeholder={
                        localizeDict["createPauti"].khata_placeholder
                      }
                      {...pautiForm.getInputProps("khata")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <DateInput
                      valueFormat="DD/MM/YYYY"
                      label={localizeDict["createPauti"].transaction_date_label}
                      placeholder={
                        localizeDict["createPauti"].transaction_date_placeholder
                      }
                      {...pautiForm.getInputProps("transaction_date")}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Select
                      label={localizeDict["createPauti"].financial_year_label}
                      placeholder={
                        localizeDict["createPauti"].financial_year_placeholder
                      }
                      data={["2023-24", "2022-23", "2021-22"]}
                      {...pautiForm.getInputProps("financial_year")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <NumberInput
                      label={
                        localizeDict["createPauti"].transaction_amount_label
                      }
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
                      {localizeDict["createPauti"].submit_button}
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

export default CreatePauti;

export interface CreatePautiProps {
  localizeDict: IntlMessages;
}
