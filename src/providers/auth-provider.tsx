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
        const {data} = await axios.get('/api/auth/login')
        if(mounted) setUser(data.user ?? null)
      } catch{
        if(mounted) setUser(null)
      }   
      finally {
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
