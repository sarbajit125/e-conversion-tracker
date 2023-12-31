import prisma from "@/networking/primsaInstance";
import { handleErrorInServer } from "../create-ticket/route";
import { NextResponse } from "next/server";
import { APiErrorResp, SearchTableResp, SearchValidation } from "@/layouts/ComponentsStyle";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const result = await SearchValidation.validate(requestBody);
    switch (result.category) {
      case 'slot':
        const slotfromDb = await prisma.slotBooking_Table.findMany({
          where: {
            OR: [
              {
                application_id:{
                  equals: result.application_id
                }
              },
              {
                firstParty:{
                  contains: result.application_id,
                  mode:'insensitive',
                }
              }
            ]
          }
        })
        if (slotfromDb.length == 0) {
          throw new APiErrorResp('No result found')
        } else {
          const response: SearchTableResp[] =  slotfromDb.map((item) => ({
            id: item.application_id,
            category: 'slot',
            name: item.firstParty,
            status: item.slotDate.setHours(0,0,0) > new Date().setHours(0,0,0) ? 'Pending' : 'Completed'
        }))
        return NextResponse.json(response, {status: 200})
        }
      default:
      const dataFromDb = await  prisma.conversion_Table.findMany({
          where: {
            OR: [
              {
                application_id: {
                  equals: result.application_id,
                },
              },
              {
                applicant_name: {
                  contains: result.application_id,
                  mode:'insensitive'
                },
              },
            ],
          },
          orderBy: {
            application_id: "desc",
          },
          include:{
            applicant_name_id:true
          }
        });
        if (dataFromDb.length == 0) {
          throw new APiErrorResp('No result found')
        } else {
          const response: SearchTableResp[] =  dataFromDb.map((item) => ({
            id: item.application_id,
            category: 'conversion',
            name: item.applicant_name,
            status: item.ready_for_conversion ? 'In Progress' : 'Initiated'
        }))
        return NextResponse.json(response, {status: 200})
        }
    }
    
  } catch (error) {
    console.log(error)
    const errorObj = handleErrorInServer(error);
    return NextResponse.json(errorObj, { status: 400 });
  }
}
