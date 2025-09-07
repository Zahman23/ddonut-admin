'use client'

import React from 'react'

interface ContainerProps{
    children: React.ReactNode
}

const Container = ({children} : ContainerProps) => {
  return (
    <div className='flex-1 flex flex-col h-screen'>
        {children}
    </div>
  )
}

export default Container