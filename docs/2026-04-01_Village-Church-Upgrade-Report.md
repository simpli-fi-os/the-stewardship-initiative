# TSI Village Church Upgrade — April 1, 2026
## From Beta Prototype → Production-Ready Platform

---

## What Got Built

### 1. Real Authentication System (Supabase Auth)
Full login/signup flow with two methods:

| Feature | File | Status |
|---------|------|--------|
| **Login page** (Magic Link + Password) | `app/login/page.tsx` + `LoginForm.tsx` | Ready |
| **Signup page** (email + password) | `app/signup/page.tsx` + `SignupForm.tsx` | Ready |
| **Auth callback handler** | `app/auth/callback/route.ts` | Ready |
| **Session middleware** (protects /admin) | `middleware.ts` | Ready |
| **Logout API** | `app/api/auth/logout/route.ts` | Ready |
| **Browser Supabase client** (PKCE flow) | `lib/supabase-browser.ts` | Ready |
| **Server Supabase client** (cookie-based) | `lib/supabase-server.ts` | Ready |
| **Auth utilities** (profiles, admin checks) | `lib/auth.ts` | Ready |

All styled in the existing **Garden of Eden** design system — dark teal backgrounds, gold accents, Playfair Display headers.

### 2. Admin Dashboard
Full admin panel at `/admin` with sidebar navigation:

| Page | What It Does |
|------|-------------|
| **Dashboard** (`/admin`) | Stats cards (total members, approved, pending, this week), pending approvals queue, recent members table |
| **Members** (`/admin/members`) | Full member management — filter by All/Pending/Approved/Rejected, search, expandable detail rows, one-click approve/reject/feature |
| **Settings** (`/admin/settings`) | Org info display, skills list, embed link for sharing |

Admin API route at `/api/admin/members/[id]` supports PATCH with actions:
- `approve` — sets approved=true, records timestamp
- `reject` — sets approved=false, records timestamp + optional reason
- `toggle-featured` — toggles featured status

### 3. Upgraded Directory Experience
The public directory at `/directory/village-church` now includes:

| Improvement | Before | After |
|-------------|--------|-------|
| **Member count** | Not shown | Badge in header showing total |
| **Available Now filter** | Not available | Checkbox filter + green dot indicators |
| **Pagination** | All members loaded at once | Load More button (12 at a time) |
| **Featured badges** | Not shown | Gold "Featured" badge on cards |
| **Available indicators** | Not shown | Green dot on cards + profile |
| **Contact info in modal** | Email only | Email + Phone (click-to-call) + Website |
| **Request Service** | Not available | In-modal form that sends request to member |
| **Admin login link** | Not available | Link in top banner |
| **Results count** | Not shown | "Showing X of Y members" |
| **Image hover** | No effect | Subtle zoom on hover |

### 4. Database Migration
File: `supabase/migrations/002_auth_and_admin.sql`

Creates:
- `profiles` table (linked to Supabase Auth users)
- Role-based access (member, admin, super_admin)
- New columns on `members`: user_id, approved_by, approved_at, rejected_at, rejection_reason
- Row Level Security policies for admin access
- Auto-create profile trigger on signup
- Indexes for performance

---

## Files Created (16 new)

```
NEW FILES:
├── middleware.ts                           ← Route protection for /admin
├── lib/
│   ├── supabase-browser.ts                ← Browser-side auth client
│   ├── supabase-server.ts                 ← Server-side admin client
│   └── auth.ts                            ← Auth utilities + admin functions
├── app/
│   ├── login/
│   │   ├── page.tsx                       ← Login page (server component)
│   │   └── LoginForm.tsx                  ← Login form (magic link + password)
│   ├── signup/
│   │   ├── page.tsx                       ← Signup page
│   │   └── SignupForm.tsx                 ← Signup form
│   ├── auth/callback/route.ts             ← Auth callback (PKCE + OTP)
│   ├── admin/
│   │   ├── layout.tsx                     ← Admin shell with sidebar
│   │   ├── AdminSidebar.tsx               ← Navigation + user info + logout
│   │   ├── page.tsx                       ← Dashboard with stats
│   │   ├── members/
│   │   │   ├── page.tsx                   ← Members list (server)
│   │   │   └── MembersManager.tsx         ← Members CRUD (client)
│   │   └── settings/page.tsx              ← Org settings view
│   ├── api/
│   │   ├── admin/members/[id]/route.ts    ← Member approve/reject/feature API
│   │   ├── auth/logout/route.ts           ← Logout + clear cookies
│   │   └── directory/[slug]/request/route.ts ← Service request API
├── supabase/migrations/
│   └── 002_auth_and_admin.sql             ← Full migration script
└── docs/
    └── 2026-04-01_Village-Church-Upgrade-Report.md  ← This file

MODIFIED FILES:
├── app/directory/[slug]/DirectoryView.tsx  ← Added filters, pagination, request service
└── lib/supabase.ts                         ← Added approved field to query
```

---

## Design Preserved ✓

All new pages follow the Garden of Eden design system exactly:
- Eden color palette (jungle, lush, tidal, hibiscus, marigold, orchid)
- Playfair Display + Inter typography
- `.eden-card` component styling
- `.btn-primary` gold button pattern
- Consistent border/shadow/transition tokens
- No changes to homepage, onboard, or find-resources pages
- ConstellationCanvas animation untouched

---

## Deployment Steps

### Step 1: Run Database Migration (5 min)
1. Go to https://supabase.com/dashboard → select TSI project
2. Navigate to **SQL Editor**
3. Paste the contents of `supabase/migrations/002_auth_and_admin.sql`
4. Click **Run**
5. Verify: Check that `profiles` table exists in Table Editor

**Note:** The original Supabase project (`ckfhtprqifukudqmfzck`) referenced here is DEPRECATED and inactive. TSI now uses project `kfwtxtjqpsmxpwcndude` on the Simpli-FI OS organization. Update your `.env.local` accordingly.

### Step 2: Enable Auth in Supabase
1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Under Email settings:
   - Enable "Confirm email" (for signups)
   - Enable "Magic Link" sign-in
   - Set Site URL to your deployment URL
4. Under **URL Configuration**, add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-production-domain.vercel.app/auth/callback`

### Step 3: Create Your Admin Account
1. Go to `/signup` and create an account with `hunter.lott@simpli-fi-alpha.com`
2. Confirm email
3. In Supabase SQL Editor, run:
   ```sql
   UPDATE profiles
   SET role = 'super_admin', org_id = 'a1b2c3d4-0000-0000-0000-000000000001'
   WHERE email = 'hunter.lott@simpli-fi-alpha.com';
   ```
4. Sign in at `/login` → you'll be redirected to `/admin`

### Step 4: Deploy to Vercel
```bash
cd tsi-next
npm run build
vercel --prod
```

### Step 5: (Optional) Configure Email Notifications
For the "Request Service" feature to send real emails:
1. Sign up for Resend (resend.com)
2. Add `RESEND_API_KEY` to `.env.local`
3. Uncomment the Resend code in `app/api/directory/[slug]/request/route.ts`

---

## What's Next

1. **Resume Supabase project** if paused, then run migration
2. **Deploy and test auth flow** end-to-end
3. **Connect Supabase MCP** to manage database directly from Claude
4. **TSI Engineer** — separate Claude Code instance for ongoing development
5. **Add more communities** beyond Village Church (the platform is multi-tenant ready)
6. **Skill management UI** in admin settings (currently view-only)
7. **Member self-editing** — let authenticated members update their own profiles
