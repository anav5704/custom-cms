import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId } = auth()
        const { name } = body

        // Protect the route by throwing error if user does not exist
        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!name) return new NextResponse("Store name is required", { status: 400 })

        // Create the store
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log("STORE_POST", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}