'use client'

import { useStoreModal } from '@/store/use-store-modal'
import { useEffect } from 'react'

const BuildStore = () => {
    const {isOpen, onOpen} = useStoreModal()

    useEffect(() => {
        if(!isOpen){
            onOpen()
        }
    },[isOpen, onOpen])

  return null
}

export default BuildStore