# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Tech Stack
- **Framework**: Next.js 16.2.2 (App Router)
- **Language**: TypeScript
- **Package Manager**: npm
- **Build/Dev**: `npm run dev` (Next.js dev server), `npm run build`, `npm start`
- **Lint**: `npm run lint` (ESLint 9)
- **Test**: Playwright E2E (`@playwright/test`)

## Architecture
Vercel-hosted SaaS portal for KnowFlow AI license sales and customer management. Next.js frontend with:
- **Auth**: Clerk (`@clerk/nextjs` 7.0.8) for user login
- **Database**: Vercel Postgres (Neon) via `@vercel/postgres` 0.10.0
- **ORM**: Drizzle ORM for type-safe queries
- **Payments**: Lemon Squeezy (`@lemonsqueezy/lemonsqueezy.js` 4.0.0) for subscription billing
- **UI**: shadcn components with Tailwind CSS v4 + Framer Motion animations
- **Internationalization**: `next-intl` 4.9.0 for multi-language support

## Key Files
- `app/page.tsx` — Landing page
- `app/api/` — API routes (Clerk webhooks, payment callbacks, Drizzle queries)
- `components/` — UI components (login, pricing, license management)
- `lib/` — Database schema (Drizzle) and utilities

## Project-Specific Rules
- **License Generation**: Portal generates RSA-signed license keys for KnowFlow. Uses `KNOWFLOW_RSA_PRIVATE_KEY` env var to sign (`core/license.ts`)
- **Database**: All queries via Drizzle ORM, never raw SQL
- **Environment**: `vercel pull` syncs .env from Vercel project
- **Vercel CLI**: `vercel build --prod` locally before push to verify production build succeeds
