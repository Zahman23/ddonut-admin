import prismaDb from "@/lib/prisma";
import { requiredAuth, requiredSuperAdmin } from "@/lib/auth-server";
import { NextResponse } from "next/server";

interface ParamsProps{
    params: Promise<{storeId: string}>
}

export async function PATCH(req: Request, {params}: ParamsProps){
    try {
        const session = await requiredAuth()
        const {name} = await req.json()
        const storeId = (await params).storeId

        requiredSuperAdmin(session.role)

        if(!name){
             return NextResponse.json({
                success: false,
                error: "Nama Toko Harus diisi"
            },
        {
            status: 400
        });
        }

        if(!storeId){
            return NextResponse.json({
                success: false,
                error: "Toko Tidak ditemukan"
            })
        }

        const store = await prismaDb.store.updateMany({
            where:{
                id: storeId,
            },
            data: {
                name
            }
        })

        return NextResponse.json({success: true, store})
    } catch (err: any) {
         console.log("[STORE_PATCH]", err);
    return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, {params}: ParamsProps) {
    try {
        const session = await requiredAuth()
        const storeId = (await params).storeId
        requiredSuperAdmin(session.role)

        if(!storeId){
            return NextResponse.json({
                success: false,
                error: "Toko Tidak ditemukan"
            })
        }

        const store = await prismaDb.store.deleteMany({
            where: {
                id: storeId
            }
        })

        return NextResponse.json({
            success: true,
            store
        })
    } catch (error) {
        console.log("[STORE_DELET]", error);
    return new NextResponse("Internal Error", { status: 500 });
    }
}