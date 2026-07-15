import {z} from "zod";

export const CreateCartShema = z.object({
    productId: z.number(),
    quantity: z.number(),
});

export const updateCartSchema = z.object({
    quantity: z.number()
})