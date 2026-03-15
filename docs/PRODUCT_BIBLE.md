# TSI Product Bible

**The Stewardship Initiative: Product, Design & Growth Specification**
*Version 1.0 | March 2026 | A Simpli-FI OS Initiative*

---

## 1. Executive Summary

### What TSI Is

The Stewardship Initiative is a skills-and-services directory platform for high-trust communities, starting with churches. It makes invisible networks visible by connecting member needs with member gifts.

### What TSI Is NOT

TSI is not a Church Management System (ChMS). It does not handle giving, attendance, check-in, worship planning, or accounting. It does ONE thing: surfaces the hidden talent within a congregation and makes it findable.

The ChMS market is crowded with 40+ competitors (Planning Center, Breeze, ChurchTrac, Tithely, ChMeetings). The "skills directory" niche within church software is underserved. Nobody is doing it well. That gap is our moat.

### The $1K/mo Thesis

- **Conservative path**: 67 churches at $15/mo = $1,005/mo
- **Moderate path**: 34 churches at $29/mo = $986/mo
- **Premium path**: 20 churches at $49/mo = $980/mo

There are ~370,000 churches in the US. We need to convert 0.009% to 0.018% of the addressable market.

---

## 2. Market Analysis & Opportunity

**US Church Market**:
- ~370,000 religious congregations in the US (Hartford Institute)
- 332,000 are Protestant and other Christian churches
- Church management software market: $970.9M in 2024, projected $1.47B by 2033 (4.7% CAGR)
- 86% of churches now use digital management tools

**The Disruption Moment**:
- 15,000 churches projected to close in 2025 (Thom Rainer / LifeWay)
- 29% of Americans now religiously unaffiliated
- "Connection gap" is the #1 pastoral concern: 1 in 4 churchgoers feel disconnected (Barna Group)

### Competitive Pricing Analysis

| Competitor | What They Do | Price | Our Differentiator |
|-----------|-------------|-------|-------------------|
| Instant Church Directory | Photo directory only | $9.99-$14.99/mo | We surface SKILLS, not just names |
| Planning Center | Full ChMS | $0-$300/mo | We complement, not compete |
| ChurchTrac | Full ChMS | $9-$45/mo | We do one thing better |
| Breeze | Full ChMS | $72-$180/mo | Overkill for directory use case |

### TAM / SAM / SOM

| Metric | Calculation | Size |
|--------|-------------|------|
| **TAM** | 332K churches x $15/mo x 12 | $59.8M/year |
| **SAM** | ~100K churches with 100+ members | $18M/year |
| **SOM** (Year 1) | 100 churches at avg $20/mo | $24K/year |

---

## 3. Positioning & Competitive Advantage

### Positioning Statement

For **church leaders and ministry staff** who know their congregation is full of talented, generous people but have no way to connect those gifts with members who need them, **The Stewardship Initiative** is a **community skills directory** that makes the invisible talent network within your church visible, searchable, and actionable. Unlike generic church management software or basic photo directories, TSI is purpose-built for stewardship: connecting needs with gifts, strengthening fellowship from within.

### The One-Liner

**"Your congregation's greatest resource is already sitting in the pews. We help them find each other."**

---

## 4. Revenue Model

### Pricing Tiers

**Seed (Free)**: Up to 25 member profiles, basic search/filter, TSI branding. Purpose: Get churches hooked.

**Growth ($29/mo)**: Unlimited profiles, custom skill categories, church branding, analytics dashboard, SEO listing page, priority support. Purpose: The money tier.

**White-Label ($199/mo)**: Everything in Growth + custom subdomain, full brand removal, API access, dedicated onboarding. Purpose: Premium tier for large churches.

### Revenue Projections

| Month | Seed (free) | Growth ($29) | White-Label ($199) | MRR |
|-------|------------|-------------|-------------------|-----|
| 1-3 | 20 | 5 | 0 | $145 |
| 4-6 | 50 | 15 | 1 | $634 |
| 7-9 | 100 | 25 | 2 | $1,123 |
| 10-12 | 200 | 40 | 3 | $1,757 |

**$1K/mo target: Month 7-8** with blended tier adoption.

---

## 5. Technical Architecture & Stack

### Target Stack: Next.js + Vercel + Supabase

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 14+ (App Router) | SSR for SEO, API routes, Vercel-native |
| **Hosting** | Vercel | Auto-deploy from GitHub, edge functions |
| **Database** | Supabase (PostgreSQL) | Row-level security, realtime, auth |
| **Auth** | Supabase Auth | Magic link (no passwords) |
| **Payments** | Stripe | Subscriptions, webhooks |
| **CMS / Blog** | MDX or Supabase | Content auto-deploys with code |
| **Email** | Resend | Transactional + marketing |
| **Analytics** | Plausible or PostHog | Privacy-respecting |
| **Cron Jobs** | Vercel Cron | Scheduled content generation, data sync |
| **AI Content** | Anthropic API (Claude) | SEO articles, listing enrichment |

### Vercel Cron Configuration

```json
{
  "crons": [
    { "path": "/api/cron/generate-article", "schedule": "0 6 * * 1,4" },
    { "path": "/api/cron/sync-notion", "schedule": "*/30 * * * *" },
    { "path": "/api/cron/enrich-listings", "schedule": "0 3 * * *" }
  ]
}
```

---

## 6. Automation Pipeline: The Autonomous Engine

### System 1: Content Engine (SEO Articles)

**Schedule**: Twice per week (Monday & Thursday, 6am CT)

Claude API generates article from topic queue, saves to Supabase, admin reviews (or auto-publishes), renders as static page via Next.js ISR, sitemap auto-updates.

**Topic Categories** (rotating): church skills directory how-tos, stewardship theology, community connection strategies, volunteer management, skill-specific articles (finding accountants/lawyers in your church), church member engagement ideas.

**Target**: 8 articles/month, 1,200-2,000 words each, targeting long-tail keywords.

### System 2: Listing Enrichment

**Schedule**: Daily at 3am CT

When members submit profiles with a website URL, the system fetches their site, extracts business description, and Claude summarizes into TSI format. Flags missing photos for admin follow-up. Suggests skill categories based on title/description.

**Important**: Every listing is opt-in. We do NOT scrape or steal data. The enrichment system improves quality of voluntarily submitted information.

### System 3: Notion Sync

**Schedule**: Every 30 minutes

Polls Notion databases for churches still using the template backend. Diffs with Supabase records, upserts changes.

### System 4: Auto-Deploy

Content stored in Supabase renders via ISR. Code changes push to GitHub, Vercel auto-deploys. No manual deployment needed.

---

## 7. Brand Identity & Design System

### Brand Essence

| Attribute | Value |
|-----------|-------|
| **Mission** | Make the invisible talent within communities visible |
| **Personality** | Warm, trustworthy, rooted, generous, quietly confident |
| **Voice** | Pastoral but modern. Not preachy. Not corporate. Human. |
| **Tagline** | "Discover the Heart of Your Community" |

### Color Palette: "Garden of Eden"

| Token | Hex | Usage |
|-------|-----|-------|
| jungle-green | #022C22 | Primary background, trust, depth |
| lush-teal | #033F32 | Card surfaces, secondary backgrounds |
| tidal-teal | #26A69A | Tertiary accent, success states |
| hibiscus-pink | #D90368 | Emotional accent, heart, CTAs |
| marigold-yellow | #FDB833 | Interactive elements, links, warmth |
| orchid-white | #FDFDFF | Primary text on dark, purity |
| redwood | #A44A3F | Warning, earthy warmth |

### Typography

| Role | Font | Usage |
|------|------|-------|
| Display / Headlines | Playfair Display (700) | Hero headlines, section titles |
| UI / Body | Inter (300-700) | Body text, UI elements, navigation |

### Motion & Interaction

| Element | Animation | Purpose |
|---------|-----------|---------|
| Homepage | Constellation particles with connections | Disconnected dots becoming connected |
| "Heart" text | Heartbeat keyframe | Emotional center of brand |
| Scroll sections | fade-in with IntersectionObserver | Progressive reveal |
| Directory cards | Grayscale to color on hover | Discovery, surprise |
| CTAs | Scale-105 on hover | Inviting, touchable |

---

## 8. Content & SEO Strategy

### Primary Keywords (bottom-funnel)
- "church skills directory", "church member directory software", "church community directory", "Notion church directory"

### Long-tail Targets
- "how to create a church skills directory"
- "finding professionals in your church"
- "church community resources directory"

### Content Calendar (Automated via Cron)

8 articles/month rotating through: practical how-tos, theological stewardship content, community connection strategies, skill-specific guides, engagement ideas.

### GEO (Generative Engine Optimization)

Structure content for AI search retrieval: clear factual claims with data citations, FAQ sections with schema markup, entity-rich content, concise quotable summaries.

---

## 9. Growth Loops & Funnel Architecture

### Loop 1: Directory Virality
Church sets up TSI -> shares with members -> members browse -> other church staff see it -> "We need this" -> new signup. Every free-tier page includes "Powered by TSI" footer.

### Loop 2: Content/SEO
SEO article ranks -> church leader finds it -> clicks CTA -> starts free trial -> sets up directory -> "Powered by TSI" drives Loop 1.

### Loop 3: Church-to-Church Network
Pastor uses TSI -> mentions at denominational meeting -> word-of-mouth signups (highest conversion, lowest cost).

### Lead Magnet: "The Church Connection Toolkit"
Free PDF with: 50 Skills Categories template, Congregation Announcement scripts, Stewardship Sunday sermon guide.

---

## 10. Roadmap & Milestones

### Phase 1: Foundation (Weeks 1-4)
- Initialize Next.js project, deploy to Vercel
- Set up Supabase (tables, RLS, auth)
- Build marketing pages (port PHP to Next.js)
- Build directory page (dynamic, data-driven)
- Build admin dashboard
- Stripe integration (Free/Growth/White-Label)
- Member self-submission form

### Phase 2: Content Engine (Weeks 5-8)
- Blog infrastructure (Supabase + ISR)
- 10 foundational SEO articles (manual)
- Claude API content generation pipeline
- Vercel Cron for article generation
- Google Search Console, sitemap
- Email capture and newsletter

### Phase 3: Growth (Weeks 9-16)
- Referral program
- Church-specific landing pages for SEO
- Analytics dashboard for Growth tier
- White-label theming system
- LinkedIn content strategy
- Podcast guest spots

### Phase 4: Scale (Months 5-12)
- Expand to non-church communities
- Mobile app (PWA)
- API for ChMS integrations
- "Skills Marketplace" matching features
- Denominational partnerships

### Key Metrics

| Metric | Month 6 | Month 12 |
|--------|---------|----------|
| Total orgs | 75 | 250 |
| Paid orgs | 20 | 50 |
| MRR | $600 | $1,500 |
| Blog articles | 48 | 96+ |
| Monthly organic visitors | 2,000 | 8,000 |
| Email list | 500 | 2,000 |

---

## Appendix: Voice Guide

### Writing Rules (Non-Negotiable)

1. Never use em dashes. Use commas, periods, or parentheses.
2. Never use "leverage," "harness," "utilize," "synergy," or "paradigm."
3. Never start with "In today's world" or "In this article."
4. Scripture references should feel natural, not forced.
5. Stats should be specific with sources.
6. Short paragraphs: 2-3 sentences max.
7. Active voice always.

---

## Skills Sourced

| Skill | Applied |
|-------|---------|
| design-and-copy | Visual hierarchy, color psychology, UX patterns, typography, motion design |
| branding-design | Wheeler's 5-phase process, Neumeier's 5 disciplines, StoryBrand, positioning |
| frontend-design | Aesthetic direction, motion patterns, Tailwind implementation |
| simpli-fi-admin-copywriter | Schwartz awareness levels, Dunford positioning, Challenger Sale |
| simpli-fi-growth-engineer | Viral loops, K-factor, network effects |
| simpli-fi-funnel-architect | Brunson value ladder, lead magnet strategy |
| simpli-fi-conversion-copywriter | AIDA framework, headline formulas, CTA optimization |
| simpli-fi-community-cultivator | Content layering, newsletter strategy |

---

*This document is a living specification. Last updated: March 15, 2026*
*Author: Hunter Lott / Simpli-FI OS*
