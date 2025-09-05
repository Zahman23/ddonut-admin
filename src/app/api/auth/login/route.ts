// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { adminDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { requiredAuth } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    let userCred;
    try {
        userCred = await signInWithEmailAndPassword(auth,email,password)
    } catch (err: any) {
        let message = "Login gagal";
        if (err.code === "auth/invalid-credential") message = "Cek kembali inputan anda"
        return NextResponse.json(
      { success: false, error: message},
      { status: 200 } // 🚀 tetap 200, error ditangani di payload
    );
    }

    const idToken = await userCred.user.getIdToken()
    const doc = await adminDb.collection("users").doc(userCred.user.uid).get()
    const role = doc.exists ? doc.data()?.role : null

    // Hanya admin/SuperAdmin untuk UI admin
    if(role !== 'admin' && role !== 'superAdmin'){
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 200 });
    }

    // Simpan token ke cookie (plain string, HttpOnly)
    (await cookies()).set("session", idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    })

    return NextResponse.json({
        success: true,
        role
    },{
        status: 200
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Login gagal" }, { status: 200 });
  }
}

export async function GET() {
    try {
        const {uid, email, role} = await requiredAuth()
        return NextResponse.json({user: {uid, email, role}})
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 200 });
    }
}