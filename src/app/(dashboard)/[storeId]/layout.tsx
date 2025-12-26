// src/app/[storeId]/layout.tsx
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { safeAuth } from "@/lib/auth-server";
import SidebarMobile from "@/components/sidebar-mobile";
import Sidebar from "@/components/sidebar";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const s = await safeAuth();
  if (!s) redirect("/login?mode=sign-in");

  const { storeId } = await params;

  if (s.role === "superAdmin" || s.role === "owner") {
    const exists = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });
    if (!exists) redirect("/");
    return (
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <SidebarMobile />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    );
  }

  // admin harus di-assign ke store tersebut
  const assigned = await prisma.storeUser.findFirst({
    where: { userId: s.uid, storeId },
    select: { id: true },
  });
  if (!assigned) redirect("/login?mode=sign-in");

  return (
    <div className="flex h-screen bg-red-500">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <SidebarMobile />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
