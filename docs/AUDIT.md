# TSI Alpha Prototype: Technical Audit

*Reviewed March 15, 2026 against frontend-design, design-and-copy, and branding-design skill standards*

---

## Verdict: Strong Design Foundation, Needs Production Hardening

The alpha prototype demonstrates genuinely distinctive design work. The "Garden of Eden" palette, constellation particle animation, heartbeat text effect, and grayscale-to-color card transitions are memorable, intentional choices that avoid generic AI aesthetics. The visual identity is cohesive and emotionally resonant for the church audience.

The code, however, is prototype-grade and needs significant production hardening before launch.

---

## What's Working Well

**Design (8/10)**
- The constellation animation on the homepage is a standout: particles form connections over time, visually representing the product's core metaphor (disconnected people becoming connected)
- Garden of Eden palette is bold and distinctive. Deep greens signal trust and growth. Gold accents signal warmth.
- The heartbeat animation on "Heart" is a subtle, emotional touch that reinforces the brand
- Playfair Display + Inter pairing works well (serif authority + sans-serif readability)
- Card hover interactions (grayscale to color, 3D translate) add discovery and delight
- Scripture text ripple animation is creative and contextually appropriate

**Content/Copy (7/10)**
- Hero headline "Discover the Heart of Your Community" is strong
- "It's an Act of Strength to Ask for Help" reframes the ask effectively
- Stats are specific and sourced (76%, 1 in 4, 90%)
- StoryBrand alignment is clear (church leader as hero, TSI as guide)

**Information Architecture (7/10)**
- Clear page hierarchy: Homepage > Find Resources > Directory
- Onboarding flow is logical: Learn > Setup > Connect > Launch
- The Village Church demo shows white-label theming capability

---

## Critical Issues

### 1. PHP Is Unnecessary
PHP is used in exactly ONE place across all 7 files: `<?php echo date("Y"); ?>` in onboard.php's footer. Every other page hardcodes the year or omits it. These are static HTML files. **Recommendation**: Rename to .html, replace the one PHP call with JavaScript: `document.write(new Date().getFullYear())`.

### 2. Favicon Chaos (5 Different Implementations)
| Page | Favicon |
|------|---------|
| index.php | `/images/favicon.png` (correct) |
| find-resources.php | `/images/favicon.jpg` (wrong format, file doesn't exist) |
| find-resources-v1.php | `/images/favicon.jpg` (wrong format, file doesn't exist) |
| onboard.php | Emoji handshake inline SVG |
| setup-guide.php | Inline SVG flower/cross design |
| connect.php | Same inline SVG as setup-guide |
| village-directory.php | No favicon at all |

**Recommendation**: Use the uploaded favicon.png consistently across every page.

### 3. Broken/Placeholder Links
Three CTAs point to `href="#"` (dead links):
- index.php: "Share Your Gifts" button
- find-resources-v1.php: "Find Your Community's Directory" CTA
- setup-guide.php: "Connect Your API Key & Launch Your Directory" button

**Recommendation**: Link to `connect.php` or create proper destination pages.

### 4. Zero Accessibility (ARIA)
No ARIA attributes, roles, or labels across ANY file. No skip navigation links. No focus management. Form inputs in connect.php and village-directory.php lack proper aria descriptions.

**Recommendation**: Add `aria-label` to all interactive elements, `role="search"` to search forms, skip-nav links, proper heading hierarchy audit.

### 5. OG Meta Tag Inconsistency
- find-resources-v1.php: `og:url` points to `yourwebsite.com` (placeholder)
- find-resources-v1.php: `og:image` references `Preview Card.PNG` (spaces in filename, wrong case)
- find-resources.php: `og:image` uses placehold.co placeholder
- Only index.php has fully correct OG tags

**Recommendation**: Standardize all OG tags to use `thestewardshipinitiative.org` domain and the uploaded preview-card.png.

### 6. Tailwind via CDN (Not Production-Ready)
All 7 pages load Tailwind via `cdn.tailwindcss.com` Play CDN. This is explicitly documented as "for development only" by Tailwind. It adds ~300KB of unused CSS to every page load.

**Recommendation**: Migrate to PostCSS build (or Next.js which handles this natively).

---

## Moderate Issues

### 7. Hardcoded Directory Data
village-directory.php contains 12 members with hardcoded image URLs, bios, skills, and contact info. This was intentional for the alpha demo but must be replaced with dynamic data.

### 8. No Shared Components
Every page duplicates the full HTML head, Tailwind config, Google Fonts links, and footer. Changes require editing 7 files.

### 9. Missing Error States
- connect.php form has no client-side validation beyond `required`
- village-directory.php search has no debouncing
- No 404 or error pages exist

### 10. Performance
- No lazy loading on images
- No preload hints for critical fonts
- Constellation canvas runs continuously (no visibility API pause)
- No resource hints (dns-prefetch for external domains)

### 11. Homepage Load Timing
The homepage delays content reveal by 5-7 seconds. While the constellation animation is beautiful, users on slow connections or with poor attention spans may bounce before seeing any content. Consider reducing to 2-3 seconds.

---

## Migration Recommendation: PHP to Next.js

**Do NOT keep PHP.** Here's why:

| Factor | PHP (Current) | Next.js (Target) |
|--------|---------------|-------------------|
| Server rendering | Manual, per-page | Built-in SSR/SSG/ISR |
| Component reuse | None (copy-paste) | React components |
| Routing | File-based (.php) | File-based (app router) |
| API layer | Separate backend needed | API routes built in |
| SEO | Manual meta tags | next/head, generateMetadata |
| Image optimization | None | next/image (automatic WebP, lazy load) |
| CSS | Tailwind CDN (300KB) | PostCSS compiled (~10KB) |
| Deployment | Manual FTP/SSH | Git push to Vercel (auto) |
| Cron jobs | Separate server needed | Vercel Cron (built in) |
| Auth | Build from scratch | Supabase Auth (magic link) |

The migration path is documented in the Product Bible (Phase 1, Weeks 1-4).

---

## File-by-File Status

| File | Quality | Key Issue | Action |
|------|---------|-----------|--------|
| index.php | Strong | Load timing too slow (5-7s) | Keep design, reduce timing, add a11y |
| find-resources.php | Strong | Village Church specific, good white-label demo | Keep as reference for theming |
| find-resources-v1.php | Good | Placeholder links, old OG tags | Fix links and meta |
| village-directory.php | Strong | Hardcoded data, no API | Core of the product, needs dynamic data |
| onboard.php | Good | Different design language (white bg) | Align with Garden of Eden or keep as contrast |
| setup-guide.php | Strong | Placeholder CTA link | Link to connect.php |
| connect.php | Good | No validation, no backend | Needs process_connection.php |

---

*This audit serves as the quality gate for the Next.js migration. Every issue listed here should be resolved during the rebuild.*
