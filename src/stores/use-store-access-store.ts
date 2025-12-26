"use client";
import { create } from "zustand";

export type Role = "superAdmin" | "owner" | "admin" | null;
export type StoreLite = { id: string; name: string };

interface State {
  role: Role;
  stores: StoreLite[];
  loading: boolean;
  error: string | null;
  // actions
  fetchAccess: () => Promise<void>;
  clear: () => void;
  hydrate: (payload: { role: Role; stores: StoreLite[] }) => void;
}

export const useStoreAccessStore = create<State>((set) => ({
  role: null,
  stores: [],
  loading: false,        // ⬅️ set FALSE supaya bisa langsung fetch
  error: null,

  fetchAccess: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/admin/stores/access", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const json = await res.json();
      set({ role: json.role ?? null, stores: json.stores ?? [], loading: false });
    } catch (e: any) {
      set({ role: null, stores: [], loading: false, error: e.message || "Error" });
    }
  },

  clear: () => set({ role: null, stores: [], loading: false, error: null }),

  hydrate: ({ role, stores }) => set({ role, stores, loading: false, error: null }),
}));
