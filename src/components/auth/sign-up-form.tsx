"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "./password-input"
import { SocialLoginButtons } from "./social-login-buttons"
import { signUpSchema, type SignUpFormData } from "@/schemas/auth/auth-schemas"
import { useAuthStore } from "@/store/auth/auth-store"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export const  SignUpForm =() => {
  const { isLoading, error, setLoading, setError, setMode, setEmail,reset } = useAuthStore()

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "superAdmin",
    },
  })

  const onSubmit = async (data: SignUpFormData) => {
    // Simulate sign up process
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const output = await res.json()

      console.log(output)

      if(!res.ok){
        form.setError('email', {message: 'Email sudah terdaftar'})
        form.resetField('password')
        form.resetField('confirmPassword')
        return
      }else{
        form.reset()
      }
    } catch (error) {
      console.log("Network error, please try again.");
    }finally{
      setLoading(false)
    }
  }

  const handleSocialLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      const userCred = await signInWithPopup(auth, provider)
      const user = userCred.user

      // cek apakah user sudah ada
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          role: "client",
          createdAt: new Date(),
        })
      }

      const token = await user.getIdToken()
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      })
    } catch (err: any) {
      setError(err.message || "Google sign up gagal")
    } finally {
      setLoading(false)
      reset()
    }
  }

  return (
    <div className="slide-in-right">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Create your account</h1>
          <p className="text-sm text-muted-foreground text-pretty">Sign up to get started with your new account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <PasswordInput
                    placeholder="Create a password"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <PasswordInput
                    placeholder="Confirm your password"
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

            {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <SocialLoginButtons
          onGoogleLogin={() => handleSocialLogin()}
          isLoading={isLoading}
        />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Button variant="link" className="p-0 h-auto font-medium" onClick={() => setMode("sign-in")}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  )
}
