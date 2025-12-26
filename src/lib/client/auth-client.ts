// src/lib/client/auth-client.ts
export async function requiredAuthClient() {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as { uid: string; email?: string; role: string };
  } catch {
    return null;
  }
}
