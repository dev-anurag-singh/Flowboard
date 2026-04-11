import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { verificationTokens } from "@/lib/db/schema";

export async function getVerificationToken(email: string) {
  const [token] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.email, email));
  return token ?? null;
}

export async function createVerificationToken(email: string, token: string, expires: Date) {
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.email, email));

  const [created] = await db
    .insert(verificationTokens)
    .values({ email, token, expires })
    .returning();

  return created;
}

export async function getVerificationTokenByToken(token: string) {
  const [found] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token));
  return found ?? null;
}

export async function deleteVerificationToken(token: string) {
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));
}
