import Link from 'next/link'
import { Search, Users, MapPin, Heart } from 'lucide-react'

export default function ExploreSection() {
  const categories = [
    { name: 'Food & Nutrition', icon: '🍎', slug: 'food-nutrition' },
    { name: 'Healthcare', icon: '🏥', slug: 'healthcare' },
    { name: 'Youth & Education', icon: '📚', slug: 'youth-education' },
    { name: 'Housing', icon: '🏠', slug: 'housing-assistance' },
    { name: 'Financial', icon: '💰', slug: 'financial-services' },
    { name: 'Emergency', icon: '🚨', slug: 'emergency-services' },
  ]

  return (
    <section className="py-16 md:py-24 px-6 bg-eden-lush/10 border-y border-eden-tidal/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-eden-tidal font-bold tracking-widest text-sm uppercase mb-4">
            Explore Our Directory
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-eden-marigold mb-4">
            Find the Resources Your Community Needs
          </h2>
          <p className="text-eden-gray max-w-2xl mx-auto mb-8">
            Browse our community directory of trusted resources and service providers across Denton County.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 flex gap-3 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-eden-tidal" size={20} />
            <input
              type="text"
              placeholder="Search resources, services, organizations..."
              className="w-full pl-10 pr-4 py-3 bg-eden-lush/20 border border-eden-tidal/30 text-eden-orchid placeholder-eden-gray rounded-lg focus:outline-none focus:border-eden-tidal focus:ring-1 focus:ring-eden-tidal/50"
            />
          </div>
          <Link
            href="/search"
            className="px-6 py-3 bg-eden-marigold hover:bg-yellow-400 text-eden-jungle font-semibold rounded-lg transition-colors"
          >
            Search
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group p-6 bg-eden-lush/20 border border-eden-tidal/20 rounded-lg hover:border-eden-tidal hover:bg-eden-lush/30 transition-all"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold text-eden-marigold group-hover:text-yellow-300 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-eden-tidal mt-2">Browse</p>
            </Link>
          ))}
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-eden-tidal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-eden-tidal" size={24} />
            </div>
            <h3 className="font-semibold text-eden-orchid mb-2">Trusted Providers</h3>
            <p className="text-sm text-eden-gray">
              Every organization in our directory has been verified and vetted by our community.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-eden-tidal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-eden-tidal" size={24} />
            </div>
            <h3 className="font-semibold text-eden-orchid mb-2">Local Focus</h3>
            <p className="text-sm text-eden-gray">
              Resources and services tailored specifically for Denton County families and organizations.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-eden-tidal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-eden-tidal" size={24} />
            </div>
            <h3 className="font-semibold text-eden-orchid mb-2">Community Driven</h3>
            <p className="text-sm text-eden-gray">
              Built by stewards for stewards to strengthen our community bonds.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-eden-gray mb-6">
            Is your organization missing from our directory?
          </p>
          <Link
            href="/submit"
            className="inline-block px-8 py-3 bg-eden-hibiscus hover:bg-eden-hibiscus/90 text-white font-semibold rounded-lg transition-colors"
          >
            List Your Organization
          </Link>
        </div>
      </div>
    </section>
  )
}
