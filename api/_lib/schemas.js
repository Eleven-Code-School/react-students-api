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

export const RegisterDTO = z
    .object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["user", "admin"]).optional(),
    })
    .passthrough();

export const LoginDTO = z
    .object({
        email: z.string().email(),
        password: z.string().min(6),
    })
    .passthrough();

export const CartItemSchema = z.object({
    productId: z.string(),
    qty: z.number().int().positive(),
});

export const CartCreateSchema = z.object({
    userId: z.string().optional(),
});
