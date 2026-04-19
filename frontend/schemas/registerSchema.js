import { z } from "zod";
const MIN_PASSWORD_LEN = 8;
const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(MIN_PASSWORD_LEN),
    confirmPassword: z.string().min(MIN_PASSWORD_LEN)
}).refine(
    schema => schema.password === schema.confirmPassword,
    {
        message: "Error: Passwords do not match",
        path: ["confirmPassword"]
    }
);

const loginSchema = z.object({
    email : z.email(),
    password: z.string().min(MIN_PASSWORD_LEN)
})

export {
    registerSchema,
    loginSchema
}
