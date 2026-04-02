import { z } from "zod"

export const SignUpSchema = z
  .object({
    email: z.email({ error: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[a-zA-Z]/, { message: "Password must contain at least 1 letter" })
      .regex(/[0-9]/, { message: "Password must contain at least 1 number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type TSignUpSchema = z.infer<typeof SignUpSchema>
