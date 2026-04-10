# Flowboard

A kanban-style project management app. Create boards, organize tasks into columns, and drag-and-drop cards to track progress.

Built with Next.js, Drizzle ORM, Auth.js, and Neon (serverless Postgres).

---

## Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database
- A [Google Cloud](https://console.cloud.google.com) OAuth 2.0 client
- A [Resend](https://resend.com) account for transactional email

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd flowboard
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |
| `DATABASE_URL` | Neon console → your project → Connection string (use the **pooled** URL) |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client |
| `AUTH_GOOGLE_SECRET` | Same as above |
| `RESEND_API_KEY` | Resend dashboard → API Keys |
| `SEED_USER_ID` | *(optional)* Your user ID — sign in first, then find it via `npm run db:studio` |

**Google OAuth redirect URI** — add this to your Google OAuth client's authorized redirect URIs:
```
http://localhost:3000/api/auth/callback/google
```

### 3. Push the database schema

```bash
npm run db:push
```

This pushes the schema directly to your Neon database.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate new migration files from schema changes |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:push` | Push schema directly to the database |
| `npm run db:studio` | Open Drizzle Studio to browse the database |
| `npm run db:seed` | Seed the database with sample data |

---

## Stack

- **[Next.js 16](https://nextjs.org)** — App Router, Server Components, API routes
- **[React 19](https://react.dev)**
- **[TypeScript](https://www.typescriptlang.org)** (strict)
- **[Tailwind CSS v4](https://tailwindcss.com)**
- **[shadcn/ui](https://ui.shadcn.com)** — component library
- **[Drizzle ORM](https://orm.drizzle.team)** — type-safe SQL ORM
- **[Neon](https://neon.tech)** — serverless Postgres
- **[Auth.js v5](https://authjs.dev)** — authentication (Google OAuth + email)
- **[TanStack Query](https://tanstack.com/query)** — server state and caching
- **[dnd kit](https://dndkit.com)** — drag-and-drop
- **[Resend](https://resend.com)** — transactional email
- **[Sonner](https://sonner.emilkowal.ski)** — toast notifications
- **[Motion](https://motion.dev)** — animations
