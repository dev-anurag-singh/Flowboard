"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignUpSchema, TSignUpSchema } from "@/features/auth/schemas/sign-up"
import { useSignup } from "@/features/auth/hooks/use-signup"

export function SignupForm() {
  const { signup, isPending } = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
  })

  function onSubmit({ email, password }: TSignUpSchema) {
    signup({ email, password })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            {...register("email")}
            id="email"
            disabled={isPending}
            error={errors?.email?.message}
            placeholder="e.g. alex@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            error={errors?.password?.message}
            id="password"
            type="password"
            disabled={isPending}
            placeholder="At least 8 characters"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            {...register("confirmPassword")}
            error={errors?.confirmPassword?.message}
            id="confirmPassword"
            type="password"
            disabled={isPending}
            placeholder="Repeat your password"
          />
        </div>
        <Button type="submit" disabled={isPending} className="mt-2 w-full">
          Create Account
        </Button>
      </div>
    </form>
  )
}
