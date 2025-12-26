import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requiredAuth } from "@/lib/auth-server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const s = await requiredAuth();
    if (!(s.role === "superAdmin" || s.role === "owner")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const {userId} =await params;
    const { storeId, role } = await req.json();

    if (!userId || !storeId || !role) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    if (!["admin", "superAdmin"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    const [user, store] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.store.findUnique({ where: { id: storeId }, select: { id: true } }),
    ]);
    if (!user)  return NextResponse.json({ success: false, message: "User not found" },  { status: 404 });
    if (!store) return NextResponse.json({ success: false, message: "Store not found" }, { status: 404 });

    const existing = await prisma.storeUser.findUnique({
      where: { storeId_userId: { storeId, userId } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ success: false, message: "Already assigned" }, { status: 409 });
    }

    const created = await prisma.storeUser.create({
      data: { storeId, userId, role },
      select: {
        id: true,
        role: true,
        store: { select: { id: true, name: true } },
        user:  { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: e.status ?? 500 });
  }
}

// (Opsional) Unassign
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const s = await requiredAuth();
    if (!(s.role === "superAdmin" || s.role === "owner")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const userId = params.userId;
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!userId || !storeId) {
      return NextResponse.json({ success: false, message: "Missing storeId" }, { status: 400 });
    }

    const existing = await prisma.storeUser.findUnique({
      where: { storeId_userId: { storeId, userId } },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Relation not found" }, { status: 404 });
    }

    await prisma.storeUser.delete({ where: { storeId_userId: { storeId, userId } } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: e.status ?? 500 });
  }
}
