import { NextResponse } from "next/server"
import { getVerificationTokenByToken, deleteVerificationToken } from "@/services/tokens"
import { markEmailVerified } from "@/services/users"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    if (existingToken.expires < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    await markEmailVerified(existingToken.email)
    await deleteVerificationToken(token)

    return NextResponse.json({ data: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
