<div align="center">

# ⌨️ KeyTester.io

**A free, privacy-first online keyboard diagnostic tool.**

Press any key and instantly see whether it registers — diagnose stuck keys, measure input latency, and test N-Key Rollover. No download, no sign-up, and no keystrokes ever leave your browser.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Database](#database)
- [Admin Dashboard](#admin-dashboard)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Working with the UI Library](#working-with-the-ui-library)
- [License](#license)

---

## Overview

KeyTester.io is a monorepo containing a **Next.js** tester/marketing frontend and an **Express + Prisma** API. The keyboard tester itself runs entirely client-side — key detection, latency measurement, and rollover tracking never touch the network — while the API powers an authenticated admin dashboard for managing sponsored ad placements and reviewing key-health analytics.

The tester is **always on**: the moment the page loads, every keypress is captured, rendered on a live on-screen keyboard, and scored. The board is server-rendered for a fast, static-feeling first paint and auto-scales to fit any viewport width.

## Features

**Keyboard tester (public)**
- **Real-time key detection** — every keypress lights up instantly with `pressed → verified` (green) or `failed` (red) status.
- **Always-on** — no "start" step; testing begins as soon as the page loads.
- **Full-size ANSI layout** — 104-key layout with function row, navigation cluster, arrows, and numpad.
- **N-Key Rollover (NKRO) test** — hold multiple keys at once to verify how many simultaneous presses your keyboard reports.
- **Input-latency measurement** — per-key press-to-release latency with a running average.
- **Optional key sound** — toggleable click feedback (Web Audio, zero assets).
- **Responsive & themed** — flash-free light/dark mode and a keyboard that scales to its container.
- **SEO-ready** — server-rendered markup, JSON-LD, sitemap, and robots.

**Admin dashboard (authenticated)**
- **Key Health** — average/percentile latency and a most-failed-keys leaderboard.
- **Custom Ads (Campaign Manager)** — upload creatives to Cloudinary, assign them to placement slots, and toggle them active (one active ad per slot).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui (`packages/ui`) |
| State | Zustand |
| Animation | GSAP (lazy-loaded, kept out of the critical bundle) |
| Backend | Express 5, TypeScript (ESM) |
| Database | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) |
| Auth | better-auth (email/password + admin role) |
| Media | Cloudinary (ad image uploads) |
| Tooling | Turborepo + pnpm workspaces, ESLint, Prettier |

## Architecture

```
                    ┌────────────────────────┐
   Browser ───────► │  apps/web (Next.js)     │  :3000
                    │  • SSR keyboard tester  │
                    │  • Admin UI (/admin)    │
                    └───────────┬────────────┘
                                │  fetch (credentials: include)
                                ▼
                    ┌────────────────────────┐
                    │  apps/api (Express)     │  :4000
                    │  • better-auth (/api/auth)
                    │  • /api/ads, /api/upload
                    │  • /api/admin/dashboard │
                    └───────────┬────────────┘
                                │  Prisma
                                ▼
                    ┌────────────────────────┐
                    │  PostgreSQL             │
                    └────────────────────────┘

   Ad images ──► Cloudinary CDN ──► optimized via next/image
```

- The web app talks to the API cross-origin with cookies (`credentials: "include"`); CORS on the API allows the configured `WEB_URL`.
- Route protection for `/admin` and `/dashboard` is enforced by Next.js middleware ([`apps/web/proxy.ts`](apps/web/proxy.ts)) via the better-auth session cookie, and again server-side on every admin API route.
- Ad creatives are served through Cloudinary and rendered with `next/image` (the Cloudinary host is allow-listed in `next.config.mjs`).

## Project Structure

```
keytester/
├── apps/
│   ├── web/                     # Next.js frontend (port 3000)
│   │   ├── app/                 # App Router routes (/, /login, /admin, /privacy, /terms, …)
│   │   ├── components/          # keyboard, layout, ads, admin, controls
│   │   ├── stores/              # Zustand keyboard store
│   │   ├── lib/                 # API client, auth client
│   │   └── proxy.ts             # route-protection middleware
│   └── api/                     # Express backend (port 4000)
│       ├── src/
│       │   ├── modules/         # ads, upload, admin, config, user, session
│       │   ├── middleware/      # auth, cors, error
│       │   ├── lib/             # prisma, better-auth
│       │   └── seed.ts          # admin user seed
│       └── prisma/schema/       # Prisma schema (split files)
├── packages/
│   ├── ui/                      # Shared shadcn/ui component library (@workspace/ui)
│   ├── eslint-config/
│   └── typescript-config/
├── turbo.json
└── pnpm-workspace.yaml
```

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** 9.15.9 — `npm install -g pnpm@9.15.9`
- **PostgreSQL** 14+ (local or hosted)
- A **Cloudinary** account (only needed for ad image uploads)

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/keytester.git
cd keytester
pnpm install
```

> `pnpm install` runs the API's `postinstall`, which generates the Prisma client automatically.

### 2. Configure environment variables

Create `apps/api/.env` and `apps/web/.env.local` — see [Environment Variables](#environment-variables) below.

### 3. Set up the database

```bash
# Push the Prisma schema to your database (creates tables)
pnpm --filter @workspace/api db:push

# Seed the initial admin user (defaults: admin@keytester.io / Admin@123456)
pnpm --filter @workspace/api db:seed
```

### 4. Run in development

```bash
# Start web + api together (Turborepo)
pnpm dev
```

- Web → http://localhost:3000
- API → http://localhost:4000

Or run each app individually:

```bash
pnpm --filter web dev            # frontend only
pnpm --filter @workspace/api dev # backend only
```

## Environment Variables

### `apps/api/.env`

| Variable | Required | Description |
|---|:---:|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | ✅ | Session-signing secret (**min 32 chars**) |
| `BETTER_AUTH_URL` | ✅ | Public URL of the API (default `http://localhost:4000`) |
| `WEB_URL` | ✅ | Public URL of the frontend — used for CORS & trusted origins |
| `PORT` | — | API port (default `4000`) |
| `CLOUDINARY_CLOUD_NAME` | ✅¹ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅¹ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅¹ | Cloudinary API secret |
| `ADMIN_EMAIL` | — | Seed admin email (default `admin@keytester.io`) |
| `ADMIN_PASSWORD` | — | Seed admin password (default `Admin@123456`) |
| `ADMIN_NAME` | — | Seed admin display name (default `Admin`) |

¹ Required only for uploading ad images through the admin dashboard.

### `apps/web/.env.local`

| Variable | Required | Description |
|---|:---:|---|
| `NEXT_PUBLIC_API_URL` | ✅ | URL of the API (default `http://localhost:4000`) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public URL of the frontend — used in sitemap & OG tags |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | — | Google AdSense publisher ID (`ca-pub-…`) |

## Scripts

Run from the **repo root** (Turborepo fans out to every workspace):

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in dev mode with hot reload |
| `pnpm build` | Production build of all apps and packages |
| `pnpm start` | Start all apps in production mode |
| `pnpm lint` | Lint all packages (ESLint) |
| `pnpm typecheck` | Type-check all packages (`tsc --noEmit`) |
| `pnpm format` | Format the repo with Prettier |

API-specific scripts (`pnpm --filter @workspace/api <script>`):

| Script | Description |
|---|---|
| `db:push` | Push the Prisma schema to the database |
| `db:migrate` | Create & apply a migration (`prisma migrate dev`) |
| `db:generate` | Regenerate the Prisma client |
| `db:studio` | Open Prisma Studio (database GUI) |
| `db:seed` | Seed / promote the admin user |

## Database

Prisma + PostgreSQL. The schema is split across files in `apps/api/prisma/schema/`.

| Model | Description |
|---|---|
| `User` · `Session` · `Account` · `Verification` | Managed by better-auth (admin plugin adds the `role` field) |
| `TestSession` | One record per keyboard test — browser, country, and key stats |
| `CustomAd` | Ad creative: Cloudinary URL + public ID, target link, slot, `isActive` |
| `GlobalConfig` | Site-wide settings (e.g. AdSense toggle, affiliate links) |

```bash
# Inspect data
pnpm --filter @workspace/api db:studio

# After editing the schema
pnpm --filter @workspace/api db:push        # quick sync (dev)
# or
pnpm --filter @workspace/api db:migrate --name your-change
```

## Admin Dashboard

Visit `/login` and sign in with the seeded admin credentials. The dashboard lives at `/admin`.

| Section | Description |
|---|---|
| **Key Health** | Average/percentile latency and a most-failed-keys leaderboard |
| **Custom Ads** | Upload creatives to Cloudinary, assign to a slot, and activate/deactivate |

### Ad slots

| Slot | Placement |
|---|---|
| `sidebar-left` | Primary sponsor banner, shown below the keyboard |
| `sidebar` | Right sidebar of the tester page |
| `banner` | Compact banner card below the keyboard |

Only **one ad per slot** can be active at a time — activating a new ad automatically deactivates the previous one in that slot.

## API Reference

| Method | Path | Auth | Description |
|---|---|:---:|---|
| `GET` | `/health` | Public | Health check |
| `ANY` | `/api/auth/*` | — | better-auth (sign-in, sign-out, session) |
| `GET` | `/api/ads/active?slot=` | Public | Active ad for a given slot |
| `GET` | `/api/ads` | Admin | List all ads |
| `POST` | `/api/ads` | Admin | Create an ad |
| `PATCH` | `/api/ads/:id` | Admin | Update an ad |
| `DELETE` | `/api/ads/:id` | Admin | Delete an ad (also removes the Cloudinary asset) |
| `POST` | `/api/upload` | Admin | Upload an image to Cloudinary |
| `GET` | `/api/admin/dashboard` | Admin | Aggregated key-health & visitor stats |
| `GET` · `PATCH` | `/api/config` | Admin | Read / update global site config |

All admin routes require a valid better-auth session **and** the `admin` role.

## Deployment

- **Frontend** — deploy `apps/web` to any Next.js host (e.g. Vercel). Set `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_APP_URL` to the production URLs.
- **API** — deploy `apps/api` to any Node host. `pnpm --filter @workspace/api build` compiles to `dist/` and generates the Prisma client; run with `pnpm --filter @workspace/api start`. Apply the schema with `db:push` (or migrations) against the production database, then run `db:seed` once.
- Set `BETTER_AUTH_URL` and `WEB_URL` to the real origins so auth cookies and CORS work across domains.

## Working with the UI Library

Shared components live in `packages/ui` (`@workspace/ui`). Add a shadcn/ui component:

```bash
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

Import it anywhere:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## License

This project is private and not licensed for redistribution. All rights reserved © 2026 KeyTester.io.
