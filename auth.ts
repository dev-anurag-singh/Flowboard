import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { compare } from "@node-rs/bcrypt"
import { db } from "@/lib/db"
import { users, accounts } from "@/lib/db/schema"
import { SignInSchema } from "@/features/auth/schemas/sign-in"

declare module "next-auth" {
  interface User {
    emailVerified: Date | null
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({
          emailVerified: new Date(),
          name: user.name,
          image: user.image,
        })
        .where(eq(users.id, user.id!))
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true
if (!user.emailVerified) return false
      return true
    },
    async session({ token, session }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      async authorize(credentials) {
        const result = SignInSchema.safeParse(credentials)
        if (!result.success) return null

        const { email, password } = result.data

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))

        if (!user?.password) return null

        const passwordsMatch = await compare(password, user.password)
        if (!passwordsMatch) return null

        return user
      },
    }),
  ],
})
