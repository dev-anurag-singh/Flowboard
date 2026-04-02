import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })

// Used for API route validation
export const SignUpApiSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: passwordSchema,
})

// Used for the form — adds confirmPassword
export const SignUpSchema = SignUpApiSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type TSignUpSchema = z.infer<typeof SignUpSchema>
