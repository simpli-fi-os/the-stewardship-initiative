'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import ListingCard from '@/components/directory/ListingCard'

const MOCK_LISTINGS = [
  {
    id: 1,
    slug: 'denton-community-food-bank',
    name: 'Denton Community Food Bank',
    category: 'Food & Nutrition',
    location: 'Denton, TX',
    description: 'Community food bank providing free groceries and nutrition resources to families in need across Denton County.',
    image: '/images/listings/food-bank.jpg',
    rating: 4.8,
    reviewCount: 124,
    tags: ['Food', 'Families', 'Emergency Assistance', 'Free', 'Weekly Hours'],
    isPremium: true,
  },
  {
    id: 2,
    slug: 'nutrition-counseling-center',
    name: 'Nutrition Counseling Center',
    category: 'Food & Nutrition',
    location: 'Denton, TX',
    description: 'Professional nutrition counseling and meal planning services for individuals and families.',
    image: '/images/listings/nutrition.jpg',
    rating: 4.6,
    reviewCount: 45,
    tags: ['Nutrition', 'Health', 'Counseling', 'Meal Planning'],
    isPremium: false,
  },
  {
    id: 3,
    slug: 'community-garden-project',
    name: 'Community Garden Project',
    category: 'Food & Nutrition',
    location: 'Denton, TX',
    description: 'Community garden providing fresh produce and gardening education to residents.',
    image: '/images/listings/garden.jpg',
    rating: 4.7,
    reviewCount: 67,
    tags: ['Gardening', 'Fresh Produce', 'Community', 'Education'],
    isPremium: false,
  },
  {
    id: 4,
    slug: 'food-pantry-network',
    name: 'Food Pantry Network',
    category: 'Food & Nutrition',
    location: 'Denton, TX',
    description: 'Network of food pantries across Denton County serving families in need.',
    image: '/images/listings/pantry.jpg',
    rating: 4.5,
    reviewCount: 89,
    tags: ['Food', 'Free', 'Pantry', 'Family Services'],
    isPremium: true,
  },
]

interface CategoryPageProps {
  params: { slug: string }
}

const CATEGORY_MAP: Record<string, { name: string; description: string }> = {
  'food-nutrition': {
    name: 'Food & Nutrition',
    description: 'Resources and support for food security, nutrition education, and healthy eating in our community.',
  },
  'healthcare': {
    name: 'Healthcare',
    description: 'Medical services, preventive care, and health resources available in Denton County.',
  },
  'youth-education': {
    name: 'Youth & Education',
    description: 'Educational programs, mentorship, and youth development services.',
  },
  'housing-assistance': {
    name: 'Housing Assistance',
    description: 'Support services for housing needs, repairs, and homelessness prevention.',
  },
  'financial-services': {
    name: 'Financial Services',
    description: 'Financial counseling, budgeting assistance, and economic empowerment resources.',
  },
  'emergency-services': {
    name: 'Emergency Services',
    description: 'Crisis support, disaster relief, and emergency assistance programs.',
  },
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [filteredListings, setFilteredListings] = useState(MOCK_LISTINGS)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const categoryInfo = CATEGORY_MAP[params.slug] || {
    name: 'Category',
    description: 'Browse resources in this category.',
  }

  useEffect(() => {
    let results = MOCK_LISTINGS.filter(listing =>
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (sortBy === 'a-z') {
      results.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'newest') {
      results.reverse()
    }

    setFilteredListings(results)
  }, [searchQuery, sortBy])

  return (
    <div className="min-h-screen bg-eden-jungle text-eden-orchid">
      {/* Breadcrumb */}
      <div className="bg-eden-lush/50 border-b border-eden-tidal/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link href="/directory-landing" className="text-eden-tidal hover:text-eden-marigold">
            Directory
          </Link>
          <span className="text-eden-gray">/</span>
          <span className="text-eden-orchid">{categoryInfo.name}</span>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-b from-eden-lush/30 to-eden-jungle border-b border-eden-tidal/20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-eden-marigold mb-4">
            {categoryInfo.name}
          </h1>
          <p className="text-eden-gray text-lg max-w-2xl">
            {categoryInfo.description}
          </p>
          <p className="text-sm text-eden-tidal mt-4">
            {filteredListings.length} resource{filteredListings.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-eden-tidal" size={20} />
            <input
              type="text"
              placeholder="Search within this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-eden-lush/20 border border-eden-tidal/30 text-eden-orchid placeholder-eden-gray rounded-lg focus:outline-none focus:border-eden-tidal focus:ring-1 focus:ring-eden-tidal/50"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="sm:hidden flex items-center justify-between px-4 py-2 bg-eden-lush/20 border border-eden-tidal/30 rounded-lg text-eden-tidal hover:border-eden-tidal transition-colors"
            >
              <span>Filters</span>
              <ChevronDown size={18} className={`transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <label className="text-sm text-eden-gray flex items-center gap-2">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-eden-lush/20 border border-eden-tidal/30 text-eden-orchid rounded-lg focus:outline-none focus:border-eden-tidal"
              >
                <option value="relevance">Relevance</option>
                <option value="a-z">A to Z</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-16 h-16 bg-eden-tidal/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">🔍</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-eden-marigold mb-2">No Results Found</h2>
            <p className="text-eden-gray mb-6">
              Try searching with different keywords or browse other categories.
            </p>
            <Link
              href="/directory-landing"
              className="inline-block px-6 py-2 bg-eden-marigold hover:bg-yellow-400 text-eden-jungle font-semibold rounded transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-eden-lush/20 border-t border-eden-tidal/20 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold font-display text-eden-marigold mb-3">
            Is your organization missing?
          </h2>
          <p className="text-eden-gray mb-6 max-w-2xl mx-auto">
            Help us grow our community directory by adding your resource or service.
          </p>
          <Link
            href="/submit"
            className="inline-block px-6 py-3 bg-eden-hibiscus hover:bg-eden-hibiscus/90 text-white font-semibold rounded transition-colors"
          >
            List Your Organization
          </Link>
        </div>
      </div>
    </div>
  )
}
