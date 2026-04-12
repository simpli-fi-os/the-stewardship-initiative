// ============================================
// TSI Search Engine — Layer 1: Full-Text Search
// PostgreSQL FTS with trigram fallback
// ============================================

import { SupabaseClient } from '@supabase/supabase-js'
import { LayerResult } from './types'

/**
 * Execute PostgreSQL full-text search using pre-computed tsvector.
 * Uses websearch_to_tsquery for natural language query parsing.
 * Falls back to trigram similarity when FTS returns no results.
 */
export async function searchFTS(
  supabase: SupabaseClient,
  query: string,
  filters: {
    type?: string
    city?: string
    state?: string
    county?: string
    categorySlug?: string
    verification?: string
  } = {},
  limit: number = 50
): Promise<{ results: LayerResult[]; raw: any[]; timeMs: number }> {
  const start = performance.now()

  // Try FTS first
  const { data: ftsData, error: ftsError } = await supabase.rpc('search_resources_fts', {
    search_query: query,
    filter_type: filters.type || null,
    filter_city: filters.city || null,
    filter_state: filters.state || null,
    filter_county: filters.county || null,
    filter_category_slug: filters.categorySlug || null,
    filter_verification: filters.verification || null,
    result_limit: limit,
  })

  if (!ftsError && ftsData && ftsData.length > 0) {
    const maxRank = Math.max(...ftsData.map((r: any) => r.fts_rank || 0), 0.001)
    const results: LayerResult[] = ftsData.map((r: any) => ({
      id: r.id,
      score: (r.fts_rank || 0) / maxRank, // normalize to 0-1
      source: 'fts' as const,
    }))

    return {
      results,
      raw: ftsData,
      timeMs: performance.now() - start,
    }
  }

  // Fallback: trigram similarity search
  const { data: trigramData, error: trigramError } = await supabase.rpc('search_resources_trigram', {
    search_term: query,
    filter_type: filters.type || null,
    similarity_threshold: 0.12,
    result_limit: limit,
  })

  if (!trigramError && trigramData && trigramData.length > 0) {
    const maxScore = Math.max(...trigramData.map((r: any) => r.trigram_score || 0), 0.001)
    const results: LayerResult[] = trigramData.map((r: any) => ({
      id: r.id,
      score: (r.trigram_score || 0) / maxScore,
      source: 'trigram' as const,
    }))

    return {
      results,
      raw: trigramData,
      timeMs: performance.now() - start,
    }
  }

  return {
    results: [],
    raw: [],
    timeMs: performance.now() - start,
  }
}
