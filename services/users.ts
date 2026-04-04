import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
}

export async function createUser(email: string, hashedPassword: string) {
  const [user] = await db
    .insert(users)
    .values({ email, password: hashedPassword })
    .returning();
  return user;
}

export async function markEmailVerified(email: string) {
  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, email));
}

export async function updateUserFromOAuth(
  userId: string,
  data: { name?: string | null; image?: string | null },
) {
  await db
    .update(users)
    .set({ emailVerified: new Date(), ...data })
    .where(eq(users.id, userId));
}
