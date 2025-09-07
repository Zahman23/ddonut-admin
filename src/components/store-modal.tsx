'use client'

import React, { useState } from 'react'
import Modal from './ui/modal'
import { useStoreModal } from '@/store/use-store-modal'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { storeFormData, storeFormSchema } from '@/schemas/store/store-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'

const StoreModal = () => {
    const {isOpen, onClose} = useStoreModal()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<storeFormData>({
        resolver: zodResolver(storeFormSchema),
        defaultValues: {
            name: ''
        }
    })

    const onSubmit = async (values: storeFormData) => {
        setIsLoading(true)
        try {
            const res = await axios.post('/api/admin/stores', values)
            console.log(res)
            window.location.assign(`/${res.data.store.id}`)
        } catch (err: any) {
            console.log(err)
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <Modal
    title="Buat Toko Baru"
    description='Tambahkan Toko untuk membuat produk dan kategori baru.'
    isOpen={isOpen}
    onClose={onClose}
    >
        <div>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Store</FormLabel>
                                <FormControl>
                                    <Input 
                                    disabled={isLoading}
                                    placeholder='Nama Store'
                                    {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                        />
                        <div className='pt-4 space-x-2 flex items-center justify-end w-full'>
                            <Button
                            disabled={isLoading}
                            variant='outline'
                            onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                            disabled={isLoading}
                            type='submit'
                            onClick={onClose}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </Modal>
  )
}

export default StoreModal