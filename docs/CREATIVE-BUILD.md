# TSI Creative Build — The Community Trust Engine
## From Hidden Resources to Visible Networks: Complete Creative Specification

> **THE CREATIVE MANDATE**: TSI is not a church directory. It is the universal infrastructure layer powering the entire Simpli-FI ecosystem — a trust engine that collects, vets, and surfaces the hidden talent in every high-trust community. This spec transforms the website from a vertical-specific solution into a horizontal platform that looks, feels, and reads like the elite technical and design team built something genuinely world-changing. Not hype. Conviction.

---

## EXECUTIVE OVERVIEW

### The Core Story (Emotional Truth)
"In a church of 400 members, a single mother whose car breaks down on a Tuesday has no idea that three ASE-certified mechanics sit in her congregation every Sunday. She pays $800 at a chain shop. One of those mechanics would have done the work for the cost of parts and a cup of coffee. The gap is not caused by apathy. It is caused by invisibility. The skills exist. The needs exist. Nobody has built the bridge."

This story is the emotional north star. Every page, every section, every headline traces back to this moment.

### The Real Differentiation
TSI is "The Community Trust Engine" — the first-ever platform that turns community visibility into community capability. It is:
- **The Engine** powering filtered directory views across all seven Simpli-FI storefronts via API
- **The Front Door** at thestewardshipinitiative.org where anyone can search unfiltered
- **The Vetting System** that makes communities (church, fire department, family office, municipality) trustworthy
- **The Three-Layer Opportunity**: Every provider in the directory is a resource AND a potential wealth management client

### Revenue Architecture
TSI is profitable on its own (Freemium model: Free tier → Growth $29/mo → Enterprise), but its real value is the funnel it builds:
1. Community leader uses TSI to organize members → sees value
2. Community leader upgrades to Growth plan
3. TSI surfaces provider profiles to Opus Familiae (family season advisors) and Blue Collar Family Office (first responder specialists)
4. Providers get exposure, community leaders get data, Simpli-FI Alpha gets new RIA clients

**Scoreboard**: #1 ranked venture. $4.2B TAM. 8-14 months to $10K/mo MRR.

### Seven Storefronts, One Engine
Every storefront reads differently but runs on the same TSI infrastructure:

1. **Public TSI Platform** (thestewardshipinitiative.org) — Anyone, anywhere, unfiltered search
2. **Church Partner Pages** (e.g., villagechurch.thestewardshipinitiative.org) — Congregation skills + nonprofits
3. **Blue Collar Family Office** (via RTS API) — First responder specialists (firefighters, EMTs, PD, military)
4. **Opus Familiae** (via OF API) — Family season advisors for life transitions (caregiving, loss, relocation, business sale)
5. **Curate Learning** (via Learning Odyssey API) — Education resources and tutoring
6. **Made Local / Local Goods** — Artisans, farmers, makers, local production
7. **Municipal Resource Hub** — City/county community resources, nonprofits, crisis services

### Two Directories
- **For-Profit**: Professional services, trades, local goods/makers, skilled services (Tier 1 verified)
- **Non-Profit**: Food pantries, crisis counseling, housing assistance, community centers (Tier 1 verified)

### The Three-Layer Value Proposition
This is what goes in every relevant section. This is the economic moat:

**Layer 1**: TSI connects members with members → community becomes functional → retention improves
**Layer 2**: Admin features in Simpli-FI Admin help providers manage their back office (scheduling, payments, contracts)
**Layer 3**: Simpli-FI Alpha advisors reach out to high-net-worth providers identified in the directory → new RIA relationships

### Vetting Architecture (Critical for Trust)

**Tier 1: Platform Verification** (Every listing)
- Identity verified (name + email)
- Background check (if applicable)
- Business license/credentials (if professional)
- Insurance documentation (if service provider)

**Tier 2: Community Endorsement** (Trust signal)
- Minimum 1 endorsement from verified community member
- Endorsement includes specific skill/service comment
- Display: "Endorsed by [Name] from [Community]"

**Tier 3: Specialty Designations** (Earned badges)
- **First Responder Specialist**: Verification for firefighters, police, military, EMS working with RTS ecosystem
- **Family Season Advisor**: Training completion for Opus Familiae network advisors
- **Community Impact Partner**: Minimum 10 community endorsements + activity history
- **Local Steward**: Made Local verified artisan/maker with physical storefront or production proof

---

## DESIGN SYSTEM — "GARDEN OF EDEN"

### Color Palette (Sacred — Do Not Modify)
```
Primary Colors (Lush & Vibrant):
- eden-jungle: #022C22    (Deep forest green, trust, growth, sanctuary)
- eden-lush: #033F32      (Slightly lighter green, secondary emphasis)
- eden-tidal: #26A69A     (Teal accent, water/connection, secondary CTA)
- eden-hibiscus: #D90368  (Hot pink, urgency, emotional moments)
- eden-marigold: #FDB833  (Warm gold, joy, accomplishment, primary CTA)

Supporting Colors:
- eden-orchid: #FDFDFF   (Off-white, readability)
- eden-redwood: #A44A3F  (Deep terracotta, rare emphasis/warnings)
- sage: #4A7C6F          (Muted green, tertiary text)
- mist: #E8F0ED          (Barely there green tint, backgrounds)
- cream: #FFF9F0         (Warm off-white, light backgrounds)
```

### Typography (Sacred)
- **Display**: Playfair Display (all headlines, h1-h3, calls-to-action text)
- **Body**: Inter (all body copy, metadata, UI labels)

### Personality & Motion
- **Visual**: Lush, living, organic. Dark backgrounds (#022C22) with vibrant botanical accents. Sacred but not stuffy. Breathes with space and light.
- **Animation**: ConstellationCanvas particle system (homepage hero). Scroll-triggered reveals. Subtle glow effects. Animated counters. Float animations on decorative elements.
- **Hierarchy**: Dark + saturated = important. Light + desaturated = supporting.

### Visual Language
- Cards use **glassmorphism**: `backdrop-blur-md bg-eden-lush/40 border border-eden-tidal/10`
- Backgrounds layer: base color + grain overlay (2-3% opacity) + radial glow (5-8% opacity behind key sections)
- Icons are custom SVG, monoline style, eden-tidal primary color
- Hover states: color shift + lift + subtle glow
- Loading states: breathing animation (0-100% opacity, 2s ease-in-out infinite)
- Empty states: illustration + warm, invitational copy

---

## PHASE 1: HOMEPAGE — THE TRANSFORMATION

This is the front door to the TSI vision. It is a **narrative journey** that takes the visitor from problem → possibility → proof → action. Every section is choreographed. Every word earns its place.

### Hero Section (Keep the Spirit, Enhance Everything Else)

**What Stays:**
- ConstellationCanvas particle animation (dark background, nodes connecting, representing invisible networks becoming visible)
- Heartbeat animation on the word "Heart"

**What Changes:**
- Headline reframe (from "Discover the Heart" → something that conveys the larger mission)
  - **NEW HEADLINE**: "The Skills That Connect Your Community Are Already Inside."
  - **Subheadline**: "TSI helps every community discover, vet, and activate the hidden talent sitting right beside them."
  
- Tagline positioning: Center the constellation and text in the full viewport. The animation is the message.

- Scroll indicator (subtle animated chevron): "Scroll to explore" in eden-marigold

- Dual CTAs (repositioned):
  - **Primary (eden-marigold button)**: "See a Live Directory" → `/directory/village-church`
  - **Secondary (outline button)**: "For Church Leaders" → `/for-churches`
  - Beneath: "Or explore other communities" → dropdown showing link options (Fire Dept, Local Makers, Nonprofits, etc.)

- Trust bar (below fold, subtle): "Trusted by churches, nonprofits, fire departments, and family offices across Texas" with simple icon row

---

### Section 2: THE PROBLEM (The Emotional Hook)

**Headline** (Playfair, text-5xl, centered, eden-jungle):
"Your Community Is Full of Hidden Talent. And Nobody Knows It."

**Lead Copy** (Inter, text-lg, centered, max-w-3xl, eden-gray):
> Every Sunday morning in churches across America. Every shift change at fire stations. Every neighborhood in every city. Somewhere right now, a retired electrician is frustrated because he can't find meaningful ways to serve. Somewhere, a single mother is paying $800 at a chain shop for work that would cost $200 if she knew the mechanic in her congregation. Somewhere, a business owner is drowning during tax season while a CPA sits three rows back completely unaware.
>
> They never connect. Not because they don't care — but because there's no way to know.

**Design Layout**:
- Full-width section: eden-jungle background + subtle glow-hibiscus effect behind text
- Text is center-aligned, generous typography (line-height-relaxed)
- Below copy: **Three Stat Cards** (stagger-reveal animation on scroll)

**The Stats** (Animated counters):
```
Card 1: "1 in 4"
Stat: Church members feel disconnected from their congregation
Attribution: (Barna Group, 2024)

Card 2: "76%"
Stat: Of church members say they'd serve more if they knew what was needed
Attribution: (Gallup Engagement Study)

Card 3: "$2.3T"
Stat: Hidden economic value in untapped community services annually (US churches)
Attribution: (Christian Community Development Association estimate)
```

**Card Design**:
- Each card: `eden-glass` style with `glow-marigold` effect
- Number (Playfair, text-5xl, eden-marigold) appears with a subtle scale-up animation as counter reaches target
- Description (Inter, text-sm, eden-gray) below
- Cards sit on a 3-column grid (desktop) / stack vertically (mobile)
- On scroll into view: counters animate from 0 to final number over 2 seconds (ease-out)

**Emotional Anchor** (below stats, italic, eden-sage):
> "The gap is not caused by apathy. It is caused by *invisibility*. The skills exist. The needs exist. Nobody has built the bridge — until now."

---

### Section 3: THE VISION (The Possibility)

**Headline** (Playfair, text-4xl, eden-jungle):
"What If Every Gift Found Its Purpose?"

**Copy** (Inter, text-lg, max-w-2xl):
> Imagine a congregation where asking for help is as natural as offering it. Where the retired teacher mentors the homeschool family. Where the contractor builds the widow's ramp before she even has to ask. Where the counselor speaks quietly to the overwhelmed single parent. Where skills are visible. Needs are met. And everyone serves.
>
> That's not a fantasy. It's what happens when you make the invisible visible.

**Design Layout**:
- Two-column layout (desktop) / stacked (mobile)
- **Left column**: "Before TSI" visualization
  - Scattered, disconnected dots of light in deep green darkness
  - Some dots glowing faintly (marigold), others completely dim (gray)
  - Tooltip-style labels on a few dots: "Plumber (hidden)", "Counselor (unknown)", "Teacher (invisible)"
  - Title above: "The Gap: Hidden Resources"

- **Right column**: "After TSI" visualization
  - Same dots now connected by thin, glowing teal lines forming a beautiful web
  - Warmth radiating from connection points
  - Dots are brighter (marigold where they're featured, tidal where they're secondary)
  - Title above: "The Bridge: Activated Network"
  - Subtle parallax: as you scroll, both visuals shift slightly upward

- Between columns: Arrow or flow indicator showing transformation

**Background**: Gradient from eden-jungle (left) to eden-lush (right), subtle and understated

---

### Section 4: HOW IT WORKS (Three Simple Steps)

**Headline** (Playfair, text-4xl, centered, eden-jungle):
"Three Steps. One Afternoon. A Connected Community."

**Design Layout**:
- Horizontal 3-column flow (desktop) / vertical stack (mobile)
- Connecting dashed line between steps (eden-tidal/30 opacity)

**Step 1: "Set Up Your Directory"**
- **Icon** (SVG, eden-tidal): Seedling/plant sprouting, 48x48
- **Step badge** (Playfair, text-6xl, eden-marigold/20 opacity, behind icon): "1"
- **Title** (Playfair, text-2xl, eden-jungle): "Set Up Your Directory"
- **Copy** (Inter, text-sm, eden-sage): "We create your branded directory page in minutes. Your logo, your colors, your community's identity. No technical knowledge required."

**Step 2: "Invite Your Members"**
- **Icon** (SVG, eden-tidal): Connected people / network nodes, 48x48
- **Step badge**: "2" (eden-marigold/20)
- **Title** (Playfair): "Invite Your Members"
- **Copy**: "Share a simple link via email or your newsletter. Members add their name, photo, and the skills they're willing to share. No app to download. No training required. Approval takes 30 seconds."

**Step 3: "Watch Connections Happen"**
- **Icon** (SVG, eden-tidal): Heart with sparkles, 48x48
- **Step badge**: "3"
- **Title** (Playfair): "Watch Connections Happen"
- **Copy**: "Members search by skill, reach out directly, and start serving each other. You see all activity in your dashboard. Track what's working. Learn what your community needs."

**Below Steps**: 
- Full-width CTA button (btn-primary, eden-marigold, large): "Start Free — No Credit Card Required"
- Subtext beneath button: "Setup takes 15 minutes. Unlimited members. Cancel anytime."

---

### Section 5: LIVE PRODUCT PREVIEW (Proof of Concept)

**Headline** (Playfair, text-4xl, eden-jungle):
"See It in Action"

**Subheadline** (Inter, text-lg, eden-sage):
"The Village Church in Denton, Texas launched their directory in one afternoon. This is what it looks like."

**Design Layout**:
- Center a **styled mockup** (NOT an iframe) of the Village Church directory
- The mockup shows:
  - Header with church logo + "Village Church Directory" + member count badge (63 members)
  - Search bar prominently featured
  - Skill filter pills horizontally scrollable (Plumber, Counselor, Teacher, Contractor, etc.)
  - 6-cell grid of member cards:
    - Photo (with subtle glow on hover)
    - Name (Playfair bold)
    - Title/Role (Inter, gray)
    - 2-3 skill tags
    - "Available" or "Featured" badge
  - Card hover effect: card lifts, photo color-shifts, subtle glow appears

- **Below the mockup**: Testimonial card
  - Layout: Photo (48x48, circular) + quote + attribution
  - Quote: "We discovered 47 skills we didn't know existed in our congregation. In the first week alone, three members connected to help each other with real needs. This is what the church is supposed to be."
  - Attribution: "— Pastor David Mitchell, The Village Church, Denton TX"
  - Design: `eden-glass` card with eden-marigold left border accent (4px)

- **CTA below testimonial**: "Explore the Live Directory →" (text link, eden-marigold, arrow animates right on hover)

- **Background**: Subtle glow-tidal effect behind the mockup section

---

### Section 6: THE TRUST SYSTEM (3-Tier Vetting)

**Headline** (Playfair, text-4xl, eden-jungle):
"How TSI Builds Trust"

**Subheadline** (Inter, text-lg, eden-sage):
"Every listing goes through three levels of verification. So leaders can trust what they find."

**Design Layout**:
- **Vertical flow** (stacked on all screen sizes for clarity)
- Three **verification cards**, each with icon, title, description

**Tier 1: Platform Verification** (Blue/Teal emphasis)
- **Icon** (SVG, eden-tidal): Shield with checkmark, 64x64
- **Title** (Playfair, text-xl): "We Verify"
- **Copy** (Inter, text-sm): "Identity check. Background screening. License verification for professionals. Insurance documentation for service providers. Nobody gets listed without meeting these standards."
- **Badge**: "Required for every listing" (eden-tidal/20 background, eden-tidal text)

**Tier 2: Community Endorsement** (Gold emphasis)
- **Icon** (SVG, eden-marigold): Person + heart, 64x64
- **Title** (Playfair): "Your Community Endorses"
- **Copy**: "Real people from real communities vouch for this person. At least one verified community member has endorsed their skill and character. You can see who endorsed them and what they said."
- **Badge**: "Builds trust signals" (eden-marigold/20 background)

**Tier 3: Earned Designations** (Hibiscus emphasis)
- **Icon** (SVG, eden-hibiscus): Star + badge, 64x64
- **Title** (Playfair): "Specialty Designations (Earned)"
- **Copy**: "First Responder Specialist. Family Season Advisor. Community Impact Partner. Local Steward. These badges show someone has gone deeper — training, verification, consistent activity. They've earned them."
- **Badge types shown**: 4 small badge examples arranged in a row (icons only, one in each color)

**Below tiers**: 
- Text link: "How do I earn a designation?" → `/help/designations`

---

### Section 7: SEVEN STOREFRONTS, ONE ENGINE (The Platform Story)

**Headline** (Playfair, text-4xl, eden-jungle):
"One Engine, Seven Storefronts"

**Subheadline** (Inter, text-lg, eden-sage):
"TSI powers community directories across every kind of organization and every kind of need."

**Design Layout**:
- **Grid layout**: 2x3 grid on desktop (6 storefronts) + 1 full-width below (7th)
- Actually, rethink: 2 rows of 3, then final row, then a 7th full-width card at bottom
- OR: Horizontal carousel (mobile-friendly) that scrolls through all 7

**Card Style for Each Storefront**:
- `eden-glass` card with header color unique to each storefront
- Icon (SVG, 48x48, unique per storefront)
- Name (Playfair, text-lg)
- Description (Inter, text-sm, one sentence)
- Tag showing vertical (e.g., "Community" or "Family" or "Local")

**Storefronts**:

1. **Public TSI Platform**
   - Icon: World/globe
   - Description: "Anyone can search unfiltered. Professional services, trades, makers, nonprofits — all organized by skill."
   - Color accent: eden-tidal

2. **Church Partner Pages**
   - Icon: Church building
   - Description: "Congregation skills + nonprofits. Every church gets their own branded directory page."
   - Color accent: eden-hibiscus

3. **Blue Collar Family Office**
   - Icon: Firefighter helmet / badge
   - Description: "First responders — firefighters, EMTs, police, military. Specialists who understand the first responder life."
   - Color accent: eden-marigold

4. **Opus Familiae Network**
   - Icon: Family silhouettes
   - Description: "Family season advisors for life transitions. Caregiving, loss, relocation, business sale. Guidance when families need it most."
   - Color accent: sage

5. **Curate Learning**
   - Icon: Books / mortarboard
   - Description: "Tutors, mentors, education specialists. Connecting families with trusted educators and skill-builders."
   - Color accent: eden-orchid

6. **Made Local**
   - Icon: Artisan hands / paintbrush
   - Description: "Artisans, farmers, makers. Verified local producers of goods, crafts, food, and services."
   - Color accent: eden-redwood

7. **Municipal Resource Hub** (full-width card below)
   - Icon: City buildings
   - Description: "City and county community resources. Nonprofits, crisis services, government programs — searchable by category and location."
   - Color accent: mist

**Call-Out Below Storefronts**:
- Text (Inter, centered): "Each storefront has different branding and UI, but all run on the same TSI engine. One vetting system. One API. One infrastructure layer serving the entire Simpli-FI ecosystem."

---

### Section 8: FOR COMMUNITIES VS FOR PROVIDERS (Two Value Props)

**Design Layout**:
- **Two-column split** (desktop) / tabs (mobile)
- Left column: "For Communities" + Right column: "For Providers"
- Each column has its own hero, benefits, and CTA

**LEFT COLUMN: FOR COMMUNITIES**

**Headline** (Playfair, text-3xl, eden-jungle):
"For Church Leaders & Community Organizers"

**Subheadline**: "Activate the gifts sitting in your pews."

**Benefits List** (6 bullet points):
1. **Discover Hidden Skills** — See exactly what your members can do. No more guessing.
2. **Build Stronger Connections** — Members find each other and serve naturally.
3. **Free to Start** — No credit card required. No time limit on the free tier.
4. **Branded for Your Community** — It's your logo, your name, your colors.
5. **Safe & Controlled** — You approve every member before they appear in the directory.
6. **Data You Own** — Your directory, your data. Export anytime. Cancel anytime.

**Design**: Each benefit as a simple text item with a left accent bar (eden-marigold)

**CTA Button**: "Start Free for Your Community" (btn-primary, eden-marigold)

**RIGHT COLUMN: FOR PROVIDERS**

**Headline** (Playfair, text-3xl, eden-jungle):
"For Service Providers & Skilled Professionals"

**Subheadline**: "Get discovered by the communities that trust you."

**Benefits List** (6 bullet points):
1. **Get Found** — Appear in communities where you already live and work.
2. **Earn Endorsements** — Real people vouching for your work. Real trust.
3. **Free Listing** — No upfront cost to create a profile. No hidden fees.
4. **Premium Visibility** — Upgrade to premium for $19/mo to be featured prominently.
5. **Lead Tracking** — See who's contacting you and what they need. Simple CRM.
6. **Three-Layer Opportunity** — Services → Community Leader → Potential Wealth Client. 🎯

**Design**: Same as left column

**CTA Button**: "Create a Free Provider Profile" (btn-secondary)

---

### Section 9: HORMOZI VALUE STACK (The Offer)

**Headline** (Playfair, text-4xl, centered, eden-jungle):
"Everything You Need to Connect Your Community (Without the Price Tag)"

**Visual Design**: Looks like a "receipt" or value stack. Centered, single column, ~500px max width.

**The Stack**:
```
┌─────────────────────────────────────────────┐
│ WHAT YOU GET                    VALUE      │
├─────────────────────────────────────────────┤
│ Branded community directory    $500/yr     │
│ Unlimited member profiles      $300/yr     │
│ Skill search & filtering       $200/yr     │
│ Admin dashboard & analytics    $400/yr     │
│ Member approval workflow       $200/yr     │
│ SEO-optimized public listing   $300/yr     │
│ Email notifications            $100/yr     │
│                                            │
│ TOTAL VALUE:                   $2,000/yr   │
│ ⚠️ Strike through the $2,000               │
│                                            │
│ YOUR PRICE (Growth Plan):      $348/yr     │
│ (That's $29/mo)                            │
│                                            │
│ OR START FREE:                 $0          │
│ (Unlimited time limit)                     │
└─────────────────────────────────────────────┘
```

**Design Details**:
- Each line item is a simple table row
- Left side: item name (Inter, medium weight)
- Right side: dollar value (Inter, lighter, strikethrough once you hit "TOTAL VALUE")
- "TOTAL VALUE" line: eden-marigold text, slightly larger
- "YOUR PRICE (Growth Plan)" line: BIG text, eden-marigold, text-4xl, Playfair
- "OR START FREE" line: eden-tidal text, text-2xl, Playfair, slightly smaller than YOUR PRICE

**Below the stack** (Risk reversal copy, centered, italic, eden-sage):
> "The free tier has no time limit. Upgrade when you're ready. No credit card required to start. Cancel your subscription anytime."

**CTAs Below** (Side by side, desktop; stacked, mobile):
- **Left CTA**: "Start Free" (btn-primary, eden-marigold, large)
- **Right CTA**: "View Full Pricing" (btn-secondary, text-tidal, large)

---

### Section 10: OBJECTION HANDLING ("But What About...")

**Headline** (Playfair, text-3xl, eden-jungle):
"Real Questions Answered"

**Design Layout**: Accordion-style, but styled as a conversation, not corporate FAQ

**Accordion Items** (6 objections):

1. **"We already have a church directory."**
   > Photo directories show faces. This shows *gifts*. Knowing someone's name is nice. Knowing they're a licensed plumber when your baptistry is leaking — that's stewardship. That's what the church is supposed to be.

2. **"Our members aren't tech-savvy."**
   > If they can fill out a Google Form or join a group text, they can join your directory. No app to download. No account to create. Just a name, a photo, and the skills they're willing to share. We handle the complexity. They just show up.

3. **"We're a small church — do we really need this?"**
   > Small churches benefit *most*. In a church of 80 members, the odds that someone has exactly the skill another member needs are surprisingly high. You just need a way to find out. Plus, TSI is free to start. If it's not useful, delete it.

4. **"What about privacy? Won't people be wary of sharing their info?"**
   > Members control what they share. Your directory can be public (great for SEO and visitors) or private (members-only with a login). You approve every profile before it goes live. And we never share data with third parties. Not even us.

5. **"How is this different from a Facebook group?"**
   > Facebook buries posts in an algorithm. Your directory is searchable, organized by skill, always available. It's a living resource, not a feed that disappears. And it's on your church's site, not Meta's.

6. **"What if someone misrepresents their skills?"**
   > That's why community endorsements matter. Someone vouching for this person creates accountability. Plus, your admin dashboard shows all activity. If someone is disruptive or dishonest, you remove them. You're in control.

**Design**:
- Each accordion item opens/closes smoothly
- When open: question in eden-jungle (Playfair, bold), answer in eden-sage (Inter, relaxed)
- Left border accent (eden-marigold) on open state
- Subtle glow effect on the accordion item when open

---

### Section 11: FINAL CTA (The Emotional Close)

**Headline** (Playfair, text-5xl, centered, eden-jungle):
"Your Congregation's Greatest Resource Is Already Sitting in the Pews."

**Subheadline** (Inter, text-2xl, centered, eden-sage):
"Help them find each other."

**Design Layout**:
- Full-width section with constellation background element (SVG or simplified particle system showing connected dots, subtle, not as pronounced as hero)
- Center all text
- Generous breathing room (padding-y: 24 or more)
- Background: eden-jungle with subtle glow-tidal effect

**Below subheadline**:
- Large CTA button: "Bring TSI to Your Community — Free" (btn-primary, eden-marigold, extra large, 56px height)
- Subtext below button: "Setup takes 15 minutes. No credit card required."
- Trust element below that: 🔒 icon + "Your data is yours. Always." (eden-sage, text-sm, italic)

---

### Section 12: Footer (Enhanced)

**Structure** (4 columns on desktop, stacked on mobile):

**Column 1: About TSI**
- TSI logo + "The Community Trust Engine"
- Tagline: "Making invisible networks visible."
- Subtext: "A Simpli-FI Venture"

**Column 2: Quick Links**
- Directory Demo
- Pricing
- Blog
- Get Started
- For Providers

**Column 3: Resources**
- Help Center
- Privacy Policy
- Terms of Service
- API Docs
- Status Page

**Column 4: Stay Connected**
- Newsletter heading: "Church Leadership Insights Weekly"
- Email input field (inline)
- Subscribe button (eden-marigold)
- Social links (Twitter/X, LinkedIn, Instagram)

**Bottom Bar**:
- Left: "© 2026 The Stewardship Initiative. All rights reserved."
- Center: "Made with conviction in Denton, Texas"
- Right: "Part of the Simpli-FI Ecosystem"

---

## PHASE 2: COMMUNITY JOURNEY PAGES

### /for-churches (B2B Church Landing Page)

This is the **dedicated sales page** for church administrators, pastors, and community directors. The homepage tells the story. This page closes the deal.

**Page Structure** (Hormozi + StoryBrand):

#### Hero
**Headline**: "The Skills Directory Your Church Has Been Missing"
**Subheadline**: "Join 1+ churches transforming their congregation in one afternoon"
**Visual**: Hero image showing a diverse congregation in worship (warm light, inviting)
**CTA**: "Start Free Now" + "Watch 2-min demo"

#### Video Section
**Heading**: "See It in Action"
**Placeholder**: "Watch how The Village Church set up their directory in 15 minutes"
(Video to be created later. Design a 16:9 responsive video container with play button overlay.)

#### Before/After Section
**Left Column: WITHOUT TSI**
- Headline: "Before: The Hidden Economy"
- Bullet points (in red/muted):
  - Members don't know what skills exist in the congregation
  - Unmet needs go unmet because nobody knows who can help
  - Potential volunteers don't know where they're needed
  - Admin scrambles to coordinate help

**Right Column: WITH TSI**
- Headline: "After: The Visible Network"
- Bullet points (in green/marigold):
  - Members find each other based on real skills
  - Needs get met within hours, not weeks
  - Volunteers know exactly where they're needed
  - Admin dashboard tracks connections and impact

#### Features Deep Dive
6 features, each with:
- Feature icon (SVG, eden-tidal)
- Feature name (Playfair, text-xl)
- Description (Inter, text-sm)
- Benefit highlight (eden-marigold accent)
- Screenshot/mockup of the feature in action

Features:
1. **Branded Directory Page** — Your church's name, logo, colors. Shows your unique community.
2. **Simple Member Invites** — Email + text. No training. Members add themselves in 2 minutes.
3. **Skill-Based Search** — Find plumbers, counselors, teachers, contractors. Exactly what your community has.
4. **Endorsement System** — Members vouch for each other. Real trust.
5. **Admin Dashboard** — See all activity, member count, trending skills, connection frequency.
6. **Mobile-First Design** — Works perfectly on phones. Your members live on their phones.

#### Case Study: Village Church
**Section Headline**: "Real Results from Real Churches"

**Testimonial Structure**:
- Large quote (Playfair, text-2xl, eden-hibiscus)
- Quote: "We discovered 47 skills we didn't know existed. Three members connected to help each other in the first week. This is what the church is supposed to be."
- Attribution: Pastor David Mitchell, The Village Church
- Headshot: 64x64 circular photo

**Stats Below Quote** (animated counters):
- "47 skills discovered" + icon
- "3 connections in week 1" + icon
- "100% adoption rate" + icon (18 members out of 18 invited)

#### Pricing Table (Embedded)
Show the three church-relevant tiers:
- **Free**: Unlimited members, basic dashboard, public directory
- **Growth** ($29/mo): Everything in Free + analytics, email notifications, priority support
- **Enterprise** ($99+/mo): White-label, custom integrations, API access, SLA

#### FAQ Section (Accordion)
Church-specific questions:
- "How long does setup take?" → 15 minutes
- "Can we control who sees the directory?" → Yes, public or members-only
- "What if a member isn't tech-savvy?" → They just fill out a simple form
- "Can we delete the directory later?" → Yes. Your data is always yours.

#### Final CTA
**Headline**: "Your Church Already Has Everything It Needs. It Just Needs to Be Seen."

**CTA Button**: "Start Your Church Directory Free" (btn-primary, large)

**Subtext**: "No credit card. No setup fee. Unlimited members. Cancel anytime."

---

### /for-providers (B2C Provider Landing Page)

For individual service providers, tradespeople, professionals, and skilled community members.

**Page Structure**:

#### Hero
**Headline**: "Get Found by Your Community"
**Subheadline**: "Create a free profile. Get discovered. Build trust."
**Visual**: Headshot of a happy service provider or artisan (warm, genuine)
**CTA**: "Create Free Profile" + "See Examples"

#### Why List on TSI
**3 Key Reasons** (cards):
1. **Get Discovered** — Appear in communities where you already live and work. No ads. No cold calling.
2. **Build Trust Fast** — Endorsements from real community members create credibility you can't buy.
3. **Three-Layer Opportunity** — Your service gets you connected with a community leader who might become a wealth management client.

#### Create a Profile (Step-by-Step)
**Heading**: "It Takes 5 Minutes"

Three steps:
1. **Basic Info** — Name, photo, email, phone
2. **Skills & Services** — What you offer, price range, availability
3. **Go Live** — Community admin approves your profile. You're live.

#### Example Profiles
Show 3-4 real examples of well-filled provider profiles from the Village Church or other communities.

#### Trust & Safety
**Heading**: "How We Keep Everyone Safe"

Three points:
- Community admins verify every provider
- Endorsements build accountability
- Clear rating/review system (coming soon)

#### FAQ
- "What's the cost?" → Free to list. Premium features coming at $19/mo.
- "What communities are on TSI?" → Start with churches, adding fire departments, local artisans, and more.
- "How do I get paid?" → That's between you and the client. We don't handle payments.

#### Final CTA
**Headline**: "Your Skills Deserve to Be Visible"

**CTA**: "Create Your Free Profile" (btn-primary)

---

### /for-first-responders (Blue Collar Family Office Landing Page)

For firefighters, EMTs, police officers, military personnel, and their families.

**Page Structure**:

#### Hero
**Headline**: "Specialists Who Understand Your Life"
**Subheadline**: "First responder advisors. Family season guides. When you need help, someone who *gets it* is right there."
**Visual**: Firefighters in action or first responder family moment (warm, respectful)
**CTA**: "Explore First Responder Specialists" + "Schedule Consultation"

#### The First Responder Journey
**Section**: Different life stages with specialists who understand:
- **New to the Force**: Onboarding advisors who help with PTSD, family adjustment
- **Career Growth**: Advancement planning, parallel income strategies
- **Family Transitions**: Spouse career changes, childcare, education planning
- **Burnout / Career End**: Transition planning, business opportunities for ex-first responders
- **Loss & Trauma**: Grief counseling specialists trained in first responder culture

#### Specialist Types
- Mental health professionals trained in first responder trauma
- Financial advisors who understand pension/benefits structures
- Career counselors for second careers
- Family counselors experienced with first responder families
- Business advisors for moonlighting and post-career entrepreneurship

#### How It Works
**Heading**: "Find Your Specialist"

1. **Search by Need** — "PTSD support", "career planning", "spouse career coaching", etc.
2. **See Credentials** — Verified specialists with first responder training
3. **Connect Direct** — Message or call the specialist directly
4. **Get Help** — Pay out-of-pocket or use your insurance (varies by provider)

#### Testimonial
Quote from a fire captain or police officer about finding the right specialist

#### CTA
**Headline**: "Your Family Deserves Specialists Who Understand."

**Button**: "Find Your Specialist" (btn-primary)

---

### /for-nonprofits (B2B Nonprofit Landing Page)

For food banks, crisis counseling centers, housing nonprofits, community centers, development programs, and community housing initiatives.

**Page Structure** (similar to /for-churches but tailored to nonprofit context):

#### Hero
**Headline**: "Making Invisible Resources Visible for Those Who Need Them Most"
**Subheadline**: "TSI connects people in crisis with vetted community resources — free, fast, and without the runaround."
**CTA**: "List Your Organization Free"

#### Problems Nonprofits Face
- People in crisis don't know about available services
- Services are listed across multiple platforms, outdated databases
- Volunteers don't know where help is most needed
- Hard to track what services are being used
- Development programs for adults and youth lack visibility in their communities
- Community housing projects struggle to reach the families they exist to serve

#### Solutions TSI Provides
- Searchable nonprofit directory (food pantries, counseling, housing, development programs, etc.)
- Public + private listing options
- Volunteer coordination
- Analytics on usage and impact
- Free listings for all nonprofit and community-serving organizations (always)
- Integration with church partner pages so congregations can surface relevant nonprofits to their members

#### Pricing
(Nonprofit listings are always FREE. Premium analytics and custom branding available on Growth tier.)

---

### /community-programs (TSI's Own Benevolent Mission)

TSI is not just a directory platform. TSI has its own mission: making invisible resources visible so that families in need can access what they cannot find alone. This page showcases the benevolent programs that TSI either operates, incubates, or actively supports.

**Page Structure:**

#### Hero
**Headline** (Playfair, text-5xl): "Beyond the Directory: Building What's Missing"
**Subheadline** (Inter, text-lg): "Some communities don't just need a better directory. They need resources that don't exist yet. TSI builds them."
**Background**: eden-jungle with eden-marigold glow behind headline

#### Program Cards (Grid — 3 across desktop, stack mobile)

Each card: eden-glass style, icon + title + 2-sentence description + "Learn More" link

**Card 1: Adult Development Programs**
- Icon: Rising chart / person growing
- Description: "Workforce readiness, financial literacy, mentorship matching, and life skills for adults rebuilding or starting over. Partnering with local employers and churches to create real pathways."
- Status badge: "In Development"

**Card 2: Youth Development Programs**
- Icon: Seedling / young person
- Description: "Character formation, career exploration, fitness and discipline, and mentorship for young people ages 12-18. Built on the conviction that every young person deserves adults who invest in them."
- Status badge: "In Development"

**Card 3: Community Housing Projects**
- Icon: House with hands
- Description: "Connecting families with affordable housing resources, habitat builds, transitional housing, and community land trusts. Making safe housing visible and accessible."
- Status badge: "Research Phase"

**Card 4: Children's Boarding School**
- Icon: Academy / school building
- Description: "A long-term vision for a residential academy where children from difficult circumstances receive education, mentorship, and a stable foundation. Inspired by faith, built on stewardship."
- Status badge: "Vision Stage"

**Card 5: First Responder Agency Index**
- Icon: Badge / fire helmet
- Description: "The most comprehensive database of fire, police, and EMS agencies in the country — starting with Texas. Salary data, benefits, hiring status, and honest city guides for families considering relocation."
- Status badge: "Active — Building Now"

**Card 6: Local Makers & Growers Network**
- Icon: Hands crafting / farm
- Description: "Connecting communities with local artisans, farmers, and small-batch producers. Supporting the people who make things with their hands and grow food from the ground."
- Status badge: "Active — Building Now"

#### Closing Statement
**Text** (Inter, text-lg, centered, eden-sage italic):
> "TSI exists because some of the most important resources in a community are the ones nobody can see. Our job is to make them visible. And when they don't exist yet — to build them."

#### CTA
**Button** (eden-marigold): "Partner With Us" → contact/partnership form
**Secondary link**: "View the Full Directory" → /directory

---

## PHASE 3: DIRECTORY EXPERIENCE (Product UI Upgrade)

The directory at `/directory/[slug]` is the living product. It must feel premium and intentional.

### Directory Page Structure

#### Hero Banner
- Full-width background: org's hero_image_url (or beautiful fallback: gradient from eden-jungle to eden-lush)
- Organization name (Playfair, text-5xl, white text with shadow for readability)
- Tagline (if provided)
- Member count badge: "63 Members" (eden-marigold background, pill-shaped)
- About section (if provided by org admin)

#### Search & Filter Section
- **Search bar**: Prominent, centered, large input field
  - Placeholder: "Search skills, names, or specialties..."
  - Icon (magnifying glass, eden-tidal)
  - On focus: border changes to eden-marigold, subtle glow
- **Skill filter pills**: Horizontal scrollable row
  - Pill style: eden-glass with eden-tidal text when inactive
  - Active pill: eden-marigold background, white text
  - Each pill has an icon + skill name
  - Scrollable on mobile, visible all on desktop
- **View toggle** (right side of filters):
  - Grid icon (active by default)
  - List icon
  - Toggle between grid and list view

#### Member Cards (Grid View)
- 3 columns on desktop / 2 on tablet / 1 on mobile
- Card dimensions: ~280px width
- Card design:
  - Rounded corners (16px)
  - Photo at top (100% width, 200px height, object-cover)
  - Subtle glow on hover: eden-tidal/20 shadow
  - Name (Playfair, text-lg, bold, eden-jungle)
  - Title/Role (Inter, text-sm, eden-sage, if provided)
  - Bio snippet (Inter, text-xs, eden-gray, truncated to 2 lines)
  - Skills pills (3-5 displayed, eden-tidal background, eden-jungle text, 12px padding)
  - Badges (if applicable):
    - "Available" badge: eden-tidal background + pulsing animation (1s heartbeat)
    - "Featured" badge: eden-marigold background with star icon
  - Card footer: CTA button "Learn More" (eden-tidal text, no background, on hover: eden-marigold)
- Card hover effect: lift (transform: translateY(-4px)), shadow increases, color shift on photo (slight desaturation)

#### Member Cards (List View)
- Horizontal layout with photo on left (120x120)
- Name, title, bio, and 2-3 skills displayed
- Same badges and CTA as grid view

#### Member Detail Modal
- Full-screen on mobile, centered modal on desktop
- Large photo with gradient overlay at bottom (dark teal to transparent)
- Name overlaid at bottom of photo (Playfair, white text, text-4xl)
- Title below photo (Inter, eden-marigold)
- "Contact" button area (prominent, eden-marigold)
- Tabs: "About" / "Skills" / "Endorsements"

**About tab**:
- Full bio text (Inter, relaxed)
- Availability status
- Contact form button: "Request Service" → opens contact form modal

**Skills tab**:
- Full skills list (larger pills, more space)
- Year of experience (if provided)
- Certification badges (if applicable)

**Endorsements tab**:
- List of endorsements (if any)
- Endorser name + profile photo (small, circular)
- Endorsement text ("Great work on my bathroom renovation!")
- Date endorsed

#### Empty State
- If no members in directory yet:
  - Large illustration (SVG): seedling with connecting lines
  - Headline (Playfair, text-3xl): "No members yet, but it's coming!"
  - Copy (Inter, text-lg): "Your admin is inviting members to the directory. They'll appear here as they join. Check back soon!"
  - "In the meantime" CTA: "Learn about TSI" → link to homepage

#### Footer
- "Powered by TSI" badge (for free-tier orgs):
  - Logo + "The Community Trust Engine"
  - Link to thestewardshipinitiative.org
  - Subtle, bottom-right corner, not obnoxious
- Organization contact (if provided)

---

## PHASE 4: BLOG & CONTENT INFRASTRUCTURE

The blog is where SEO lives. It must look like a premium publication, not a template.

### Blog Index Page (`/blog`)

**Hero Section**:
- Large headline (Playfair, text-5xl): "Church Leadership Insights"
- Subheadline: "Strategies for connection, stewardship, and community."
- Search bar (optional but nice-to-have)

**Featured Article Card** (Full-width, large):
- Feature image (16:9 aspect ratio)
- Headline (Playfair, text-3xl, white text with shadow over image)
- Excerpt (2-3 sentences)
- Author byline + date
- "Read Article →" link
- Overlay: background gradient from transparent to dark for text readability

**Articles Grid** (Below featured):
- 2-column layout (desktop) / 1 column (mobile)
- Each card:
  - Feature image (16:9)
  - Category tag (eden-tidal background, eden-jungle text, 12px pill)
  - Headline (Playfair, text-xl)
  - Excerpt (Inter, text-sm, 2 lines max)
  - Author + date (Inter, text-xs, eden-gray)
  - "Read More →" link

**Sidebar** (Desktop only):
- **Categories**: Link list with article count (e.g., "Church Leadership (5)")
- **Popular Articles**: 3 most-viewed articles
- **Newsletter**: "Church Leadership Insights Weekly" + email field + subscribe button

### Blog Article Page (`/blog/[slug]`)

**Reading Experience**:
- Max-width: 650px (comfortable reading width)
- Font size: 18px (generous)
- Line height: 1.8 (relaxed)
- Paragraph spacing: 1.5em

**Article Header**:
- Hero image (full-width, 600px height)
- Category tag (eden-tidal)
- Headline (Playfair, text-4xl)
- Subheadline/excerpt (Inter, text-xl, eden-sage)
- Meta: Author byline (small circular photo + name) + publish date + reading time estimate
- Divider line (eden-tidal/20)

**Article Body**:
- Beautiful typography
- H2 and H3 subheadings (Playfair, eden-jungle)
- Bold text for emphasis (Playfair weight)
- Pull quotes (blockquote style): left border accent (eden-marigold, 4px), italic text, eden-sage color
- Inline images with captions
- Code blocks (if applicable): dark background (eden-jungle), monospace font, syntax highlighting

**Inline CTA Box** (Midway through article):
- Background: eden-glass
- Headline (Playfair, text-xl): "Discover TSI for Your Community"
- Copy: "Make this real for your church. Start free in 15 minutes."
- Button: "Start Your Directory" (btn-primary, eden-marigold)

**Article Footer**:
- Author bio: Photo (64x64 circular) + short bio + Twitter/LinkedIn links
- Share buttons: Twitter, Facebook, LinkedIn, Copy Link
- "Estimated reading time" + word count

**Related Articles** (3 articles):
- 3-column grid (desktop) / stacked (mobile)
- Same card design as blog index cards
- Headlines link to articles

**Newsletter Signup** (Full-width at bottom):
- Headline (Playfair): "Get More Insights Like This"
- Subheadline: "Church leadership strategies delivered weekly."
- Email input + "Subscribe" button

---

## PHASE 5: PROGRAMMATIC SEO PAGES

Generated automatically or via templates to capture long-tail search volume.

### Skill Pages (`/skills/[slug]`)

**Example URL**: `/skills/plumber`

**Page Structure**:
- Hero: Headline "Find a Plumber in Your Church"
- Explanation: Why plumbing is important in a church context (theological angle if appropriate)
- "Churches using TSI have discovered [X] plumbers across their communities"
- Related skills: "Also searching for: Electrician, HVAC Technician, etc."
- CTA: "Search for [Skill] in Your Community"
- JSON-LD schema for SEO

**Generate these for**:
- Professional services: Plumber, Electrician, HVAC, Carpenter, Contractor
- Financial: CPA, Tax Professional, Financial Advisor, Insurance Broker
- Health: Counselor, Therapist, Nurse, Doctor
- Education: Teacher, Tutor, Mentor
- Other skilled trades: Mechanic, Landscaper, Painter, Welder

~20-30 skill pages total.

### Category Pages (`/categories/[slug]`)

**Example URL**: `/categories/professional-services`

**Page Structure**:
- Hero: "Professional Services in Your Church"
- List of providers in that category across all communities
- Filter by community/location (if applicable)
- CTA: "List Your Service"

---

## PHASE 6: IMAGE GENERATION PROMPTS

Create `/docs/IMAGE-PROMPTS.md` with production-ready AI image prompts for Midjourney/FLUX.

### Needed Images

1. **Homepage Hero Background**
   - Prompt: "Overhead view of diverse congregation seated in wooden pews, warm golden light streaming through stained glass windows, soft focus, cinematic lighting, dark green color grading inspired by #022C22, peaceful and sacred, 16:9 aspect ratio"

2. **Section 2 Illustration: The Problem (Scattered Dots)**
   - Prompt: "Abstract illustration of scattered disconnected dots of light floating in deep green darkness (#022C22), some dots glowing soft gold, others dimly illuminated in teal, conveying isolation and hidden potential, minimal, digital art style, 3000x2000px"

3. **Section 3 Illustration: The Vision (Connected Network)**
   - Prompt: "Same abstract dots as above but now connected by thin glowing teal threads forming a beautiful intricate web pattern, warmth radiating from connection points in gold, sense of harmony and revelation, minimal, digital art style, 3000x2000px"

4. **Directory Preview Mockup**
   - Prompt: "Modern web interface design mockup showing dark-themed community directory with member profile cards featuring headshots, skill badges in teal and gold, search bar at top, professional UI design on deep green background #022C22, 1920x1080px, clean modern design"

5. **Blog Post: Skills Discovery**
   - Prompt: "Photograph of hands forming a circle, diverse group of people from different professions (plumber, teacher, counselor, contractor visible through their hands/work), warm golden hour lighting, depth of field, human connection, 16:9"

6. **Blog Post: Church Community**
   - Prompt: "Small group conversation in a modern church space, diverse congregation members smiling and engaged, warm natural lighting, coffee cups and casual comfort, authentic moment, 16:9"

7. **Blog Post: First Responders**
   - Prompt: "Firefighters or EMTs in action helping a community member, teamwork, trust, respect, warm golden lighting, professional documentation style, 16:9"

8. **Blog Post: Volunteer Service**
   - Prompt: "Group of volunteers of various ages serving food, building, or helping in community, genuine smiles, warm light, sense of purpose, 16:9"

9. **Blog Post: Leadership**
   - Prompt: "Church pastor or community leader looking thoughtful, warm portrait lighting, professional but approachable, in church interior, 16:9"

10. **Social Preview Card (og:image)**
    - Prompt: "The Stewardship Initiative logo with seedling/tree icon on deep green background (#022C22) with golden accent line, modern minimalist design, professional, 1200x630px, "The Community Trust Engine" text in modern sans-serif"

**Format**: Save all prompts in `/docs/IMAGE-PROMPTS.md` with:
- Image name/purpose
- Full prompt text
- Recommended dimensions
- Color palette notes
- Alternative versions (if applicable)

---

## PHASE 7: SCROLL ANIMATION & MOTION SYSTEM

### ScrollReveal Component Upgrade

```tsx
// components/ScrollReveal.tsx
'use client'
import { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number        // stagger delay in ms (0-500)
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  duration?: number     // animation duration in ms (300-1000)
  threshold?: number    // 0-1, how much of element must be visible (0.1-0.5)
  className?: string
  triggerOnce?: boolean // animate only once (default: true)
}

// Component: Uses IntersectionObserver to trigger animation on scroll
// Adds .reveal and .visible classes based on viewport position
// Smooth performance using CSS transitions + transform
```

### Animation Choreography (Homepage)

- **Hero**: No animation (instant, full-screen)
- **Section 2 (Problem)**:
  - Headline: fade-in on scroll (up direction, 800ms)
  - Copy: fade-in with 200ms delay
  - Stat cards: stagger in from left/right (each 100ms apart)
  - Counter numbers: count up to target value when card enters viewport

- **Section 3 (Vision)**:
  - Headline: fade-in
  - Left illustration (scattered dots): fade-in
  - Right illustration (connected dots): fade-in with 200ms delay, plus subtle parallax on scroll

- **Section 4 (How It Works)**:
  - Steps: stagger in from left to right, 100ms apart
  - Connecting line: draw animation (strokeDashoffset)

- **Section 5 (Product Preview)**:
  - Mockup: slide up from bottom with fade
  - Testimonial card: fade-in with 300ms delay

- **Section 6 (Trust System)**:
  - Tier cards: stagger in from top to bottom, 150ms apart

- **Section 7 (Storefronts)**:
  - Each storefront card: fade-in with slight scale-up, stagger 100ms apart
  - Cards are in a grid, so animation flows left-to-right, top-to-bottom

- **Section 8 (Value Prop Columns)**:
  - Left column: slide in from left
  - Right column: slide in from right (slightly delayed, 100ms)

- **Section 9 (Hormozi Stack)**:
  - Stack items: each line appears one by one as you scroll into view, 50ms apart
  - Total value and "Your Price" have a special highlight animation (glow effect)

- **Section 10 (Objections)**:
  - Accordion items: fade-in on scroll, stagger 75ms apart

- **Section 11 (Final CTA)**:
  - Background constellation dots: fade-in + subtle float animation
  - Headline: fade-in with 200ms delay
  - Button: fade-in with 400ms delay

---

## PHASE 8: ANIMATED COUNTER COMPONENT

```tsx
// components/AnimatedCounter.tsx
'use client'
import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  target: number
  duration?: number  // ms, default 2000
  suffix?: string    // '%', '/yr', etc.
  prefix?: string    // '$', etc.
  decimals?: number  // for decimal display
  start?: number     // default 0
  className?: string
  onComplete?: () => void
}

// Component behavior:
// - Initializes on page load (not on scroll — eager)
// - Actually: triggers when scrolled into viewport
// - Uses requestAnimationFrame for smooth animation
// - Easing function: easeOut (fast start, slow finish)
// - Applied to: homepage stats, pricing page numbers, case study numbers
```

**Usage Examples**:
```tsx
<AnimatedCounter target={47} suffix=" skills" />
<AnimatedCounter target={2000} prefix="$" suffix="/yr" />
<AnimatedCounter target={76} suffix="%" />
```

---

## PHASE 9: NEWSLETTER & EMAIL CAPTURE INFRASTRUCTURE

### On-Site Capture Points

1. **Homepage Footer**: Inline email field "Get church leadership insights weekly"
   - Input + button (eden-marigold)
   - Placeholder: "Your church email"
   - Button text: "Subscribe"

2. **Blog Sidebar** (Desktop): "Join 100+ church leaders getting weekly stewardship insights"
   - Email field + submit button
   - Subtext: "No spam. Unsubscribe anytime."

3. **Blog Article End**: Full-width CTA card
   - Headline: "Get More Insights Like This"
   - Copy: "Every week, a new strategy for building community and activating gifts."
   - Email field + button

4. **Exit Intent Modal** (Stretch goal, Phase 2):
   - Trigger: when cursor moves toward top of screen (attempts to exit)
   - Headline: "Before You Go..."
   - Copy: "Join church leaders getting practical insights weekly."
   - Email field + close button

5. **Pricing Page**: Post-CTA email gate
   - "Not ready to start? Get our free guide: 5 Ways to Activate Hidden Talent in Your Pews"
   - Email gate (email required to download PDF)

### Lead Magnet

**PDF Guide**: "The Pastor's Playbook: 5 Ways to Activate Hidden Talent in Your Church"
- **Location**: `/guide` (landing page) or direct PDF download
- **Format**: Beautiful PDF with Garden of Eden branding
  - Cover page (Playfair headline, TSI logo, warm hero image)
  - 8-10 pages of actionable content
  - Each strategy: headline + explanation + how-to + real example
  - Final page: CTA to start TSI free trial + contact info
- **Delivery**: Auto-email via MailerLite after signup
- **Sequence**: Lead Magnet → Welcome Email → Weekly Newsletter starts

### Email Templates (MailerLite HTML)

**Welcome Email**:
- Subject: "Your guide is ready — plus, here's what thousands of churches are already doing"
- Design: Garden of Eden branded, warm pastoral tone
- Body: Download link + brief note about the 5 ways + "This week on the blog" CTA
- Footer: Social links + unsubscribe

**Weekly Newsletter**:
- Subject line varies week to week (never spammy)
- Header: TSI logo + "Church Leadership Insights"
- Featured article: title + excerpt + CTA
- "This week's highlight": 2-3 bullets from recent blog posts
- Featured provider: one provider from a community (randomized)
- CTA: "Start your community directory" (if not already customer)
- Footer: social + unsubscribe + preference center

---

## EXECUTION PRIORITY & TIMELINE

### Phase 1: Homepage (Critical Path)
- Estimated effort: 40-50 engineering hours
- When done: /sessions/relaxed-lucid-cori/mnt/Lott Family/Projects/.../tsi-next/app/(marketing)/page.tsx
- Quality gates: 
  - Lighthouse 95+ on desktop
  - 90+ on mobile
  - All animations smooth at 60fps
  - No CLS (Cumulative Layout Shift)

### Phase 2: Community Journey Pages (High Priority)
- /for-churches
- /for-providers
- /for-first-responders
- /for-nonprofits
- /community-programs (TSI benevolent mission showcase)
- Estimated effort: 25-35 hours
- Each follows the same template + conversion flow (community-programs has unique card grid layout)

### Phase 3: Directory Experience (Product Critical)
- Enhance `/directory/[slug]` page
- Member card design
- Search & filter UX
- Modal/detail view
- Estimated effort: 15-20 hours

### Phase 4: Blog Infrastructure (SEO Foundation)
- /blog homepage
- /blog/[slug] article template
- Category and tag pages
- Newsletter signup components
- Estimated effort: 20-25 hours
- Content creation: 5 blog posts (outsource or async)

### Phase 5: Programmatic SEO Pages (Long-Tail)
- Generate /skills/[slug] pages
- Generate /categories/[slug] pages
- JSON-LD schema for all pages
- Estimated effort: 10-15 hours

### Phase 6: Image Prompts (Async, Non-Blocking)
- Create /docs/IMAGE-PROMPTS.md
- Generate images via Midjourney/FLUX
- Replace placeholders
- Estimated effort: 5-10 hours (creative work)

### Phase 7 & 8: Motion & Animation (Polish)
- ScrollReveal component usage throughout
- AnimatedCounter implementation
- Fine-tune timing and easing
- Test on mobile devices
- Estimated effort: 15-20 hours

### Phase 9: Newsletter & Email (Lead Gen)
- Email capture components
- Lead magnet PDF creation
- MailerLite integration
- Sequence setup
- Estimated effort: 10-15 hours

**Total Estimated Effort**: 135-185 engineering hours (3-5 weeks at 40 hrs/week)

---

## QUALITY STANDARDS & TESTING

### The 5-Second Test
Show homepage for 5 seconds (first fold only). Visitor should understand:
1. **What**: A community directory platform for churches and organizations
2. **For whom**: Church leaders and community administrators
3. **What to do**: Click "Start Free" or "See a Demo"

### The Pastor Test
Would a 55-year-old pastor in Denton, Texas feel:
- **Respected** (not talked down to, not trendy slang)
- **Understood** (you get the challenge of building community)
- **Hopeful** (this could actually work in my church)
- **Safe** (this won't embarrass me, my data is safe)

### The Designer Test
Would a professional web designer think:
- "Someone with taste and skill built this" (not a template)
- "The animations are intentional, not gratuitous"
- "The typography system is beautiful and coherent"
- "I'd show this in my portfolio"

### The Hormozi Test
- Is the offer crystal clear?
- Is the value obvious (before clicking)?
- Would someone feel *foolish* saying no to the free tier?
- Is there a clear upgrade path (Free → Growth → Enterprise)?
- Does every section earn its place on the page?

### Technical Checks

**Performance**:
- Lighthouse: 95+ desktop, 90+ mobile
- CLS: < 0.1
- FCP: < 1.5s
- LCP: < 2.5s
- Zero console errors

**Accessibility**:
- WCAG 2.1 AA compliance
- Keyboard navigation works throughout
- Color contrast: 4.5:1 minimum for body text
- No images without alt text
- Form labels properly associated

**Mobile Responsiveness**:
- Test on: iPhone SE, iPhone 14 Pro, iPad, Android (Pixel 6)
- Touch targets: 48px minimum
- Viewport handling: No horizontal scroll
- Font sizes: 16px+ for body copy on mobile

**Cross-Browser Testing**:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

---

## COMMIT STRATEGY

```bash
# After each phase:
git commit -m "feat(tsi-website-[phase-number]): [Phase description]

- Updated: [which files changed]
- New sections: [what sections added]
- Animations: [what motion added if applicable]
- Mobile: [responsive behavior details]

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

**After EVERY commit**:
- `npm run build` (must pass, zero errors)
- `npm run lint` (must pass)
- Spot-check on mobile device or responsive emulator

---

## FINAL DELIVERABLE & BUILD REPORT

When complete, create `/docs/2026-04-02_CREATIVE-BUILD-REPORT.md` with:

### Report Structure
1. **Completion Checklist** — Every phase marked complete/pending
2. **Visual Walkthrough** — Screenshots or descriptions of every major section
3. **Copy Audit** — Full copy for every headline, subheadline, CTA button (so stakeholder can review)
4. **Animation Audit** — Description of every scroll animation, timing, easing curve
5. **Responsive Testing** — Notes on mobile/tablet/desktop behavior
6. **Performance Metrics** — Lighthouse scores, FCP/LCP, CLS, any issues
7. **Known Limitations** — Images still placeholder, video script needed, etc.
8. **Next Steps** — What needs to happen in Phase 2 (if multi-phase project)
9. **Commits & Timeline** — Hash of each commit, time spent per phase

---

## VOICE GUIDE (Critical for Copy Consistency)

### TSI Voice: Warm Authority & Conviction

| DO | DON'T |
|---|---|
| "Your congregation" | "Users" or "customers" |
| "Skills" and "gifts" | "Services" or "offerings" |
| "Connect" and "discover" | "Network" or "leverage" |
| "Serve" and "stewardship" | "Engage" or "activate" (alone) |
| "Community" | "Platform" or "ecosystem" |
| Speak to the pastor's *heart* | Speak to their budget first |
| Use Scripture naturally when it fits (1 Peter 4:10, etc.) | Force theological language or feel preachy |
| Be specific (numbers, names, real stories) | Be vague ("improve engagement") |
| Acknowledge real pain | Be patronizing |

### Banned Words & Phrases
- "Leverage" / "Synergy" / "Paradigm" / "Utilize"
- "Robust" / "Seamless" / "Cutting-edge" / "Empower" (without context)
- "In today's world..." / "It's no secret that..."
- "Disruptive" / "Next-gen" / "Innovative" (overused, sounds desperate)
- Exclamation marks (more than 1 per page)

### Encouraged Patterns
- **Questions that make them think**: "How many skills are sitting in your pews right now?"
- **Before/after contrasts**: "Before TSI... After TSI..."
- **Specific scenarios they'll recognize**: the plumber in pew 3, the single mom, the CPA in the choir
- **Numbers with context**: "47 skills discovered in one church of 200 members"
- **Scripture references** (sparingly): "As each has received a gift, use it to serve one another" — 1 Peter 4:10

---

## FILES TO CREATE / MODIFY

### New Files
```
app/(marketing)/page.tsx              — Homepage (complete rewrite)
app/(marketing)/for-churches/page.tsx — Church landing page
app/(marketing)/for-providers/page.tsx — Provider landing page
app/(marketing)/for-first-responders/page.tsx
app/(marketing)/for-nonprofits/page.tsx
app/(marketing)/community-programs/page.tsx — TSI benevolent programs showcase
app/(marketing)/blog/page.tsx          — Blog index
app/(marketing)/blog/[slug]/page.tsx   — Blog article template
app/(marketing)/skills/[slug]/page.tsx — Programmatic skill pages
app/(marketing)/categories/[slug]/page.tsx — Programmatic category pages
components/ScrollReveal.tsx            — Scroll animation wrapper
components/AnimatedCounter.tsx         — Counter animation component
components/ConstellationCanvas.tsx     — Updated/enhanced constellation animation
components/NewsletterSignup.tsx        — Reusable newsletter form
components/MemberCard.tsx              — Directory member card component
components/MemberModal.tsx             — Member detail modal
docs/IMAGE-PROMPTS.md                  — AI image generation prompts
docs/VOICE-GUIDE.md                    — Copy tone and style guide (optional)
```

### Files to Modify
```
app/globals.css                        — Add animation utilities, grain overlay, glow effects
app/layout.tsx                         — Update meta tags for home/landing pages
public/fonts/                          — Ensure Playfair Display + Inter are loaded
tailwind.config.ts                     — Verify all Garden of Eden colors defined
.env.local                             — Ensure MailerLite API key for email capture
```

---

## SUMMARY & VISION ALIGNMENT

This creative specification fulfills the TSI vision:

✅ **Positions TSI as universal infrastructure**, not a vertical-specific solution
✅ **Tells the emotional story** ("invisible skills made visible") on every page
✅ **Showcases all seven storefronts** to position TSI as the engine
✅ **Explains the three-layer value prop** (community → provider → RIA client funnel)
✅ **Emphasizes vetting & trust** (three-tier system evident throughout)
✅ **Uses Garden of Eden design system** consistently across all pages
✅ **Applies StoryBrand & Hormozi frameworks** for conversion
✅ **Optimizes for both B2B (church leaders) and B2C (providers, families)**
✅ **Builds SEO foundation** with blog, programmatic pages, structured data
✅ **Creates lead-gen infrastructure** (newsletter, lead magnet, email sequences)
✅ **Maintains theological authenticity** (pastoral tone, Scripture references, focus on stewardship)

---

*Creative Direction & Specification*
*Date: April 2, 2026*
*Version: 1.0 — Complete Creative Build Spec*
*For execution by: Claude Code (autonomous overnight build)*
*Design System: Garden of Eden*
*Frameworks: StoryBrand, Hormozi Value Stack, Schwartz Awareness Levels*
*Voice: Warm Authority + Conviction*