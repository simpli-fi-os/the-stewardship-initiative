import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ListingCard from '@/components/directory/ListingCard'
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

function subtypeIcon(subtype: string): string {
  const icons: Record<string, string> = {
    food_assistance: '🍎',
    housing_shelter: '🏠',
    health_medical: '🏥',
    mental_health_counseling: '🧠',
    legal_aid: '⚖️',
    financial_assistance: '💰',
    veteran_services: '🎖️',
    youth_education: '📚',
    crisis_emergency: '🚨',
    employment: '💼',
    financial_advisor: '💰',
    tax_professional: '📊',
    insurance_agent: '🛡️',
    estate_planning_attorney: '⚖️',
    real_estate_agent: '🏢',
    home_services_contractor: '🔧',
    health_wellness: '❤️',
    childcare_education: '👶',
    business_coaching: '📋',
  }
  return icons[subtype] || '📌'
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
    .map(([subtype, count]) => ({ subtype, name: subtypeLabel(subtype), icon: subtypeIcon(subtype), count }))
    .sort((a, b) => b.count - a.count)

  const providerCategories = Object.entries(counts.providers)
    .map(([subtype, count]) => ({ subtype, name: subtypeLabel(subtype), icon: subtypeIcon(subtype), count }))
    .sort((a, b) => b.count - a.count)

  const totalListings = Object.values(counts.resources).reduce((a, b) => a + b, 0)
    + Object.values(counts.providers).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-eden-jungle">
      <Navigation />

      <main id="main-content" className="flex flex-col">
        <section className="relative py-16 md:py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[400px] bg-eden-hibiscus/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-eden-orchid mb-6">
              Every community has the <span className="text-eden-marigold">help you need</span>
            </h1>
            <p className="text-lg text-eden-orchid/80 mb-10">
              Search {totalListings} trusted resources, providers, and community members in Denton County.
            </p>

            <DirectorySearch />
          </div>
        </section>

        <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-eden-lush border border-eden-marigold/30 rounded-lg p-8">
              <h2 className="font-display text-2xl font-bold text-eden-orchid mb-8">Find Help</h2>
              <div className="grid grid-cols-3 gap-4">
                {resourceCategories.slice(0, 6).map((category) => (
                  <Link
                    key={category.subtype}
                    href={`/search?type=resource&subtype=${category.subtype}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-eden-jungle/50 transition-colors"
                  >
                    <span className="text-3xl">{category.icon}</span>
                    <p className="text-xs font-medium text-eden-orchid text-center leading-tight">{category.name}</p>
                    <p className="text-xs text-eden-gray">{category.count} listings</p>
                  </Link>
                ))}
              </div>
              <Link
                href="/search?type=resource"
                className="mt-8 block w-full text-center px-6 py-3 bg-eden-marigold/20 hover:bg-eden-marigold/30 text-eden-marigold font-semibold rounded-lg transition-colors"
              >
                View All Resources
              </Link>
            </div>

            <div className="bg-eden-lush border border-eden-marigold/30 rounded-lg p-8">
              <h2 className="font-display text-2xl font-bold text-eden-orchid mb-8">Find a Provider</h2>
              <div className="grid grid-cols-3 gap-4">
                {providerCategories.slice(0, 6).map((category) => (
                  <Link
                    key={category.subtype}
                    href={`/search?type=provider&subtype=${category.subtype}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-eden-jungle/50 transition-colors"
                  >
                    <span className="text-3xl">{category.icon}</span>
                    <p className="text-xs font-medium text-eden-orchid text-center leading-tight">{category.name}</p>
                    <p className="text-xs text-eden-gray">{category.count} listings</p>
                  </Link>
                ))}
              </div>
              <Link
                href="/search?type=provider"
                className="mt-8 block w-full text-center px-6 py-3 bg-eden-marigold/20 hover:bg-eden-marigold/30 text-eden-marigold font-semibold rounded-lg transition-colors"
              >
                View All Providers
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-eden-lush border-t border-b border-eden-marigold/20 px-6 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xl font-display text-eden-orchid mb-4">Serving Denton County</p>
            <p className="text-eden-gray text-sm">
              {totalListings} curated listings across {resourceCategories.length + providerCategories.length} categories. A trusted network of resources and providers ready to help.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto w-full">
          <h2 className="font-display text-3xl font-bold text-eden-orchid mb-4">Featured Listings</h2>
          <p className="text-eden-gray mb-10">Recently added community resources and providers</p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {featured.map((listing: any) => (
              <ListingCard key={listing.id} {...toCardProps(listing)} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/search" className="text-eden-marigold hover:text-eden-marigold/80 font-semibold transition-colors">
              View all listings
            </Link>
          </div>
        </section>

        <section className="bg-eden-lush border-t border-eden-marigold/20 px-6 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-eden-orchid mb-4 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-eden-marigold/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-eden-marigold">1</span>
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-eden-orchid mb-2">Search</h3>
                <p className="text-eden-gray text-sm">
                  Find exactly what you need by browsing categories or using the search bar.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-eden-marigold/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-eden-marigold">2</span>
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-eden-orchid mb-2">Connect</h3>
                <p className="text-eden-gray text-sm">
                  View detailed listings with contact information and service details.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-eden-marigold/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-eden-marigold">3</span>
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-eden-orchid mb-2">Get Help</h3>
                <p className="text-eden-gray text-sm">
                  Reach out directly to trusted community resources and providers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
