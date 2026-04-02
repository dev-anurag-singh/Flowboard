import { hash } from "@node-rs/bcrypt"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { SignUpApiSchema } from "@/features/auth/schemas/sign-up"
import { generateVerificationToken } from "@/utils/tokens"
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

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)
    await db.insert(users).values({ email, password: hashedPassword })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return NextResponse.json({ data: "Confirmation email sent!" })
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
