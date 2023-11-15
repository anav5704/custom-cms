import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const body = await req.json()
        const { userId } = auth()
        const { name, price, categoryId, sizeId, colorId, images, isFeatured, isArchived } = body

        // Protect the route by throwing error if user does not exist
        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!name) return new NextResponse("Product name is required", { status: 400 })
        if (!price) return new NextResponse("Product price is required", { status: 400 })
        if (!categoryId) return new NextResponse("Product category id is required", { status: 400 })
        if (!sizeId) return new NextResponse("Product size id is required", { status: 400 })
        if (!colorId) return new NextResponse("Product color id is required", { status: 400 })
        if (!images || !images.length) return new NextResponse("Product image(s) is required", { status: 400 })
        if (!isFeatured) return new NextResponse("Product feature state is required", { status: 400 })
        if (!isArchived) return new NextResponse("Product archive state is required", { status: 400 })

        // Check if user has owns store of id passed in params
        const userOwnsStore = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!userOwnsStore) return new NextResponse("User does not own this store", { status: 403 })

        // Create the product
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizeId,
                colorId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("PRODUCTS_POST", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const isFeatured = searchParams.get("isFeatured")
        const isArchived = searchParams.get("isArchived")

        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })

        // Get all products
        const products = await prismadb.product.findMany({
            where: {
                categoryId,
                sizeId,
                colorId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
                storeId: params.storeId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(products)

    } catch (error) {
        console.log("PRODUCTS_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}