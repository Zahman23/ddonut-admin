// app/api/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  // Hapus cookie "session"
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // langsung expired
  });

  return NextResponse.redirect(new URL("/login?mode=sign-in", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));;
}
