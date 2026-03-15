# TSI Alpha Prototype: Technical Audit

*Reviewed March 15, 2026 against frontend-design, design-and-copy, and branding-design skill standards*

---

## Verdict: Strong Design Foundation, Needs Production Hardening

The alpha prototype demonstrates genuinely distinctive design work. The "Garden of Eden" palette, constellation particle animation, heartbeat text effect, and grayscale-to-color card transitions are memorable, intentional choices that avoid generic AI aesthetics. The visual identity is cohesive and emotionally resonant for the church audience.

The code, however, is prototype-grade and needs significant production hardening before launch.

---

## What's Working Well

**Design (8/10)**
- Constellation animation: particles form connections over time, visually representing the product's core metaphor
- Garden of Eden palette is bold and distinctive. Deep greens signal trust and growth. Gold accents signal warmth.
- Heartbeat animation on "Heart" is a subtle, emotional touch
- Playfair Display + Inter pairing works well (serif authority + sans-serif readability)
- Card hover interactions (grayscale to color, 3D translate) add discovery and delight
- Scripture text ripple animation is creative and contextually appropriate

**Content/Copy (7/10)**
- Hero headline "Discover the Heart of Your Community" is strong
- "It's an Act of Strength to Ask for Help" reframes the ask effectively
- Stats are specific and sourced (76%, 1 in 4, 90%)

**Information Architecture (7/10)**
- Clear page hierarchy: Homepage > Find Resources > Directory
- Onboarding flow is logical: Learn > Setup > Connect > Launch
- Village Church demo shows white-label theming capability

---

## Critical Issues

### 1. PHP Is Unnecessary
PHP is used in exactly ONE place across all 7 files. Every other page hardcodes the year or omits it. These are static HTML files disguised as PHP.
**Action**: Rename to .html, replace PHP call with JavaScript.

### 2. Favicon Chaos (5 Different Implementations)
| Page | Favicon |
|------|---------|
| index.php | /images/favicon.png (correct) |
| find-resources.php | /images/favicon.jpg (wrong format) |
| onboard.php | Emoji handshake inline SVG |
| setup-guide.php | Inline SVG flower design |
| village-directory.php | No favicon at all |

**Action**: Use uploaded favicon.png consistently across every page.

### 3. Broken/Placeholder Links
Three CTAs point to href="#" (dead links) on index, find-resources-v1, and setup-guide.
**Action**: Link to connect.php or proper destination pages.

### 4. Zero Accessibility (ARIA)
No ARIA attributes, roles, or labels across ANY file. No skip-nav links. No focus management.
**Action**: Add aria-label to interactive elements, role="search" to forms, skip-nav links.

### 5. OG Meta Tag Inconsistency
- find-resources-v1: og:url points to "yourwebsite.com" (placeholder)
- find-resources-v1: og:image references "Preview Card.PNG" (spaces, wrong case)
- find-resources: og:image uses placehold.co
**Action**: Standardize to thestewardshipinitiative.org domain.

### 6. Tailwind via CDN (Not Production-Ready)
All 7 pages load ~300KB of unused CSS via Play CDN.
**Action**: Migrate to PostCSS build (Next.js handles this natively).

---

## Migration Recommendation: PHP to Next.js

**Do NOT keep PHP.** The files use zero PHP functionality. The target stack (Next.js + Vercel + Supabase) provides:

| Factor | PHP (Current) | Next.js (Target) |
|--------|---------------|-------------------|
| Components | None (copy-paste) | React components |
| API layer | Separate backend needed | API routes built in |
| SEO | Manual meta tags | generateMetadata |
| Images | No optimization | next/image (auto WebP, lazy) |
| CSS | Tailwind CDN (300KB) | PostCSS compiled (~10KB) |
| Deploy | Manual FTP/SSH | Git push to Vercel |
| Cron | Separate server | Vercel Cron built in |
| Auth | Build from scratch | Supabase Auth |

---

## File-by-File Status

| File | Quality | Key Issue | Action |
|------|---------|-----------|--------|
| index.php | Strong | Load delay too slow (5-7s) | Keep design, reduce timing |
| find-resources.php | Strong | Village Church specific | Keep as theming reference |
| find-resources-v1.php | Good | Placeholder links, old OG tags | Fix links and meta |
| village-directory.php | Strong | Hardcoded data | Needs Supabase/Notion API |
| onboard.php | Good | Different design language | Align or keep as contrast |
| setup-guide.php | Strong | Placeholder CTA | Link to connect.php |
| connect.php | Good | No validation, no backend | Needs backend processing |

---

## What Makes This Design Award-Worthy (and What's Missing)

**Already distinctive:**
- The constellation loading metaphor (disconnection becoming connection)
- Garden of Eden color system (not another purple gradient)
- Heartbeat animation (emotional, on-brand)
- Grayscale to color card reveal (discovery moment)

**Needed for award-level:**
- Smooth page transitions (View Transitions API or Framer Motion)
- Micro-interactions on every touchpoint (button ripples, form feedback)
- Custom cursor on the constellation canvas
- Sound design (optional ambient audio toggle)
- Scroll-driven animations (parallax, progressive reveal)
- Custom 404 page that fits the Garden of Eden theme
- Loading skeleton screens for the directory
- Accessibility excellence (WCAG AAA, not just AA)

---

*This audit serves as the quality gate for the Next.js migration. Every issue here should be resolved during the rebuild.*
*Reviewed: March 15, 2026*
