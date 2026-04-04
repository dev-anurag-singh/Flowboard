# Flowboard — Agent Rules

## Before writing any Next.js code

This is **Next.js 16.2.1** — APIs, conventions, and defaults differ significantly from what you were trained on. Always read the relevant guide in `node_modules/next/dist/docs/` before using any API. Heed deprecation notices.

---

## Stack

- **Next.js 16.2.1** — read the docs before using any API
- **React 19.2.4**
- **TypeScript** (strict)
- **Tailwind CSS v4** — no `tailwind.config.js`, config via `@theme` in CSS
- **Turbopack** (default, no `--turbopack` flag needed)
- **shadcn/ui** — components installed to `components/ui/`
- **Drizzle or Prisma** (TBD — update when decided)

---

## Project Structure

`app/` is routing + API routes only. All business logic lives in `features/` or shared folders.

```
flowboard/
├── app/                        # Routing + API routes ONLY
│   ├── api/                    # API route handlers (route.ts files)
│   ├── (auth)/                 # Auth route group
│   ├── (dashboard)/            # Dashboard route group
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── features/                   # Feature modules (business logic)
│   └── [feature]/
│       ├── components/         # Feature-specific components
│       ├── hooks/              # Feature-specific hooks
│       ├── types.ts
│       └── index.ts            # Barrel export
│
├── components/
│   └── ui/                     # shadcn components (auto-installed here)
│       └── index.ts
│
├── hooks/                      # Shared hooks (used across features)
│   └── index.ts
│
├── utils/                      # Shared utility functions
│   └── index.ts
│
├── lib/                        # DB client, API client, config
│   └── index.ts
│
└── types/                      # Global TypeScript types
    └── index.ts
```

### Import conventions — always `@/` aliases, never relative `../../`

```ts
import { Button } from '@/components/ui/button'   // shadcn: import directly, no barrel
import { BoardCard } from '@/features/board'
import { formatDate } from '@/utils'
import { db } from '@/lib'
```

### Structure rules

- `app/` pages are thin — import from `features/` and render, nothing more
- Feature-specific code stays inside its `features/[feature]/` — not imported by other features directly
- Shared code (used by 2+ features) goes into `components/`, `hooks/`, `utils/`, or `lib/`
- Every folder imported externally MUST have an `index.ts` barrel export
- shadcn components install to `components/ui/` — do not move them
- DB client lives in `lib/db.ts`, exported from `lib/index.ts`

---

## Naming Conventions

- **Files & folders**: `kebab-case` — e.g. `board-card.tsx`, `use-board.ts`
- **Components**: `PascalCase` named exports — e.g. `export function BoardCard() {}`
- **Hooks**: `camelCase`, always prefixed with `use` — e.g. `useBoard`, `useDebounce`
- **Types/interfaces**: `PascalCase` — e.g. `BoardCard`, `ApiResponse`
- **Next.js required files** (`page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`): default exports only

## Component Exports

Named exports everywhere except Next.js file conventions:

```ts
// ✅ All regular components — named export
export function BoardCard() {}
export function useBoard() {}

// ✅ Next.js required files only — default export
export default function Page() {}
export default function Layout() {}
```

## TypeScript

- Strict — no `any` unless unavoidable
- Use `type` by default; use `interface` only when you need `extends`
- Path alias `@/*` maps to the project root
- Run `npx next typegen` to generate `PageProps`, `LayoutProps`, `RouteContext` types

## API Routes

All `app/api/` routes follow REST conventions:

```
GET    /api/[resource]          → list
POST   /api/[resource]          → create
GET    /api/[resource]/[id]     → single item
PATCH  /api/[resource]/[id]     → update
DELETE /api/[resource]/[id]     → delete
```

Always return consistent JSON shapes:
```ts
// Success
{ data: T }

// Error
{ error: string }
```

## Environment Variables

- Secrets go in `.env.local` (gitignored — never commit)
- All variables documented in `.env.example` (committed, no real values)
- Client-safe variables prefixed with `NEXT_PUBLIC_`

## Animations

- Use `motion` library for all animations — never write custom animation hooks or CSS keyframes
- Use `whileInView` + `viewport={{ once: true }}` for scroll-triggered animations
- Components using `motion` must be `'use client'`

## Code Style

- Prefer Server Components by default — only add `'use client'` when needed
- Add `loading.tsx` and `error.tsx` per route when the route fetches data or can fail

## Responsive Design

- **Mobile-first always** — write base styles for mobile, layer up with `md:` and `lg:` breakpoints
- Tailwind is built for this — use its breakpoint prefixes in order: base → `sm:` → `md:` → `lg:` → `xl:`
- Never design desktop-first and patch mobile after

---

## Migrating code from the previous repo

When pasting code from the old repo, apply these transformations before using it:

### Font sizes

The old repo had a custom Tailwind `fontSize` config. This repo overrides `--text-sm` to `0.8125rem` (13px) in `globals.css` — so `text-sm` is the base body size. Map old classes as follows:

| Old class | Old size | Use instead | This repo's size | Font weight |
|-----------|----------|-------------|-----------------|-------------|
| `text-2xl` | 1.5rem | `text-2xl` | 1.5rem (same) | `font-bold` |
| `text-xl` | 1.125rem | `text-lg` | 1.125rem (same) | `font-bold` |
| `text-lg` | 0.9375rem (15px) | `text-[15px]` | 15px (exact) | `font-bold` |
| `text-md` | 0.75rem | `text-xs` | 0.75rem (same) | `font-bold` |
| `text-base` | 0.8125rem | `text-sm` | 0.8125rem (exact) | `font-medium` |
| `text-sm` | 0.75rem | `text-xs` | 0.75rem (same) | `font-bold` |

### Zod

| Old (v3) | New (v4) |
|----------|----------|
| `result.error.errors` | `result.error.issues` |
| `z.string().email()` | `z.email()` |

---

### Toast notifications

Old repo used `react-hot-toast`. This repo uses **Sonner**. Replace all toast calls:

```ts
// Old
import toast from "react-hot-toast"
toast("Message")
toast.success("Saved!")
toast.error("Failed!")
toast.loading("Loading...")
toast.dismiss()

// New
import { toast } from "sonner"
toast("Message")
toast.success("Saved!")
toast.error("Failed!")
toast.loading("Loading...")
toast.dismiss()
```

---

## Commits

- Format: `feat: short message` — no scope, no body, no co-author line
- Separate commits by concern — never bundle unrelated changes in one commit
- Read `git status` and `git diff` before committing to group changes logically

---

## Keeping these rules up to date

As we write code, new patterns and conventions will emerge. When that happens:

1. **Ask the user first** — propose the new rule and wait for approval before adding it
2. **Never auto-add** — do not silently update this file after writing code
3. Once approved, add it to the relevant section — concise, with one clear example

Triggers to propose a new rule:
- A new library or tool is added to the project
- A pattern is used more than once that isn't documented here
- A mistake is made that a rule would prevent in future
- The user establishes a preference during a conversation
