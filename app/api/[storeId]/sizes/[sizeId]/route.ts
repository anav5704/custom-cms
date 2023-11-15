import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function GET(req: Request, { params }: { params: { sizeId: string }}) {
    try {
        if (!params.sizeId) return new NextResponse("Size id is requried", { status: 400 })

        // Get the size
        const size = await prismadb.size.findUnique({
            where: {
               id: params.sizeId
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log("SIZE_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, sizeId: string }}) {
    try {
        const body = await req.json()
        const { userId } = auth()
        const { name, value } = body

        // Protect the route by throwing error if user does not exist
        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!params.sizeId) return new NextResponse("Size id is requried", { status: 400 })
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
        
        // Update the size
        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId
            },
            data: {
               name,
               value,
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log("SIZE_PATCH", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: {storeId: string, sizeId: string }}) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!params.sizeId) return new NextResponse("Size id is requried", { status: 400 })

        // Delete the size
        const size = await prismadb.size.deleteMany({
            where: {
               id: params.sizeId
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log("SIZE_DELETE", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}