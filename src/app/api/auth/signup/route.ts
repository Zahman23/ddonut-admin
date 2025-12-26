import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requiredAuth } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const me = await requiredAuth();
    if (me.role !== "superAdmin" && me.role !== "owner") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { email, password, role } = await req.json();

    // 1. cek apakah email sudah terdaftar
    let existingUser;
    try {
      existingUser = await adminAuth.getUserByEmail(email);
    } catch (err) {
      existingUser = null;
    }
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // 2. buat user baru di Firebase Auth
    const user = await adminAuth.createUser({ email, password });

    // 3. simpan data ke Firestore
    await adminDb.collection("users").doc(user.uid).set({
      uid: user.uid,
      email,
      role,
      createdAt: new Date(),
    });

    // 4. set custom claims
    await adminAuth.setCustomUserClaims(user.uid, { role });

    return NextResponse.json({ message: "success", uid: user.uid });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return NextResponse.json({ message: "Berfungsi" });
}
