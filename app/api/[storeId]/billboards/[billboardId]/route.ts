import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function GET(req: Request, { params }: { params: { billboardId: string }}) {
    try {
        if (!params.billboardId) return new NextResponse("Billboard id is requried", { status: 400 })

        // Delete the billboard
        const billboard = await prismadb.billboard.findUnique({
            where: {
               id: params.billboardId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("BILLBOARD_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, billboardId: string }}) {
    try {
        const body = await req.json()
        const { userId } = auth()
        const { label, imageUrl } = body

        // Protect the route by throwing error if user does not exist
        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!params.billboardId) return new NextResponse("Billboard id is requried", { status: 400 })
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
        
        // Update the billboard
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId
            },
            data: {
               label,
               imageUrl,
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("BILLBOARD_PATCH", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: {storeId: string, billboardId: string }}) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!params.billboardId) return new NextResponse("Billboard id is requried", { status: 400 })

        // Delete the billboard
        const billboard = await prismadb.billboard.deleteMany({
            where: {
               id: params.billboardId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("BILLBOARD_DELETE", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}