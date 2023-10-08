import { NextResponse } from "next/server";
import prisma from "../../../networking/primsaInstance";
import { handleErrorInServer } from "../create-ticket/route";
import { APISuccessResp, SlotTicktFormValidation } from "@/layouts/ComponentsStyle";

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const parsedRequest = await SlotTicktFormValidation.validate(requestBody)
        const timeArr = parsedRequest.time.split(':').map((duration) => parseInt(duration))
        let parsedSlot = parsedRequest.slotDate
        parsedSlot.setUTCHours(timeArr[0],timeArr[1], 0)
        const dataFromDb = await prisma.slotBooking_Table.create({
            data:{
                application_id: parsedRequest.application_id,
                district: parsedRequest.district,
                officeName: parsedRequest.officeName,
                secondParty: parsedRequest.secondParty,
                firstParty_Id: {
                    connectOrCreate:{
                        where:{
                            name: parsedRequest.firstParty
                        },
                        create:{
                            name: parsedRequest.firstParty
                        }
                    }
                },
                slotDate: parsedSlot
            }
        })
        const successResp: APISuccessResp = {
            message: 'Sale deed slot recorded',
            timeStamp: new Date().toUTCString()
        }
        return NextResponse.json(successResp, {status: 201})
    } catch (error) {
        const errorObj = handleErrorInServer(error)
    console.log(errorObj)
    return NextResponse.json(errorObj, { status: 400 });
    }
}