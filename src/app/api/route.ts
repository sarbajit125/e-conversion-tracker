import { NextResponse } from "next/server";
import { handleErrorInServer } from "./create-ticket/route";
import prisma from "@/networking/primsaInstance";
export async function GET(request: Request) {
    try {
        const transactionFromDb = await prisma.transaction_Record_Table.findMany({
            orderBy:{
                transaction_date:'desc'
            },
            take:8,
            include:{
                conversion_details: true
            }
        })
        const preparedRecentTransaction: RecentTransactionResp[] = transactionFromDb.map((item) => ({
            currencyCode: item.transaction_currency,
            date: item.transaction_date,
            amount: item.transaction_amount.toNumber(),
            transactionId: item.transaction_id,
            user: item.conversion_details.applicant_name
        }))
        const recentCustomerData: RecentCustomerResp[] = transactionFromDb.map((item) => ({
            amount: item.transaction_amount.toNumber(),
            currencyCode: item.transaction_currency,
            serviceType:item.transaction_type,
            user: item.conversion_details.applicant_name
        }))
        let finalResponse: DashboardResp = {
            recentTransaction:preparedRecentTransaction,
            recentCustomer:recentCustomerData
        }
        return NextResponse.json(finalResponse,{status:200})
    } catch (error) {
        const errorObj = handleErrorInServer(error)
        console.log(errorObj)
        return NextResponse.json(errorObj, { status: 400 });
    }
}


export interface RecentTransactionResp {
    amount: number,
    currencyCode: string,
    date: Date,
    user: string,
    transactionId: string
}
export interface RecentCustomerResp {
    user: string
    serviceType: string
    amount: number
    currencyCode: string
}

export interface DashboardResp {
    recentTransaction: RecentTransactionResp[]
    recentCustomer: RecentCustomerResp[]

}