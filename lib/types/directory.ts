// Directory and Search Types for TSI Platform

export type ListingType = 'provider' | 'agency' | 'church' | 'nonprofit' | 'maker' | 'resource' | 'farm' | 'education'

export interface DirectoryCategory {
  slug: string
  name: string
  description: string
  icon: string // Lucide icon name
  parentGroup: 'resources' | 'family-office'
  color: string // Hex color
}

export interface Listing {
  id: string
  type: ListingType
  subtype: string | null
  name: string
  slug: string
  description: string | null
  city: string
  state: string
  zip: string | null
  county: string | null
  address: string | null
  lat: number | null
  lng: number | null
  phone: string | null
  email: string | null
  website: string | null
  logo_url: string | null
  photo_urls: string[] | null
  rating: number | null
  review_count: number
  tags: string[] | null
  source: string | null
  source_url: string | null
  claimed: boolean
  claimed_by: string | null
  premium_tier: 'free' | 'featured' | 'premium' | 'sponsored'
  stripe_subscription_id: string | null
  metadata: Record<string, unknown> | null
  published: boolean
  created_at: string
  updated_at: string
  scraped_at: string | null
}

export interface ListingSearchResult {
  id: string
  type: ListingType
  subtype: string | null
  name: string
  slug: string
  city: string
  state: string
  rating: number | null
  review_count: number
  premium_tier: 'free' | 'featured' | 'premium' | 'sponsored'
  tags: string[] | null
  photo_url: string | null
  distance_miles?: number | null
  salary?: {
    starting: number | null
    mid: number | null
    top: number | null
    pension_type: string | null
  }
  city_data?: {
    cost_of_living_index: number | null
    median_home_price: number | null
    school_rating: number | null
    outdoor_score: number | null
    salary_adjusted: number | null
  }
}

export interface SalaryData {
  id: string
  listing_id: string
  role: string
  year: number
  starting_pay: number | null // in cents
  mid_career_pay: number | null
  top_pay: number | null
  overtime_avg: number | null
  benefits_value: number | null
  pension_type: string | null
  pension_contribution_pct: number | null
  source: string | null
  source_url: string | null
  created_at: string
}

export interface City {
  id: string
  name: string
  state: string
  slug: string
  population: number | null
  median_household_income: number | null // in cents
  median_home_price: number | null // in cents
  cost_of_living_index: number | null
  school_rating: number | null
  safety_score: number | null
  climate_zone: string | null
  outdoor_score: number | null
  commute_avg_minutes: number | null
  walkability_score: number | null
  nearest_military_base: string | null
  nearest_military_base_miles: number | null
  state_income_tax_rate: number | null
  tags: string[] | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface SearchParams {
  q?: string
  type?: ListingType
  subtype?: string
  category?: string
  state?: string
  city?: string
  county?: string
  radius?: number
  lat?: number
  lng?: number
  tags?: string[]
  min_rating?: number
  min_salary?: number
  max_salary?: number
  min_cost_of_living?: number
  max_cost_of_living?: number
  min_school_rating?: number
  min_outdoor_score?: number
  pension_type?: string
  hiring_status?: string
  lateral_friendly?: boolean
  academy_provided?: boolean
  sort?: 'relevance' | 'name_asc' | 'name_desc' | 'rating_desc' | 'distance_asc' | 'salary_desc' | 'salary_asc' | 'salary_adjusted_desc'
  page?: number
  per_page?: number
}

export interface Facet {
  [key: string]: number | Record<string, number>
}

export interface SearchResponse {
  results: ListingSearchResult[]
  total: number
  page: number
  per_page: number
  facets: {
    types?: Record<string, number>
    subtypes?: Record<string, number>
    states?: Record<string, number>
    counties?: Record<string, number>
    salary_ranges?: Record<string, number>
    hiring_status?: Record<string, number>
    categories?: Record<string, number>
  }
}

export interface ListingInsert {
  type: ListingType
  subtype?: string
  name: string
  city: string
  state: string
  zip?: string
  county?: string
  address?: string
  lat?: number
  lng?: number
  phone?: string
  email?: string
  website?: string
  logo_url?: string
  photo_urls?: string[]
  tags?: string[]
  source?: string
  source_url?: string
  metadata?: Record<string, unknown>
  description?: string
}
