"use client";

import { useEffect, useRef, useState } from "react";
import { useStoreAccessStore } from "@/stores/use-store-access-store";

type UserSession = { uid: string; email?: string; role?: string | null } | null;

export function useStoreAccess() {
  // Zustand selectors
  const role    = useStoreAccessStore(s => s.role);
  const stores  = useStoreAccessStore(s => s.stores);
  const loading = useStoreAccessStore(s => s.loading);
  const error   = useStoreAccessStore(s => s.error);
  const fetchAccess = useStoreAccessStore(s => s.fetchAccess);

  // session user (email/role) dari endpoint terpisah
  const [user, setUser] = useState<UserSession>(null);
  const mounted = useRef(false);

  // Fetch sekali saat mount (tanpa syarat)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fetchAccess().catch(() => {});
    }
  }, [fetchAccess]);

  // Ambil session user (sekali)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!res.ok) { setUser(null); return; }
        const json = await res.json();
        if (active) setUser(json);
      } catch {
        if (active) setUser(null);
      }
    })();
    return () => { active = false; };
  }, []);

  return { role, stores, loading, error, user, refresh: fetchAccess };
}
