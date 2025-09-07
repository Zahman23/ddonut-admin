import { verifySessionFromUi } from '@/lib/session'
import { redirect } from 'next/navigation'
import React from 'react'

const AuthLogin = async ({children} : {children: React.ReactNode}) => {
  const session = await verifySessionFromUi()
  console.log(session)

  if(session && (session.role === 'admin' || session.role === 'superAdmin')){
    redirect('/')
  }

  return (
    <div className='min-h-screen flex items-center justify-center '>{children}</div>
  )
}

export default AuthLogin