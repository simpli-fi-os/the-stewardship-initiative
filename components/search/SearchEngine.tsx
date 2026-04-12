'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ResourceCard from './ResourceCard'
import { ResourceResult, SearchFacets, SortOption, AIQueryInterpretation } from '@/lib/search/types'

// ─── Types ────────────────────────────────────────────

interface SearchState {
  query: string
  type: string
  category: string
  city: string
  county: string
  verification: string
  minRating: number
  sort: SortOption
  page: number
  lat: number | null
  lng: number | null
  radiusMiles: number
}

interface SearchResult {
  results: ResourceResult[]
  total: number
  page: number
  perPage: number
  facets: SearchFacets
  query: {
    original: string
    interpreted?: AIQueryInterpretation | null
  }
  timing: {
    totalMs: number
    ftsMs?: number
    semanticMs?: number
  }
}

// ─── Category quick-links ─────────────────────────────

const POPULAR_CATEGORIES = [
  { slug: 'food-assistance', label: 'Food', icon: '🍎' },
  { slug: 'housing-shelter', label: 'Housing', icon: '🏠' },
  { slug: 'medical-health', label: 'Medical', icon: '🏥' },
  { slug: 'mental-health', label: 'Counseling', icon: '💚' },
  { slug: 'legal-aid', label: 'Legal', icon: '⚖️' },
  { slug: 'financial-assistance', label: 'Financial', icon: '💰' },
  { slug: 'childcare-youth', label: 'Childcare', icon: '👶' },
  { slug: 'veteran-services', label: 'Veterans', icon: '🎖️' },
  { slug: 'crisis-emergency', label: 'Crisis', icon: '🚨' },
  { slug: 'faith-based-services', label: 'Faith', icon: '⛪' },
]

// ─── Component ────────────────────────────────────────

export default function SearchEngine() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [state, setState] = useState<SearchState>({
    query: searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    county: searchParams.get('county') || '',
    verification: searchParams.get('verification') || '',
    minRating: Number(searchParams.get('min_rating')) || 0,
    sort: (searchParams.get('sort') as SortOption) || 'relevance',
    page: Number(searchParams.get('page')) || 1,
    lat: searchParams.has('lat') ? Number(searchParams.get('lat')) : null,
    lng: searchParams.has('lng') ? Number(searchParams.get('lng')) : null,
    radiusMiles: Number(searchParams.get('radius')) || 25,
  })

  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // ─── Fetch Results ──────────────────────────────────

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (state.query.trim()) params.set('q', state.query.trim())
      if (state.type) params.set('type', state.type)
      if (state.category) params.set('category', state.category)
      if (state.city) params.set('city', state.city)
      if (state.county) params.set('county', state.county)
      if (state.verification) params.set('verification', state.verification)
      if (state.minRating > 0) params.set('min_rating', String(state.minRating))
      if (state.sort && state.sort !== 'relevance') params.set('sort', state.sort)
      if (state.lat && state.lng) {
        params.set('lat', String(state.lat))
        params.set('lng', String(state.lng))
        params.set('radius', String(state.radiusMiles))
      }
      params.set('page', String(state.page))
      params.set('per_page', '20')

      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error('Search failed')

      const data: SearchResult = await res.json()
      setResult(data)
    } catch (err) {
      console.error('Search error:', err)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }, [state])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  // ─── URL Sync ───────────────────────────────────────

  useEffect(() => {
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    if (q !== state.query || category !== state.category) {
      setState((s: SearchState) => ({ ...s, query: q, category, page: 1 }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // ─── Handlers ───────────────────────────────────────

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState((s: SearchState) => ({ ...s, page: 1 }))
    // Update URL
    const params = new URLSearchParams()
    if (state.query.trim()) params.set('q', state.query.trim())
    if (state.category) params.set('category', state.category)
    router.push(`/search?${params.toString()}`, { scroll: false })
  }

  const setFilter = (key: keyof SearchState, value: string | number) => {
    setState((s: SearchState) => ({ ...s, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setState((s: SearchState) => ({
      ...s,
      type: '',
      category: '',
      city: '',
      county: '',
      verification: '',
      minRating: 0,
      page: 1,
    }))
  }

  const requestLocation = () => {
    if (!navigator.geolocation) return
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState((s: SearchState) => ({
          ...s,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          sort: 'distance' as SortOption,
          page: 1,
        }))
        setLocationLoading(false)
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: false, timeout: 5000 }
    )
  }

  const clearLocation = () => {
    setState((s: SearchState) => ({
      ...s,
      lat: null,
      lng: null,
      sort: s.sort === 'distance' ? 'relevance' : s.sort,
    }))
  }

  const handleCategoryClick = (slug: string) => {
    setState((s: SearchState) => ({
      ...s,
      category: s.category === slug ? '' : slug,
      page: 1,
    }))
  }

  // ─── Derived State ──────────────────────────────────

  const hasActiveFilters = !!(state.type || state.category || state.city || state.county || state.verification || state.minRating > 0)
  const hasLocation = state.lat !== null && state.lng !== null
  const totalPages = result ? Math.ceil(result.total / result.perPage) : 0

  // ─── Render ─────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Search Bar ── */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-eden-gray" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={state.query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState((s: SearchState) => ({ ...s, query: e.target.value }))}
            placeholder="What do you need help with? Try 'food near me' or 'mental health counseling'..."
            className="w-full pl-14 pr-32 py-4 eden-glass rounded-2xl text-eden-orchid placeholder-eden-gray/50 focus:outline-none focus:ring-2 focus:ring-eden-tidal/30 focus:border-eden-tidal/40 text-base transition-all duration-300"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Location toggle */}
            <button
              type="button"
              onClick={hasLocation ? clearLocation : requestLocation}
              disabled={locationLoading}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                hasLocation
                  ? 'bg-eden-tidal/20 text-eden-tidal'
                  : 'bg-eden-jungle/40 text-eden-gray hover:text-eden-orchid hover:bg-eden-lush/60'
              }`}
              title={hasLocation ? 'Remove location filter' : 'Use my location'}
            >
              {locationLoading ? (
                <div className="w-4 h-4 border-2 border-eden-tidal/30 border-t-eden-tidal rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill={hasLocation ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              )}
            </button>
            {/* Search button */}
            <button
              type="submit"
              className="px-6 py-2.5 bg-eden-marigold text-eden-jungle font-semibold rounded-xl hover:bg-eden-marigold/90 transition-all duration-300 text-sm shadow-lg shadow-eden-marigold/20"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* ── Category Quick Links ── */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {POPULAR_CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
              state.category === cat.slug
                ? 'bg-eden-tidal text-eden-jungle shadow-lg shadow-eden-tidal/20'
                : 'bg-eden-jungle/60 text-eden-gray border border-eden-tidal/15 hover:border-eden-tidal/40 hover:text-eden-orchid'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── AI Interpretation Banner ── */}
      {result?.query?.interpreted && result.query.interpreted.confidence > 0.6 && (
        <div className="mb-6 max-w-3xl mx-auto eden-glass rounded-xl px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-eden-tidal/20 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-eden-tidal">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 0 1 10 10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <p className="text-sm text-eden-gray">
            <span className="text-eden-orchid font-medium">Understood: </span>
            {result.query.interpreted.summary}
          </p>
        </div>
      )}

      {/* ── Active Filter Pills ── */}
      {(hasActiveFilters || hasLocation) && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {state.type && (
            <FilterPill label={state.type} onRemove={() => setFilter('type', '')} />
          )}
          {state.category && (
            <FilterPill label={state.category.replace(/-/g, ' ')} onRemove={() => setFilter('category', '')} color="tidal" />
          )}
          {state.city && (
            <FilterPill label={state.city} onRemove={() => setFilter('city', '')} />
          )}
          {state.county && (
            <FilterPill label={state.county} onRemove={() => setFilter('county', '')} />
          )}
          {state.verification && (
            <FilterPill label={state.verification.replace(/_/g, ' ')} onRemove={() => setFilter('verification', '')} />
          )}
          {state.minRating > 0 && (
            <FilterPill label={`${state.minRating}+ stars`} onRemove={() => setFilter('minRating', 0)} color="marigold" />
          )}
          {hasLocation && (
            <FilterPill label={`Within ${state.radiusMiles} mi`} onRemove={clearLocation} color="tidal" />
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-eden-gray/60 hover:text-eden-orchid transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Mobile Filter Toggle ── */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full eden-glass rounded-xl px-5 py-3 flex items-center justify-between text-eden-orchid font-medium text-sm"
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
          </span>
          <svg className={`w-4 h-4 transition-transform duration-300 ${mobileFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileFiltersOpen && (
          <div className="mt-3 eden-glass rounded-xl p-6">
            <FilterPanel
              state={state}
              facets={result?.facets}
              onFilterChange={setFilter}
              onClear={clearFilters}
              hasLocation={hasLocation}
              onRequestLocation={requestLocation}
              onClearLocation={clearLocation}
            />
          </div>
        )}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="eden-glass rounded-2xl p-6 sticky top-24">
            <FilterPanel
              state={state}
              facets={result?.facets}
              onFilterChange={setFilter}
              onClear={clearFilters}
              hasLocation={hasLocation}
              onRequestLocation={requestLocation}
              onClearLocation={clearLocation}
            />
          </div>
        </aside>

        {/* Results Area */}
        <div className="lg:col-span-3">
          {/* Results header */}
          {!loading && result && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-eden-gray">
                {result.total > 0 ? (
                  <>
                    <span className="font-semibold text-eden-orchid">{result.total}</span> resource{result.total !== 1 ? 's' : ''}
                    {state.query && (
                      <> for <span className="text-eden-tidal font-medium">&ldquo;{state.query}&rdquo;</span></>
                    )}
                    {result.timing.totalMs && (
                      <span className="text-eden-gray/40 ml-2">({Math.round(result.timing.totalMs)}ms)</span>
                    )}
                  </>
                ) : null}
              </p>

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={state.sort}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('sort', e.target.value)}
                  className="appearance-none bg-eden-jungle/80 border border-eden-tidal/20 rounded-lg px-3 py-1.5 pr-8 text-xs text-eden-orchid focus:outline-none focus:border-eden-tidal/40 cursor-pointer"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="trust">Most Trusted</option>
                  {hasLocation && <option value="distance">Nearest</option>}
                  <option value="name_asc">Name A-Z</option>
                  <option value="newest">Newest</option>
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-eden-gray pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-eden-tidal/10" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-eden-marigold animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-eden-tidal animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
              <p className="text-eden-gray font-medium">Searching resources...</p>
            </div>
          ) : result && result.results.length > 0 ? (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {result.results.map((r: ResourceResult) => (
                  <ResourceCard key={r.id} resource={r} showDistance={hasLocation} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setFilter('page', Math.max(1, state.page - 1))}
                    disabled={state.page === 1}
                    className="px-5 py-2.5 rounded-xl eden-glass text-eden-orchid text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-eden-tidal/40 transition-all duration-300 flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) pageNum = i + 1
                      else if (state.page <= 3) pageNum = i + 1
                      else if (state.page >= totalPages - 2) pageNum = totalPages - 4 + i
                      else pageNum = state.page - 2 + i
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setFilter('page', pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-300 ${
                            state.page === pageNum
                              ? 'bg-eden-tidal text-eden-jungle shadow-lg shadow-eden-tidal/20'
                              : 'text-eden-gray hover:text-eden-orchid hover:bg-eden-lush/50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setFilter('page', Math.min(totalPages, state.page + 1))}
                    disabled={state.page === totalPages}
                    className="px-5 py-2.5 rounded-xl eden-glass text-eden-orchid text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-eden-tidal/40 transition-all duration-300 flex items-center gap-2"
                  >
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ── Empty State ── */
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-eden-tidal/10 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-eden-orchid mb-3">No Resources Found</h2>
              <p className="text-eden-gray max-w-md mx-auto leading-relaxed mb-6">
                {state.query
                  ? `We couldn\u0027t find anything matching \u201C${state.query}\u201D. Try broadening your search or adjusting your filters.`
                  : 'No resources match your current filters. Try adjusting your criteria.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-eden-marigold text-eden-jungle font-semibold rounded-xl hover:bg-eden-marigold/90 transition-all duration-300 text-sm shadow-lg shadow-eden-marigold/20"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Filter Panel Component ───────────────────────────

function FilterPanel({
  state,
  facets,
  onFilterChange,
  onClear,
  hasLocation,
  onRequestLocation,
  onClearLocation,
}: {
  state: SearchState
  facets?: SearchFacets
  onFilterChange: (key: keyof SearchState, value: string | number) => void
  onClear: () => void
  hasLocation: boolean
  onRequestLocation: () => void
  onClearLocation: () => void
}) {
  const hasActiveFilters = !!(state.type || state.category || state.city || state.county || state.verification || state.minRating > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-eden-orchid flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
        </h3>
        {hasActiveFilters && (
          <button onClick={onClear} className="text-xs text-eden-marigold hover:text-eden-marigold/80 font-medium transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* Location */}
      <div>
        <h4 className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-3">Location</h4>
        {hasLocation ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-eden-tidal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" fill="#022C22" />
              </svg>
              Using your location
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-eden-gray">Radius:</label>
              <select
                value={state.radiusMiles}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('radiusMiles', Number(e.target.value))}
                className="flex-1 bg-eden-jungle/80 border border-eden-tidal/20 rounded-lg px-3 py-1.5 text-xs text-eden-orchid focus:outline-none"
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
                <option value={100}>100 miles</option>
              </select>
            </div>
            <button onClick={onClearLocation} className="text-xs text-eden-gray hover:text-eden-orchid transition-colors">
              Remove location
            </button>
          </div>
        ) : (
          <button
            onClick={onRequestLocation}
            className="w-full px-4 py-2.5 eden-glass rounded-lg text-sm text-eden-gray hover:text-eden-orchid hover:border-eden-tidal/40 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Use my location
          </button>
        )}
      </div>

      {/* Type Filter */}
      <div>
        <h4 className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-3">Type</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { val: '', label: 'All' },
            { val: 'nonprofit', label: 'Nonprofits' },
            { val: 'provider', label: 'Providers' },
            { val: 'church', label: 'Churches' },
            { val: 'government', label: 'Government' },
          ].map(({ val, label }) => (
            <button
              key={val || 'all'}
              onClick={() => onFilterChange('type', val)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                state.type === val
                  ? 'bg-eden-tidal text-eden-jungle shadow-lg shadow-eden-tidal/20'
                  : 'bg-eden-jungle/60 text-eden-gray border border-eden-tidal/15 hover:border-eden-tidal/40 hover:text-eden-orchid'
              }`}
            >
              {label}
              {facets?.types?.[val] ? ` (${facets.types[val]})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Filter */}
      <div>
        <h4 className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-3">Verification</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { val: '', label: 'Any' },
            { val: 'officially_verified', label: 'Verified' },
            { val: 'community_verified', label: 'Community' },
          ].map(({ val, label }) => (
            <button
              key={val || 'all'}
              onClick={() => onFilterChange('verification', val)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                state.verification === val
                  ? 'bg-eden-marigold text-eden-jungle shadow-lg shadow-eden-marigold/20'
                  : 'bg-eden-jungle/60 text-eden-gray border border-eden-tidal/15 hover:border-eden-marigold/40 hover:text-eden-orchid'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-3">Minimum Rating</h4>
        <div className="flex gap-2">
          {[
            { val: 0, label: 'Any' },
            { val: 3, label: '3+' },
            { val: 4, label: '4+' },
            { val: 4.5, label: '4.5+' },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => onFilterChange('minRating', val)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                state.minRating === val
                  ? 'bg-eden-marigold text-eden-jungle shadow-lg shadow-eden-marigold/20'
                  : 'bg-eden-jungle/60 text-eden-gray border border-eden-tidal/15 hover:border-eden-marigold/40 hover:text-eden-orchid'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* County Filter (from facets) */}
      {facets?.counties && Object.keys(facets.counties).length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-3">County</h4>
          <select
            value={state.county}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('county', e.target.value)}
            className="w-full px-4 py-2.5 bg-eden-jungle/80 border border-eden-tidal/20 rounded-lg text-eden-orchid text-sm focus:outline-none focus:border-eden-tidal/50 appearance-none cursor-pointer transition-colors"
          >
            <option value="">All Counties</option>
            {Object.entries(facets.counties)
              .sort((a, b) => b[1] - a[1])
              .map(([county, count]) => (
                <option key={county} value={county}>
                  {county} ({count})
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  )
}

// ─── Filter Pill Component ────────────────────────────

function FilterPill({
  label,
  onRemove,
  color = 'tidal',
}: {
  label: string
  onRemove: () => void
  color?: 'tidal' | 'marigold'
}) {
  const colorClasses = color === 'marigold'
    ? 'bg-eden-marigold/15 text-eden-marigold border-eden-marigold/20'
    : 'bg-eden-tidal/15 text-eden-tidal border-eden-tidal/20'

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full border capitalize ${colorClasses}`}>
      {label}
      <button onClick={onRemove} className="hover:text-eden-orchid transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  )
}
