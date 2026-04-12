import Link from 'next/link'
import Footer from '@/components/Footer'
import ListingCard from '@/components/directory/ListingCard'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedCounter from '@/components/AnimatedCounter'
import { createServerClient } from '@/lib/supabase'
import DirectorySearch from './DirectorySearch'

export const revalidate = 300

async function getFeaturedListings() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('published', true)
      .order('premium_tier', { ascending: false })
      .order('name')
      .limit(6)

    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

async function getCategoryCounts() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('listings')
      .select('type, subtype')
      .eq('published', true)

    if (error || !data) return { resources: {}, providers: {} }

    const resources: Record<string, number> = {}
    const providers: Record<string, number> = {}

    for (const listing of data) {
      if (listing.type === 'resource') {
        const key = listing.subtype || 'other'
        resources[key] = (resources[key] || 0) + 1
      } else if (listing.type === 'provider') {
        const key = listing.subtype || 'other'
        providers[key] = (providers[key] || 0) + 1
      }
    }

    return { resources, providers }
  } catch {
    return { resources: {}, providers: {} }
  }
}

function subtypeLabel(subtype: string): string {
  return subtype
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/* SVG icons for each category — monoline, eden-tidal/marigold */
function CategoryIcon({ subtype, className = '' }: { subtype: string; className?: string }) {
  const iconMap: Record<string, JSX.Element> = {
    food_assistance: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 3c-3 0-6 2-6 5 0 4 6 7 6 7s6-3 6-7c0-3-3-5-6-5z" />
        <path d="M14 15v10" /><path d="M10 25h8" />
      </svg>
    ),
    housing_shelter: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 14l10-10 10 10" /><path d="M6 12v11h16V12" /><path d="M11 23v-6h6v6" />
      </svg>
    ),
    health_medical: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 4h4v8h8v4h-8v8h-4v-8H4v-4h8V4z" />
      </svg>
    ),
    mental_health_counseling: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="14" cy="11" r="7" /><path d="M9 14c0 2.5 2 5 5 5s5-2.5 5-5" /><path d="M14 18v6" /><path d="M10 24h8" />
      </svg>
    ),
    legal_aid: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 3v22" /><path d="M6 7l8-4 8 4" /><path d="M4 13l4-6v6H4zm16 0l4 0h-4v-6l4 6z" />
      </svg>
    ),
    financial_assistance: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="14" cy="14" r="10" /><path d="M14 8v12" /><path d="M10 12c0-2 2-2 4-2s4 0 4 2-2 2-4 3-4 1-4 3 2 2 4 2 4 0 4-2" />
      </svg>
    ),
    veteran_services: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="14,3 17,10 24,11 19,16 20,23 14,20 8,23 9,16 4,11 11,10" />
      </svg>
    ),
    youth_education: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 10l10-5 10 5-10 5-10-5z" /><path d="M24 10v8" /><path d="M8 12v7c0 2 3 4 6 4s6-2 6-4v-7" />
      </svg>
    ),
    crisis_emergency: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 4l1.5 6H22l-5 4 2 6-5-3.5L9 20l2-6-5-4h6.5L14 4z" />
      </svg>
    ),
    employment: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="8" width="20" height="16" rx="2" /><path d="M10 8V6a4 4 0 0 1 8 0v2" /><path d="M14 14v4" />
      </svg>
    ),
    financial_advisor: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 22l4-6 4 4 6-8 6 4" /><rect x="3" y="3" width="22" height="19" rx="2" />
      </svg>
    ),
    tax_professional: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="5" y="3" width="18" height="22" rx="2" /><path d="M9 8h10" /><path d="M9 12h10" /><path d="M9 16h6" />
      </svg>
    ),
    insurance_agent: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 3l10 5v7c0 6-10 10-10 10S4 21 4 15V8l10-5z" /><polyline points="10 14 13 17 18 12" />
      </svg>
    ),
    estate_planning_attorney: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="6" y="4" width="16" height="20" rx="1" /><path d="M10 9h8" /><path d="M10 13h8" /><path d="M10 17h5" /><path d="M17 21l2-2-2-2" />
      </svg>
    ),
    real_estate_agent: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 25h22" /><rect x="6" y="10" width="16" height="15" rx="1" /><path d="M3 10l11-7 11 7" /><rect x="11" y="17" width="6" height="8" />
      </svg>
    ),
    home_services_contractor: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 4l8 8-12 12-8-8 12-12z" /><path d="M4 24l4-4" /><path d="M20 8l-3 3" />
      </svg>
    ),
    health_wellness: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 25S3 18 3 11a5.5 5.5 0 0 1 11 0 5.5 5.5 0 0 1 11 0c0 7-11 14-11 14z" />
      </svg>
    ),
    childcare_education: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="14" cy="8" r="5" /><path d="M6 25c0-5 4-8 8-8s8 3 8 8" />
      </svg>
    ),
    business_coaching: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="10" cy="8" r="4" /><circle cx="20" cy="10" r="3" /><path d="M3 22c0-4 3-7 7-7s7 3 7 7" /><path d="M18 22c0-3 1-5 4-5" />
      </svg>
    ),
  }

  return iconMap[subtype] || (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="14" cy="14" r="10" /><path d="M14 10v4l3 3" />
    </svg>
  )
}

// Map DB listing to ListingCard props
function toCardProps(listing: any) {
  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    category: subtypeLabel(listing.subtype || listing.type),
    location: listing.city,
    county: listing.county ? `${listing.county} County` : '',
    rating: listing.rating || 0,
    ratingCount: listing.review_count || 0,
    description: listing.description || '',
    tags: (listing.tags || []).slice(0, 3),
    isPremium: listing.premium_tier === 'featured' || listing.premium_tier === 'premium',
  }
}

export default async function DirectoryLanding() {
  const [featured, counts] = await Promise.all([
    getFeaturedListings(),
    getCategoryCounts(),
  ])

  const resourceCategories = Object.entries(counts.resources)
    .map(([subtype, count]) => ({ subtype, name: subtypeLabel(subtype), count }))
    .sort((a, b) => b.count - a.count)

  const providerCategories = Object.entries(counts.providers)
    .map(([subtype, count]) => ({ subtype, name: subtypeLabel(subtype), count }))
    .sort((a, b) => b.count - a.count)

  const totalListings = Object.values(counts.resources).reduce((a, b) => a + b, 0)
    + Object.values(counts.providers).reduce((a, b) => a + b, 0)

  const totalCategories = resourceCategories.length + providerCategories.length

  return (
    <div className="min-h-screen bg-eden-jungle">
      <main id="main-content" className="flex flex-col">
        {/* ═══════════════════════════════════════
            HERO — Atmospheric, compelling
           ═══════════════════════════════════════ */}
        <section className="relative py-20 md:py-32 px-6 overflow-hidden">
          {/* Background atmosphere */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-eden-tidal/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-eden-hibiscus/4 rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-eden-marigold/3 rounded-full blur-3xl" />
          </div>

          {/* Grain overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <p className="text-eden-tidal font-semibold tracking-widest text-xs uppercase mb-6">
                The Community Trust Engine
              </p>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-eden-orchid leading-tight mb-6">
                Find Trusted Help.{' '}
                <span className="text-eden-marigold">Right Where You Live.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-lg md:text-xl text-eden-gray max-w-2xl mx-auto mb-10 leading-relaxed">
                Search {totalListings} vetted resources and providers across {totalCategories} categories in Denton County. Every listing is verified. Every connection is trusted.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <DirectorySearch />
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
                <div className="flex items-center gap-2 text-sm text-eden-gray">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#26A69A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l6 4v6c0 6-6 10-6 10S6 18 6 12V6l6-4z" /><polyline points="9 12 11 14 15 10" />
                  </svg>
                  Every listing verified
                </div>
                <div className="flex items-center gap-2 text-sm text-eden-gray">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FDB833" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  Updated daily
                </div>
                <div className="flex items-center gap-2 text-sm text-eden-gray">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D90368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  Denton County, TX
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            STATS BAR — Quick trust signals
           ═══════════════════════════════════════ */}
        <section className="relative border-t border-b border-eden-tidal/10">
          <div className="absolute inset-0 bg-eden-lush/30 pointer-events-none" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <ScrollReveal delay={0}>
                <div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-eden-marigold">
                    <AnimatedCounter target={totalListings} />
                  </p>
                  <p className="text-xs text-eden-gray mt-1 uppercase tracking-wide">Verified Listings</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-eden-tidal">
                    <AnimatedCounter target={totalCategories} />
                  </p>
                  <p className="text-xs text-eden-gray mt-1 uppercase tracking-wide">Categories</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-eden-hibiscus">3</p>
                  <p className="text-xs text-eden-gray mt-1 uppercase tracking-wide">Trust Tiers</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-eden-orchid">100%</p>
                  <p className="text-xs text-eden-gray mt-1 uppercase tracking-wide">Free to Search</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            BROWSE CATEGORIES — Glassmorphism cards
           ═══════════════════════════════════════ */}
        <section className="relative px-6 py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-eden-marigold/3 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Resources Section */}
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-eden-tidal font-semibold tracking-widest text-xs uppercase mb-3">Community Resources</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid mb-3">
                  Find Help When You Need It
                </h2>
                <p className="text-eden-gray max-w-xl mx-auto">
                  Nonprofits, social services, and community organizations. All vetted. All local.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {resourceCategories.map((cat, i) => (
                <ScrollReveal key={cat.subtype} delay={i * 50} direction="fade">
                  <Link
                    href={`/search?type=resource&subtype=${cat.subtype}`}
                    className="eden-glass p-5 rounded-xl flex flex-col items-center gap-3 hover:scale-[1.03] hover:border-eden-tidal/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="text-eden-tidal group-hover:text-eden-marigold transition-colors">
                      <CategoryIcon subtype={cat.subtype} />
                    </div>
                    <p className="text-sm font-semibold text-eden-orchid text-center leading-tight group-hover:text-eden-marigold transition-colors">
                      {cat.name}
                    </p>
                    <span className="text-xs text-eden-gray bg-eden-jungle/40 px-2.5 py-0.5 rounded-full">
                      {cat.count} listing{cat.count !== 1 ? 's' : ''}
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className="text-center mb-20">
                <Link
                  href="/search?type=resource"
                  className="inline-flex items-center gap-2 text-eden-marigold font-semibold hover:underline group"
                >
                  View All Resources
                  <span className="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </ScrollReveal>

            {/* Providers Section */}
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-eden-marigold font-semibold tracking-widest text-xs uppercase mb-3">Trusted Providers</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid mb-3">
                  Find a Vetted Professional
                </h2>
                <p className="text-eden-gray max-w-xl mx-auto">
                  Financial advisors, contractors, healthcare providers, and more. Community-endorsed and platform-verified.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {providerCategories.map((cat, i) => (
                <ScrollReveal key={cat.subtype} delay={i * 50} direction="fade">
                  <Link
                    href={`/search?type=provider&subtype=${cat.subtype}`}
                    className="eden-glass p-5 rounded-xl flex flex-col items-center gap-3 hover:scale-[1.03] hover:border-eden-marigold/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="text-eden-marigold group-hover:text-eden-tidal transition-colors">
                      <CategoryIcon subtype={cat.subtype} />
                    </div>
                    <p className="text-sm font-semibold text-eden-orchid text-center leading-tight group-hover:text-eden-marigold transition-colors">
                      {cat.name}
                    </p>
                    <span className="text-xs text-eden-gray bg-eden-jungle/40 px-2.5 py-0.5 rounded-full">
                      {cat.count} listing{cat.count !== 1 ? 's' : ''}
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className="text-center">
                <Link
                  href="/search?type=provider"
                  className="inline-flex items-center gap-2 text-eden-marigold font-semibold hover:underline group"
                >
                  View All Providers
                  <span className="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FEATURED LISTINGS
           ═══════════════════════════════════════ */}
        {featured.length > 0 && (
          <section className="relative px-6 py-20 md:py-28 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #022C22 0%, #033F32 50%, #022C22 100%)' }} />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-eden-tidal/4 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <p className="text-eden-hibiscus font-semibold tracking-widest text-xs uppercase mb-3">Recently Added</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid mb-3">
                    Featured Listings
                  </h2>
                  <p className="text-eden-gray max-w-lg mx-auto">
                    Newly verified community resources and providers ready to serve.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {featured.map((listing: any, i: number) => (
                  <ScrollReveal key={listing.id} delay={i * 100} direction="fade">
                    <ListingCard {...toCardProps(listing)} />
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={400}>
                <div className="text-center">
                  <Link href="/search" className="btn-secondary">
                    Browse All Listings
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            HOW IT WORKS — Elegant 3-step
           ═══════════════════════════════════════ */}
        <section className="relative px-6 py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-eden-marigold/3 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid mb-3">
                  Three Steps to Connected Community
                </h2>
                <p className="text-eden-gray">Simple for everyone. Powerful for leaders.</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px border-t-2 border-dashed border-eden-tidal/20 z-0" />

              {[
                {
                  num: '1',
                  title: 'Search',
                  desc: 'Type what you need. Browse by category. Filter by type, location, or specialty. Every result is verified.',
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="14" cy="14" r="9" /><path d="M28 28l-7-7" />
                    </svg>
                  ),
                },
                {
                  num: '2',
                  title: 'Connect',
                  desc: 'See detailed profiles with credentials, endorsements, and contact information. Know who you are reaching out to.',
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" /><circle cx="22" cy="14" r="4" /><path d="M4 28c0-5 4-8 8-8 2 0 3.5.5 5 1.5" /><path d="M18 28c0-4 2-6 4-6s4 2 4 6" />
                    </svg>
                  ),
                },
                {
                  num: '3',
                  title: 'Get Help',
                  desc: 'Reach out directly to trusted resources and providers. No middleman. No fees. Just community helping community.',
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 28s-10-6-10-14a10 10 0 0 1 20 0c0 8-10 14-10 14z" /><polyline points="12 16 15 19 20 14" />
                    </svg>
                  ),
                },
              ].map((step, i) => (
                <ScrollReveal key={i} delay={i * 150}>
                  <div className="relative text-center z-10">
                    <div className="relative inline-block mb-6">
                      <span className="absolute -top-5 -left-5 font-display text-7xl text-eden-marigold/10 font-bold select-none">
                        {step.num}
                      </span>
                      <div className="relative z-10 w-14 h-14 rounded-full bg-eden-lush/60 backdrop-blur-sm border border-eden-tidal/20 flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-bold text-eden-orchid mb-3">{step.title}</h3>
                    <p className="text-sm text-eden-gray leading-relaxed">{step.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            CTA — For providers/communities
           ═══════════════════════════════════════ */}
        <section className="relative px-6 py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-eden-lush/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-eden-tidal/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal direction="left">
                <div className="eden-glass glow-marigold p-8 md:p-10 rounded-2xl h-full flex flex-col">
                  <div className="mb-6">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#FDB833" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 5l12 6v10c0 8-12 14-12 14S8 29 8 21V11l12-6z" /><polyline points="14 20 18 24 26 16" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-eden-orchid mb-3">
                    Are You a Provider?
                  </h3>
                  <p className="text-eden-gray text-sm leading-relaxed mb-6 flex-1">
                    Get discovered by communities that trust you. Create a free profile, earn endorsements, and connect with the people who need your skills most.
                  </p>
                  <Link href="/submit" className="btn-primary text-sm text-center">
                    Create Your Free Profile
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={100}>
                <div className="eden-glass glow-tidal p-8 md:p-10 rounded-2xl h-full flex flex-col">
                  <div className="mb-6">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="16" cy="14" r="6" /><circle cx="28" cy="16" r="4" /><path d="M6 34c0-6 4-10 10-10s10 4 10 10" /><path d="M24 34c0-4 2-6 4-6s4 2 4 6" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-eden-orchid mb-3">
                    Lead a Community?
                  </h3>
                  <p className="text-eden-gray text-sm leading-relaxed mb-6 flex-1">
                    Launch a branded directory for your church, nonprofit, or organization. Discover the hidden talent sitting right beside you. Free to start.
                  </p>
                  <Link href="/get-started" className="btn-secondary text-sm text-center">
                    Start Your Directory
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
