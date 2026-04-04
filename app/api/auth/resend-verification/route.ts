import { NextResponse } from "next/server"
import { getVerificationToken, createVerificationToken } from "@/services/tokens"
import { getUserByEmail } from "@/services/users"
import { sendVerificationEmail } from "@/utils/mail"

const GENERIC_RESPONSE = NextResponse.json({ data: "Verification email sent!" })

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) return GENERIC_RESPONSE

    const user = await getUserByEmail(email)

    if (!user || user.emailVerified) return GENERIC_RESPONSE

    // If a valid unexpired token exists, don't send another email
    const existing = await getVerificationToken(email)
    if (existing && existing.expires > new Date()) return GENERIC_RESPONSE

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 3600 * 1000)
    const verificationToken = await createVerificationToken(email, token, expires)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return GENERIC_RESPONSE
  } catch {
    return GENERIC_RESPONSE
  }
}
