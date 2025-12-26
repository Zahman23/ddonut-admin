// src/lib/auth-server.ts
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "./firebase-admin";

export type AppRole = "superAdmin" | "owner" | "admin" | null;
export type SessionUser = { uid: string; email?: string; role: AppRole };

export async function requiredAuth(): Promise<SessionUser> {
  const cookie = await cookies();
  const token = cookie.get("session")?.value;
  if (!token) throw Object.assign(new Error("Unauthorized"), { status: 401 });

  const decoded = await adminAuth.verifySessionCookie(token, true).catch(() => null);
  if (!decoded) throw Object.assign(new Error("Unauthorized"), { status: 401 });

  const snap = await adminDb.collection("users").doc(decoded.uid).get();
  const role = (snap.exists ? (snap.data()?.role as AppRole) : null) ?? null;

  return { uid: decoded.uid, email: decoded.email, role };
}

// Untuk SSR layouts/pages: return null agar bisa redirect halus
export async function safeAuth(): Promise<SessionUser | null> {
  const cookie = await cookies();
  const token = cookie.get("session")?.value;
  if (!token) return null;

  const decoded = await adminAuth.verifySessionCookie(token, true).catch(() => null);
  if (!decoded) return null;

  const snap = await adminDb.collection("users").doc(decoded.uid).get();
  const role = (snap.exists ? (snap.data()?.role as AppRole) : null) ?? null;

  return { uid: decoded.uid, email: decoded.email, role };
}
