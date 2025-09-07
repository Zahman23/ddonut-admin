'use client'

import AddAccountModal from '@/components/add-account-modal'
import Navbar from '@/components/widgets/navbar'
import React, { useState } from 'react'

const WrapperSettings = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
    <AddAccountModal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    />
     <Navbar 
     handleAction={() => setIsOpen(true)}
    nameSection='User Management' 
    actionName='Add User'
    description={`Welcome back! Here's what's happening with your business today.`}
    />
    </>
  )
}

export default WrapperSettings