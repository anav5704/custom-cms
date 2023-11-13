import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request, { params }: { params: {storeId: string }}) {
    try {
        const body = await req.json()
        const { userId } = auth()
        const { label, imageUrl } = body

        // Protect the route by throwing error if user does not exist
        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!label) return new NextResponse("Billboard label is required", { status: 400 })
        if (!imageUrl) return new NextResponse("Billboard image is required", { status: 400 })

        // Check if user has owns store of id passed in params
        const userOwnsStore = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!userOwnsStore) return new NextResponse("User does not own this store", { status: 403 })
        
        // Create the billboard
        const billboard = await prismadb.billboard.create({
            data: {
               label,
               imageUrl,
               storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("BILLBOARDS_POST", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: {storeId: string }}) {
    try {
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })

        // Get all billboards
        const billboards = await prismadb.billboard.findMany({
            where: {
               storeId: params.storeId
            }
        })

        return NextResponse.json(billboards)

    } catch (error) {
        console.log("BILLBOARDS_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}