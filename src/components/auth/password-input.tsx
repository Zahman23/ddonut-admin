'use client'

import { usePasswordVisibility } from '@/hooks/use-password-visibility'
import React, { forwardRef } from 'react'
import { Input} from '@/components/ui/input'
import { Button } from '../ui/button'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({children, dangerouslySetInnerHTML, ...props}, ref) => {
        const { isVisible, togglePassword } = usePasswordVisibility()

        return (
            <div className='relative'>
                <Input {...props} ref={ref} type={isVisible ? 'text' : 'password'}/>
                <Button
                type='button'
                variant={'ghost'}
                size={'sm'}
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={togglePassword}
                tabIndex={-1}
                >
                    {isVisible ? (
                        <EyeOff className='h-4 w-4 text-muted-foreground'/>
                    ): (
                       <Eye className='h-4 w-4 text-muted-foreground'/>
                    )}
                </Button>
            </div>
        )
    }
)

PasswordInput.displayName = 'PasswordInput'

