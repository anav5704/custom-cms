import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request, { params }: { params: {storeId: string }}) {
    try {
        const body = await req.json()
        const { userId } = auth()
        const { name, billboardId } = body

        // Protect the route by throwing error if user does not exist
        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
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
        
        // Create the category
        const category = await prismadb.category.create({
            data: {
               name,
               billboardId,
               storeId: params.storeId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("CATEGORIES_POST", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: {storeId: string }}) {
    try {
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })

        // Get all categories
        const categories = await prismadb.category.findMany({
            where: {
               storeId: params.storeId
            }
        })

        return NextResponse.json(categories)

    } catch (error) {
        console.log("CATEGORIES_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}