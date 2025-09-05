'use client'

import { Chrome } from "lucide-react"
import { Button } from "../ui/button"

interface SocialLoginButtonsProps {
    onGoogleLogin: () => void
    isLoading?: boolean
}

export const SocialLoginButtons = ({onGoogleLogin, isLoading} : SocialLoginButtonsProps) => {
    return (
        <div className="space-y-3">
            <Button
            type="button"
            variant={'outline'}
            className="w-full h-11 text-sm font-medium bg-transparent"
            onClick={onGoogleLogin}
            disabled={isLoading}
            >
                <Chrome className="w-4 h-4 mr-2" />
                Continue with Google
            </Button>
        </div>
    )
}