// src/app/(root)/page.tsx
import { BuildStore, NotAssignStore } from "@/components/build-store";
import prisma from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function Home() {
  const s = await safeAuth();
  if (!s) redirect("/login?mode=sign-in");

  if (s.role === "superAdmin" || s.role === "owner") {
    const first = await prisma.store.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (!first) return <BuildStore />;
    redirect(`/${first.id}`);
  }

  if (s.role === "admin") {
    const assigned = await prisma.storeUser.findFirst({
      orderBy: { createdAt: "asc" },
    });

    redirect(`/${assigned?.storeId}`);
  }

  // admin
  const assigned = await prisma.storeUser.findFirst({
    where: { userId: s.uid },
    select: { storeId: true },
  });

  console.log("assigned", assigned);

  if (!assigned) {
    return <NotAssignStore />;
  }
}
