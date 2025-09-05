import { PrismaClient } from "@/generated/prisma";

declare global{
    var prisma: PrismaClient | undefined
}

const prismaDb = global.globalThis.prisma || new PrismaClient()

if(process.env.NODE_ENV !== 'production'){
    globalThis.prisma = prismaDb
}

export default prismaDb