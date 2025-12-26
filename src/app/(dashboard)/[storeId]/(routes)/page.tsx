import Sidebar from "@/components/sidebar";
import prismaDb from "@/lib/prisma";
import { requireRoleAccess } from "@/lib/store-service";
import { redirect } from "next/navigation";
import React from "react";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const storeId = (await params).storeId;

  await requireRoleAccess();

  const storeUser = await prismaDb.store.findFirst({
    where: {
      id: storeId,
    },
  });

  if (!storeUser) {
    redirect("/");
  }
  return <div className="bg-red-500">Dashboard</div>;
};

export default DashboardPage;
