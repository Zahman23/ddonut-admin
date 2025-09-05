'use client'

import { SignInFormData, signInSchema } from '@/schemas/auth/auth-schemas'
import { useAuthStore } from '@/store/auth/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'

import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { PasswordInput } from './password-input'
import { Button } from '../ui/button'
import { SocialLoginButtons } from './social-login-buttons'
import { useRouter } from 'next/navigation'

const SignInForm = () => {
    const {isLoading, error, setLoading, setError, setMode} = useAuthStore()
    const router = useRouter()

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data: SignInFormData) => {
        setLoading(true);
    try {
        const res = await axios.post("/api/auth/login", data)
        const body = res.data

        if(body.success){
            setError(null)
            router.replace('/')
        }else{
            form.resetField('password')
            setError(body.error)
        }
    } catch (err) {
      console.error("Login gagal",err);
    } finally {
      setLoading(false);
    }
    }

    const handleSocialLogin = () => {
        // handle social login...
    }


  return (
    <div className='slide-in-left'>
        <div className='space-y-6'>
            <div className='space-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight text-balance'>Welcome Back</h1>
                <p className='text-sm text-muted-foreground text-pretty'>
                    Sign in to your account to continue
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                    control={form.control}
                    name='email'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Input
                            type='email'
                            placeholder='Enter your email'
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                     <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <PasswordInput
                    placeholder="Enter your password"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
                <div className='p-3 text-sm text-destructive bg-destructive/10 rounded-md'>{error}</div>
            )}

            <Button
            type='submit'
            className='w-full'
            disabled={isLoading}
            >
            {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
                </form>
            </Form>

            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t'></span>
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-card px-2 text-muted-foreground'>Or continue with</span>
                </div>
            </div>

            <SocialLoginButtons
            onGoogleLogin={handleSocialLogin}
            isLoading={isLoading}
            />

            <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button variant="link" className="p-0 h-auto font-medium" onClick={() => setMode("sign-up")}>
            Sign up
          </Button>
        </div>
        </div>
    </div>
  )
}

export default SignInForm