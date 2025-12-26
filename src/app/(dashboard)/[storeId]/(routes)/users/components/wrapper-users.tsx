// src/app/[storeId]/users/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Shield, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "./user-avatar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface WrapperUsersProps {
  role: "superAdmin" | "owner" | null;
  storeId: string;
}

type StoreLite = { id: string; name: string };
type UserRow = {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null; // global role di tabel User
  createdAt: string;
  updatedAt: string;
  stores: {
    id: string;
    role: "admin" | "superAdmin";
    store: { id: string; name: string };
  }[];
};

type UsersResp = {
  success: boolean;
  data: {
    items: UserRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export default function WrapperUsers({ role, storeId }: WrapperUsersProps) {
  // state
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [stores, setStores] = useState<StoreLite[]>([]);
  const [assigning, setAssigning] = useState<string | null>(null); // userId yang lagi di-assign

  const router = useRouter();

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  // load stores (untuk dropdown assign) – hanya superAdmin/owner yg sukses
  async function loadStores() {
    const res = await fetch("/api/admin/stores", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    setStores(json.stores ?? []);
  }

  // load users
  async function loadUsers({ q, page }: { q: string; page: number }) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed: ${res.status}`);
      }
      const json: UsersResp = await res.json();
      setUsers(json.data.items);
      setTotalPages(json.data.totalPages);
      console.log("Loaded users:", json.data.items);
    } catch (e: any) {
      toast.error(e.message || "Gagal memuat pengguna");
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  // initial & reactive loads
  useEffect(() => {
    loadStores().catch(() => {});
  }, []);
  useEffect(() => {
    loadUsers({ q: debouncedQ, page }).catch(() => {});
  }, [debouncedQ, page]);

  // actions
  async function handleAssign(
    userId: string,
    storeId: string,
    storeRole: "admin" | "superAdmin"
  ) {
    try {
      setAssigning(userId);
      const res = await fetch(`/api/admin/users/${userId}/assign`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ storeId, role: storeRole }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed: ${res.status}`);
      }
      toast.success("User berhasil di-assign");
      await loadUsers({ q: debouncedQ, page });
    } catch (e: any) {
      toast.error(e.message || "Assign gagal");
    } finally {
      setAssigning(null);
    }
  }

  async function handleUnassign(userId: string, storeId: string) {
    try {
      setAssigning(userId);
      const res = await fetch(
        `/api/admin/users/${userId}/assign?storeId=${storeId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed: ${res.status}`);
      }
      toast.success("User dihapus dari store");
      await loadUsers({ q: debouncedQ, page });
    } catch (e: any) {
      toast.error(e.message || "Unassign gagal");
    } finally {
      setAssigning(null);
    }
  }

  const handleRegister = () => {
    router.push(`/${storeId}/users/register`);
  };

  const empty = !loading && users.length === 0;
  const assignedStore = users.map((u) => u.stores.map((s) => s.store.name));
  console.log("assignedStore", assignedStore ?? "-");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Kelola user & assign ke store
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Cari nama / email…"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            className="w-64"
          />
          {(role === "superAdmin" || role === "owner") && (
            <Button
              onClick={handleRegister}
              className="cursor-pointer"
              disabled={!(role === "superAdmin" || role === "owner")}
            >
              Daftar
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Memuat…
        </div>
      ) : empty ? (
        <div className="text-muted-foreground">Tidak ada user.</div>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Global Role</th>
                <th className="p-2 text-left">Assigned Stores</th>
                <th className="p-2 text-left w-[340px]">Assign to Store</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={u.name}
                        email={u.email}
                        className="h-9 w-9"
                      />
                      <div>
                        <div className="font-medium">{u.email || "-"}</div>
                        <div className="text-xs text-muted-foreground">
                          {u.name || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <Badge variant="outline">{u.role || "-"}</Badge>
                  </td>
                  <td className="p-2">
                    {u.stores.length === 0 ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {u.stores.map((su) => (
                          <div key={su.id} className="flex items-center gap-1">
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Store className="h-3 w-3" />
                              {su.store.name}
                              <span className="text-[10px] opacity-70">
                                ({su.role})
                              </span>
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-destructive"
                              onClick={() => handleUnassign(u.id, su.store.id)}
                              disabled={assigning === u.id}
                            >
                              hapus
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <Select
                        onValueChange={(storeId) =>
                          handleAssign(u.id, storeId, "admin")
                        }
                      >
                        <SelectTrigger className="w-56">
                          {u.stores.length === 0 ? (
                            <SelectValue placeholder="Pilih store…" />
                          ) : (
                            u.stores.map((st) => (
                              <SelectValue
                                key={st.store.id}
                                placeholder={st.store.name ?? ""}
                              />
                            ))
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        defaultValue="admin"
                        onValueChange={(r) => {
                          // simpan preferred role assign di data-attr tombol jika mau
                          // di contoh ini, kita langsung assign saat pilih store dengan role "admin"
                          // kalau mau tombol "Assign" terpisah, kamu bisa tambah state untuk role
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <span className="flex items-center gap-1">
                              <Plus className="h-3 w-3" /> admin
                            </span>
                          </SelectItem>
                          <SelectItem value="superAdmin">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" /> superAdmin
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-3">
            <div className="text-xs text-muted-foreground">
              Page {page} dari {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
