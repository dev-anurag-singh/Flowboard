import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { getVerificationToken, generateVerificationToken } from "@/utils/tokens"
import { sendVerificationEmail } from "@/utils/mail"

const GENERIC_RESPONSE = NextResponse.json({ data: "Verification email sent!" })

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) return GENERIC_RESPONSE

    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user || user.emailVerified) return GENERIC_RESPONSE

    // If a valid unexpired token exists, don't send another email
    const existing = await getVerificationToken(email)
    if (existing && existing.expires > new Date()) return GENERIC_RESPONSE

    const token = await generateVerificationToken(email)
    await sendVerificationEmail(token.email, token.token)

    return GENERIC_RESPONSE
  } catch {
    return GENERIC_RESPONSE
  }
}
