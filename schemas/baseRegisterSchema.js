import { z } from "zod";

export const registerBaseSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
});