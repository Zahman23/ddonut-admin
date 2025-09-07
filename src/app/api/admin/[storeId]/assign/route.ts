import { NextResponse } from "next/server";
import prismaDb from "@/lib/prisma";
import { requiredAuth, requiredSuperAdmin } from "@/lib/auth-server";

interface ParamsProps{
    params: Promise<{storeId: string}>
}

export async function POST(req: Request) {
    try {
        const session = await requiredAuth()
        requiredSuperAdmin(session.role)

        const {userId, role, storeId} = await req.json()

        if(!storeId){
            return NextResponse.json({ success: false, error: "storeId required" }, { status: 400 });
        }

        if(!userId){
            return NextResponse.json({ success: false, error: "UserId required" }, { status: 400 });
        }

        if(role !== 'admin' && role !== 'superAdmin' ){
            return NextResponse.json({ success: false, error: "Role required Admin or SuperAdmin" }, { status: 400 });
        }

        const storeUser = await prismaDb.storeUser.create({
            data: {
                storeId,
                userId,
                role
            }
        })

        return NextResponse.json({
            success: true,
            storeUser
        },
    {
        status: 200
    })
    } catch (err) {
        console.error("[ASSIGN_ADMIN]", err);
        return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
    }
}