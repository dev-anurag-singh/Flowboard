import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { verificationTokens } from "@/lib/db/schema"

export async function getVerificationToken(email: string) {
  const [token] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.email, email))
  return token ?? null
}

export async function generateVerificationToken(email: string) {
  await db.delete(verificationTokens).where(eq(verificationTokens.email, email))

  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 3600 * 1000)

  const [created] = await db
    .insert(verificationTokens)
    .values({ email, token, expires })
    .returning()

  return created
}
