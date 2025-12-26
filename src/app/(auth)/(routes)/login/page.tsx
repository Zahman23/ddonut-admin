import AuthContainer from '@/components/auth/auth-container'
import { verifySessionFromUi } from '@/lib/session';
import React, { Suspense } from 'react'

const LoginPage = async () => {
  const session = await verifySessionFromUi()

  // ⛔️ Kalau sudah login → jangan render login form
  if (session) return null;
  
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <AuthContainer/>
      </Suspense>
  )
}

export default LoginPage