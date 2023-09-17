import { APISuccessResp, DeleteValidation } from "@/layouts/ComponentsStyle";
import prisma from "@/networking/primsaInstance";
import { NextResponse } from "next/server";
import { handleErrorInServer } from "../create-ticket/route";

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const result = await DeleteValidation.validate(requestBody);
        switch (result.category) {
            default:
                const dbResponse = await prisma.conversion_Table.delete({
                    where:{
                        application_id: result.application_id
                    },

                })
                    const successResp: APISuccessResp = {
                        message: 'Id deleted successfully',
                        timeStamp: new Date().toUTCString(),
                    }
                    return NextResponse.json(successResp, {status:201})
        }
    } catch (error) {
        console.log(error)
    const errorObj = handleErrorInServer(error);
    return NextResponse.json(errorObj, { status: 400 });
    }
}