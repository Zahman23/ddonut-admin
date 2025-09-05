"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

type User = { uid: string; email: string; role: "admin" | "superAdmin" | "client" };

const AuthCtx = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const { data } = await axios.get("/api/auth/login");
        if (!mounted) return;

        setUser(data.user ?? null);

        const isAdminPage =
          pathname === "/" ||
          pathname.startsWith("/category") ||
          pathname.startsWith("/banner") ||
          pathname.startsWith("/product");

        if (isAdminPage) {
          if (!data.user || (data.user.role !== "admin" && data.user.role !== "superAdmin")) {
            router.replace("/login?mode=sign-in");
            return;
          }
        }

        // ⛔️ Jangan tampilkan /login kalau sudah login
        if ((pathname === "/login" || pathname === '/login?mode=sign-in') && data.user && (data.user.role === "admin" || data.user.role === "superAdmin")) {
          router.replace("/");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  return <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
