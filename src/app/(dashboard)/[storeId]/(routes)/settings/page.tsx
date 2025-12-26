import React from 'react'
import FormSetting from './components/form-setting'
import Navbar from '@/components/widgets/navbar'
import { requireRoleAccess } from '@/lib/store-service'
import { redirect } from 'next/navigation'
import prismaDb from '@/lib/prisma'
import WrapperSettings from './components/wrapper-settings'

interface SettingsPageProps{
  params: Promise<{storeId: string}>
}

const SettingsPage = async ({params}: SettingsPageProps) => {
  const storeId =  (await params).storeId
  const {session} = await requireRoleAccess()

  const stores = await prismaDb.store.findFirst({
    where: {
      id: storeId,
    },
  });

  if (!stores) {
    redirect("/");
  }
  return <WrapperSettings store={stores} role={session.role}/>
}

export default SettingsPage