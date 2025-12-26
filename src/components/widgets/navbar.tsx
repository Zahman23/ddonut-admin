'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Filter, Plus } from 'lucide-react'

interface NavbarProps{
  nameSection: string,
  actionName?: string,
  showAction?: boolean
  description: string,
  handleAction?: () => void
}

const Navbar = ({nameSection,handleAction,actionName, showAction= true, description}:NavbarProps) => {

  
  return (
    <div className="border-b border-border bg-card flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">{nameSection.toUpperCase()}</h1>
              <p className="text-muted-foreground mt-1">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {showAction && (
              <Button size="sm" onClick={() => handleAction?.()}>
                <Plus className="w-4 h-4 mr-2" />
                {actionName}
              </Button>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}

export default Navbar