import * as z from "zod";

export const storeFormSchema = z.object({
    name: z.string().min(2, "Store name is required"),
    storeTagline: z.string().min(2, "Store tagline is required"),
    storeHeading: z.string().min(2, "Store heading is required"),
    storeDescription: z.string().min(10, "Provide a more detailed description"),
    phoneNumber: z.string().min(6, "Phone number is required"),
    whatsappNumber: z.string().min(6, "WhatsApp number is required"),
    storeAddress: z.string().min(4, "Store address is required"),
    city: z.string().min(2, "City is required"),
})

export type storeFormData = z.infer<typeof storeFormSchema>