'use client'

import axios from "axios"
import { useEffect, useState } from "react"

type Store = {
    id: string,
    name: string
}

interface StoreAcess{
    role: 'superAdmin' | 'owner' | 'admin'
    stores: Store[]
}

const useStoreAccess = () => {
    const [data, setData] = useState<StoreAcess | null>(null)
    const [loading,setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true;

        const fetchAccess = async () => {
            try {
                const res = await axios.get('/api/stores/access')
        
                if(res.status !== 200){
                    throw new Error(`Failed: ${res.status}`)
                }

                const body = res.data
                if(isMounted){
                    setData({role: body.role, stores: body.stores})
                }
            } catch (err: any) {
                if(isMounted){
                    setError(err.message || "Error fetching store access")
                }
            } finally{
                if(isMounted) setLoading(false)
            }
        }

        fetchAccess()
        return() => {
            isMounted = false
        }
    },[])

    return {data, loading, error}
}