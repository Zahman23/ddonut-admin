import { NextResponse } from "next/server";
import { requiredAuth } from "@/lib/auth-server";
import prismaDb from "@/lib/prisma";

export async function GET() {
    try {
        const session = await requiredAuth().catch(() => null)

        if(!session){
            return NextResponse.json({
                success: false,
                message: 'Unauthorized'
            })
        }

        if(session.role === 'superAdmin' || session.role === 'owner'){

            const stores = await prismaDb.store.findMany({
                include: {
                    users: {include: {user: true}}
                }
            })

            return NextResponse.json({
                success:true,
                role: session.role,
                stores
            })
        }

        if(session.role === 'admin'){

            const assigned = await prismaDb.storeUser.findMany({
                where: {
                    userId: session.uid
                },
                include: {
                    store:true
                }
            })

            return NextResponse.json({
                success: true,
                role: session.role,
                stores:assigned.map((a) => a.store)
            })
        }

        return NextResponse.json({
            success: false,
            message: 'Forbidden'
        },
    {
        status: 403
    }
    )
    } catch (err:any) {
        console.error("Store Access Error:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}