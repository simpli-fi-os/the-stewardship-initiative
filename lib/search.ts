// Search utility functions for TSI directory

import { SearchParams, Facet } from '@/lib/types/directory'

/**
 * Build a Supabase PostgreSQL FTS query with filters
 * Handles text search, geographic radius, tags, ratings, and other facets
 */
export function buildSearchQuery(params: SearchParams): {
  query: string
  filters: Record<string, unknown>
} {
  const filters: Record<string, unknown> = {}
  const whereClauses: string[] = []

  // Type filter
  if (params.type) {
    whereClauses.push(`type = '${params.type}'`)
  }

  // Subtype filter
  if (params.subtype) {
    whereClauses.push(`subtype = '${params.subtype}'`)
  }

  // Category filter (via tags)
  if (params.category) {
    whereClauses.push(`tags @> ARRAY['${params.category}']`)
  }

  // State filter
  if (params.state) {
    whereClauses.push(`state = '${params.state}'`)
  }

  // City filter
  if (params.city) {
    whereClauses.push(`city ILIKE '%${params.city}%'`)
  }

  // County filter
  if (params.county) {
    whereClauses.push(`county = '${params.county}'`)
  }

  // Radius filter (requires lat/lng)
  if (params.radius && params.lat && params.lng) {
    const earthRadius = 3959 // miles
    whereClauses.push(
      `(6371 * acos(cos(radians(${params.lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${params.lng})) + sin(radians(${params.lat})) * sin(radians(lat)))) <= ${params.radius}`
    )
  }

  // Tags filter
  if (params.tags && params.tags.length > 0) {
    const tagPlaceholders = params.tags.map(tag => `'${tag}'`).join(',')
    whereClauses.push(`tags && ARRAY[${tagPlaceholders}]`)
  }

  // Rating filter
  if (params.min_rating) {
    whereClauses.push(`rating >= ${params.min_rating}`)
  }

  // Salary filters
  if (params.min_salary) {
    // Assuming salary stored in cents, so 50000 * 100 = 5000000
    whereClauses.push(`salary_data.starting_pay >= ${params.min_salary * 100}`)
  }
  if (params.max_salary) {
    whereClauses.push(`salary_data.starting_pay <= ${params.max_salary * 100}`)
  }

  // Cost of living filters
  if (params.min_cost_of_living) {
    whereClauses.push(`city_data.cost_of_living_index >= ${params.min_cost_of_living}`)
  }
  if (params.max_cost_of_living) {
    whereClauses.push(`city_data.cost_of_living_index <= ${params.max_cost_of_living}`)
  }

  // School rating filter
  if (params.min_school_rating) {
    whereClauses.push(`city_data.school_rating >= ${params.min_school_rating}`)
  }

  // Outdoor score filter
  if (params.min_outdoor_score) {
    whereClauses.push(`city_data.outdoor_score >= ${params.min_outdoor_score}`)
  }

  // Pension type filter
  if (params.pension_type) {
    whereClauses.push(`salary_data.pension_type = '${params.pension_type}'`)
  }

  // Hiring status filter (stored in metadata)
  if (params.hiring_status) {
    whereClauses.push(`metadata->>'hiring_status' = '${params.hiring_status}'`)
  }

  // Lateral friendly filter
  if (params.lateral_friendly !== undefined) {
    whereClauses.push(`metadata->>'lateral_friendly' = '${params.lateral_friendly}'`)
  }

  // Academy provided filter
  if (params.academy_provided !== undefined) {
    whereClauses.push(`metadata->>'academy_provided' = '${params.academy_provided}'`)
  }

  // Build the final WHERE clause
  const whereClause = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : ''

  // Build the query
  let query = `SELECT * FROM listings${whereClause}`

  // Add full-text search if query provided
  if (params.q) {
    const searchQuery = params.q.trim()
    query = `
      SELECT * FROM (
        SELECT *, 
          ts_rank(to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, '')), 
                  plainto_tsquery('english', '${searchQuery}')) as rank
        FROM listings
        WHERE to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, '')) @@ 
              plainto_tsquery('english', '${searchQuery}')
        ${whereClause ? `AND ${whereClauses.join(' AND ')}` : ''}
        UNION ALL
        SELECT *, 
          similarity(name, '${searchQuery}') as rank
        FROM listings
        WHERE name % '${searchQuery}' 
        ${whereClause ? `AND ${whereClauses.join(' AND ')}` : ''}
      ) search_results
      ORDER BY rank DESC
    `
  } else {
    // Default sort
    if (params.sort) {
      const sortMap: Record<string, string> = {
        name_asc: 'name ASC',
        name_desc: 'name DESC',
        rating_desc: 'rating DESC, review_count DESC',
        distance_asc: 'distance_miles ASC',
        salary_desc: 'salary_data.starting_pay DESC',
        salary_asc: 'salary_data.starting_pay ASC',
        salary_adjusted_desc: 'city_data.salary_adjusted DESC',
        relevance: 'rating DESC',
      }
      const sortClause = sortMap[params.sort] || 'rating DESC'
      query += ` ORDER BY ${sortClause}`
    } else {
      query += ' ORDER BY rating DESC, review_count DESC'
    }
  }

  return { query, filters }
}

/**
 * Parse NextJS search params into typed SearchParams
 */
export function parseSearchParams(searchParams: Record<string, string | string[] | undefined>): SearchParams {
  const params: SearchParams = {}

  if (searchParams.q) {
    params.q = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q
  }

  if (searchParams.type) {
    const type = Array.isArray(searchParams.type) ? searchParams.type[0] : searchParams.type
    params.type = type as any
  }

  if (searchParams.subtype) {
    params.subtype = Array.isArray(searchParams.subtype) ? searchParams.subtype[0] : searchParams.subtype
  }

  if (searchParams.category) {
    params.category = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category
  }

  if (searchParams.state) {
    params.state = Array.isArray(searchParams.state) ? searchParams.state[0] : searchParams.state
  }

  if (searchParams.city) {
    params.city = Array.isArray(searchParams.city) ? searchParams.city[0] : searchParams.city
  }

  if (searchParams.county) {
    params.county = Array.isArray(searchParams.county) ? searchParams.county[0] : searchParams.county
  }

  if (searchParams.radius) {
    params.radius = parseInt(
      Array.isArray(searchParams.radius) ? searchParams.radius[0] : searchParams.radius,
      10
    )
  }

  if (searchParams.lat) {
    params.lat = parseFloat(Array.isArray(searchParams.lat) ? searchParams.lat[0] : searchParams.lat)
  }

  if (searchParams.lng) {
    params.lng = parseFloat(Array.isArray(searchParams.lng) ? searchParams.lng[0] : searchParams.lng)
  }

  if (searchParams.tags) {
    params.tags = Array.isArray(searchParams.tags) ? searchParams.tags : [searchParams.tags]
  }

  if (searchParams.min_rating) {
    params.min_rating = parseFloat(
      Array.isArray(searchParams.min_rating) ? searchParams.min_rating[0] : searchParams.min_rating
    )
  }

  if (searchParams.min_salary) {
    params.min_salary = parseInt(
      Array.isArray(searchParams.min_salary) ? searchParams.min_salary[0] : searchParams.min_salary,
      10
    )
  }

  if (searchParams.max_salary) {
    params.max_salary = parseInt(
      Array.isArray(searchParams.max_salary) ? searchParams.max_salary[0] : searchParams.max_salary,
      10
    )
  }

  if (searchParams.min_cost_of_living) {
    params.min_cost_of_living = parseFloat(
      Array.isArray(searchParams.min_cost_of_living)
        ? searchParams.min_cost_of_living[0]
        : searchParams.min_cost_of_living
    )
  }

  if (searchParams.max_cost_of_living) {
    params.max_cost_of_living = parseFloat(
      Array.isArray(searchParams.max_cost_of_living)
        ? searchParams.max_cost_of_living[0]
        : searchParams.max_cost_of_living
    )
  }

  if (searchParams.min_school_rating) {
    params.min_school_rating = parseFloat(
      Array.isArray(searchParams.min_school_rating)
        ? searchParams.min_school_rating[0]
        : searchParams.min_school_rating
    )
  }

  if (searchParams.min_outdoor_score) {
    params.min_outdoor_score = parseFloat(
      Array.isArray(searchParams.min_outdoor_score)
        ? searchParams.min_outdoor_score[0]
        : searchParams.min_outdoor_score
    )
  }

  if (searchParams.pension_type) {
    params.pension_type = Array.isArray(searchParams.pension_type)
      ? searchParams.pension_type[0]
      : searchParams.pension_type
  }

  if (searchParams.hiring_status) {
    params.hiring_status = Array.isArray(searchParams.hiring_status)
      ? searchParams.hiring_status[0]
      : searchParams.hiring_status
  }

  if (searchParams.lateral_friendly) {
    params.lateral_friendly = Array.isArray(searchParams.lateral_friendly)
      ? searchParams.lateral_friendly[0] === 'true'
      : searchParams.lateral_friendly === 'true'
  }

  if (searchParams.academy_provided) {
    params.academy_provided = Array.isArray(searchParams.academy_provided)
      ? searchParams.academy_provided[0] === 'true'
      : searchParams.academy_provided === 'true'
  }

  if (searchParams.sort) {
    params.sort = Array.isArray(searchParams.sort) ? (searchParams.sort[0] as any) : (searchParams.sort as any)
  }

  if (searchParams.page) {
    params.page = parseInt(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page, 10)
  }

  if (searchParams.per_page) {
    const perPage = parseInt(
      Array.isArray(searchParams.per_page) ? searchParams.per_page[0] : searchParams.per_page,
      10
    )
    // Cap at 100 per page
    params.per_page = Math.min(perPage, 100)
  }

  return params
}

/**
 * Generate facets from search results for filtering UI
 * Groups results by types, subtypes, states, counties, salary ranges, hiring status, categories
 */
export function generateFacets(results: any[]): Record<string, Record<string, number>> {
  const facets: Record<string, Record<string, number>> = {
    types: {},
    subtypes: {},
    states: {},
    counties: {},
    salary_ranges: {},
    hiring_status: {},
    categories: {},
  }

  results.forEach(result => {
    // Type facet
    if (result.type) {
      facets.types[result.type] = (facets.types[result.type] || 0) + 1
    }

    // Subtype facet
    if (result.subtype) {
      facets.subtypes[result.subtype] = (facets.subtypes[result.subtype] || 0) + 1
    }

    // State facet
    if (result.state) {
      facets.states[result.state] = (facets.states[result.state] || 0) + 1
    }

    // County facet
    if (result.county) {
      facets.counties[result.county] = (facets.counties[result.county] || 0) + 1
    }

    // Salary range facet
    if (result.salary?.starting) {
      const salary = result.salary.starting / 100 // Convert from cents
      let range = 'unknown'
      if (salary < 40000) range = 'under_40k'
      else if (salary < 60000) range = '40k_60k'
      else if (salary < 80000) range = '60k_80k'
      else if (salary < 100000) range = '80k_100k'
      else range = 'over_100k'
      facets.salary_ranges[range] = (facets.salary_ranges[range] || 0) + 1
    }

    // Hiring status facet
    if (result.metadata?.hiring_status) {
      const status = result.metadata.hiring_status
      facets.hiring_status[status] = (facets.hiring_status[status] || 0) + 1
    }

    // Categories facet (from tags)
    if (result.tags && Array.isArray(result.tags)) {
      result.tags.forEach((tag: string) => {
        facets.categories[tag] = (facets.categories[tag] || 0) + 1
      })
    }
  })

  return facets
}

/**
 * Calculate distance in miles between two lat/lng points (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
