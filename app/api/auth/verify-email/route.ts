import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, verificationTokens } from "@/lib/db/schema"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    const [existingToken] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    if (existingToken.expires < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.email, existingToken.email))

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token))

    return NextResponse.json({ data: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
