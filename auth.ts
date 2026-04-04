import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { compare } from "@node-rs/bcrypt"
import { db } from "@/lib/db"
import { users, accounts } from "@/lib/db/schema"
import { SignInSchema } from "@/features/auth/schemas/sign-in"
import { getUserByEmail, updateUserFromOAuth } from "@/services/users"

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
      await updateUserFromOAuth(user.id!, {
        name: user.name,
        image: user.image,
      })
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

        const user = await getUserByEmail(email)

        if (!user?.password) return null

        const passwordsMatch = await compare(password, user.password)
        if (!passwordsMatch) return null

        return user
      },
    }),
  ],
})
