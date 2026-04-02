# TSI Sprint 2 — April 2–3, 2026
## Claude Code Build-Test-Evaluate-Optimize Cycle

> **METHODOLOGY**: For every task below, follow this exact cycle:
> 1. **PLAN** — Read relevant existing code. Understand the current state. Decide your approach.
> 2. **BUILD** — Write the code. Use existing patterns and design system.
> 3. **TEST** — Run `npm run build`. If it fails, fix it before moving on. Test the feature manually if applicable (start dev server, hit the endpoint, verify the UI).
> 4. **EVALUATE** — Re-read what you wrote. Check for: TypeScript strictness, Garden of Eden compliance, security (no secrets in client code), proper error handling, mobile responsiveness.
> 5. **OPTIMIZE/FIX** — Fix anything found in evaluate. Refactor if needed.
> 6. **COMMIT** — Small, atomic commit with descriptive message.
> 7. **REPEAT** — Move to next task.
>
> **DO NOT** batch multiple tasks into one commit. **DO NOT** skip the test step. **DO NOT** skip the evaluate step.

---

## Pre-Flight (Same as Sprint 1)

```bash
git pull
npm run build  # Must pass before you start
```

Read these files before starting:
- `CLAUDE.md` — Design system rules, architecture
- `docs/OVERNIGHT-BUILD.md` — Original spec (for reference)
- `docs/2026-04-02_Overnight-Build-Report.md` — What was built, what's missing

---

## Sprint 2 Tasks (Priority Order)

### Task 1: Fix Join Form — Apply Garden of Eden Theme

**Context**: The build report noted "The existing join page uses a light theme. CLAUDE.md says existing pages are sacred, so it was left as-is." But the join form IS a new page that should match the directory. It currently has a white/light background which clashes with the rest of TSI.

**PLAN**: Read `app/directory/[slug]/join/page.tsx` and `app/directory/[slug]/join/JoinForm.tsx`. Understand current styling.

**BUILD**: Restyle to match Garden of Eden:
- Background: `bg-eden-jungle`
- Card container: `.eden-card`
- Inputs: `.form-input`
- Labels: `text-eden-orchid`
- Submit button: `.btn-primary`
- Header: `font-display` with org name
- Back link to directory
- Success state: eden-tidal checkmark icon

**TEST**: `npm run build` + visually verify the form at `/directory/village-church/join`

**EVALUATE**: Does it feel like part of the same app as the directory page? Is it mobile-responsive?

---

### Task 2: Wire Up Analytics Tracking in Directory

**Context**: `lib/analytics.ts` exists with `trackEvent()` but it's never called from the directory view.

**PLAN**: Read `app/directory/[slug]/DirectoryView.tsx` and `lib/analytics.ts`.

**BUILD**: Add tracking calls for:
- `page_view` — on component mount (with org slug in metadata)
- `search` — when user types in search box (debounced, 500ms)
- `filter` — when user selects a skill filter
- `profile_view` — when user opens a member modal
- `contact_click` — when user clicks email/phone/website in modal
- `request_service` — when user submits the request service form

You'll need the org ID. Pass it as a prop from the server component or extract from context.

**TEST**: `npm run build` + open directory, check browser Network tab for POST to `/api/analytics/track`

**EVALUATE**: Are events firing at the right moments? Is the debounce working for search? Does it fail silently (no UI errors if analytics API is down)?

---

### Task 3: Member Self-Edit Profile Page

**Context**: Members who joined should be able to edit their own profiles. This was in the original spec but not built.

**PLAN**: The flow is:
1. Member visits `/directory/[slug]/profile`
2. Must be logged in (redirect to /login if not)
3. Show their current profile pre-populated
4. Allow editing: name, title, bio, skills, photo, availability
5. Save updates via API

**BUILD**:
- `app/directory/[slug]/profile/page.tsx` — Server component, checks auth, fetches member data
- `app/directory/[slug]/profile/ProfileEditor.tsx` — Client component, edit form
- `app/api/members/[id]/route.ts` — PATCH endpoint for member self-update
- Middleware: add `/directory/*/profile` to protected patterns (or check in page component)
- Form uses `.form-input`, `.btn-primary`, `.eden-card`, Garden of Eden throughout
- Photo upload using `lib/storage.ts` `uploadMemberPhoto()`
- Skills: checkboxes from the org's skill list
- "Available for requests" toggle

**TEST**: `npm run build` + test the full flow: login → navigate to profile → edit → save → verify changes appear in directory

**EVALUATE**: Does the form handle errors gracefully? Does it show a loading state while saving? Does the photo upload work? Is it mobile-responsive?

---

### Task 4: Admin Dashboard — Export Members CSV

**Context**: Mentioned in spec, not built. Church admins need to export their member list.

**PLAN**: Read `app/admin/page.tsx` to see where to add the button.

**BUILD**:
- Add "Export CSV" button to admin dashboard Quick Actions (or member management page)
- `app/api/admin/members/export/route.ts` — GET endpoint that:
  - Verifies admin session
  - Fetches all members for the admin's org
  - Generates CSV with columns: Name, Email, Phone, Title, Skills, Available, Approved, Created
  - Returns with `Content-Type: text/csv` and `Content-Disposition: attachment`
- Button triggers a download

**TEST**: `npm run build` + click export, verify CSV downloads with correct data

**EVALUATE**: Are special characters in names/bios properly escaped in CSV? Is the filename timestamped?

---

### Task 5: Improve Onboarding Wizard — Add Logo Upload

**Context**: Step 3 of the wizard was simplified to just skill selection. Add logo upload.

**PLAN**: Read `app/get-started/OnboardingWizard.tsx` and `lib/storage.ts`.

**BUILD**:
- Add logo upload field in Step 3 (Customize)
- File input with preview (show uploaded image)
- On submit, upload to Supabase Storage `org-logos` bucket
- Pass logo URL to the API when creating the org
- Show placeholder icon if no logo uploaded
- Accept: image/png, image/jpeg, image/webp. Max: 2MB

**TEST**: `npm run build` + walk through full onboarding with logo upload

**EVALUATE**: Does the preview show immediately? Is the file size check client-side? Does it handle upload errors?

---

### Task 6: Add Structured Data (JSON-LD) to Key Pages

**Context**: Blog articles already have JSON-LD. Other pages need it for SEO.

**PLAN**: Read the existing JSON-LD in `app/blog/[slug]/page.tsx` as a reference.

**BUILD**:
- **Homepage** (`app/page.tsx`): Organization schema
  ```json
  { "@type": "Organization", "name": "The Stewardship Initiative", "url": "...", "description": "..." }
  ```
- **Pricing page**: Product schema with Offer for each tier
- **Directory pages**: LocalBusiness or Organization schema per org
  ```json
  { "@type": "Organization", "name": "Village Church Directory", "member": [...] }
  ```

Add via `<script type="application/ld+json">` in the page's metadata or as a component.

**TEST**: `npm run build` + use Google's Rich Results Test or Schema.org validator

**EVALUATE**: Is the structured data valid JSON-LD? Does it match what Google expects for these page types?

---

### Task 7: Admin Article Auth Hardening

**Context**: The article admin API route (`app/api/admin/articles/[id]/route.ts`) checks for cookie existence but doesn't verify the token is valid or that the user is an admin.

**PLAN**: Read `lib/auth.ts` for the `getUserProfile()` function pattern.

**BUILD**:
- Update `app/api/admin/articles/[id]/route.ts` to:
  1. Get access token from cookies
  2. Verify it against Supabase (set session, get user)
  3. Check that the user has admin or super_admin role in profiles
  4. Only then allow the operation
- Apply the same pattern to any other admin API routes that only check cookie existence:
  - `app/api/admin/articles/generate/route.ts`
  - `app/api/billing/portal/route.ts`
  - `app/api/admin/members/[id]/route.ts` (verify this one too)

**TEST**: `npm run build` + test with invalid/expired cookie — should return 401

**EVALUATE**: Is there a shared `verifyAdminSession()` helper to avoid code duplication? If not, create one in `lib/auth.ts`.

---

### Task 8: Input Validation on All API Routes

**Context**: Several API routes accept JSON without validating field types or lengths.

**PLAN**: Audit all `app/api/` routes for input handling.

**BUILD**: Add validation to:
- `app/api/onboard/route.ts` — church name required (2-100 chars), email format, password min 8 chars, slug format check
- `app/api/admin/articles/[id]/route.ts` — title max 200 chars, slug format (lowercase, hyphens, no spaces), category must be in enum
- `app/api/directory/[slug]/request/route.ts` — name required, message required (10-1000 chars), email format
- `app/api/analytics/track/route.ts` — rate limit: max 100 events per session per hour

Return clear error messages: `{ error: "Title must be under 200 characters", field: "title" }`

**TEST**: `npm run build` + send bad data to each endpoint, verify proper 400 responses

**EVALUATE**: Are error messages helpful but not leaking internals? Is validation consistent across routes?

---

### Task 9: Vercel Deployment Configuration

**Context**: The app needs a `vercel.json` for cron jobs and proper env var configuration.

**BUILD**:
Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/generate-article",
      "schedule": "0 12 * * 1,4"
    }
  ]
}
```

Update `app/api/cron/generate-article/route.ts`:
- Also accept Vercel's cron auth header (`Authorization: Bearer <CRON_SECRET>`)

Create `.env.example` update with ALL needed variables documented.

**TEST**: `npm run build` + verify vercel.json is valid JSON

---

### Task 10: Performance — Image Optimization Audit

**PLAN**: Search the entire codebase for `<img` tags that should be `<Image>` from `next/image`.

**BUILD**:
- Replace all `<img>` tags with Next.js `<Image>` component
- Add proper `width`/`height` or `fill` prop
- Add `loading="lazy"` for below-fold images
- Add `priority` for above-fold hero images
- Ensure all image domains are in `next.config.js` `remotePatterns`

**TEST**: `npm run build` + check for no image optimization warnings

**EVALUATE**: Run Lighthouse on the homepage and directory page. Target 90+ Performance.

---

## Commit Strategy

Same as Sprint 1:
```
feat|fix|perf(task-N): Brief description

- What changed
- Why

Co-Authored-By: Claude Code <noreply@anthropic.com>
```

One commit per task. If a task requires a fix during the evaluate step, amend the commit or add a follow-up `fix(task-N)` commit.

---

## Build Report

After completing all tasks, create `docs/2026-04-02_Sprint-2-Report.md` with:
- Tasks completed vs skipped
- Decisions made
- Issues found during evaluate steps
- Lighthouse scores (if run)
- Remaining TODOs

---

## Priority If Time Runs Short

1. Task 1 (Join form theme) — Visual consistency
2. Task 2 (Analytics wiring) — Data collection
3. Task 7 (Auth hardening) — Security
4. Task 8 (Input validation) — Security
5. Task 3 (Member self-edit) — User feature
6. Task 6 (Structured data) — SEO
7. Task 4 (CSV export) — Admin feature
8. Task 5 (Logo upload) — Onboarding polish
9. Task 9 (Vercel config) — Deployment
10. Task 10 (Image audit) — Performance

---

*Planned by: Cowork Session (Claude Opus 4.6) — April 2, 2026*
*For execution by: Claude Code terminal session*
*Methodology: Plan → Build → Test → Evaluate → Optimize → Commit → Repeat*
