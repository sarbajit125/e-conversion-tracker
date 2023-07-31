import { APISuccessResp, APiErrorResp, PDFFormSchema, validationSchema } from "@/layouts/ComponentsStyle";
import { NextResponse } from "next/server";
import prisma from "../../../../networking/primsaInstance";

export async function POST(request: Request) {
  try {
    const result = await validationSchema.validate(request.body);
    if (result.ready_for_conversion) {
       const conversionResult = validateConversionData(result)
       if (conversionResult.isValid && conversionResult.properties != undefined) {
        if (await setFormData(result)) {
            const success: APISuccessResp = {
                message: 'Successfully create the ticket',
                timeStamp: new Date().toUTCString()
            }
            NextResponse.json(success,{status:201})
        }
       } else {
            const errorObj = new APiErrorResp('Conversion data in invalid format')
            return NextResponse.json(errorObj,{status:400})
       }
    } else {
        if (await setFormData(result)) {
            const success: APISuccessResp = {
                message: 'Successfully create the ticket',
                timeStamp: new Date().toUTCString()
            }
            NextResponse.json(success,{status:201})
        }
    }
  } catch (error) {
    console.log(error)
    const errorObj = new APiErrorResp("Something went wrong")
    return NextResponse.json(errorObj,{status:500})
  }
}

function validateConversionData(data: PDFFormSchema): {
  isValid: boolean;
  properties?: {
    conversion_case_no: string;
    conversion_transaction_id: string;
    conversion_transaction_amount: string;
    conversion_transaction_date: string;
  };
} {
  if (
    data.conversion_case_no != undefined &&
    data.conversion_transaction_id != undefined &&
    data.conversion_transaction_amount != undefined &&
    data.conversion_transaction_date != undefined
  ) {
    return {
      isValid: true,
      properties: {
        conversion_case_no: data.conversion_case_no,
        conversion_transaction_amount: data.conversion_transaction_amount,
        conversion_transaction_date: data.conversion_transaction_date,
        conversion_transaction_id: data.conversion_transaction_id,
      },
    };
  } else {
    return {
      isValid: false,
      properties: undefined,
    };
  }
}
async function setFormData(data:PDFFormSchema) {
    try {
        const response = prisma.conversion_Table.create({
            data:{
                application_id: data.application_id,
                khata: data.khata,
                mouza: data.mouza,
                tahsil: data.tahsil,
                ready_for_conversion: data.ready_for_conversion,
                applicant_name_id: {
                    connectOrCreate:{
                        where:{
                            name: data.applicant_name
                        },
                        create:{
                            name: data.applicant_name
                        }
                    }
                },
                conversion_case_no: data.conversion_case_no,
                conversion_transaction:{
                    createMany:{
                        skipDuplicates: true,
                        data: data.ready_for_conversion ? [
                            {
                                transaction_amount: parseFloat(data.application_fees_amount ?? "0"),
                                transaction_date: new Date(data.application_entry_date ?? new Date()),
                                transaction_id: data.application_transaction_id,
                                transaction_type: 'ENTRY',
                            },
                            {
                                transaction_amount: parseFloat(data.conversion_transaction_amount ?? "0"),
                                transaction_date: new Date(data.conversion_transaction_date ?? new Date()),
                                transaction_id: data.conversion_transaction_id ?? "",
                                transaction_type: 'CONVERSION'
                            }
                        ]: [
                            {
                                transaction_amount: parseFloat(data.application_fees_amount ?? "0"),
                                transaction_date: new Date(data.application_entry_date ?? new Date()),
                                transaction_id: data.application_transaction_id,
                                transaction_type: 'ENTRY',
                            }
                        ]
                    }
                }
    
            }
        })
        return true
    } catch (error) {
        console.log(error)
        throw error
    }
    
}
