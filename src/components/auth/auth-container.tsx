'use client'

import { useAuthStore } from '@/store/auth/auth-store'
import { useRouter, useSearchParams } from 'next/navigation'
import {use, useEffect,useRef} from 'react'
import { Card, CardContent } from '../ui/card'
import SignInForm from './sign-in-form'
import { SignUpForm } from './sign-up-form'

const AuthContainer = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const {mode, setMode} = useAuthStore()
    const isUpdatingFromUrl = useRef(false)

    // Sync mode with URL
    useEffect(() => {
        const urlMode = searchParams.get('mode')
        if(urlMode === 'sign-in'){
            if(urlMode !== mode){
                isUpdatingFromUrl.current = true
                setMode(urlMode)
            }
        }else{
            // Default to sign-in if mode is invalid
            isUpdatingFromUrl.current = true
            setMode('sign-in')
        }
    }, [searchParams, setMode])

    // Update URL when mode changes (but not when updating from URL)
    useEffect(() => {
        if(isUpdatingFromUrl.current){
            isUpdatingFromUrl.current = false
            return
        }

        const currentMode = searchParams.get('mode')
        if(currentMode !== mode){
            router.push(`/login?mode=${mode}`, {scroll: false})
        }
    }, [mode, router, searchParams])

    const renderForm = () => {
        switch(mode){
            default:
                return <SignInForm/>
        }
    }

  return (
        <div className='w-full max-w-md '>
            <Card className='border-0 shadow-lg'>
                <CardContent className='p-8 relative overflow-hidden'>
                    {renderForm()}
                </CardContent>
            </Card>
        </div>
  )
}

export default AuthContainer