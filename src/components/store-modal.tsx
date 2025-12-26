'use client'

import React, { useState } from 'react'
import Modal from './ui/modal'
import { useStoreModal } from '@/stores/use-store-modal'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { storeFormData, storeFormSchema } from '@/schemas/store/store-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Textarea } from './ui/textarea'

const StoreModal = () => {
    const {isOpen, onClose} = useStoreModal()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<storeFormData>({
        resolver: zodResolver(storeFormSchema),
        defaultValues: {
            name: '',
            storeTagline: "",
            storeHeading: "",
            storeDescription: "",
            phoneNumber: "",
            whatsappNumber: "",
            storeAddress: "",
            city: "",
        },
        mode: 'onSubmit'
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6 py-4'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Acme Mart" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storeTagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store tagline</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Quality You Trust" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="storeHeading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store heading</FormLabel>
                      <FormControl>
                        <Input placeholder="Main headline" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. San Francisco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="storeDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your store, products, and value proposition"
                        className="min-h-28"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g. +1 555-123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g. +1 555-987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="storeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Street, district, postal code" className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
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