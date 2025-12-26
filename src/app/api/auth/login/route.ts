// app/api/auth/login/route.ts
export const runtime = "nodejs"; // penting untuk Admin SDK

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requiredAuth } from "@/lib/auth-server";

type RestError = {
  error?: {
    code: number;
    message: string; // e.g. "EMAIL_NOT_FOUND" | "INVALID_PASSWORD" | "INVALID_LOGIN_CREDENTIALS"
  };
};

function mapError(message: string) {
  switch (message) {
    case "EMAIL_NOT_FOUND":
      return { type: "EMAIL_NOT_FOUND", message: "Email belum terdaftar." };
    case "INVALID_PASSWORD":
      return { type: "WRONG_PASSWORD", message: "Password salah." };
    case "INVALID_LOGIN_CREDENTIALS":
      // format baru Google; artinya kombinasi salah
      return { type: "WRONG_PASSWORD", message: "Email atau password salah." };
    case "USER_DISABLED":
      return { type: "USER_DISABLED", message: "Akun dinonaktifkan." };
    case "INVALID_EMAIL":
      return { type: "INVALID_EMAIL", message: "Format email tidak valid." };
    case "OPERATION_NOT_ALLOWED":
      // Email/Password belum di-enable di Firebase Console
      return { type: "OPERATION_NOT_ALLOWED", message: "Metode Email/Password belum diaktifkan." };
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return { type: "RATE_LIMIT", message: "Terlalu banyak percobaan. Coba lagi nanti." };
    default:
      return { type: "UNKNOWN", message: "Login gagal. Coba lagi." };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
      return NextResponse.json(
        { success: false, type: "BAD_REQUEST", message: "Payload tidak valid." },
        { status: 200 }
      );
    }

    const { email, password } = body;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, type: "SERVER_MISCONFIG", message: "API key tidak dikonfigurasi." },
        { status: 200 }
      );
    }

    // ---- Panggil REST ----
    let res: Response;
    try {
      res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
          cache: "no-store",
        }
      );
    } catch (e) {
      // Error jaringan/DNS/SSL dsb
      return NextResponse.json(
        { success: false, type: "NETWORK_ERROR", message: "Gagal menghubungi Auth server." },
        { status: 200 }
      );
    }

    // ---- Parse response aman ----
    const text = await res.text();
    let json: any = undefined;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      // Bukan JSON (mis. HTML proxy/error)
      return NextResponse.json(
        {
          success: false,
          type: "BAD_RESPONSE",
          message: "Respons tidak valid dari Auth server.",
          debug: process.env.NODE_ENV !== "production" ? { status: res.status, text } : undefined,
        },
        { status: 200 }
      );
    }

    // ---- Tangani error REST (status 400) ----
    if (!res.ok || (json && json.error)) {
      const code = (json as RestError)?.error?.message ?? "UNKNOWN";
      const mapped = mapError(code);
      return NextResponse.json({ success: false, ...mapped }, { status: 200 });
    }

    // ---- Sukses login ----
    const idToken: string = json.idToken;
    const uid: string = json.localId;

    // Ambil role di Firestore
    const snap = await adminDb.collection("users").doc(uid).get();
    const role = snap.exists ? (snap.data()?.role as string | null) : null;

    if (role !== "admin" && role !== "superAdmin") {
      return NextResponse.json(
        { success: false, type: "UNAUTHORIZED", message: "Unauthorized" },
        { status: 200 }
      );
    }

    // Buat session cookie
    const expiresInMs = 1000 * 60 * 60 * 24 * 7; // 7 hari
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: expiresInMs,
    });

    (await cookies()).set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresInMs / 1000,
    });

    return NextResponse.json({ success: true, role }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, type: "UNKNOWN", message: "Login gagal. Coba lagi." },
      { status: 200 }
    );
  }
}

export async function GET() {
  try {
    const { uid, email, role } = await requiredAuth();
    return NextResponse.json({ user: { uid, email, role } }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
