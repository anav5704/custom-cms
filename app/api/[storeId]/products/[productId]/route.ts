import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function GET(req: Request, { params }: { params: { productId: string }}) {
    try {
        if (!params.productId) return new NextResponse("Product id is requried", { status: 400 })

        // Get the product
        const product = await prismadb.product.findUnique({
            where: {
               id: params.productId
            },
             include: {
                images: true,
                category: true,
                size: true,
                color: true
            },
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("PRODUCT_GET", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string }}) {
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

        // Check if user has owns store of id passed in params
        const userOwnsStore = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!userOwnsStore) return new NextResponse("User does not own this store", { status: 403 })
        
        // Update the product and delete the existing images
        await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizeId,
                colorId,
                images: {
                    deleteMany: {}
                }
            }
        })

        // Add new images
        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
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
        console.log("PRODUCT_PATCH", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: {storeId: string, productId: string }}) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse("User not authenticated", { status: 401 })
        if (!params.storeId) return new NextResponse("Store id is requried", { status: 400 })
        if (!params.productId) return new NextResponse("Product id is requried", { status: 400 })

        // Delete the product
        const product = await prismadb.product.deleteMany({
            where: {
               id: params.productId
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("PRODUCT_DELETE", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}