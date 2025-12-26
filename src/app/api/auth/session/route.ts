// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { requiredAuth } from "@/lib/auth-server";

export async function GET() {
  try {
    const session = await requiredAuth();
    return NextResponse.json(session);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: e.status ?? 401 });
  }
}
