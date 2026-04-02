# TSI Overnight Build — April 1–2, 2026
## Claude Code Autonomous Build Session

> **COWORK SESSION OVERSIGHT**: This build was planned and will be reviewed by Hunter's Cowork session (Claude Opus). After completing each phase, commit your work with clear messages. The Cowork session will review commits, verify design system compliance, and test the build. Build for production quality — this is the real platform, not a prototype.

---

## Pre-Flight Checklist

Before writing ANY code, do these things:

1. **Read `CLAUDE.md`** in the project root — it has the design system rules, architecture, and current state
2. **Read `docs/PRODUCT_BIBLE.md`** — it has the business model, pricing tiers, and automation pipeline specs
3. **Read `app/globals.css`** — memorize the design tokens and component classes
4. **Run `npm run build`** — confirm the project compiles clean BEFORE you start
5. **Run `git pull`** — make sure you have the latest code

**Golden Rules:**
- NEVER modify: homepage (`app/page.tsx`), `ConstellationCanvas.tsx`, `globals.css` design tokens, or the onboard page
- EVERY new page uses the Garden of Eden design system (dark backgrounds, gold accents, Playfair headers)
- EVERY new component uses existing CSS classes (`.eden-card`, `.btn-primary`, `.form-input`, `.skill-pill`)
- Commit after EACH completed phase with descriptive messages
- Run `npm run build` after each phase to verify no regressions
- If a build fails, fix it before moving to the next phase

---

## Phase 1: Blog & Content Engine (Priority: HIGH)

**Why first**: SEO is the #1 growth channel. Every day without indexed content is lost organic traffic.

### 1A: Articles Table Migration

Create `supabase/migrations/003_articles_and_analytics.sql`:

```sql
-- Articles table (if not exists from seed)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'The Stewardship Initiative',
  category TEXT DEFAULT 'stewardship',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  og_image_url TEXT,
  reading_time_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS directory_views (
  id BIGSERIAL PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  member_id UUID REFERENCES members(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'search', 'filter', 'contact_click', 'profile_view', 'request_service')),
  metadata JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_directory_views_org ON directory_views(org_id);
CREATE INDEX IF NOT EXISTS idx_directory_views_created ON directory_views(created_at);

-- RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (published = true);
CREATE POLICY "Service role manages articles" ON articles
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE directory_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages analytics" ON directory_views
  FOR ALL USING (auth.role() = 'service_role');

-- Updated_at trigger for articles
CREATE TRIGGER set_updated_at_articles
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

Run this migration via: `npx supabase db query --linked < supabase/migrations/003_articles_and_analytics.sql`

### 1B: Article Types & Lib

Create `lib/articles.ts`:
- `fetchPublishedArticles(limit?, offset?)` → paginated published articles
- `fetchArticleBySlug(slug)` → single article with full content
- `fetchArticleCategories()` → distinct categories with counts
- TypeScript interfaces: `Article`, `ArticleListItem`

### 1C: Blog Index Page

Create `app/blog/page.tsx`:
- Server component with ISR (revalidate: 300)
- Uses `Header` + `Footer` components
- Hero section: "Insights for Community Leaders" (Playfair Display, eden-orchid on eden-jungle)
- Category filter pills (`.skill-pill` style, horizontal scroll on mobile)
- Article grid: 2 columns desktop, 1 mobile
- Each card (`.eden-card`):
  - Category badge (eden-tidal)
  - Title (Playfair, eden-orchid)
  - Description (eden-gray, 2-line clamp)
  - Author + reading time + date (eden-gray, text-sm)
  - Hover: subtle lift + border glow
- Pagination: Load More button (`.btn-primary`)
- Empty state if no articles yet: "Content coming soon" with eden-tidal icon

### 1D: Article Detail Page

Create `app/blog/[slug]/page.tsx`:
- Server component with ISR (revalidate: 600)
- `generateMetadata()` for SEO (title, description, og:image, article structured data)
- Layout: max-w-3xl centered, generous padding
- Article header:
  - Category pill
  - Title (Playfair, text-4xl)
  - Author + date + reading time
  - Divider line (eden-tidal/30)
- Article body: `prose` styling adapted for dark theme
  - Override Tailwind prose: text-eden-orchid, links eden-marigold, headings Playfair
  - Code blocks: eden-lush bg
  - Blockquotes: left border eden-tidal
- CTA section at bottom:
  - "Ready to build your community's directory?"
  - `.btn-primary` → /onboard
- Related articles (3 cards, same category)
- Back to blog link

### 1E: Article Generation Cron

Upgrade `app/api/cron/generate-article/route.ts`:
- Verify `CRON_SECRET` header for auth
- Fetch article topic from a rotating queue (hardcode initial 12 topics)
- Call Anthropic API (Claude) with system prompt:
  - Voice: pastoral but modern, warm, practical
  - Length: 1,200–2,000 words
  - Include: intro, 3-5 sections with headers, conclusion with CTA
  - SEO: natural keyword integration, no stuffing
  - End with subtle TSI CTA
- Save to Supabase articles table (published: false for review)
- Return success with article ID

**Topic queue** (first 12):
1. "How a Church Skills Directory Strengthens Your Congregation"
2. "Why Your Church Members Don't Know Each Other's Gifts"
3. "5 Ways to Activate the Hidden Talent in Your Pews"
4. "The Stewardship Model: Beyond Tithes and Offerings"
5. "How to Build a Volunteer Network That Actually Works"
6. "What the Early Church Got Right About Community"
7. "The Connection Gap: Why 1 in 4 Members Feel Invisible"
8. "From Pews to Purpose: Making Every Member Matter"
9. "Why Your Church Directory Isn't Enough"
10. "Digital Stewardship: Technology in Service of Community"
11. "Small Church, Big Impact: Community Skills on a Budget"
12. "How One Church Discovered 47 Hidden Skills in 30 Days"

### 1F: Admin Article Management

Add to admin dashboard:
- New sidebar link: "Articles" with document icon
- `app/admin/articles/page.tsx` — Article list with status (draft/published)
- `app/admin/articles/[id]/page.tsx` — Article editor (title, content textarea, publish toggle)
- API route `app/api/admin/articles/[id]/route.ts` — PATCH to update, POST to create
- "Generate Article" button that triggers the cron endpoint manually

---

## Phase 2: Stripe Billing Integration (Priority: HIGH)

**Why**: Revenue. The Village Church is free (alpha), but the self-service funnel needs billing.

### 2A: Stripe Schema

Add to organizations table (via migration `004_stripe_billing.sql`):
```sql
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none'
  CHECK (subscription_status IN ('none', 'trialing', 'active', 'past_due', 'canceled'));
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS billing_email TEXT;
```

### 2B: Stripe Lib

Create `lib/stripe.ts`:
- Initialize Stripe with `STRIPE_SECRET_KEY`
- `createCheckoutSession(orgId, priceId, returnUrl)` — creates Stripe Checkout
- `createBillingPortalSession(customerId, returnUrl)` — manage subscription
- `handleWebhookEvent(event)` — process subscription changes
- Price IDs mapping: { seed: null, growth: 'price_xxx', whitelabel: 'price_xxx' }

### 2C: Webhook Handler

Create `app/api/webhooks/stripe/route.ts`:
- Verify Stripe signature
- Handle events:
  - `checkout.session.completed` → update org tier + stripe IDs
  - `customer.subscription.updated` → sync status
  - `customer.subscription.deleted` → downgrade to seed
  - `invoice.payment_failed` → update status to past_due
- Update organization record in Supabase

### 2D: Pricing Page

Create `app/pricing/page.tsx`:
- Server component
- Three-tier pricing cards (Seed / Growth / White-Label)
- Use the Product Bible pricing details exactly
- Seed card: "Free" badge, feature list, "Get Started" → /onboard
- Growth card: "$29/mo" with "Most Popular" badge (eden-marigold border), feature list, "Start Free Trial" → Stripe Checkout
- White-Label card: "$199/mo" with "Enterprise" badge, feature list, "Contact Us" → mailto or calendly
- Annual toggle: "Save 2 months" with discounted price
- FAQ accordion below pricing cards
- Design: eden-jungle bg, cards as `.eden-card` with tier-specific border accents

### 2E: Admin Billing Page

Create `app/admin/billing/page.tsx`:
- Current plan display
- Usage stats (member count, features used)
- Upgrade button → Stripe Checkout
- Manage billing → Stripe Customer Portal
- Add "Billing" link to admin sidebar

---

## Phase 3: Church Self-Service Onboarding (Priority: HIGH)

**Why**: Currently only Hunter can create orgs via SQL. Churches need to self-register.

### 3A: Onboarding Wizard

Create `app/get-started/page.tsx` — Multi-step form:

**Step 1: Church Info**
- Church name (required)
- Website URL (optional)
- City/State (for SEO and future geo-features)
- Approximate congregation size (dropdown: <100, 100-250, 250-500, 500-1000, 1000+)

**Step 2: Admin Account**
- Full name
- Email
- Password
- (Creates auth user + profile with role='admin')

**Step 3: Customize Directory**
- Upload logo (to Supabase Storage)
- Select skill categories from presets OR type custom ones
- Choose accent color (default marigold, offer 5 presets)

**Step 4: Invite Members**
- Shareable join link displayed: `thestewardshipinitiative.org/directory/[slug]/join`
- Copy button
- Optional: paste email list for invite emails (future)
- "Go to Dashboard" button → /admin

**Backend**:
- API route `app/api/onboard/route.ts` — creates org, user, profile, default skills in a transaction
- Auto-generate slug from church name (lowercase, hyphenated, check uniqueness)
- Set tier='seed' by default

### 3B: Member Self-Registration

Upgrade `app/directory/[slug]/join/page.tsx` and `JoinForm.tsx`:
- Read existing code first — there may be a form started
- Full form: name, email, phone, title/role, bio, skill selection (checkboxes from org's skills), photo upload
- Photo upload to Supabase Storage bucket `member-photos`
- Submit creates member with `approved: false` (pending admin review)
- Success page: "Your profile is pending approval. The admin will review it shortly."
- Notification: log to console for now, Resend email later

### 3C: Supabase Storage Setup

Create `lib/storage.ts`:
- `uploadMemberPhoto(file, memberId)` — upload to `member-photos` bucket, return public URL
- `uploadOrgLogo(file, orgId)` — upload to `org-logos` bucket, return public URL
- Handle image resize if needed (or rely on Next.js Image optimization)

Migration `005_storage_buckets.sql`:
```sql
-- Note: Storage buckets are created via Supabase Dashboard or API, not SQL
-- But we can set policies
INSERT INTO storage.buckets (id, name, public) VALUES ('member-photos', 'member-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('org-logos', 'org-logos', true) ON CONFLICT DO NOTHING;
```

---

## Phase 4: Analytics & Admin Enhancements (Priority: MEDIUM)

### 4A: Event Tracking

Create `lib/analytics.ts`:
- `trackEvent(orgId, eventType, metadata?)` — POST to `/api/analytics/track`
- API route `app/api/analytics/track/route.ts` — inserts into directory_views
- Track: page_view, search, filter, profile_view, contact_click, request_service
- Include session_id (random UUID stored in sessionStorage)

### 4B: Analytics Dashboard

Create `app/admin/analytics/page.tsx`:
- Date range selector (7d, 30d, 90d, custom)
- Stats cards:
  - Total page views (with trend arrow)
  - Unique visitors
  - Most viewed member
  - Most searched skill
- Charts (use recharts or Chart.js via cdn):
  - Views over time (line chart)
  - Top skills searched (bar chart)
  - Contact clicks by member (bar chart)
- Add "Analytics" link to admin sidebar

### 4C: Member Self-Edit

Create `app/directory/[slug]/profile/page.tsx`:
- Authenticated members can edit their own profile
- Same form as join, but pre-populated
- Photo change with preview
- Save → update via API
- Requires login (redirect to /login if not authenticated)

### 4D: Admin Dashboard Upgrades

Enhance `app/admin/page.tsx`:
- Add chart: "Members over time" (line chart, last 30 days)
- Add chart: "Top skills" (horizontal bar)
- Add "Quick Actions" section:
  - "Generate Article" button
  - "View Live Directory" link
  - "Copy Join Link" with copy button
  - "Export Members CSV" download

---

## Phase 5: SEO & Performance (Priority: MEDIUM)

### 5A: Sitemap

Create `app/sitemap.ts`:
```typescript
export default async function sitemap() {
  // Static pages
  const staticPages = ['', '/onboard', '/find-resources', '/pricing', '/blog']

  // Dynamic: all published articles
  // Dynamic: all org directory pages

  return [...staticPages, ...articleUrls, ...directoryUrls].map(url => ({
    url: `https://thestewardshipinitiative.org${url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: url === '' ? 1 : 0.8,
  }))
}
```

### 5B: Structured Data

Add JSON-LD to:
- Homepage: Organization schema
- Blog articles: Article schema with author, datePublished, dateModified
- Directory pages: LocalBusiness or Organization schema per member
- Pricing: Product schema with offers

### 5C: Image Optimization

Update `next.config.js`:
- Add `kfwtxtjqpsmxpwcndude.supabase.co` to `remotePatterns` (for storage uploads)
- Ensure all `<img>` tags are `next/image` `<Image>` components
- Add width/height or fill prop to all images
- Lazy loading for below-fold images

### 5D: Performance Audit

- Run Lighthouse on homepage, directory, and blog
- Target: 90+ Performance, 100 Accessibility, 90+ SEO
- Fix any issues found
- Add `loading.tsx` skeleton screens for:
  - `/directory/[slug]` — card grid skeleton
  - `/blog` — article card skeleton
  - `/admin` — dashboard skeleton

---

## Phase 6: Email Notifications via Resend (Priority: MEDIUM)

### 6A: Resend Setup

Create `lib/email.ts`:
- Initialize Resend client
- Email templates (plain HTML, Garden of Eden styled):
  - `sendWelcomeEmail(to, orgName)` — new org admin welcome
  - `sendMemberApprovedEmail(to, memberName, directoryUrl)` — member approved notification
  - `sendServiceRequestEmail(to, memberName, requesterMessage)` — service request
  - `sendNewMemberNotification(adminEmail, memberName, orgName)` — admin notification of new signup

### 6B: Wire Up Emails

- On member approval → `sendMemberApprovedEmail`
- On new member join → `sendNewMemberNotification` to admin
- On service request → `sendServiceRequestEmail` (uncomment code in existing route)
- On org creation → `sendWelcomeEmail`

---

## Phase 7: Polish & Production Readiness (Priority: HIGH)

### 7A: Error Handling

- Add `app/not-found.tsx` — custom 404 page (Eden themed)
- Add `app/error.tsx` — custom error boundary (Eden themed)
- Add `app/loading.tsx` — root loading state
- Ensure all API routes return proper error responses with status codes

### 7B: Security Hardening

- Verify all admin routes check auth via middleware
- Verify all admin API routes verify session + admin role
- Add rate limiting to public API routes (service request, join form)
- Ensure `.env.local` is in `.gitignore` (verify!)
- Add CORS headers to API routes if needed
- Add Content Security Policy headers

### 7C: Meta & Social

- Verify Open Graph tags on all pages
- Verify Twitter Card tags
- Add `robots.txt` at `app/robots.ts`
- Ensure favicon loads correctly across browsers

### 7D: Responsive Design Audit

Test every page at these breakpoints:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px
- Wide: 1536px

Fix any layout breaks. The directory card grid should be:
- 1 col on mobile
- 2 col on tablet
- 3 col on desktop

---

## Commit Strategy

After each phase, commit with this pattern:
```
feat(phase-N): Brief description

- Bullet point of what was added
- Another bullet point

Co-Authored-By: Claude Code <noreply@anthropic.com>
```

**Commit after each sub-phase** (1A, 1B, 1C, etc.) — don't batch an entire phase into one commit. Small, atomic commits make review easier.

---

## Build Verification

After ALL phases, run:
```bash
npm run build        # Must pass with zero errors
npm run lint         # Must pass
```

Then create a summary file at `docs/2026-04-02_Overnight-Build-Report.md` documenting:
- What was built (with file paths)
- What wasn't finished and why
- Any decisions made and reasoning
- Known issues or TODOs
- Database migrations run

---

## Priority Order If Time Runs Short

If you can't complete everything, prioritize in this order:
1. **Phase 1** (Blog) — SEO content is the growth engine
2. **Phase 7** (Polish) — Production quality matters
3. **Phase 3** (Self-service onboarding) — Removes Hunter as bottleneck
4. **Phase 5** (SEO) — Compounds with blog content
5. **Phase 2** (Stripe) — Revenue, but can be added later
6. **Phase 4** (Analytics) — Nice to have, not blocking
7. **Phase 6** (Email) — Can log to console for now

---

## Notes from Cowork Oversight

I (Claude Opus, Cowork session) planned this build and will review the output. Here's what I'll be checking:

1. **Design system compliance** — Every pixel must feel like it belongs in the Garden of Eden. If I see a white background, a sans-serif headline where Playfair should be, or a blue link, I'm sending it back.

2. **Code quality** — TypeScript strict mode. No `any` types. Proper error handling. Server vs client components used correctly. No unnecessary `'use client'` directives.

3. **Database safety** — All migrations are idempotent (IF NOT EXISTS, ON CONFLICT). RLS policies cover all new tables. No exposed service role key in client code.

4. **Build integrity** — `npm run build` must pass clean after every phase. Zero TypeScript errors. Zero unused imports.

5. **Commit hygiene** — Small commits, clear messages, no secrets in git history.

6. **Mobile-first** — Every new page must look great on a phone. Churches check this stuff on their phones during Sunday service.

7. **The Product Bible is law** — If this doc and the Product Bible conflict, the Product Bible wins. It has the business strategy, pricing, and positioning. Build what it says.

Build something Hunter will be proud to show to the next 10 churches. Make it world class.

---

*Planned by: Cowork Session (Claude Opus 4.6) — April 1, 2026*
*For execution by: Claude Code terminal session*
*Review by: Cowork Session upon completion*
