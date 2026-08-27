# AGENTS.md

Compact guidance for OpenCode sessions in this repo. Read only if it changes what you'd otherwise do.

## What this repo is

Next.js 16 (App Router, Turbopack) + React 19 dashboard for curating quotes, authors, categories, and users.
- UI: Tailwind CSS v4 (config via `@theme` in `src/app/globals.css`, not a JS config).
- DB: PostgreSQL on Neon, accessed via Prisma v7 + `@prisma/adapter-neon` (serverless adapter).
- Auth: Google OAuth → JWT session cookie (`kk_session`), HS256 via `jose`. Session logic in `src/lib/session.js`. Roles: `writer | admin | superadmin` (`prisma/schema.prisma`).
- Data layer: REST API routes under `src/app/api/**` (TypeScript), consumed by client components (`.jsx`). Shared types in `src/types/index.ts`.

## Commands (from package.json)

- `npm run dev` — Next dev server (Turbopack). App at http://localhost:3000
- `npm run build` — **runs `prisma generate` first**, then `next build`. Don't run `next build` alone; the client won't exist.
- `npm run start` — serve the production build.
- `npm run lint` — `eslint` (flat config in `eslint.config.mjs`, extends `eslint-config-next/core-web-vitals`).
- No test runner, typecheck script, or formatter configured. Type safety is `tsc` via `next build` and the TS plugin. There are no automated tests to run.

## Prisma v7 gotchas

- DB connection URLs live in `prisma.config.ts` (not `schema.prisma`). `schema.prisma` has no `url` on the datasource — editing it there does nothing.
- `prisma.config.ts` imports `dotenv/config`, so `.env*` is loaded for Prisma CLI commands.
- Two DB URLs: `DATABASE_URL` (pooled, for app runtime + most commands) and `DATABASE_URL_UNPOOLED` (for migrations that need a direct connection). See `.env.local`.
- `src/lib/prisma.ts` uses a singleton with a quirk: it re-creates the client if the `author` model isn't present — relevant if you add models and reuse the cached instance.
- Run `prisma generate` after any schema change before starting the dev server; the app imports `@prisma/client` at runtime.

## Environment

- Required at runtime: `DATABASE_URL`, `SESSION_SECRET` (JWT signing). `src/lib/prisma.ts` and `src/lib/session.js` throw if missing.
- `DATABASE_URL` must be a pooled Neon URL for the Neon adapter; unpooled only for migrations.
- `.env.local` holds real credentials (committed in this repo) — do not expose further or commit new secrets.

## Conventions / things that differ from defaults

- Path alias `@/*` → `src/*` (tsconfig `paths`). Use it for imports.
- Server-only logic must import `server-only` (see `src/lib/session.js`); keep DB/JWT code out of client components.
- API routes follow a consistent shape: `{ success, data?, error?, message? }` response envelope (`src/types/index.ts`), `try/catch` returning 4xx/5xx with `console.error`. Mirror this in new routes.
- `tesseract.js` is dynamically imported client-side only (OCR on quotes); no server config needed.
- Many-to-many `Quote ↔ Category` goes through the `QuoteCategory` join model, not Prisma's implicit m2m.

## Docs are stale — trust the code

`README.md` and `ARCHITECTURE.md` describe an older UI-only dashboard (no auth/users/authors/categories API). The actual code has grown substantially (`src/app/dashboard/**`, `src/app/api/**`, auth flows). When docs and code conflict, trust `package.json`, `prisma.config.ts`, and the source. See `PRISMA_SETUP.md`/`PRISMA_TUTORIAL.md` for DB setup, `AUTH_DOCS.md`, `CATEGORIES_DOCS.md` for feature notes.
