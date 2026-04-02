import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { verificationTokens } from "@/lib/db/schema"

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

  // Delete any existing token for this email
  await db.delete(verificationTokens).where(eq(verificationTokens.email, email))

  const [created] = await db
    .insert(verificationTokens)
    .values({ email, token, expires })
    .returning()

  return created
}
