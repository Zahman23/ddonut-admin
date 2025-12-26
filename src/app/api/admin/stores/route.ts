import { requiredAuth } from "@/lib/auth-server";
import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    const s = await requiredAuth();
    if (!(s.role === "superAdmin" || s.role === "owner")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama Toko Harus diisi",
        },
        {
          status: 400,
        }
      );
    }

    const store = await prismaDb.store.create({
      data: { name },
    });

    return NextResponse.json(
      {
        success: true,
        store,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    console.error("Error create store:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan" },
      { status: err.status || 500 }
    );
  }
}

export async function GET() {
  try {
    const s = await requiredAuth();
    if (!(s.role === "superAdmin" || s.role === "owner")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const stores = await prismaDb.store.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    });

    return NextResponse.json({ success: true, stores });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message },
      { status: e.status ?? 500 }
    );
  }
}
