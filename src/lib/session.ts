import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// 🔐 simpan session ke cookie
export async function setSession(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

// 🔎 verifikasi session dari cookie
export async function verifySession(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;

  try {
    // validasi ke Firebase Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);

    // ambil role dari Firestore
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : null;

    return {
      user: {
        uid: decoded.uid,
        email: decoded.email,
        role,
      },
    };
  } catch (err) {
    return null;
  }
}

// 🚪 hapus session (logout)
export async function clearSession() {
  const cookieStore = await cookies();
    cookieStore.set("session", "", { maxAge: 0, path: "/" });
}
