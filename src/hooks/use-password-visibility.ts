'use client'

import { use, useCallback, useEffect, useState } from 'react'

export const usePasswordVisibility = () => {
    const [isVisible, setVisible] = useState<boolean>(false)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    const showPassword = useCallback(() =>  {
        setVisible(true)

        // Hapus batas waktu yang ada
        if(timeoutId){
            clearTimeout(timeoutId)
        }

        // Atur waktu tunggu baru untuk menyembunyikan kata sandi setelah 5 detik
        const newTimeoutId = setTimeout(() => {
            setVisible(false)
        }, 5000)

        setTimeoutId(newTimeoutId)
    }, [timeoutId])

    const hidePassword = useCallback(() => {
        setVisible(false)
        if(timeoutId){
            clearTimeout(timeoutId)
            setTimeoutId(null)
        }
    }, [timeoutId])

    const togglePassword = useCallback(() => {
        if(isVisible){
            hidePassword()
        } else {
            showPassword()
        }
    },[isVisible, showPassword, hidePassword])

    // Batas waktu pembersihan saat melepas mount
    useEffect(() => {
        return () => {
            if(timeoutId){
                clearTimeout(timeoutId)
            }
        }
    },[timeoutId])

    return { isVisible, showPassword, hidePassword, togglePassword }
}