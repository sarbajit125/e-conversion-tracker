import { APiErrorResp } from "@/layouts/ComponentsStyle";
import { recentDateDisplayFormat } from "@/lib/utils";
import prisma from "@/networking/primsaInstance";
import dayjs from "dayjs";
import { handleErrorInServer } from "../create-ticket/route";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    console.log(searchParams);
    if (id != null && type != null) {
      switch (type) {
        case "slot":
          return fetchDataForSlot(id);
        default:
          return fetchDataForConverison(id);
      }
    } else {
      throw new APiErrorResp("Id parameter missing");
    }
  } catch (error) {
    const errorObj = handleErrorInServer(error);
    return NextResponse.json(errorObj, { status: 400 });
  }
}

export interface ViewTicketResp {
  records: ViewTicketRecordResp[];
}
export interface ViewTicketRecordResp {
  id: "Detail" | "Amount";
  title: string;
  value: string;
  additionalDetails?: Record<string, string>;
}

const fetchDataForConverison = async (id: string): Promise<NextResponse> => {
  try {
    const dataFromDB = await prisma.conversion_Table.findFirstOrThrow({
      where: {
        application_id: id,
      },
      include: {
        applicant_name_id: true,
        conversion_transaction: true,
      },
    });
    let apiData: ViewTicketRecordResp[] = [
      {
        id: "Detail",
        title: "Application Id",
        value: dataFromDB.application_id,
      },
      {
        id: "Detail",
        title: "Applicant Name",
        value: dataFromDB.applicant_name,
      },
      {
        id: "Detail",
        title: "Application Entry Date",
        value: dayjs(dataFromDB.conversion_transaction[0].transaction_date)
          .format(recentDateDisplayFormat)
          .toString(),
      },
      {
        id: "Detail",
        title: "Tahsil",
        value: dataFromDB.tahsil,
      },
      {
        id: "Detail",
        title: "Mouza",
        value: dataFromDB.mouza,
      },
      {
        id: "Detail",
        title: "Khata No.",
        value: dataFromDB.khata,
      },
      {
        id: "Amount",
        title: "Application Entry Fees",
        value:
          dataFromDB.conversion_transaction[0].transaction_amount.toString(),
        additionalDetails: {
          currencyId: dataFromDB.conversion_transaction[0].transaction_currency,
        },
      },
      {
        id: "Detail",
        title: "Entry Transaction Id",
        value: dataFromDB.conversion_transaction[0].transaction_id,
      },
    ];
    if (dataFromDB.ready_for_conversion) {
      apiData.push({
        id: "Detail",
        title: "Conversion Case No.",
        value: dataFromDB.conversion_case_no ?? "",
      });
      apiData.push({
        id: "Detail",
        title: "Conversion Transaction Id",
        value: dataFromDB.conversion_transaction[1].transaction_id,
      });
      apiData.push({
        id: "Amount",
        title: "Conversion Premium Fees",
        value:
          dataFromDB.conversion_transaction[1].transaction_amount.toString(),
        additionalDetails: {
          currencyId: dataFromDB.conversion_transaction[1].transaction_currency,
        },
      });
      apiData.push({
        id: "Detail",
        title: "Conversion Payment Date",
        value: dayjs(dataFromDB.conversion_transaction[1].transaction_date)
          .format(recentDateDisplayFormat)
          .toString(),
      });
    }
    const response: ViewTicketResp = {
      records: apiData,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    throw error;
  }
};
const fetchDataForSlot = async (id: string): Promise<NextResponse> => {
  try {
    const dataFromDB = await prisma.slotBooking_Table.findFirstOrThrow({
      where: {
        application_id: id,
      },
    });
    let apiData: ViewTicketRecordResp[] = [
      {
        id: "Detail",
        title: "First party name",
        value: dataFromDB.firstParty,
      },
      {
        id: "Detail",
        title: "Second party name",
        value: dataFromDB.secondParty,
      },
      {
        id: "Detail",
        title: "Application id",
        value: dataFromDB.application_id,
      },
      {
        id: "Detail",
        title: "District",
        value: dataFromDB.district,
      },
      {
        id: "Detail",
        title: "Registration office",
        value: dataFromDB.officeName,
      },
      {
        id: "Detail",
        title: "Registry date",
        value: dayjs(dataFromDB.slotDate).format(recentDateDisplayFormat).toString(),
      },
    ];
    const response: ViewTicketResp = {
      records: apiData,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    throw error;
  }
};
