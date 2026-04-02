import { Suspense } from "react"
import { VerifyEmailCard } from "@/features/auth"

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailCard />
    </Suspense>
  )
}
