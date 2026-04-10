'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ListingCard from '@/components/directory/ListingCard'

const RESOURCE_CATEGORIES = [
  { name: 'Food', icon: '🍎', count: 24 },
  { name: 'Housing', icon: '🏠', count: 18 },
  { name: 'Medical', icon: '🏥', count: 31 },
  { name: 'Jobs', icon: '💼', count: 42 },
  { name: 'Education', icon: '📚', count: 19 },
  { name: 'Mental Health', icon: '🧠', count: 14 },
]

const PROVIDER_CATEGORIES = [
  { name: 'Financial Advisor', icon: '💰', count: 12 },
  { name: 'Tax Professional', icon: '📊', count: 8 },
  { name: 'Insurance', icon: '🛡️', count: 15 },
  { name: 'Real Estate', icon: '🏢', count: 11 },
  { name: 'Legal', icon: '⚖️', count: 7 },
  { name: 'Accounting', icon: '📋', count: 9 },
]

const FEATURED_LISTINGS = [
  {
    id: '1',
    slug: 'village-food-pantry',
    name: 'Village Food Pantry',
    category: 'Food',
    location: 'Denton',
    county: 'Denton County',
    rating: 4.8,
    ratingCount: 34,
    description: 'Community-run food pantry serving families in need with fresh groceries and essentials.',
    tags: ['Food Security', 'Community'],
    isPremium: false,
  },
  {
    id: '2',
    slug: 'denton-legal-aid',
    name: 'Denton Legal Aid Society',
    category: 'Legal',
    location: 'Denton',
    county: 'Denton County',
    rating: 4.9,
    ratingCount: 28,
    description: 'Free legal services for low-income residents on family, housing, and employment law.',
    tags: ['Legal Services', 'Pro Bono'],
    isPremium: true,
  },
  {
    id: '3',
    slug: 'denton-health-clinic',
    name: 'Denton Community Health Clinic',
    category: 'Medical',
    location: 'Denton',
    county: 'Denton County',
    rating: 4.7,
    ratingCount: 52,
    description: 'Affordable primary care, dental, and mental health services for all community members.',
    tags: ['Healthcare', 'Affordable Care'],
    isPremium: false,
  },
]

export default function DirectoryLanding() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

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
              Search trusted resources, providers, and community members ready to help in Denton County.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, providers, organizations..."
                className="flex-1 px-6 py-4 bg-eden-lush border border-eden-marigold/30 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-eden-marigold hover:bg-eden-marigold/90 text-eden-jungle font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-eden-lush border border-eden-marigold/30 rounded-lg p-8">
              <h2 className="font-display text-2xl font-bold text-eden-orchid mb-8">Find Help</h2>
              <div className="grid grid-cols-3 gap-4">
                {RESOURCE_CATEGORIES.map((category) => (
                  <Link
                    key={category.name}
                    href={`/categories/resources/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-eden-jungle/50 transition-colors"
                  >
                    <span className="text-3xl">{category.icon}</span>
                    <p className="text-xs font-medium text-eden-orchid text-center leading-tight">{category.name}</p>
                    <p className="text-xs text-eden-gray">{category.count} listings</p>
                  </Link>
                ))}
              </div>
              <Link
                href="/search?type=resources"
                className="mt-8 block w-full text-center px-6 py-3 bg-eden-marigold/20 hover:bg-eden-marigold/30 text-eden-marigold font-semibold rounded-lg transition-colors"
              >
                View All Resources
              </Link>
            </div>

            <div className="bg-eden-lush border border-eden-marigold/30 rounded-lg p-8">
              <h2 className="font-display text-2xl font-bold text-eden-orchid mb-8">Find a Provider</h2>
              <div className="grid grid-cols-3 gap-4">
                {PROVIDER_CATEGORIES.map((category) => (
                  <Link
                    key={category.name}
                    href={`/categories/providers/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-eden-jungle/50 transition-colors"
                  >
                    <span className="text-3xl">{category.icon}</span>
                    <p className="text-xs font-medium text-eden-orchid text-center leading-tight">{category.name}</p>
                    <p className="text-xs text-eden-gray">{category.count} listings</p>
                  </Link>
                ))}
              </div>
              <Link
                href="/search?type=providers"
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
              A curated network of trusted resources, providers, and community members ready to help.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto w-full">
          <h2 className="font-display text-3xl font-bold text-eden-orchid mb-4">Featured Listings</h2>
          <p className="text-eden-gray mb-10">Recently added and highly-rated community resources</p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {FEATURED_LISTINGS.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
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
                  View detailed listings with ratings, reviews, and contact information.
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
