import { hash } from "@node-rs/bcrypt"
import { NextResponse } from "next/server"
import { SignUpApiSchema } from "@/features/auth/schemas/sign-up"
import { createVerificationToken } from "@/services/tokens"
import { getUserByEmail, createUser } from "@/services/users"
import { sendVerificationEmail } from "@/utils/mail"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = SignUpApiSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password } = result.data

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)
    await createUser(email, hashedPassword)

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 3600 * 1000)
    const verificationToken = await createVerificationToken(email, token, expires)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return NextResponse.json({ data: "Confirmation email sent!" })
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
