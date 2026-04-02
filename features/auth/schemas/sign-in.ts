import { z } from "zod"

export const SignInSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z.string().min(8, {
    message: "Must be 8 characters",
  }),
})

export type TSignInSchema = z.infer<typeof SignInSchema>
