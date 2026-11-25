import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8)
    .max(70)
    .refine((password) => /[A-Z]/.test(password))
    .refine((password) => /[a-z]/.test(password))
    .refine((password) => /[0-9]/.test(password))
    .refine((password) => /[!@#$%^&*]/.test(password)),
});

export const createTokenSchema = createUserSchema;
