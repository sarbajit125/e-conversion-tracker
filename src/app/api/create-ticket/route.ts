import {
  APISuccessResp,
  APiErrorResp,
  PDFFormSchema,
  validationSchema,
} from "@/layouts/ComponentsStyle";
import { NextResponse } from "next/server";
import prisma from "../../../networking/primsaInstance";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    console.log("coming to api part");
    const requestBody = await request.json();
    console.log(requestBody);
    const result = await validationSchema.validate(requestBody);
    if (await setFormData(result)) {
      const success: APISuccessResp = {
        message: "Successfully created the ticket",
        timeStamp: new Date().toUTCString(),
      };
      return NextResponse.json(success, { status: 201 });
    }
  } catch (error) {
    const errorObj = handleErrorInServer(error)
    console.log(errorObj)
    return NextResponse.json(errorObj, { status: 400 });
  }
}
function getDateOBj(dateStr: string | undefined): Date {
  if (dateStr != undefined) {
    const parts = dateStr.split("/");
    const dateObject = new Date(`${parts[2]}/${parts[1]}/${parts[0]}`);
    return dateObject
  } else {
    return new Date()
  }
}
async function setFormData(data: PDFFormSchema) {
  try {
    const response = await prisma.conversion_Table.create({
      data: {
        application_id: data.application_id,
        khata: data.khata,
        mouza: data.mouza,
        tahsil: data.tahsil,
        ready_for_conversion: data.ready_for_conversion,
        applicant_name_id: {
          connectOrCreate: {
            where: {
              name: data.applicant_name,
            },
            create: {
              name: data.applicant_name,
            },
          },
        },
        conversion_case_no: data.conversion_case_no,
        conversion_transaction: {
          createMany: {
            skipDuplicates: true,
            data:
              data.ready_for_conversion &&
              data.conversion_case_no != undefined &&
              data.conversion_transaction_id != undefined &&
              data.conversion_transaction_amount != undefined &&
              data.conversion_transaction_date != undefined
                ? [
                    {
                      transaction_amount: parseFloat(
                        data.application_fees_amount ?? "0"
                      ),
                      transaction_date: getDateOBj(data.application_entry_date),
                      transaction_id: data.application_transaction_id,
                      transaction_type: "ENTRY",
                    },
                    {
                      transaction_amount: parseFloat(
                        data.conversion_transaction_amount
                      ),
                      transaction_date: getDateOBj(data.conversion_transaction_date),
                      transaction_id: data.conversion_transaction_id,
                      transaction_type: "CONVERSION",
                    },
                  ]
                : [
                    {
                      transaction_amount: parseFloat(
                        data.application_fees_amount ?? "0"
                      ),
                      transaction_date: getDateOBj(data.application_entry_date)
                      ,
                      transaction_id: data.application_transaction_id,
                      transaction_type: "ENTRY",
                    },
                  ],
          },
        },
      },
    });
    return true;
  } catch (error) {
    throw handleErrorInServer(error)
  }
}


export const handleErrorInServer = (error: unknown): APiErrorResp => {
  let errorMsg = ""
   console.log(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error.code)
    errorMsg = error.message
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    console.log(error.name)
    errorMsg = error.message
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    errorMsg = "Validation failed for single/multiple fields"
  } else if (error instanceof APiErrorResp) {
    return error
  } else {
    errorMsg = "Error in server side"
  }
  let errObj = new APiErrorResp(errorMsg)
  return errObj
}
