// src/app/api/store/assign-user/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requiredAuth } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const s = await requiredAuth();
    if (!(s.role === "superAdmin" || s.role === "owner")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { storeId, userId, role } = await req.json();
    if (!storeId || !userId || !role) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }
    if (!["admin", "superAdmin"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId }, select: { id: true } });
    if (!store) return NextResponse.json({ success: false, message: "Store not found" }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const existing = await prisma.storeUser.findUnique({
      where: { storeId_userId: { storeId, userId } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ success: false, message: "Already assigned" }, { status: 409 });
    }

    const created = await prisma.storeUser.create({
      data: { storeId, userId, role },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: e.status ?? 500 });
  }
}
