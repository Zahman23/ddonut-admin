'use client'

import React, { useEffect, useState } from 'react'
import Container from './ui/container'
import { useStoreDashboard } from '@/stores/use-store-dashboard'
import Navbar from './widgets/navbar'
import DonutLoader from './ui/loading'

interface WrapperProps{
  children: React.ReactNode
}

const Wrapper = ({children}: WrapperProps) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
       setIsMounted(true)
    },[])

    if(!isMounted){
      return <DonutLoader/>
    }

  return (
    <Container>
        {children}
    </Container>
  )
}

export default Wrapper