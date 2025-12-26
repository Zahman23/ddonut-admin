"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "@/generated/prisma";
import { Save, Store as IconStore, Trash2 } from "lucide-react";
import z from "zod";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AlertModal from "@/components/alert-modal";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import toast from "react-hot-toast";
import { optionalTrimmedString, trimString } from "@/utils/validation";
import { Textarea } from "@/components/ui/textarea";

interface FormSettingProps {
  initialData: Store;
  role: string;
}

const countString = {
  min: 1,
  tagline: {
    max: 55,
  },
  heading: {
    max: 100,
  },
  description: {
    max: 255,
  },
  address: {
    max: 250,
  },
};

const phoneRegex = /^(?:\+62|0)(?:\d){0,14}$/;

const formSchema = z.object({
  name: z.string().trim().min(1),
  tagline: optionalTrimmedString(countString.min, countString.tagline.max),
  heading: optionalTrimmedString(countString.min, countString.heading.max),
  description: optionalTrimmedString(
    countString.min,
    countString.description.max
  ),
  phone: z
    .string()
    .trim()
    .regex(
      phoneRegex,
      "Format nomor telepon tidak valid (contoh +6212345... atau 0812345...)"
    )
    .min(5, "Nomor telepon terlalu pendek")
    .max(20, "Nomor telepon terlalu panjang")

    .optional(),
  address: optionalTrimmedString(countString.min, countString.address.max),
  city: optionalTrimmedString(1, 50),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const FormSetting = ({ initialData, role }: FormSettingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const { storeId } = params;
  const router = useRouter();
  const origin = useOrigin();

  const requiredSuperAdmin = role === "superAdmin";
  console.log(!(role === "superAdmin") && !(role === "owner"));

  const filtered = {
    name: initialData.name ?? "",
    tagline: initialData.tagline ?? "",
    heading: initialData.heading ?? "",
    description: initialData.description ?? "",
    phone: initialData.phone ?? "",
    address: initialData.address ?? "",
    city: initialData.city ?? "",
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: filtered,
    mode: "onChange",
  });

  const handleSubmit = async (data: SettingsFormValues) => {
    if (!requiredSuperAdmin) return;
    setIsLoading(true);
    try {
      console.log(data);
      const res = await axios.patch(`/api/admin/${storeId}`, data);
      router.refresh();
      toast.success("Toko berhasil dirubah");
    } catch (error) {
      toast.error("Gagal merubah toko");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!requiredSuperAdmin) return;
    setIsLoading(true);
    try {
      await axios.delete(`/api/admin/${storeId}`);
      router.refresh();
      router.replace("/");
      toast.success("Toko berhasil dihapus");
    } catch (error) {
      toast.error("Toko gagal dihapus");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        loading={isLoading || !requiredSuperAdmin}
      />
      <Card>
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2">
            <IconStore className="w-5 h-5" />
            Store Settings
          </CardTitle>
          <CardDescription>
            Update your store information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              {/* Left Column - Store Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Store Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="lg:max-w-[450px]">
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white"
                            placeholder="Enter your store name"
                            disabled={isLoading || !requiredSuperAdmin}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the name displayed to your customers.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Tagline */}
                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem className="lg:max-w-[450px]">
                        <FormLabel>Tagline</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white"
                            placeholder="Enter your tagline"
                            disabled={isLoading || !requiredSuperAdmin}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          A short slogan to represent your store.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Heading */}
                  <FormField
                    control={form.control}
                    name="heading"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-white"
                            placeholder="Enter your heading"
                            disabled={isLoading || !requiredSuperAdmin}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Highlight text that grabs attention.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-white"
                            placeholder="Enter your description"
                            disabled={isLoading || !requiredSuperAdmin}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A detailed description of your store.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column - Contact & Location */}
                <div className="space-y-4">
                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="lg:max-w-[450px]">
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white"
                            placeholder="Enter your phone number"
                            disabled={isLoading || !requiredSuperAdmin}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Phone number for customer contact.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="lg:max-w-[450px]">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white"
                            placeholder="Enter your city"
                            disabled={isLoading || !requiredSuperAdmin}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The city where your store is located.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-white"
                            placeholder="Enter your address"
                            disabled={isLoading || !requiredSuperAdmin}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The complete address of your store.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  disabled={isLoading || !requiredSuperAdmin}
                  className="lg:max-w-[450px] mt-3"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
          <CardContent className="p-0 m-0 mt-2">
            <Button
              disabled={isLoading || !requiredSuperAdmin}
              onClick={() => setIsOpen(true)}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Store
            </Button>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
};

export default FormSetting;
