import {create} from 'zustand'

export type AuthMode = 'sign-in' | 'sign-up'

interface AuthState {
    mode: AuthMode,
    email: string,
    isLoading: boolean,
    error: string | null,
    setMode: (mode: AuthMode) => void,
    setEmail: (email: string) => void,
    setLoading: (isLoading: boolean) => void,
    setError: (error: string | null) => void,
    reset: () => void,
}

export const useAuthStore = create<AuthState>((set) => ({
    mode: 'sign-in',
    email: '',
    isLoading: false,
    error: null,
    setMode: (mode: AuthMode) => set({mode}),
    setEmail: (email: string) => set({email}),
    setLoading: (isLoading: boolean) => set({isLoading}),
    setError: (error: string | null) => set({error}),
    reset: () => set({email: '', isLoading: false, error: null}),
}))