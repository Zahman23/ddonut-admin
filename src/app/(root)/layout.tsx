import prismaDb from '@/lib/prisma'
import { requireRoleAccess } from '@/lib/store-service'
import { redirect } from 'next/navigation'
import React from 'react'

interface SetupPageProps{
    children: React.ReactNode
    params: Promise<{storeId: string}>
}

const SetupPage = async ({children, params} : SetupPageProps) => {
    const storeId = (await params).storeId

    await requireRoleAccess()

    const storeUser = await prismaDb.store.findFirst({
        where: {
            id: storeId
        },
    })

    if(storeUser){
        redirect(`/${storeUser.id}`)
    }

  return (
    <>
        {children}
    </>
  )
}

export default SetupPage