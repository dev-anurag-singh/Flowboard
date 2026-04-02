"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SignUpSchema, TSignUpSchema } from "@/features/auth/schemas/sign-up";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
  });

  async function onSubmit({ email, password }: TSignUpSchema) {
    console.log("email", email);
    console.log("password", password);
    toast.success("Signed up successfully");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            {...register("email")}
            id="email"
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
            placeholder="Repeat your password"
          />
        </div>
        <Button type="submit" className="mt-2 w-full">
          Create Account
        </Button>
      </div>
    </form>
  );
}
