"use client"

import { useEffect, useRef } from "react"
import { BeatLoader } from "react-spinners"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email"

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function EmailVerification() {
  const hasExecuted = useRef(false)
  const token = useSearchParams().get("token")
  const { verifyEmail } = useVerifyEmail()

  const isValidToken = !!token && UUID_REGEX.test(token)

  useEffect(() => {
    if (hasExecuted.current) return
    if (isValidToken) {
      verifyEmail(token)
      hasExecuted.current = true
    }
  }, [isValidToken, token, verifyEmail])

  if (!isValidToken) {
    return (
      <Card className="border-0 py-4">
        <CardHeader className="flex flex-col gap-4 text-center">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-2xl font-semibold">
              Invalid or empty token
            </CardTitle>
            <CardDescription>
              You don&apos;t have a valid token to verify your email. Request a
              new one from the login page.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to login page
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 py-4">
      <CardHeader className="flex flex-col gap-4 text-center">
        <div className="flex w-full items-center justify-center">
          <BeatLoader />
        </div>
        <div className="flex flex-col gap-2">
          <CardTitle className="text-2xl font-semibold">
            Verifying your email
          </CardTitle>
          <CardDescription>
            Please wait while we verify your email address. This should only
            take a moment.
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
