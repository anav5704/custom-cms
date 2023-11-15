import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request, { params }: { params: {storeId: string }}) {
    try {
        const body = await req.json()
        const { userId } = auth()
        const { name, value } = body

        // Protect the route by throwing error if user does not exist
        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!name) return new NextResponse("Size name is required", { status: 400 })
        if (!value) return new NextResponse("Size value is required", { status: 400 })

        // Check if user has owns store of id passed in params
        const userOwnsStore = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!userOwnsStore) return new NextResponse("User does not own this store", { status: 403 })
        
        // Create the size
        const size = await prismadb.size.create({
            data: {
               name,
               value,
               storeId: params.storeId
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log("SIZES_POST", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: {storeId: string }}) {
    try {
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })

        // Get all sizes
        const sizes = await prismadb.size.findMany({
            where: {
               storeId: params.storeId
            }
        })

        return NextResponse.json(sizes)

    } catch (error) {
        console.log("SIZES_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}