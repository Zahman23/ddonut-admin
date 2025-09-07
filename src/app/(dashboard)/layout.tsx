import Sidebar from '@/components/sidebar'
import SidebarMobile from '@/components/sidebar-mobile'
import Wrapper from '@/components/wrapper'

import { getStoreForUser, requireRoleAccess } from '@/lib/store-service'
import { redirect } from 'next/navigation'
import React from 'react'

interface DashboardLayoutProps{
    children: React.ReactNode
}

const DashboardLayout = async ({children}: DashboardLayoutProps) => {
    const {session} = await requireRoleAccess()

    const stores = await getStoreForUser(session.uid, session.role)

    if(!stores){
        redirect('/')
    }

    const formatterUser = ({
        role: session.role,
        email: session.email,
    })

  return (
    <main className='flex h-screen bg-gray-100'>
        
        <div className='hidden lg:block'>
            <Sidebar stores={stores} user={formatterUser}/>
        </div>

        <SidebarMobile/>

        <div className='flex-1 flex flex-col overflow-hidden'>
            <Wrapper>
                {children}
            </Wrapper>
        </div>
    </main>
  )
}

export default DashboardLayout