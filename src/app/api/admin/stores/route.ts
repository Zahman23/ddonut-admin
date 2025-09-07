import { requiredAuth, requiredSuperAdmin } from "@/lib/auth-server";
import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        const {name} = await req.json()
        const session = await requiredAuth()
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

        const store = await prismaDb.store.create({
            data: {name}
        })

        return NextResponse.json(
            {
            success: true,
            store,
            },
            {
                status: 200
            }
    )

    } catch (err: any) {
        console.error("Error create store:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan" },
      { status: err.status || 500 }
    );
    }
}