import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function GET(req: Request, { params }: { params: { colorId: string }}) {
    try {
        if (!params.colorId) return new NextResponse("Color id is requried", { status: 400 })

        // Get the color
        const color = await prismadb.color.findUnique({
            where: {
               id: params.colorId
            }
        })

        return NextResponse.json(color)

    } catch (error) {
        console.log("COLOR_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, colorId: string }}) {
    try {
        const body = await req.json()
        const { userId } = auth()
        const { name, value } = body

        // Protect the route by throwing error if user does not exist
        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!params.colorId) return new NextResponse("Color id is requried", { status: 400 })
        if (!name) return new NextResponse("Color name is required", { status: 400 })
        if (!value) return new NextResponse("Color value is required", { status: 400 })

        // Check if user has owns store of id passed in params
        const userOwnsStore = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!userOwnsStore) return new NextResponse("User does not own this store", { status: 403 })
        
        // Update the color
        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId
            },
            data: {
               name,
               value,
            }
        })

        return NextResponse.json(color)

    } catch (error) {
        console.log("COLOR_PATCH", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: {storeId: string, colorId: string }}) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!params.colorId) return new NextResponse("Color id is requried", { status: 400 })

        // Delete the color
        const color = await prismadb.color.deleteMany({
            where: {
               id: params.colorId
            }
        })

        return NextResponse.json(color)

    } catch (error) {
        console.log("COLOR_DELETE", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}