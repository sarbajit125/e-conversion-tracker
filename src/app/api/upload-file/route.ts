import { NextRequest, NextResponse } from "next/server";
import { handleErrorInServer } from "../create-ticket/route";
import { APISuccessResp, APiErrorResp } from "@/layouts/ComponentsStyle";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
    try {
        const data =  await request.formData()
        const file:File | null = data.get('file') as unknown as File
        if (!file) {
            throw new  APiErrorResp('Invalid File ')
        } else {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const writePath = `public/upload/slot/${file.name}`
            await writeFile(writePath, buffer)
            const response: APISuccessResp = {
                message: 'File uploaded successfully',
                timeStamp: new Date().toUTCString()
            }
            return NextResponse.json(response)
        }
    } catch (error) {
        const errorObj = handleErrorInServer(error);
        console.log(errorObj);
        return NextResponse.json(errorObj, { status: 400 });
    }
}