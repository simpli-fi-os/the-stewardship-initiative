// ============================================
// TSI Search Engine — Type Definitions
// ============================================

export type ResourceType = 'resource' | 'provider' | 'church' | 'nonprofit' | 'maker' | 'farm' | 'education' | 'agency' | 'government'

export type VerificationLevel = 'unverified' | 'self_reported' | 'community_verified' | 'officially_verified'

export type PremiumTier = 'free' | 'seed' | 'sprout' | 'canopy' | 'redwood'

export type SortOption = 'relevance' | 'rating' | 'distance' | 'trust' | 'name_asc' | 'name_desc' | 'newest'

// ─── Search Input ────────────────────────────────────

export interface SearchRequest {
  // Text query (natural language)
  query?: string

  // Structured filters
  type?: ResourceType
  category?: string // category slug
  city?: string
  state?: string
  county?: string
  tags?: string[]
  verification?: VerificationLevel
  minRating?: number

  // Geographic
  lat?: number
  lng?: number
  radiusMiles?: number

  // Pagination & sorting
  sort?: SortOption
  page?: number
  perPage?: number

  // Feature flags
  enableSemantic?: boolean // default true
  enableAI?: boolean // default false for now (cost control)
}

// ─── Search Output ───────────────────────────────────

export interface ResourceResult {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  type: ResourceType
  city: string
  state: string
  county: string | null
  lat: number | null
  lng: number | null
  rating: number
  reviewCount: number
  verificationLevel: VerificationLevel
  trustScore: number
  premiumTier: PremiumTier
  tags: string[]
  logoUrl: string | null
  photoUrls: string[]
  website: string | null
  phone: string | null
  hours: Record<string, string> | null
  featured: boolean

  // Computed per-search
  distanceMiles?: number | null
  relevanceScore?: number
  matchSource?: ('fts' | 'trigram' | 'semantic' | 'ai' | 'geo')[]
}

export interface SearchFacets {
  types: Record<string, number>
  states: Record<string, number>
  counties: Record<string, number>
  categories: Record<string, number>
  verification: Record<string, number>
  total: number
}

export interface SearchResponse {
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
    aiMs?: number
    fusionMs?: number
  }
}

// ─── AI Query Interpretation ─────────────────────────

export interface AIQueryInterpretation {
  // What the user is looking for
  intent: 'find_resource' | 'find_provider' | 'compare' | 'navigate' | 'info'
  // Extracted structured filters
  suggestedFilters: {
    type?: ResourceType
    category?: string
    city?: string
    tags?: string[]
  }
  // Reformulated search query (cleaner for FTS)
  reformulatedQuery: string
  // Natural language summary of what was understood
  summary: string
  // Confidence 0-1
  confidence: number
}

// ─── Internal Layer Results ──────────────────────────

export interface LayerResult {
  id: string
  score: number // normalized 0-1
  source: 'fts' | 'trigram' | 'semantic' | 'geo'
}
