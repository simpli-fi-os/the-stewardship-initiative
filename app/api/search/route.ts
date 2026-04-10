// GET /api/search — Multi-parameter faceted search with FTS + trigram fallback

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { parseSearchParams, generateFacets, calculateDistance } from '@/lib/search'
import { ListingSearchResult, SearchResponse } from '@/lib/types/directory'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const params = parseSearchParams(searchParams)

    // Validate pagination
    const page = Math.max(1, params.page || 1)
    const perPage = Math.min(params.per_page || 20, 100)
    const offset = (page - 1) * perPage

    const supabase = getSupabase()

    // Build base query — select all listings with optional filters
    let query = supabase.from('listings').select('*', { count: 'exact' })

    // Apply type filter
    if (params.type) {
      query = query.eq('type', params.type)
    }

    // Apply subtype filter
    if (params.subtype) {
      query = query.eq('subtype', params.subtype)
    }

    // Apply state filter
    if (params.state) {
      query = query.eq('state', params.state)
    }

    // Apply city filter
    if (params.city) {
      query = query.ilike('city', `%${params.city}%`)
    }

    // Apply county filter
    if (params.county) {
      query = query.eq('county', params.county)
    }

    // Apply rating filter
    if (params.min_rating) {
      query = query.gte('rating', params.min_rating)
    }

    // Apply tags filter (category)
    if (params.category) {
      query = query.contains('tags', [params.category])
    }

    // Apply multiple tags (AND logic)
    if (params.tags && params.tags.length > 0) {
      for (const tag of params.tags) {
        query = query.contains('tags', [tag])
      }
    }

    // For search text, try FTS first, then trigram fallback
    let textSearchResults: any[] = []
    if (params.q) {
      const searchTerm = params.q.trim()

      // Try full-text search first
      const { data: ftsData } = await supabase.rpc('search_listings_fts', {
        search_query: searchTerm,
      })

      if (ftsData && ftsData.length > 0) {
        textSearchResults = ftsData
      } else {
        // Fallback to trigram similarity search
        const { data: trigramData } = await supabase.rpc('search_listings_trigram', {
          search_term: searchTerm,
        })

        if (trigramData && trigramData.length > 0) {
          textSearchResults = trigramData
        }
      }
    }

    // Execute the main query
    const { data: allListings, count, error } = await query.order('rating', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    let results = allListings || []

    // If we have text search results, intersect them with filtered results
    if (textSearchResults.length > 0) {
      const textSearchIds = new Set(textSearchResults.map((r: any) => r.id))
      results = results.filter(r => textSearchIds.has(r.id))
    }

    // Apply geolocation radius filter if provided
    if (params.radius && params.lat && params.lng) {
      results = results.filter((listing: any) => {
        if (!listing.lat || !listing.lng) return true // Include if coords missing
        const distance = calculateDistance(params.lat!, params.lng!, listing.lat, listing.lng)
        return distance <= params.radius!
      })
    }

    // Apply salary range filter
    if (params.min_salary || params.max_salary) {
      // Note: This would require joining with salary_data table
      // For now, filter is client-side if needed
    }

    // Apply cost of living filter
    if (params.min_cost_of_living || params.max_cost_of_living) {
      // Note: This would require joining with city table
      // For now, filter is client-side if needed
    }

    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'name_asc':
          results.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))
          break
        case 'name_desc':
          results.sort((a: any, b: any) => (b.name || '').localeCompare(a.name || ''))
          break
        case 'rating_desc':
          results.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
          break
        case 'distance_asc':
          if (params.lat && params.lng) {
            results.sort((a: any, b: any) => {
              const distA = calculateDistance(params.lat!, params.lng!, a.lat || 0, a.lng || 0)
              const distB = calculateDistance(params.lat!, params.lng!, b.lat || 0, b.lng || 0)
              return distA - distB
            })
          }
          break
      }
    }

    // Pagination
    const paginatedResults = results.slice(offset, offset + perPage)

    // Generate search results with optional fields
    const searchResults: ListingSearchResult[] = paginatedResults.map((listing: any) => {
      const result: ListingSearchResult = {
        id: listing.id,
        type: listing.type,
        subtype: listing.subtype,
        name: listing.name,
        slug: listing.slug,
        city: listing.city,
        state: listing.state,
        rating: listing.rating,
        review_count: listing.review_count,
        premium_tier: listing.premium_tier,
        tags: listing.tags,
        photo_url: listing.photo_urls?.[0] || null,
      }

      // Add distance if geolocation provided
      if (params.lat && params.lng && listing.lat && listing.lng) {
        result.distance_miles = parseFloat(
          calculateDistance(params.lat, params.lng, listing.lat, listing.lng).toFixed(1)
        )
      }

      return result
    })

    // Generate facets from ALL results (not just paginated)
    const facets = generateFacets(results)

    const response: SearchResponse = {
      results: searchResults,
      total: results.length,
      page,
      per_page: perPage,
      facets: {
        types: facets.types,
        subtypes: facets.subtypes,
        states: facets.states,
        counties: facets.counties,
        salary_ranges: facets.salary_ranges,
        hiring_status: facets.hiring_status,
        categories: facets.categories,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
