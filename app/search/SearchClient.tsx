'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ListingCard from '@/components/directory/ListingCard'

interface Listing {
  id: string
  slug: string
  name: string
  category: string
  location: string
  county: string
  rating: number
  ratingCount: number
  description: string
  tags: string[]
  isPremium: boolean
}

const MOCK_LISTINGS: Listing[] = [
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
    slug: 'community-health-clinic',
    name: 'Community Health Clinic',
    category: 'Medical',
    location: 'Denton',
    county: 'Denton County',
    rating: 4.7,
    ratingCount: 52,
    description: 'Affordable primary care, dental, and mental health services for all community members.',
    tags: ['Healthcare', 'Affordable Care'],
    isPremium: false,
  },
  {
    id: '4',
    slug: 'denton-job-center',
    name: 'Denton Job Center',
    category: 'Jobs',
    location: 'Denton',
    county: 'Denton County',
    rating: 4.5,
    ratingCount: 18,
    description: 'Job training, resume assistance, and employment counseling for community members.',
    tags: ['Employment', 'Training'],
    isPremium: false,
  },
  {
    id: '5',
    slug: 'denton-tax-pro',
    name: 'Denton Tax Professionals',
    category: 'Tax Professional',
    location: 'Denton',
    county: 'Denton County',
    rating: 4.9,
    ratingCount: 42,
    description: 'Professional tax preparation and planning services for individuals and small businesses.',
    tags: ['Accounting', 'Tax Planning'],
    isPremium: true,
  },
  {
    id: '6',
    slug: 'housing-authority',
    name: 'Denton Housing Authority',
    category: 'Housing',
    location: 'Denton',
    county: 'Denton County',
    rating: 4.3,
    ratingCount: 15,
    description: 'Affordable housing programs and rental assistance for low-income families.',
    tags: ['Housing', 'Assistance'],
    isPremium: false,
  },
]

const CATEGORIES = ['All', 'Resources', 'Providers', 'Churches', 'Nonprofits']
const RESOURCE_TYPES = ['Food', 'Housing', 'Medical', 'Jobs', 'Education', 'Mental Health']
const PROVIDER_TYPES = ['Financial Advisor', 'Tax Professional', 'Insurance', 'Real Estate', 'Legal', 'Accounting']
const CITIES = ['Denton', 'Lewisville', 'Flower Mound', 'Highland Village']
const TAGS = ['Community', 'Affordable', 'Professional', 'Pro Bono', 'Nonprofit']

export default function SearchClient() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [type, setType] = useState(searchParams.get('type') || 'all')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState('Denton')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')
  const [results, setResults] = useState<Listing[]>(MOCK_LISTINGS)

  useEffect(() => {
    let filtered = MOCK_LISTINGS

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (type === 'resources') {
      filtered = filtered.filter((l) => RESOURCE_TYPES.includes(l.category))
    } else if (type === 'providers') {
      filtered = filtered.filter((l) => PROVIDER_TYPES.includes(l.category))
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((l) => selectedCategories.includes(l.category))
    }

    filtered = filtered.filter((l) => l.county.includes(selectedCity) || selectedCity === 'all')

    if (selectedTags.length > 0) {
      filtered = filtered.filter((l) => selectedTags.some((t) => l.tags.includes(t)))
    }

    filtered = filtered.filter((l) => l.rating >= minRating)

    if (sortBy === 'a-z') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'newest') {
      filtered.reverse()
    }

    setResults(filtered)
  }, [searchQuery, type, selectedCategories, selectedCity, selectedTags, minRating, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedCity('Denton')
    setSelectedTags([])
    setMinRating(0)
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedCity !== 'Denton' || selectedTags.length > 0 || minRating > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <div className="space-y-6 bg-eden-lush p-6 rounded-lg border border-eden-marigold/30 sticky top-24">
          <div>
            <h3 className="font-display font-bold text-eden-orchid mb-4">Filters</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-eden-gray mb-3">Category</h4>
              <div className="space-y-2">
                {(type === 'resources' ? RESOURCE_TYPES : type === 'providers' ? PROVIDER_TYPES : [...RESOURCE_TYPES, ...PROVIDER_TYPES]).map(
                  (category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded border-eden-marigold/50"
                      />
                      <span className="text-sm text-eden-orchid/80">{category}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* City Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-eden-gray mb-3">City</h4>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 bg-eden-jungle border border-eden-marigold/30 rounded text-eden-orchid text-sm focus:outline-none focus:border-eden-marigold"
              >
                <option value="all">All Cities</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-eden-gray mb-3">Tags</h4>
              <div className="space-y-2">
                {TAGS.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="w-4 h-4 rounded border-eden-marigold/50"
                    />
                    <span className="text-sm text-eden-orchid/80">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-eden-gray mb-3">Minimum Rating</h4>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 bg-eden-jungle border border-eden-marigold/30 rounded text-eden-orchid text-sm focus:outline-none focus:border-eden-marigold"
              >
                <option value={0}>All</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
                <option value={4.5}>4.5+</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-sm text-eden-marigold hover:bg-eden-jungle/50 rounded transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search listings..."
            className="flex-1 px-4 py-3 bg-eden-lush border border-eden-marigold/30 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-eden-lush border border-eden-marigold/30 rounded-lg text-eden-orchid focus:outline-none focus:border-eden-marigold"
          >
            <option value="relevance">Relevance</option>
            <option value="a-z">A-Z</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setType(category.toLowerCase() === 'all' ? 'all' : category.toLowerCase())}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                (category.toLowerCase() === 'all' && type === 'all') ||
                (category.toLowerCase() !== 'all' && type === category.toLowerCase())
                  ? 'bg-eden-marigold text-eden-jungle'
                  : 'bg-eden-lush border border-eden-marigold/30 text-eden-orchid hover:border-eden-marigold'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedCategories.map((cat) => (
              <span key={cat} className="px-3 py-1 text-xs bg-eden-hibiscus/20 text-eden-hibiscus rounded-full flex items-center gap-2">
                {cat}
                <button onClick={() => toggleCategory(cat)} className="hover:opacity-70">
                  ×
                </button>
              </span>
            ))}
            {selectedCity !== 'Denton' && (
              <span className="px-3 py-1 text-xs bg-eden-hibiscus/20 text-eden-hibiscus rounded-full flex items-center gap-2">
                {selectedCity}
                <button onClick={() => setSelectedCity('Denton')} className="hover:opacity-70">
                  ×
                </button>
              </span>
            )}
            {selectedTags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs bg-eden-hibiscus/20 text-eden-hibiscus rounded-full flex items-center gap-2">
                {tag}
                <button onClick={() => toggleTag(tag)} className="hover:opacity-70">
                  ×
                </button>
              </span>
            ))}
            {minRating > 0 && (
              <span className="px-3 py-1 text-xs bg-eden-hibiscus/20 text-eden-hibiscus rounded-full flex items-center gap-2">
                {minRating}+ Rating
                <button onClick={() => setMinRating(0)} className="hover:opacity-70">
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <>
            <p className="text-sm text-eden-gray mb-6">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-eden-gray mb-4">No listings found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="text-eden-marigold hover:text-eden-marigold/80 font-semibold transition-colors"
            >
              Clear filters and try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
