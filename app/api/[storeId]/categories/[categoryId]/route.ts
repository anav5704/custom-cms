import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function GET(req: Request, { params }: { params: { categoryId: string }}) {
    try {
        if (!params.categoryId) return new NextResponse("Billboard id is requried", { status: 400 })

        // Get the category
        const category = await prismadb.category.findUnique({
            where: {
               id: params.categoryId
            },
            include: {
                billboard: true
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("CATEGORY_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, categoryId: string }}) {
    try {
        const body = await req.json()
        const { userId } = auth()
        const { name, billboardId } = body

        // Protect the route by throwing error if user does not exist
        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!params.categoryId) return new NextResponse("Billboard id is requried", { status: 400 })
        if (!name) return new NextResponse("Category name is required", { status: 400 })
        if (!billboardId) return new NextResponse("Billboard id is required", { status: 400 })

        // Check if user has owns store of id passed in params
        const userOwnsStore = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })  

        if(!userOwnsStore) return new NextResponse("User does not own this store", { status: 403 })
        
        // Update the category
        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId
            },
            data: {
               name,
               billboardId,
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("CATEGORY_PATCH", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: {storeId: string, categoryId: string }}) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!params.categoryId) return new NextResponse("Category id is requried", { status: 400 })

        // Delete the category
        const category = await prismadb.category.deleteMany({
            where: {
               id: params.categoryId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("CATEGORY_DELETE", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}