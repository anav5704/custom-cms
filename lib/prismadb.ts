import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined
}

const prismadb = globalThis.prisma || new PrismaClient()

// This is used to prevent Next from instancing new prisma clinets using its hot reloading
if(process.env.NODE_ENV != "production") globalThis.prisma = prismadb

export default prismadb