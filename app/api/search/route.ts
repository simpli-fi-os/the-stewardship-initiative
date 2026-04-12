// ============================================
// GET /api/search — TSI Three-Layer Hybrid Search
//
// Layers:
//   1. PostgreSQL FTS + trigram fallback
//   2. pgvector semantic search (embeddings)
//   3. AI query interpretation (Claude, opt-in)
// Fusion: Reciprocal Rank Fusion (RRF)
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { search, SearchRequest, ResourceType, VerificationLevel, SortOption } from '@/lib/search'

export const runtime = 'nodejs'
export const maxDuration = 15 // seconds

export async function GET(request: NextRequest): Promise<NextResponse> {
  const start = performance.now()

  try {
    const params = request.nextUrl.searchParams
    const supabase = createServerClient()

    // Parse search request from URL params
    const searchRequest: SearchRequest = {
      query: params.get('q') || undefined,
      type: (params.get('type') as ResourceType) || undefined,
      category: params.get('category') || undefined,
      city: params.get('city') || undefined,
      state: params.get('state') || undefined,
      county: params.get('county') || undefined,
      tags: params.get('tags')?.split(',').filter(Boolean) || undefined,
      verification: (params.get('verification') as VerificationLevel) || undefined,
      minRating: params.has('min_rating') ? parseFloat(params.get('min_rating')!) : undefined,
      lat: params.has('lat') ? parseFloat(params.get('lat')!) : undefined,
      lng: params.has('lng') ? parseFloat(params.get('lng')!) : undefined,
      radiusMiles: params.has('radius') ? parseFloat(params.get('radius')!) : undefined,
      sort: (params.get('sort') as SortOption) || 'relevance',
      page: params.has('page') ? parseInt(params.get('page')!, 10) : 1,
      perPage: params.has('per_page') ? Math.min(parseInt(params.get('per_page')!, 10), 100) : 20,
      enableSemantic: params.get('semantic') !== 'false',
      enableAI: params.get('ai') === 'true',
    }

    // Execute hybrid search
    const response = await search(supabase, searchRequest)

    // Log search query for analytics (fire-and-forget)
    if (searchRequest.query) {
      void supabase
        .from('search_queries')
        .insert({
          query_text: searchRequest.query,
          query_type: response.query.interpreted ? 'ai' : 'text',
          result_count: response.total,
          filters: {
            type: searchRequest.type,
            category: searchRequest.category,
            city: searchRequest.city,
            state: searchRequest.state,
          },
          response_time_ms: Math.round(response.timing.totalMs),
        })
        .then(() => {}) // fire and forget
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Search-Time-Ms': Math.round(response.timing.totalMs).toString(),
      },
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
