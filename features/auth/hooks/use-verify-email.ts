"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useVerifyEmail() {
  const router = useRouter()

  const { mutate: verifyEmail } = useMutation({
    mutationFn: async (token: string) => {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }
    },
    onSuccess: () => {
      toast.success("Email verified! You can now log in.")
      router.replace("/login")
    },
    onError: (err) => toast.error(err.message),
  })

  return { verifyEmail }
}
