"use client";
import DashboardSearchRow from "@/components/DashboardSearchRow";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import {
  APiErrorResp,
  DeleteTicketSchema,
  EditTicketRequestSchema,
  EditTicketValidation,
  SearchFormSchema,
} from "@/layouts/ComponentsStyle";
import {
  deleteTicket,
  editConversionTicket,
  searchFromTable,
} from "@/query-hooks/query-hook";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { Box, Modal, Text, TextInput, NumberInput, Grid } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import CustomOverlay from "@/components/CustomOverlay";
import { useForm, yupResolver } from "@mantine/form";
import { FaCalendarDays } from "react-icons/fa6";
import dayjs from "dayjs";
import { IntlMessages } from "../../get-localization";

function SearchTicket({ localizeDict, locale }: SearchTicketProps) {
  const router = useRouter();
  const { toast } = useToast();
  const deleteMutation = useMutation({
    mutationKey: ["deleteTicket"],
    mutationFn: (request: DeleteTicketSchema) => deleteTicket(request),
    onError: (error) => {
      close();
      toast({
        title: "Error",
        description: error instanceof APiErrorResp ? error.userMsg : "",
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      close();
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });
    },
  });
  const searchMutation = useMutation({
    mutationKey: ["SearchTicket"],
    mutationFn: (request: SearchFormSchema) => searchFromTable(request),
    cacheTime: 0,
  });
  const editMutation = useMutation({
    mutationKey: ["editTicket"],
    mutationFn: (request: EditTicketRequestSchema) =>
      editConversionTicket(request),
    onSuccess(data, variables, context) {
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof APiErrorResp ? error.userMsg : "",
        variant: "destructive",
      });
    },
  });
  const [opened, { toggle, close }] = useDisclosure(false);
  const editModalhandler = useDisclosure(false);
  const [toEditObj, setEditObj] = useState<string>("");
  const [toDeleteObj, setDeleteObj] = useState<
    DeleteTicketSchema | undefined
  >();
  const formik = useFormik({
    initialValues: {
      searchTF: "",
      recordType: "",
      sort: "desc",
    },
    onSubmit: (values) => {
      const createRequst: SearchFormSchema = {
        application_id: values.searchTF,
        category: values.recordType,
        sort: values.sort == "desc" ? true : false,
      };
      searchMutation.mutate(createRequst);
    },
  });
  const editForm = useForm({
    initialValues: {
      conversion_case_no: "",
      conversion_transaction_id: "",
      conversion_transaction_amount: "",
      conversion_transaction_date: "",
    },
    validateInputOnBlur: true,
    validate: yupResolver(EditTicketValidation),
  });

  return (
    <main className="container max-w-screen-lg mx-auto lg: ml-60">
      {
        <CustomOverlay
          isVisible={
            searchMutation.isLoading ||
            deleteMutation.isLoading ||
            editMutation.isLoading
          }
        />
      }
      <div className="px-4 p-4">
        <h2 className="font-semibold text-xl text-gray-600">{localizeDict['searchTicket'].searchTicket_heading}</h2>
        <p className="text-gray-500 mb-6">
        {localizeDict['searchTicket'].searchTicket_description}
        </p>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="relative">
          <div className="absolute flex items-center ml-2 h-full">
            <svg
              className="w-4 h-4 fill-current text-primary-gray-dark"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.8898 15.0493L11.8588 11.0182C11.7869 10.9463 11.6932 10.9088 11.5932 10.9088H11.2713C12.3431 9.74952 12.9994 8.20272 12.9994 6.49968C12.9994 2.90923 10.0901 0 6.49968 0C2.90923 0 0 2.90923 0 6.49968C0 10.0901 2.90923 12.9994 6.49968 12.9994C8.20272 12.9994 9.74952 12.3431 10.9088 11.2744V11.5932C10.9088 11.6932 10.9495 11.7869 11.0182 11.8588L15.0493 15.8898C15.1961 16.0367 15.4336 16.0367 15.5805 15.8898L15.8898 15.5805C16.0367 15.4336 16.0367 15.1961 15.8898 15.0493ZM6.49968 11.9994C3.45921 11.9994 0.999951 9.54016 0.999951 6.49968C0.999951 3.45921 3.45921 0.999951 6.49968 0.999951C9.54016 0.999951 11.9994 3.45921 11.9994 6.49968C11.9994 9.54016 9.54016 11.9994 6.49968 11.9994Z"></path>
            </svg>
          </div>
          <input
            id="searchTF"
            name="searchTF"
            onChange={formik.handleChange}
            value={formik.values.searchTF}
            type="text"
            placeholder={localizeDict['searchTicket'].searchPlaceholder}
            className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="font-medium">Filters</p>
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
            >
              {localizeDict['searchTicket'].searchSubmitButton}
            </button>
            <button
              type="reset"
              className="ml-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
            >
              {localizeDict['searchTicket'].searchResetButton}
            </button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <select
              name="recordType"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
            >
              <option value="">{localizeDict['searchTicket'].searchAllType}</option>
              <option value="conversion">{localizeDict['searchTicket'].searchConversion}</option>
              <option value="pauti">{localizeDict['searchTicket'].searchPauti}</option>
              <option value={"slot"}>{localizeDict['searchTicket'].searchSlotBooking}</option>
            </select>
            <select
              name="sort"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
            >
              <option value="">{localizeDict['searchTicket'].searchSortingType}</option>
              <option value="desc">{localizeDict['searchTicket'].searchDescOrder}</option>
              <option value="asc">{localizeDict['searchTicket'].searchAscOrder}</option>
            </select>
          </div>
        </div>
      </form>
      <div className="px-4 p-4 mt-4">
        <h3 className="font-semibold text-xl text-gray-600">{localizeDict['searchTicket'].queryResult_heading}</h3>
        {searchMutation.isError ? (
          <div id="empty-state" className="flex p-2 mt-4 justify-center">
            <div className="flex-col">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="self-center"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                />
              </svg>
              <span className="text-gray-500 mb-6 text-center">
              {localizeDict['searchTicket'].noTicketsFound}
              </span>
            </div>
          </div>
        ) : null}

        {searchMutation.isSuccess ? (
          <div className="overflow-auto mt-4">
            <table className="table text-sm bg-white rounded shadow-lg w-full">
              <thead className=" text-gray-500">
                <tr>
                  <th className="p-3">{localizeDict['searchTicket'].tableHeader_name_text}</th>
                  <th className="p-3">{localizeDict['searchTicket'].tableHeader_category_text}</th>
                  <th className="p-3">{localizeDict['searchTicket'].tableHeader_category_text}</th>
                  <th className="p-3">{localizeDict['searchTicket'].tableHeader_category_text}</th>
                  <th className="p-3">{localizeDict['searchTicket'].tableHeader_action_text}</th>
                </tr>
              </thead>
              <tbody>
                {searchMutation.data.map((item, index) => (
                  <DashboardSearchRow
                    key={index}
                    id={item.id}
                    fullName={item.name}
                    applicationId={item.id}
                    category={item.category}
                    status={item.status}
                    actionCallback={function (
                      id: string,
                      type: string,
                      action: string
                    ): void {
                      if (action === "view") {
                        const params = new URLSearchParams();
                        params.set("id", id);
                        params.set("type", type);
                        router.push(`/${locale}/view-ticket?${params.toString()}`);
                      } else if (action === "delete") {
                        setDeleteObj({
                          application_id: id,
                          category: type.toLowerCase(),
                        });
                        toggle();
                      } else if (action === "edit") {
                        setEditObj(id);
                        editModalhandler[1].toggle();
                      }
                    }}
                  />
                ))}
              </tbody>
            </table>
            <Modal
              opened={opened}
              size="lg"
              radius="md"
              onClose={close}
              withCloseButton={false}
              centered
            >
              <Text>
              {localizeDict['searchTicket'].deleteConfirmation}
              </Text>
              <div className="h-1 bg-gray-400 mt-2"></div>
              <div className="mt-1 p-2">
                <button
                  className="mr-2 font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-700 text-white"
                  title="Delete"
                  onClick={() => {
                    deleteMutation.mutate(
                      toDeleteObj ?? { application_id: "", category: "" }
                    );
                  }}
                >
                 {localizeDict['searchTicket'].deleteButton}
                </button>
                <button
                  className="mr-2 font-bold py-2 px-4 rounded bg-gray-500 hover:bg-gray-700 text-white"
                  title="Cancel"
                  onClick={close}
                >
                  {localizeDict['searchTicket'].cancelButton}
                </button>
              </div>
            </Modal>
            <Modal
              opened={editModalhandler[0]}
              size="lg"
              radius="md"
              onClose={editModalhandler[1].close}
              withCloseButton={true}
              title={localizeDict['searchTicket'].conversionPaymentDetailsTitle}
              centered
            >
              <Box>
                <form
                  onSubmit={editForm.onSubmit((values) => {
                    editModalhandler[1].close();
                    const requestBody: EditTicketRequestSchema = {
                      application_id: toEditObj,
                      conversion_case_no: values.conversion_case_no,
                      conversion_transaction_amount:
                        values.conversion_transaction_amount.toString(),
                      conversion_transaction_date: dayjs(
                        values.conversion_transaction_date
                      ).format("DD-MM-YYYY"),
                      conversion_transaction_id:
                        values.conversion_transaction_id,
                    };
                    console.log(requestBody);
                    editMutation.mutate(requestBody);
                  })}
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label={localizeDict['searchTicket'].conversionCaseNo}
                        withAsterisk
                        {...editForm.getInputProps("conversion_case_no")}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DateInput
                        label={localizeDict['searchTicket'].conversionDate}
                        {...editForm.getInputProps(
                          "conversion_transaction_date"
                        )}
                        rightSection={<FaCalendarDays />}
                        maxDate={new Date()}
                        valueFormat="DD-MM-YYYY"
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label={localizeDict['searchTicket'].conversionTransactionId}
                        withAsterisk
                        {...editForm.getInputProps("conversion_transaction_id")}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput
                        label={localizeDict['searchTicket'].conversionAmount}
                        min={0}
                        thousandsSeparator=","
                        precision={2}
                        prefix="$"
                        {...editForm.getInputProps(
                          "conversion_transaction_amount"
                        )}
                      />
                    </Grid.Col>
                  </Grid>
                  <Box className="mt-3 p-2">
                    <button
                      type="submit"
                      className="mr-2 font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700 text-white"
                    >
                      {localizeDict['searchTicket'].conversionSubmitButton}
                    </button>
                  </Box>
                </form>
              </Box>
            </Modal>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default SearchTicket;
interface SearchTicketProps {
    localizeDict: IntlMessages;
    locale: string;
}