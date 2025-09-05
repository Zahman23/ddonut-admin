// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Hanya jaga route API
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // API yang publik
  if (
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/api/auth/login")
  ) {
    return NextResponse.next();
  }

  // ❗️Edge-safe: cek cookie langsung dari req.cookies (tanpa import apa pun)
  const session = req.cookies.get("session")?.value;

  if (!session) {
    // Tidak ada cookie: block
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ⚠️ Jangan cek role di middleware (butuh admin SDK). Lanjutkan saja.
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
