import { redirect } from "next/navigation";
import prismaDb from "./prisma";
import { verifySessionFromUi } from "./session";

export const getStoreForUser = async (userId:string, role: string) => {
    if(role === 'superAdmin' || role === 'owner'){
        return prismaDb.store.findMany({
            orderBy: {createdAt: 'desc'}
        })
    }

    return prismaDb.store.findMany({
        where: {
            users: {
                some:{
                    userId
                }
            }
        }
    })
}

export async function requireRoleAccess() {
  const session = await verifySessionFromUi();

  if (!session) {
    redirect("/login?mode=sign-in");
  }

  if (session.role !== "admin" && session.role !== "superAdmin" && session.role !== 'owner') {
    redirect("/login?mode=sign-in");
  }

  return { session };
}