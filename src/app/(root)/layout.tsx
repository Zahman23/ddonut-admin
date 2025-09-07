import { requiredAuth } from '@/lib/auth-server'
import prismaDb from '@/lib/prisma'
import { clearSession } from '@/lib/session'
import { requireRoleAccess } from '@/lib/store-service'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React from 'react'

interface SetupPageProps{
    children: React.ReactNode
    params: Promise<{storeId: string}>
}

const SetupPage = async ({children, params} : SetupPageProps) => {
   // 🔒 Auth check (client masuk dashboard)
  const session = await requiredAuth();

  if(!session){
    redirect('/api/auth/logout')
  }

  // ✅ Kalau superAdmin atau owner → langsung lolos
  if (session.role === "superAdmin" || session.role === "owner") {
    return <>{children}</>;
  }

  // ✅ Kalau admin → wajib punya assign StoreUser
  const assignedStore = await prismaDb.storeUser.findFirst({
    where: { userId: session.uid },
  });

  if (!assignedStore) {
    redirect('/api/auth/logout')
  }

  return <>{children}</>;
}

export default SetupPage