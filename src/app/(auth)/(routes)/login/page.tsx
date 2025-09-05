'use client'

import AuthContainer from '@/components/auth/auth-container'
import DonutLoader from '@/components/ui/loading';
import { useAuth } from '@/providers/auth-provider';
import React, { Suspense } from 'react'

const LoginPage = () => {
  const {user, loading} = useAuth()

  // ⛔️ Kalau masih loading → jangan render apa-apa (biar nggak flicker)
  if (loading) return <DonutLoader/>

  // ⛔️ Kalau sudah login → jangan render login form
  if (user) return null;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContainer/>
    </Suspense>
  )
}

export default LoginPage