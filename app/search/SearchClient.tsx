'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ListingCard from '@/components/directory/ListingCard'

interface SearchResult {
  id: string
  type: string
  subtype: string
  name: string
  slug: string
  city: string
  state: string
  rating: number
  review_count: number
  premium_tier: string | null
  tags: string[]
  photo_url: string | null
  description?: string
}

interface Facets {
  types: Record<string, number>
  subtypes: Record<string, number>
  states: Record<string, number>
  counties: Record<string, number>
  categories: Record<string, number>
}

function subtypeLabel(subtype: string): string {
  return subtype
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [subtype, setSubtype] = useState(searchParams.get('subtype') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [minRating, setMinRating] = useState(Number(searchParams.get('min_rating')) || 0)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating_desc')
  const [results, setResults] = useState<SearchResult[]>([])
  const [facets, setFacets] = useState<Facets | null>(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 20

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('q', searchQuery.trim())
      if (type) params.set('type', type)
      if (subtype) params.set('subtype', subtype)
      if (city) params.set('city', city)
      if (minRating > 0) params.set('min_rating', String(minRating))
      if (sortBy) params.set('sort', sortBy)
      params.set('page', String(page))
      params.set('per_page', String(perPage))

      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error('Search failed')

      const data = await res.json()
      setResults(data.results || [])
      setFacets(data.facets || null)
      setTotal(data.total || 0)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, type, subtype, city, minRating, sortBy, page])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  // Sync URL params on initial load
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const t = searchParams.get('type') || ''
    const st = searchParams.get('subtype') || ''
    if (q !== searchQuery) setSearchQuery(q)
    if (t !== type) setType(t)
    if (st !== subtype) setSubtype(st)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchResults()
  }

  const setTypeFilter = (newType: string) => {
    setType(newType)
    setSubtype('')
    setPage(1)
  }

  const clearFilters = () => {
    setType('')
    setSubtype('')
    setCity('')
    setMinRating(0)
    setPage(1)
  }

  const hasActiveFilters = !!type || !!subtype || !!city || minRating > 0

  // Map API result to ListingCard props
  const toCardProps = (r: SearchResult) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: subtypeLabel(r.subtype || r.type),
    location: r.city || '',
    county: '',
    rating: r.rating || 0,
    ratingCount: r.review_count || 0,
    description: r.description || '',
    tags: (r.tags || []).slice(0, 3),
    isPremium: r.premium_tier === 'featured' || r.premium_tier === 'premium',
  })

  const subtypeOptions = facets?.subtypes
    ? Object.entries(facets.subtypes)
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => ({ key, label: subtypeLabel(key), count }))
    : []

  const cityOptions = facets?.counties
    ? Object.entries(facets.counties)
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => ({ key, label: key, count }))
    : []

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="space-y-6 bg-eden-lush p-6 rounded-lg border border-eden-marigold/30 sticky top-24">
            <h3 className="font-display font-bold text-eden-orchid mb-4">Filters</h3>

            {/* Type Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-eden-gray mb-3">Type</h4>
              <div className="space-y-2">
                {['', 'resource', 'provider'].map((t) => (
                  <label key={t || 'all'} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={type === t}
                      onChange={() => setTypeFilter(t)}
                      className="w-4 h-4 border-eden-marigold/50"
                    />
                    <span className="text-sm text-eden-orchid/80">
                      {t === '' ? 'All' : t === 'resource' ? 'Resources' : 'Providers'}
                      {facets?.types?.[t] ? ` (${facets.types[t]})` : ''}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subtype Filter */}
            {subtypeOptions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-eden-gray mb-3">Category</h4>
                <select
                  value={subtype}
                  onChange={(e) => { setSubtype(e.target.value); setPage(1) }}
                  className="w-full px-3 py-2 bg-eden-jungle border border-eden-marigold/30 rounded text-eden-orchid text-sm focus:outline-none focus:border-eden-marigold"
                >
                  <option value="">All Categories</option>
                  {subtypeOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label} ({opt.count})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-eden-gray mb-3">Minimum Rating</h4>
              <select
                value={minRating}
                onChange={(e) => { setMinRating(Number(e.target.value)); setPage(1) }}
                className="w-full px-3 py-2 bg-eden-jungle border border-eden-marigold/30 rounded text-eden-orchid text-sm focus:outline-none focus:border-eden-marigold"
              >
                <option value={0}>All</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
                <option value={4.5}>4.5+</option>
              </select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-eden-gray mb-3">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-eden-jungle border border-eden-marigold/30 rounded text-eden-orchid text-sm focus:outline-none focus:border-eden-marigold"
              >
                <option value="rating_desc">Highest Rated</option>
                <option value="name_asc">A-Z</option>
                <option value="name_desc">Z-A</option>
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
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings..."
              className="flex-1 px-4 py-3 bg-eden-lush border border-eden-marigold/30 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-eden-marigold text-eden-jungle font-semibold rounded-lg hover:bg-eden-marigold/90 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2">
              {type && (
                <span className="px-3 py-1 text-xs bg-eden-hibiscus/20 text-eden-hibiscus rounded-full flex items-center gap-2">
                  {type === 'resource' ? 'Resources' : 'Providers'}
                  <button onClick={() => setTypeFilter('')} className="hover:opacity-70">×</button>
                </span>
              )}
              {subtype && (
                <span className="px-3 py-1 text-xs bg-eden-hibiscus/20 text-eden-hibiscus rounded-full flex items-center gap-2">
                  {subtypeLabel(subtype)}
                  <button onClick={() => { setSubtype(''); setPage(1) }} className="hover:opacity-70">×</button>
                </span>
              )}
              {city && (
                <span className="px-3 py-1 text-xs bg-eden-hibiscus/20 text-eden-hibiscus rounded-full flex items-center gap-2">
                  {city}
                  <button onClick={() => { setCity(''); setPage(1) }} className="hover:opacity-70">×</button>
                </span>
              )}
              {minRating > 0 && (
                <span className="px-3 py-1 text-xs bg-eden-hibiscus/20 text-eden-hibiscus rounded-full flex items-center gap-2">
                  {minRating}+ Rating
                  <button onClick={() => { setMinRating(0); setPage(1) }} className="hover:opacity-70">×</button>
                </span>
              )}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-eden-marigold/30 border-t-eden-marigold rounded-full animate-spin mb-4" />
              <p className="text-eden-gray">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <p className="text-sm text-eden-gray mb-6">
                Found {total} result{total !== 1 ? 's' : ''}
                {searchQuery && <> for &ldquo;{searchQuery}&rdquo;</>}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((r) => (
                  <ListingCard key={r.id} {...toCardProps(r)} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded bg-eden-lush border border-eden-marigold/30 text-eden-orchid disabled:opacity-40 hover:border-eden-marigold transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-eden-gray text-sm flex items-center">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded bg-eden-lush border border-eden-marigold/30 text-eden-orchid disabled:opacity-40 hover:border-eden-marigold transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-eden-gray mb-4">No listings found matching your search.</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-eden-marigold hover:text-eden-marigold/80 font-semibold transition-colors"
                >
                  Clear filters and try again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
