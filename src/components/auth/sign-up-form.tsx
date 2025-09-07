"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "./password-input"
import { signUpSchema, type SignUpFormData } from "@/schemas/auth/auth-schemas"
import { useAuthStore } from "@/store/auth/auth-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface SignUpFormProps{
  onClose: () => void
}

export const  SignUpForm =({onClose}:SignUpFormProps) => {
  const { isLoading, error, setLoading, setError, setMode, setEmail,reset } = useAuthStore()
  const router = useRouter()

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name:'',
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin",
    },
  })

  const onSubmit = async (data: SignUpFormData) => {
    // Simulate sign up process
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post('/api/admin/users',data)
      const body = res.data
      if(body.success){
        console.log(body)
        onClose()
        router.refresh()
        toast.success("User berhasil dibuat")
      }else{
        form.resetField('password')
        form.resetField('confirmPassword')
        setError(body.error)
      }
    } catch (error) {
      console.log("Network error, please try again.");
    }finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter full name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
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
                  <FormLabel>Password *</FormLabel>
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
                  <FormLabel>Confirm Password *</FormLabel>
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

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
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

        {/* <div className="relative">
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
        /> */}
      </div>
    </div>
  )
}
