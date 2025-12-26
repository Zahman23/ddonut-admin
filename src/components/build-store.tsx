'use client'

import { useStoreModal } from '@/stores/use-store-modal'
import { useEffect } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'


export const BuildStore = () => {
    const {isOpen, onOpen} = useStoreModal()

    useEffect(() => {
        if(!isOpen){
            onOpen()
        }
    },[isOpen, onOpen])

  return null
}

export const NotAssignStore = () => {
    const router = useRouter()

    const handleLogout = async () => {
        await axios.get('/api/auth/logout')
        router.push('/login?mode=sign-in')
    }

    return(
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <p className="text-md pb-4">Hubungi owner untuk memiliki akses ke store</p>
            <Button onClick={handleLogout} size={'sm'} variant={'secondary'} className='cursor-pointer'>
                <ArrowLeftIcon className='h-4 w-4'/>
                Keluar
            </Button>
        </div>
    )
}