import {NextResponse} from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import prismaDb from '@/lib/prisma'
import { requiredAuth } from '@/lib/auth-server'

export async function POST(req: Request) {
    try {
        const s = await requiredAuth();

    if (!(s.role === "superAdmin" || s.role === "owner")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }


        const {email, password, name, role} = await req.json()

        if(!email || !password){
            return NextResponse.json({ success: false, error: "Email & password required" }, { status: 400 });
        }

        if(!name){
            return NextResponse.json({
                success: false,
                error: "Name Required"
            })
        }

        if(!role){
            return NextResponse.json({
                success: false,
                error: "Role Required"
            })
        }

        const existing = await adminAuth.getUserByEmail(email).catch(() => null)
        if(existing){
        return NextResponse.json(
        { success: false, error: "Email sudah digunakan" },
        { status: 200 }
      );
        }

        // Buat di Firebase Auth
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name || ''
        })

        // Simpan ke Firestore
        await adminDb.collection('users').doc(userRecord.uid).set({
            email,
            role,
            name: name || '',
            createdAt: new Date()
        })

        // Simpan ke Neon(table User)
        const user = await prismaDb.user.create({
            data: {
                id: userRecord.uid,
                email,
                role,
                name: name || ''
            }
        })

        return NextResponse.json({
            success: true,
            user
        })
    } catch (err: any) {
        console.error("[USER_CREATE]", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
  try {
    const s = await requiredAuth();
    if (!(s.role === "superAdmin" || s.role === "owner")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || "20")));

    const [items, total] = await Promise.all([
      prismaDb.user.findMany({
        where: q? {
            OR: [
                {email: {contains: q, mode: 'insensitive'}},
                {name: {contains: q, mode: 'insensitive'}}
            ]
        } : {},
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,           // role global di tabel User
          createdAt: true,
          updatedAt: true,
          stores: {             // relasi StoreUser[]
            select: {
              id: true,
              role: true,       // role di context store: "admin" | "superAdmin"
              store: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prismaDb.user.count({ where: q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name:  { contains: q, mode: "insensitive" } },
          ],
        }
      : {} }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: e.status ?? 500 });
  }
}
