# Auth System Implementation Guide

This document covers how to wire up the auth system used in this project. The UI is assumed to already exist — this guide focuses on the backend plumbing, config, and integration points.

---

## Stack

- **Next.js 14** (App Router)
- **NextAuth v5 beta** (`next-auth@^5.0.0-beta.29`)
- **Prisma v6** with PostgreSQL
- **`@auth/prisma-adapter`** for database session/account management
- **bcryptjs** for password hashing
- **Resend** for transactional emails
- **Zod** for validation
- **uuid** for verification token generation

---

## 1. Install Dependencies

```bash
npm install next-auth@beta @auth/prisma-adapter @prisma/client bcryptjs resend zod uuid
npm install -D prisma @types/bcrypt ts-node
```

---

## 2. Environment Variables

Create a `.env` file:

```env
DATABASE_URL='your_postgresql_connection_string'

AUTH_SECRET="your_random_secret_here"   # generate with: openssl rand -hex 32

AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

RESEND_API_KEY="your_resend_api_key"
```

> **Google OAuth**: Create credentials at [console.cloud.google.com](https://console.cloud.google.com). Set Authorized redirect URI to `http://localhost:3000/api/auth/callback/google` (and your production URL).
>
> **Resend**: Sign up at [resend.com](https://resend.com) and get an API key. During development you can send from `onboarding@resend.dev` to your own email.

---

## 3. Prisma Schema

Add these models to your `prisma/schema.prisma`. The `Account`, `User`, and `VerificationToken` models are required by NextAuth + the Prisma adapter.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // null for OAuth users

  accounts      Account[]

  @@map("users")
}

model VerificationToken {
  id      String   @id @default(cuid())
  email   String
  token   String   @unique
  expires DateTime

  @@unique([email, token])
}
```

Run migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 4. Prisma Client Singleton

`src/lib/prisma.ts`

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## 5. Auth Config (Providers)

`src/auth.config.ts` — split from the main auth file so it can be imported in middleware without pulling in Prisma (which isn't edge-compatible).

```ts
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { type NextAuthConfig } from "next-auth";
import { SignInSchema } from "./lib/validators/signin-schema";
import { prisma } from "./lib/prisma";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return user;
      },
    }),
    Google,
  ],
} satisfies NextAuthConfig;
```

---

## 6. Main Auth Setup

`src/auth.ts` — full NextAuth initialization with Prisma adapter, JWT strategy, and callbacks.

```ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

declare module "next-auth" {
  interface User {
    emailVerified: Date | null;
    id: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  events: {
    // Auto-verify email for OAuth sign-ins (Google doesn't need email verification)
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // Block credentials login if email not verified
      if (!user.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      // Expose user ID in session
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
```

---

## 7. NextAuth Route Handler

`src/app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

---

## 8. Route Access Control

`src/lib/accessControl.ts`

```ts
export const publicRoutes: string[] = ["/", "/email-verification"];

export const authRoutes: string[] = ["/login", "/signup", "/verify-email"];

export const apiAuthPrefix: string = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
```

Update these arrays to match your project's routes.

---

## 9. Middleware

`src/middleware.ts` — protects all routes. Importing `authConfig` (not the full `auth`) keeps this edge-compatible.

```ts
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/lib/accessControl";

const { auth } = NextAuth(authConfig);

export default auth(req => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  // 1. Always allow NextAuth API routes
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  // 2. Auth pages: redirect to dashboard if already logged in
  if (authRoutes.includes(path)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Protected routes: redirect to login if not logged in
  if (!isLoggedIn && !publicRoutes.includes(path)) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## 10. Validation Schemas

`src/lib/validators/signin-schema.ts`

```ts
import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Can't be empty" })
    .email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Must be 8 characters" }),
});

export type TSignInSchema = z.infer<typeof SignInSchema>;
```

`src/lib/validators/signup-schema.ts`

```ts
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});
```

---

## 11. Verification Token Utilities

`src/utils/verification-token.ts`

```ts
import { prisma } from "@/lib/prisma";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await prisma.verificationToken.findUnique({ where: { token } });
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await prisma.verificationToken.findFirst({ where: { email } });
  } catch {
    return null;
  }
};
```

`src/utils/tokens.ts`

```ts
import { v4 as uuid } from "uuid";
import { getVerificationTokenByEmail } from "./verification-token";
import { prisma } from "@/lib/prisma";

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  // Delete any existing token for this email first
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await prisma.verificationToken.deleteMany({ where: { email } });
  }

  return await prisma.verificationToken.create({
    data: { email, token, expires },
  });
};
```

---

## 12. Email Utility

`src/utils/mail.ts`

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  // Update this URL to your actual domain in production
  const confirmLink = `http://localhost:3000/email-verification?token=${token}`;

  await resend.emails.send({
    from: "noreply@yourdomain.com", // use a verified Resend sender domain
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
  });
};
```

---

## 13. API Routes

### Signup — `src/app/api/auth/signup/route.ts`

```ts
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validators/signup-schema";
import { generateVerificationToken } from "@/utils/tokens";
import { sendVerificationEmail } from "@/utils/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hashedPassword } });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return NextResponse.json({ success: "Confirmation email sent!" });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
```

### Email Verification — `src/app/api/auth/verify-email/route.ts`

```ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validate } from "uuid";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token || !validate(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (existingToken.expires < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: existingToken.email },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

---

## 14. Accessing the Session

**Server Components / Route Handlers:**

```ts
import { auth } from "@/auth";

async function MyPage() {
  const session = await auth();
  const userId = session?.user?.id;
  // ...
}
```

**Client Components:**

Wrap your app in a `SessionProvider` in `src/app/layout.tsx`:

```tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

Then in client components:

```tsx
"use client";
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
}
```

**Sign out:**

```ts
import { signOut } from "next-auth/react"; // client
// or
import { signOut } from "@/auth"; // server action
```

---

## 15. Auth Flows Summary

### Signup (credentials)

1. POST `/api/auth/signup` with `{ email, password }`
2. Password is hashed with bcrypt (10 rounds) and stored
3. A UUID verification token (1hr expiry) is created in DB
4. Verification email is sent via Resend
5. Redirect user to `/verify-email?email={email}` telling them to check inbox

### Email Verification

1. User clicks link: `/email-verification?token={uuid}`
2. Page calls POST `/api/auth/verify-email` with the token
3. Token is validated (exists, not expired)
4. User's `emailVerified` is set to `now()`
5. Token is deleted (one-time use)
6. Redirect to `/login`

### Sign In (credentials)

1. Call `signIn("credentials", { email, password, redirectTo: "/dashboard" })` from NextAuth
2. `authorize()` in `auth.config.ts` validates credentials against DB
3. `signIn` callback in `auth.ts` blocks login if `emailVerified` is null
4. JWT session cookie is set

### Sign In (Google OAuth)

1. Call `signIn("google")` — redirects to Google consent screen
2. On return, NextAuth creates/links the account
3. `linkAccount` event fires and sets `emailVerified = now()` (bypasses email verification)
4. Redirect to dashboard

---

## File Structure Reference

```
src/
├── auth.ts                          # Main NextAuth config (adapter, callbacks, events)
├── auth.config.ts                   # Providers only (edge-safe, used by middleware)
├── middleware.ts                    # Route protection
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── accessControl.ts             # Route lists + redirect constants
│   └── validators/
│       ├── signin-schema.ts         # Zod schema for login
│       └── signup-schema.ts         # Zod schema for registration
├── utils/
│   ├── tokens.ts                    # generateVerificationToken()
│   ├── verification-token.ts        # DB queries for tokens
│   └── mail.ts                      # sendVerificationEmail() via Resend
└── app/
    └── api/
        └── auth/
            ├── [...nextauth]/
            │   └── route.ts         # NextAuth handler (GET + POST)
            ├── signup/
            │   └── route.ts         # Custom signup endpoint
            └── verify-email/
                └── route.ts         # Email verification endpoint
```
