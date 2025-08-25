import { z } from "zod";

export const ProductSchema = z.object({
    sku: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
    rating: z.number().min(0).max(5).optional(),
    image: z.string().url().optional(),
});

export const UserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["user", "admin"]).default("user"),
});

export const PreferencesSchema = z
    .object({
        userId: z.string().optional(),
        currency: z.enum(["EUR", "USD"]).default("EUR"),
        language: z.enum(["es", "en"]).default("es"),
        theme: z.enum(["light", "dark", "system"]).default("system"),
        notifications: z
            .object({
                email: z.boolean().default(true),
                sms: z.boolean().default(false),
            })
            .default({ email: true, sms: false }),
        marketingOptIn: z.boolean().default(false),
    })
    .transform((d) => ({
        ...d,
        notifications: d.notifications ?? { email: true, sms: false },
    }));

export const CartItemSchema = z.object({
    productId: z.string(),
    qty: z.number().int().positive(),
});

export const CartCreateSchema = z.object({
    userId: z.string().optional(),
});
