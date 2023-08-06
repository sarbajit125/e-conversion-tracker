import { NextResponse } from "next/server";
import { handleErrorInServer } from "./create-ticket/route";
import prisma from "@/networking/primsaInstance";
import dayjs from "dayjs";
export async function GET(request: Request) {
  try {
    const transactionFromDb = await prisma.transaction_Record_Table.findMany({
      orderBy: {
        transaction_date: "desc",
      },
      take: 8,
      include: {
        conversion_details: true,
      },
    });
    const preparedRecentTransaction: RecentTransactionResp[] =
      transactionFromDb.map((item) => ({
        currencyCode: item.transaction_currency,
        date: item.transaction_date,
        amount: item.transaction_amount.toNumber(),
        transactionId: item.transaction_id,
        user: item.conversion_details.applicant_name,
      }));
    const recentCustomerData: RecentCustomerResp[] = transactionFromDb.map(
      (item) => ({
        amount: item.transaction_amount.toNumber(),
        currencyCode: item.transaction_currency,
        serviceType: item.transaction_type,
        user: item.conversion_details.applicant_name,
      })
    );
    const todayDate = new Date();
    const sevenDaysBack = dayjs().subtract(7, "days").toDate();
    const fourteenDaysBack = dayjs().subtract(14, "days").toDate();
    const finalConverisonThisWeekData = await fetchDateOnDate(
      "CONVERSION",
      sevenDaysBack,
      todayDate
    );
    const finalConverisionLastWeekData = await fetchDateOnDate(
      "CONVERSION",
      fourteenDaysBack,
      sevenDaysBack
    );
    const newApplicationThisWeek = await fetchDateOnDate(
      "ENTRY",
      sevenDaysBack,
      todayDate
    );
    const newApplicationLastWeek = await fetchDateOnDate(
      "ENTRY",
      fourteenDaysBack,
      sevenDaysBack
    );
    const application_Comp = calculateGrowth(
      newApplicationLastWeek.length,
      newApplicationThisWeek.length
    );
    const converison_Comp = calculateGrowth(
      finalConverisionLastWeekData.length,
      finalConverisonThisWeekData.length
    );
    let finalResponse: DashboardResp = {
      recentTransaction: preparedRecentTransaction,
      recentCustomer: recentCustomerData,
      completedConversion: {
        key: "COMPLETED-TICKETS",
        value: finalConverisonThisWeekData.length,
        isPostive: converison_Comp[1],
        growth: converison_Comp[0],
      },
      initatedConverison: {
        key: "INITIATED-TICKETS",
        value: newApplicationThisWeek.length,
        isPostive: application_Comp[1],
        growth: application_Comp[0],
      },
    };
    console.log(finalResponse)
    return NextResponse.json(finalResponse, { status: 200 });
  } catch (error) {
    const errorObj = handleErrorInServer(error);
    console.log(errorObj);
    return NextResponse.json(errorObj, { status: 400 });
  }
}

export interface RecentTransactionResp {
  amount: number;
  currencyCode: string;
  date: Date;
  user: string;
  transactionId: string;
}
export interface RecentCustomerResp {
  user: string;
  serviceType: string;
  amount: number;
  currencyCode: string;
}

export interface DashboardResp {
  recentTransaction: RecentTransactionResp[];
  recentCustomer: RecentCustomerResp[];
  completedConversion: DashboardIndicatorsResp;
  initatedConverison: DashboardIndicatorsResp;
}

export interface DashboardIndicatorsResp {
  key: string;
  value: number;
  isPostive: boolean;
  growth: number;
}

const calculateGrowth = (
  initial: number,
  current: number
): [growthPercentage: number, isPositive: boolean] => {
  let isPositive = false;
  if (current - initial > 0) {
    isPositive = true;
  }
  if (initial <= 1) {
    return [0, false]
  }
  const percentageGrowth = ((current - initial) / initial) * 100;
  return [percentageGrowth, isPositive];
};

const fetchDateOnDate = async (key: string, startDate: Date, endDate: Date) => {
  try {
    const response = await prisma.transaction_Record_Table.findMany({
      orderBy: {
        transaction_date: "desc",
      },
      where: {
        transaction_type: {
          equals: key,
        },
        transaction_date: {
          lte: endDate,
          gte: startDate,
        },
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
