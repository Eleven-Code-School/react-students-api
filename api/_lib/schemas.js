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

// Book and Review schemas
export const ReviewSchema = z.object({
    userId: z.string().min(1),
    userName: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1).max(1000),
});

export const BookSchema = z.object({
    // Campos básicos para card view
    title: z.string().min(1).max(200),
    author: z.string().min(1).max(100),
    isbn: z.string().optional(),
    shortDescription: z.string().min(1).max(200),
    coverImage: z.string().url().optional(),
    price: z.number().nonnegative(),
    category: z.string().min(1),

    // Campos adicionales para detail view
    extendedDescription: z.string().min(1),
    publisher: z.string().optional(),
    publishedDate: z.string().datetime().optional(),
    pages: z.number().int().positive().optional(),
    language: z.string().optional(),
    format: z.enum(["Paperback", "Hardcover", "eBook", "Audiobook"]).optional(),

    // Campos de negocio
    stock: z.number().int().nonnegative().optional(),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
});

// Utility function to format validation errors
export function formatValidationError(zodError) {
    const missingFields = [];
    const invalidFields = [];

    zodError.errors.forEach((error) => {
        if (error.code === "invalid_type" && error.received === "undefined") {
            missingFields.push(error.path[0]);
        } else {
            invalidFields.push({
                field: error.path[0],
                message: error.message,
            });
        }
    });

    const result = {};

    if (missingFields.length > 0) {
        result.missingFields = missingFields;
        result.message = `Missing required fields: ${missingFields.join(", ")}`;
    }

    if (invalidFields.length > 0) {
        result.invalidFields = invalidFields;
        if (!result.message) {
            result.message = "Validation errors occurred";
        }
    }

    return result;
}
