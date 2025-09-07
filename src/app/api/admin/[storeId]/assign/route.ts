import { NextResponse } from "next/server";
import prismaDb from "@/lib/prisma";
import { requiredAuth, requiredSuperAdmin } from "@/lib/auth-server";

interface ParamsProps{
    params: Promise<{storeId: string}>
}

export async function POST(req: Request) {
    try {
        const {uid, email,role } = await requiredAuth()
        
        if(role !== 'owner' && role !== 'superAdmin'){
            return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
        }

        const {userId, role: assignRole, storeId} = await req.json()

        if (!storeId || !userId || !assignRole) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await prisma?.storeUser.findUnique({
        where:{
            storeId_userId:{
                storeId,
                userId
            }
        }
    })

    if(existing){
         return NextResponse.json(
        { success: false, message: "User already assigned to this store" },
        { status: 400 }
      );
    }

    const storeUser = await prismaDb.storeUser.create({
        data: {
            storeId,
            userId,
            role:assignRole
        }
    })

    return NextResponse.json({
      success: true,
      message: "User assigned to store successfully",
      data: storeUser,
    });
    } catch (err:any) {
        console.error("Assign User Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.status || 500 }
    );
    }
}