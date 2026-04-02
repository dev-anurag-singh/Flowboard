import { Suspense } from "react"
import { EmailVerification } from "@/features/auth"

export default function EmailVerificationPage() {
  return (
    <Suspense>
      <EmailVerification />
    </Suspense>
  )
}
