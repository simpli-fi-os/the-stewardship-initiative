# CLAUDE.md — TSI Next.js Application

> **The Stewardship Initiative** — Community skills directory platform for high-trust organizations, starting with churches.
> Built on Next.js 14 + Supabase + Stripe. Designed to run largely automated.

---

## Quick Context

- **Repo**: `https://github.com/simpli-fi-os/the-stewardship-initiative`
- **Supabase Project**: `kfwtxtjqpsmxpwcndude` on Simpli-FI OS org (`imxdurjxispwvtrxkivu`)
- **Supabase URL**: `https://kfwtxtjqpsmxpwcndude.supabase.co`
- **Framework**: Next.js 14.2 (App Router), React 18.3, TypeScript 5.5, Tailwind 3.4
- **Alpha Client**: The Village Church (org ID `a1b2c3d4-0000-0000-0000-000000000001`, slug `village-church`)
- **Admin User**: `hunter.lott@simpli-fi-alpha.com` / super_admin / user ID `9b9af96f-0ba9-4f08-a61a-84ce38989c4b`

---

## CRITICAL: Design System — "Garden of Eden"

**DO NOT deviate from the existing design system.** Every new page, component, and UI element must use:

### Colors (Tailwind tokens under `eden-*`)
| Token | Hex | Usage |
|-------|-----|-------|
| `eden-jungle` | `#022C22` | Primary background |
| `eden-lush` | `#033F32` | Card surfaces, secondary bg |
| `eden-tidal` | `#26A69A` | Tertiary accent, success states |
| `eden-hibiscus` | `#D90368` | Emotional accent, heart, CTAs |
| `eden-marigold` | `#FDB833` | Interactive elements, gold buttons, badges |
| `eden-orchid` | `#FDFDFF` | Primary text on dark |
| `eden-redwood` | `#A44A3F` | Warning, earthy warmth |
| `eden-gray` | `#D1D5DB` | Secondary text, borders |

### Typography
- **Display/Headlines**: `font-display` → Playfair Display (400, 700)
- **Body/UI**: `font-body` → Inter (system)
- Both loaded via `next/font/google` in root layout

### Component Classes (defined in `globals.css`)
- `.eden-card` — Card container with eden-lush bg, border, shadow, hover lift
- `.btn-primary` — Gold (marigold) button with dark text, hover scale
- `.btn-secondary` — Outlined button with orchid border
- `.form-input` — Dark input field with eden-lush bg
- `.directory-card` — Member card in directory grid
- `.skill-pill` — Colored tag for skills

### Animations
- `ConstellationCanvas` — Homepage particle network (DO NOT MODIFY)
- `animate-heartbeat` — Pulsing "Heart" text on homepage
- `animate-fade-in` / `animate-fade-up` — Section reveals
- `.stagger-item` — Sequenced fade-in for content blocks

### Rules
1. All backgrounds use `eden-jungle` or `eden-lush` — NEVER white/light backgrounds
2. All text uses `eden-orchid` (primary) or `eden-gray` (secondary) — NEVER dark text on dark bg
3. CTAs use `eden-marigold` bg with dark text
4. Emotional accents use `eden-hibiscus`
5. Cards always have `border border-eden-tidal/20` and subtle shadow
6. Hover states: subtle scale or brightness shift, never jarring
7. Existing pages (homepage, onboard, find-resources) are SACRED — do not modify their design

---

## Architecture

### Database (Supabase PostgreSQL)
```
organizations → members → member_skills → skills
                  ↓
               profiles (linked to auth.users)
```

**Key tables**: organizations, members, skills, member_skills, profiles, articles, directory_views

**RLS is ON** for members and profiles. Service role key bypasses RLS for admin operations.

### Auth Flow
- Supabase Auth with Email provider (Magic Link + Password)
- PKCE flow for browser client (`lib/supabase-browser.ts`)
- Cookie-based sessions: `sb-access-token` + `sb-refresh-token`
- Middleware at `middleware.ts` protects `/admin/*` routes
- Server components read cookies via `lib/supabase-server.ts`
- Auth callback at `/auth/callback` handles code exchange

### File Organization
```
app/
├── page.tsx                    ← Homepage (ConstellationCanvas + hero)
├── layout.tsx                  ← Root layout (fonts, metadata)
├── globals.css                 ← Design system tokens + components
├── onboard/page.tsx            ← Church onboarding landing page
├── find-resources/page.tsx     ← Resource finder page
├── login/                      ← Auth: login page + form
├── signup/                     ← Auth: signup page + form
├── auth/callback/route.ts      ← Auth callback (PKCE + OTP)
├── directory/[slug]/           ← Public directory (SSR, revalidate: 60s)
│   ├── page.tsx                ← Server component, fetches data
│   ├── DirectoryView.tsx       ← Client component, search/filter/modal
│   └── join/                   ← Member self-registration form
├── admin/                      ← Protected admin dashboard
│   ├── layout.tsx              ← Admin shell (auth check + sidebar)
│   ├── page.tsx                ← Dashboard stats + pending queue
│   ├── members/                ← Member management (approve/reject/feature)
│   └── settings/page.tsx       ← Org settings view
└── api/
    ├── admin/members/[id]/     ← PATCH: approve/reject/toggle-featured
    ├── auth/logout/            ← POST: clear cookies, redirect
    ├── directory/[slug]/
    │   ├── members/route.ts    ← GET: public member listing
    │   └── request/route.ts    ← POST: service request (email stub)
    └── cron/generate-article/  ← Cron: AI article generation

components/
├── Header.tsx                  ← Site header with nav
├── Footer.tsx                  ← Site footer with CTA
├── ConstellationCanvas.tsx     ← Particle animation (DO NOT TOUCH)
└── ScrollReveal.tsx            ← Intersection observer wrapper

lib/
├── supabase.ts                 ← Public client + fetchDirectoryData()
├── supabase-browser.ts         ← Browser PKCE client (singleton)
├── supabase-server.ts          ← Server clients (admin + cookie-based)
└── auth.ts                     ← Auth utilities + admin CRUD functions
```

### Environment Variables
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://kfwtxtjqpsmxpwcndude.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>

# Optional (enable as features are built)
OPENAI_API_KEY=              # Article generation
RESEND_API_KEY=              # Transactional email
STRIPE_SECRET_KEY=           # Billing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
CRON_SECRET=                 # Cron job auth
NEXT_PUBLIC_SITE_URL=        # Production URL
```

---

## Development Commands

```bash
npm run dev          # Local development (http://localhost:3000)
npm run build        # Production build (run before deploy)
npm run lint         # TypeScript + ESLint checks
npx supabase db query --linked "SELECT 1"   # Test DB connection
```

---

## Multi-Tenant Model

TSI is multi-tenant from day one. Each `organization` has its own:
- Slug-based directory URL (`/directory/[slug]`)
- Members, skills, branding (logo, hero, colors)
- Tier (seed/growth/whitelabel) controlling features
- Admin users via `profiles.org_id` + `profiles.role`

Currently one org seeded: **The Village Church** with 12 members and 9 skill categories.

---

## What's Built vs What's Next

### Built (April 1, 2026)
- [x] Homepage with ConstellationCanvas animation
- [x] Onboard landing page for churches
- [x] Find Resources page
- [x] Public directory with search, filter, pagination, Available Now, Request Service
- [x] Supabase Auth (login, signup, magic link, password, PKCE)
- [x] Admin dashboard with stats, pending queue, recent members
- [x] Admin member management (approve/reject/feature)
- [x] Admin settings page
- [x] Middleware route protection
- [x] Database: organizations, members, skills, profiles, RLS policies
- [x] Village Church seeded with 12 members

### Needs Building (see OVERNIGHT-BUILD.md for full spec)
- [ ] Stripe billing integration (subscription tiers)
- [ ] Blog/articles system (content engine)
- [ ] Analytics dashboard for church admins
- [ ] Member self-service profile editing
- [ ] Photo upload to Supabase Storage
- [ ] Email notifications via Resend
- [ ] Church onboarding wizard (self-service org creation)
- [ ] SEO: sitemap, structured data, meta optimization
- [ ] White-label subdomain routing
- [ ] Cron jobs: article generation, listing enrichment

---

*Last updated: 2026-04-01*
*Part of Simpli-FI OS ecosystem*
