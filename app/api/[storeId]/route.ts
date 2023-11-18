import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

export async function GET(req: Request, { params }: { params: { storeId: string }}) {
    try {
        if (!params.storeId) return new NextResponse("Billboard id is requried", { status: 400 })

        // Get the store name
        const storeName = await prismadb.store.findUnique({
            where: {
               id: params.storeId
            },
            select: {
                name: true
            }
        })

        return NextResponse.json(storeName)

    } catch (error) {
        console.log("BILLBOARD_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

