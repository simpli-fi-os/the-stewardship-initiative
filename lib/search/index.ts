// ============================================
// TSI Search Engine — Main Orchestrator
// Three-layer hybrid search with RRF fusion
//
// Layer 1: PostgreSQL FTS + trigram fallback
// Layer 2: pgvector semantic search (embeddings)
// Layer 3: AI query interpretation (Claude)
// Fusion: Reciprocal Rank Fusion (RRF)
// ============================================

import { SupabaseClient } from '@supabase/supabase-js'
import {
  SearchRequest,
  SearchResponse,
  ResourceResult,
  SearchFacets,
  AIQueryInterpretation,
  LayerResult,
} from './types'
import { searchFTS } from './fts'
import { searchSemantic } from './semantic'
import { interpretQuery, classifyQueryLocally } from './ai-query'
import { searchNearby, haversineDistance } from './geo'
import { reciprocalRankFusion, applyBoosts, sortResults } from './fusion'

// Layer weights for RRF fusion
const LAYER_WEIGHTS = {
  fts: 1.0,      // Full-text search: primary signal
  semantic: 0.7,  // Semantic: supports FTS, catches synonyms
  geo: 0.5,       // Geographic: proximity bonus
}

/**
 * Execute a hybrid search across all layers.
 *
 * Flow:
 * 1. Parse & classify query (local heuristic)
 * 2. Optionally invoke AI interpretation (if enableAI)
 * 3. Execute search layers in parallel:
 *    a. FTS + trigram
 *    b. Semantic (if embeddings available)
 *    c. Geographic (if lat/lng provided)
 * 4. Fuse results with RRF
 * 5. Hydrate full resource data
 * 6. Apply boosts (trust, premium, verification)
 * 7. Sort, paginate, return
 */
export async function search(
  supabase: SupabaseClient,
  request: SearchRequest
): Promise<SearchResponse> {
  const totalStart = performance.now()
  const timing: SearchResponse['timing'] = { totalMs: 0 }

  const query = request.query?.trim() || ''
  const page = Math.max(1, request.page || 1)
  const perPage = Math.min(request.perPage || 20, 100)
  const enableSemantic = request.enableSemantic !== false
  const enableAI = request.enableAI === true

  let aiInterpretation: AIQueryInterpretation | null = null

  // ─── Step 1: Query Classification ──────────────────
  let effectiveQuery = query
  let effectiveFilters = {
    type: request.type,
    city: request.city,
    state: request.state,
    county: request.county,
    categorySlug: request.category,
    verification: request.verification,
  }

  if (query) {
    // Local heuristic classification (free, instant)
    const classification = classifyQueryLocally(query)

    if (classification.likelyCategory && !request.category) {
      effectiveFilters.categorySlug = classification.likelyCategory
    }
    if (classification.likelyType && !request.type) {
      effectiveFilters.type = classification.likelyType as any
    }

    // ─── Step 2: AI Interpretation (opt-in) ────────────
    if (enableAI && !classification.isSimple) {
      const aiStart = performance.now()
      aiInterpretation = await interpretQuery(query)
      timing.aiMs = performance.now() - aiStart

      if (aiInterpretation && aiInterpretation.confidence > 0.6) {
        effectiveQuery = aiInterpretation.reformulatedQuery || query
        if (aiInterpretation.suggestedFilters.category && !request.category) {
          effectiveFilters.categorySlug = aiInterpretation.suggestedFilters.category
        }
        if (aiInterpretation.suggestedFilters.type && !request.type) {
          effectiveFilters.type = aiInterpretation.suggestedFilters.type as any
        }
        if (aiInterpretation.suggestedFilters.city && !request.city) {
          effectiveFilters.city = aiInterpretation.suggestedFilters.city
        }
      }
    }
  }

  // ─── Step 3: Execute Search Layers in Parallel ─────

  const layerPromises: Promise<{ key: string; results: LayerResult[]; raw: any[]; timeMs: number }>[] = []

  // Layer 1: FTS (always runs if query present)
  if (effectiveQuery) {
    layerPromises.push(
      searchFTS(supabase, effectiveQuery, effectiveFilters, 100).then(r => ({
        key: 'fts',
        ...r,
      }))
    )
  }

  // Layer 2: Semantic (if enabled and query present)
  if (effectiveQuery && enableSemantic) {
    layerPromises.push(
      searchSemantic(supabase, effectiveQuery, {
        type: effectiveFilters.type,
        city: effectiveFilters.city,
        state: effectiveFilters.state,
      }, 100).then(r => ({
        key: 'semantic',
        ...r,
      }))
    )
  }

  // Layer 3: Geographic (if coordinates provided)
  if (request.lat && request.lng) {
    layerPromises.push(
      searchNearby(supabase, request.lat, request.lng, request.radiusMiles || 25, {
        type: effectiveFilters.type,
        categorySlug: effectiveFilters.categorySlug,
      }, 100).then(r => ({
        key: 'geo',
        ...r,
      }))
    )
  }

  // Execute all layers in parallel
  const layerResults = await Promise.all(layerPromises)

  // Collect timing
  for (const lr of layerResults) {
    if (lr.key === 'fts') timing.ftsMs = lr.timeMs
    if (lr.key === 'semantic') timing.semanticMs = lr.timeMs
  }

  // ─── Step 4: Fuse Results with RRF ─────────────────

  const fusionStart = performance.now()

  // Build raw data map from all layers
  const rawDataMap = new Map<string, any>()
  for (const lr of layerResults) {
    for (const item of lr.raw) {
      if (!rawDataMap.has(item.id)) {
        rawDataMap.set(item.id, item)
      }
    }
  }

  let fusedScores: Map<string, { score: number; sources: string[] }>

  if (layerResults.length > 0 && layerResults.some(lr => lr.results.length > 0)) {
    // Multiple layers: use RRF
    fusedScores = reciprocalRankFusion(
      layerResults.map(lr => ({
        results: lr.results,
        weight: LAYER_WEIGHTS[lr.key as keyof typeof LAYER_WEIGHTS] || 0.5,
      }))
    )
  } else {
    // No text query — fetch all published resources with filters
    fusedScores = new Map()

    let dbQuery = supabase
      .from('resources')
      .select('*')
      .eq('published', true)
      .order('rating', { ascending: false })
      .limit(200)

    if (effectiveFilters.type) dbQuery = dbQuery.eq('type', effectiveFilters.type)
    if (effectiveFilters.state) dbQuery = dbQuery.eq('state', effectiveFilters.state)
    if (effectiveFilters.city) dbQuery = dbQuery.ilike('city', `%${effectiveFilters.city}%`)
    if (effectiveFilters.county) dbQuery = dbQuery.eq('county', effectiveFilters.county)
    if (request.minRating) dbQuery = dbQuery.gte('rating', request.minRating)
    if (request.tags && request.tags.length > 0) dbQuery = dbQuery.contains('tags', request.tags)

    const { data: allData } = await dbQuery

    if (allData) {
      // If category filter, need to join — do it manually
      let filteredData = allData
      if (effectiveFilters.categorySlug) {
        const { data: catResources } = await supabase
          .from('resource_categories')
          .select('resource_id, categories!inner(slug)')
          .eq('categories.slug', effectiveFilters.categorySlug)

        if (catResources) {
          const catResourceIds = new Set(catResources.map((cr: any) => cr.resource_id))
          filteredData = allData.filter(r => catResourceIds.has(r.id))
        }
      }

      for (const item of filteredData) {
        rawDataMap.set(item.id, item)
        fusedScores.set(item.id, {
          score: (item.rating || 0) / 5, // normalize rating to 0-1 as relevance proxy
          sources: [],
        })
      }
    }
  }

  timing.fusionMs = performance.now() - fusionStart

  // ─── Step 5: Hydrate Results ──────────────────────

  let results: ResourceResult[] = []
  fusedScores.forEach((fused, id) => {
    const raw = rawDataMap.get(id)
    if (!raw) return

    const result: ResourceResult = {
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      shortDescription: raw.short_description || raw.description?.substring(0, 150) || null,
      type: raw.type,
      city: raw.city,
      state: raw.state,
      county: raw.county || null,
      lat: raw.lat || null,
      lng: raw.lng || null,
      rating: parseFloat(raw.rating) || 0,
      reviewCount: raw.review_count || 0,
      verificationLevel: raw.verification_level || 'unverified',
      trustScore: parseFloat(raw.trust_score) || 0,
      premiumTier: raw.premium_tier || 'free',
      tags: raw.tags || [],
      logoUrl: raw.logo_url || null,
      photoUrls: raw.photo_urls || [],
      website: raw.website || null,
      phone: raw.phone || null,
      hours: raw.hours || null,
      featured: raw.featured || false,
      relevanceScore: fused.score,
      matchSource: fused.sources as any,
    }

    // Compute distance if user location provided
    if (request.lat && request.lng && result.lat && result.lng) {
      result.distanceMiles = parseFloat(
        haversineDistance(request.lat, request.lng, result.lat, result.lng).toFixed(1)
      )
    } else if (raw.distance_miles !== undefined) {
      result.distanceMiles = parseFloat(parseFloat(raw.distance_miles).toFixed(1))
    }

    results.push(result)
  })

  // ─── Step 6: Apply Boosts ─────────────────────────

  results = applyBoosts(results, fusedScores)

  // ─── Step 7: Sort & Paginate ──────────────────────

  results = sortResults(results, request.sort || 'relevance')

  const total = results.length
  const paginatedResults = results.slice((page - 1) * perPage, page * perPage)

  // ─── Step 8: Get Facets ────────────────────────────

  let facets: SearchFacets = {
    types: {},
    states: {},
    counties: {},
    categories: {},
    verification: {},
    total,
  }

  // Compute facets from all results (not just paginated)
  for (const r of results) {
    facets.types[r.type] = (facets.types[r.type] || 0) + 1
    facets.states[r.state] = (facets.states[r.state] || 0) + 1
    if (r.county) facets.counties[r.county] = (facets.counties[r.county] || 0) + 1
    facets.verification[r.verificationLevel] = (facets.verification[r.verificationLevel] || 0) + 1
    for (const tag of r.tags) {
      facets.categories[tag] = (facets.categories[tag] || 0) + 1
    }
  }

  timing.totalMs = performance.now() - totalStart

  return {
    results: paginatedResults,
    total,
    page,
    perPage,
    facets,
    query: {
      original: query,
      interpreted: aiInterpretation,
    },
    timing,
  }
}

// Re-export types and utilities
export * from './types'
export { generateResourceEmbedding } from './semantic'
export { geocodeLocation } from './geo'
