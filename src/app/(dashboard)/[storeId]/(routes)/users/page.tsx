import React from "react";
import WrapperUsers from "./components/wrapper-users";
import { safeAuth } from "@/lib/auth-server";
import { redirect } from "next/navigation";

interface UsersPageProps {
  params: Promise<{ storeId: string }>;
}

const UsersPage = async ({ params }: UsersPageProps) => {
  const s = await safeAuth();
  const { storeId } = await params;

  if (!(s?.role === "superAdmin" || s?.role === "owner"))
    redirect(`/${storeId}`);

  return <WrapperUsers role={s.role} storeId={storeId} />;
};

export default UsersPage;
