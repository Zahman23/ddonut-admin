import React from 'react'
import FormSetting from './components/form-setting'
import Navbar from '@/components/widgets/navbar'
import { requireRoleAccess } from '@/lib/store-service'
import { redirect } from 'next/navigation'
import prismaDb from '@/lib/prisma'

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
  return (
    <>
    <Navbar nameSection={'Settings'} showAction={false} description=''/>
    <main className='flex-1 overflow-y-auto w-full'>
        <div className='p-6 max-w-2xl mx-auto'>
          <FormSetting initialData={stores} role={session.role}/>
        </div>
    </main>
    </>
  )
}

export default SettingsPage