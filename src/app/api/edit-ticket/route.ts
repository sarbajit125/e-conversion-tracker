import { NextResponse } from "next/server";
import { getDateOBj, handleErrorInServer } from "../create-ticket/route";
import {
  APISuccessResp,
  EditTicketRequestValidation,
} from "@/layouts/ComponentsStyle";
import prisma from "@/networking/primsaInstance";

export async function PATCH(request: Request) {
  try {
    const requestBody = await request.json();
    const result = await EditTicketRequestValidation.validate(requestBody);
    const dataFromDb = await prisma.conversion_Table.update({
      where: {
        application_id: result.application_id,
      },
      data: {
        ready_for_conversion: true,
        conversion_case_no: result.conversion_case_no,
        conversion_transaction: {
          create: {
            transaction_amount: parseFloat(
              result.conversion_transaction_amount
            ),
            transaction_date: getDateOBj(result.conversion_transaction_date),
            transaction_id: result.conversion_transaction_id,
            transaction_type: "CONVERSION",
          },
        },
      },
    });
    const success: APISuccessResp = {
      message: "Successfully edited the ticket",
      timeStamp: new Date().toUTCString(),
    };
    return NextResponse.json(success, { status: 201 });
  } catch (error) {
    console.log(error);
    const errorObj = handleErrorInServer(error);
    return NextResponse.json(errorObj, { status: 400 });
  }
}
