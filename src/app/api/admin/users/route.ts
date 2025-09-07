import {NextResponse} from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import prismaDb from '@/lib/prisma'
import { requiredAuth, requiredSuperAdmin } from '@/lib/auth-server'

export async function POST(req: Request) {
    try {
        const session = await requiredAuth()
        requiredSuperAdmin(session.role)

        const {email, password, name, role} = await req.json()

        if(!email || !password){
            return NextResponse.json({ success: false, error: "Email & password required" }, { status: 400 });
        }

        if(!name){
            return NextResponse.json({
                success: false,
                error: "Name Required"
            })
        }

        if(!role){
            return NextResponse.json({
                success: false,
                error: "Role Required"
            })
        }

        const existing = await adminAuth.getUserByEmail(email).catch(() => null)
        if(existing){
        return NextResponse.json(
        { success: false, error: "Email sudah digunakan" },
        { status: 200 }
      );
        }

        // Buat di Firebase Auth
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name || ''
        })

        // Simpan ke Firestore
        await adminDb.collection('users').doc(userRecord.uid).set({
            email,
            role,
            name: name || '',
            createdAt: new Date()
        })

        // Simpan ke Neon(table User)
        const user = await prismaDb.user.create({
            data: {
                id: userRecord.uid,
                email,
                role,
                name: name || ''
            }
        })

        return NextResponse.json({
            success: true,
            user
        })
    } catch (err: any) {
        console.error("[USER_CREATE]", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
    }
}