import BuildStore from "@/components/build-store";
import { requiredAuth } from "@/lib/auth-server";
import prismaDb from "@/lib/prisma";
import { redirect } from "next/navigation";


export default async function Home() {
const session = await requiredAuth().catch(() => null);

  if (!session) {
    redirect("/api/auth/logout");
  }

  // SUPERADMIN / OWNER
  if (session.role === "superAdmin" || session.role === "owner") {
    const store = await prismaDb.store.findFirst();

    if (!store) {
      return <BuildStore />;
    }

    return redirect(`/${store.id}`);
  }

  // ADMIN
  if (session.role === "admin") {
    const assignedStore = await prismaDb.storeUser.findFirst({
      where: { userId: session.uid },
      include: { store: true },
    });

    if (!assignedStore) {
      return (
        <div className="flex justify-center items-center min-h-screen w-full">
          Store belum ada, mohon hubungi pemilik toko
        </div>
      );
    }

    return redirect(`/${assignedStore.storeId}`);
  }

  return redirect("/api/auth/logout");
 
}
