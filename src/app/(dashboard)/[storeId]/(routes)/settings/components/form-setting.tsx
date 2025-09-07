'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Store } from '@/generated/prisma'
import { Save, Store as IconStore, Trash2 } from 'lucide-react'
import z from 'zod'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOrigin } from '@/hooks/use-origin'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import AlertModal from '@/components/alert-modal'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import toast from 'react-hot-toast'

interface FormSettingProps{
    initialData: Store,
    role: string
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const FormSetting = ({initialData,role} : FormSettingProps) => {
    const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const { storeId } = params;
  const router = useRouter();
  const origin = useOrigin();

  const requiredSuperAdmin = role === 'superAdmin'

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });


  const handleSubmit = async (data: SettingsFormValues) => {
    if(!requiredSuperAdmin) return
    setIsLoading(true)
    try {
        const res = await axios.patch(`/api/admin/stores/${storeId}`, data)
        router.refresh()
        toast.success('Toko berhasil dirubah')
    } catch (error) {
        toast.error("Gagal merubah toko");
      console.log(error);
    }finally{
        setIsLoading(false)
    }
  }

  const onDelete = async () => {
    if(!requiredSuperAdmin) return
    setIsLoading(true)
    try {
        await axios.delete(`/api/admin/${storeId}`)
        router.refresh()
        router.push('/')
        toast.success('Toko berhasil dihapus')
    } catch (error) {
        toast.error("Toko gagal dihapus");
      console.log(error);
    }finally{
        setIsLoading(false)
    }
  }
  return (
    <>
    <AlertModal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    onConfirm={onDelete}
    loading={isLoading || !requiredSuperAdmin}
    />
    <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconStore className="w-5 h-5" />
                Store Settings
              </CardTitle>
              <CardDescription>Update your store information and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <FormField
                    control={form.control}
                    name='name'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Store Name</FormLabel>
                            <FormControl>
                                <Input
                                placeholder='Enter your store name'
                                disabled={isLoading || !requiredSuperAdmin}
                                {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is the name that will be displayed to your customers.
                            </FormDescription>
                        </FormItem>
                    )}
                    />
                </div>

                <Button type="submit" disabled={isLoading || !requiredSuperAdmin}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
              </Form>
            </CardContent>
          </Card>

           <Separator className="my-8" />

           <Card className='border-destructive'>
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible and destructive actions.
                    </CardDescription>
                    <CardContent className='p-0 m-0 mt-2'>
                        <Button 
                        disabled={isLoading || !requiredSuperAdmin}
                        onClick={() => setIsOpen(true)}
                        variant="destructive" 
                        className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Store
                  </Button>
                    </CardContent>
                </CardHeader>
           </Card>
    </>
  )
}

export default FormSetting