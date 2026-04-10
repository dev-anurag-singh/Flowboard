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
- **Drizzle ORM** with Neon (serverless Postgres)

---

## Project Structure

`app/` is routing + API routes only. All business logic lives in `features/` or shared folders.

```
flowboard/
├── app/                        # Routing + API routes ONLY
│   ├── api/                    # API route handlers (route.ts files) — thin HTTP adapters
│   ├── (auth)/                 # Auth route group
│   ├── (main)/                 # Main app route group
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── features/                   # Feature modules (business logic)
│   └── [feature]/
│       ├── components/         # Feature-specific components
│       ├── hooks/              # Feature-specific hooks
│       ├── schemas/            # Zod schemas
│       ├── queries.ts          # React Query options (queryOptions())
│       └── index.ts            # Barrel export
│
├── services/                   # Server-side DB functions, one file per entity
│   ├── boards.ts               # e.g. getBoardsForUser, createBoard
│   ├── users.ts
│   └── tokens.ts
│
├── components/
│   └── ui/                     # shadcn components (auto-installed here)
│
├── hooks/                      # Shared hooks (used across features)
├── utils/                      # Shared utility functions (non-DB)
├── lib/                        # DB client + schema only
│   └── db/
│       ├── index.ts
│       └── schema.ts
│
└── types/                      # Global TypeScript types
```

### Import conventions — always `@/` aliases, never relative `../../`

```ts
import { Button } from '@/components/ui/button'   // shadcn: import directly, no barrel
import { BoardCard } from '@/features/board'
import { formatDate } from '@/utils'
import { db } from '@/lib'
```

### Structure rules

- `app/` pages and API routes are thin — import from `features/` or `services/` and delegate, nothing more
- API routes are HTTP adapters only — no inline DB queries, call `services/` functions
- Feature-specific code stays inside its `features/[feature]/` — not imported by other features directly
- Shared code (used by 2+ features) goes into `components/`, `hooks/`, `utils/`, or `lib/`
- shadcn components install to `components/ui/` — do not move them
- DB client and schema live in `lib/db/` only — no query logic there
- All DB query functions live in `services/` — one file per entity, used by both API routes and server components directly
- Never define inline DB queries in API routes or layouts — always go through `services/`
- `services/` functions interact with the DB only — no side effects, no external calls, no pure computation (e.g. no `crypto.randomUUID()`, no date math, no email sending). Orchestrating multiple DB operations or transactions is fine.
- Non-DB logic (token generation, expiry calculation, etc.) belongs in the caller (route or server action)
- Drizzle infers types from schema — never create a separate `types.ts` just to re-export `InferSelectModel`

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

## Data Fetching

### Server → Client flow

1. **Server component (layout/page)** calls `services/` directly and uses `queryClient.setQueryData()` to populate the React Query cache
2. **`HydrationBoundary`** passes the dehydrated cache to the client
3. **Client component** calls `useQuery(entityQueryOptions)` — data is already in cache, no loading state

```ts
// layout.tsx (server)
const boards = await getBoardsForUser(session.user.id)
queryClient.setQueryData(boardsQueryOptions.queryKey, boards)

// component (client)
const { data: boards = [] } = useQuery(boardsQueryOptions)
```

### Query options

Define query options with `queryOptions()` from TanStack Query in `features/[feature]/queries.ts`. The `queryFn` calls the API route (used for client-side refetches):

```ts
export const boardsQueryOptions = queryOptions<Board[]>({
  queryKey: ["boards"],
  queryFn: async () => {
    const res = await fetch("/api/boards")
    if (!res.ok) throw new Error("Failed to fetch boards")
    const json = await res.json()
    return json.data
  },
})
```

### QueryClient setup

- `lib/query-client.ts` — server-side `getQueryClient` using React `cache()`, includes `shouldDehydrateQuery` and `shouldRedactErrors` config
- `app/query-provider.tsx` — client `QueryClientProvider`, imports from `lib/query-client.ts`

---

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

## Toasts

Use **Sonner** for all toast notifications:

```ts
import { toast } from "sonner"
toast.success("Saved!")
toast.error("Failed!")
toast.loading("Loading...")
toast.dismiss()
```

---

## Font sizes

`--text-sm` is overridden to `0.8125rem` (13px) in `globals.css` — `text-sm` is the base body size.

| Class | Size | Typical weight |
|-------|------|----------------|
| `text-2xl` | 1.5rem | `font-bold` |
| `text-lg` | 1.125rem | `font-bold` |
| `text-[15px]` | 15px | `font-bold` |
| `text-sm` | 0.8125rem | `font-medium` |
| `text-xs` | 0.75rem | `font-bold` |

---

## Commits

- Format: `feat: short message` — no scope, no body, no co-author line
- Separate commits by concern — never bundle unrelated changes in one commit
- Read `git status` and `git diff` before committing to group changes logically

---

## Keeping these rules up to date

When new patterns or conventions emerge during development:

1. **Propose first** — suggest the rule and wait for approval before adding it
2. **Never auto-add** — do not silently update this file after writing code
3. Once approved, add it to the relevant section — concise, with one clear example

Triggers to propose a new rule:
- A new library or tool is added to the project
- A pattern is used more than once that isn't documented here
- A mistake is made that a rule would prevent in future
- A preference is established during a conversation
