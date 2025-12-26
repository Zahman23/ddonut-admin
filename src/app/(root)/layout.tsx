// src/app/(root)/layout.tsx
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-server";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await safeAuth();
  if (!s) redirect("/login?mode=sign-in");

  return <>{children}</>;
}
