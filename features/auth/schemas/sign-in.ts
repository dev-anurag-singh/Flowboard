import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export type TSignInSchema = z.infer<typeof SignInSchema>;
