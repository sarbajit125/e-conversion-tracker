import {
  APISuccessResp,
  APiErrorResp,
  PDFFormSchema,
  validationSchema,
} from "@/layouts/ComponentsStyle";
import { NextResponse } from "next/server";
import prisma from "../../../networking/primsaInstance";

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
    console.log(error);
    const errorObj = new APiErrorResp("Something went wrong");
    throw NextResponse.json(errorObj, { status: 500 });
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
    console.log("error from here")
    console.log(error);
    throw error;
  }
}
