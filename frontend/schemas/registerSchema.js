import { z } from "zod";
import { registerBaseSchema } from "../../schemas/baseRegisterSchema";

export const registerSchema = registerBaseSchema.extend({
    confirmPassword: z.string()
}).refine(
    schema => schema.password === schema.confirmPassword,
    {
        message: "Error: Passwords do not match",
        path: ["confirmPassword"]
    }
);