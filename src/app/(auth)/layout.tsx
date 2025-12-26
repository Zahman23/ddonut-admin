// src/app/login/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requiredAuthClient } from "@/lib/client/auth-client";

export default function AuthLoginLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await requiredAuthClient();
      if (s && (s.role === "superAdmin" || s.role === "owner" || s.role === "admin")) {
        router.replace("/");
        return;
      }
      setLoading(false);
    })();
  }, [router]);

  if (loading) return <div className="min-h-screen grid place-items-center">Loading…</div>;
  return <div className="min-h-screen flex items-center justify-center">{children}</div>;
}
