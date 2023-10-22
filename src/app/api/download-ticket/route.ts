import { NextResponse } from "next/server";
import { handleErrorInServer } from "../create-ticket/route";
import { APiErrorResp } from "@/layouts/ComponentsStyle";
import { readFile } from "fs/promises";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const type = searchParams.get("type");
        if (id != null && type != null) {
            const imageData = await readFile(`public/upload/${type}/${id}.png`)
            const headers = new Headers();
            const blob = new Blob([imageData])
            headers.set("Content-Type", "image/png");
            return new NextResponse(blob, { status: 200, statusText: "OK", headers });
        } else {
            throw new APiErrorResp("Id parameter missing");
        }
    } catch (error) {
        const errorObj = handleErrorInServer(error);
    return NextResponse.json(errorObj, { status: 400 });
    }
}