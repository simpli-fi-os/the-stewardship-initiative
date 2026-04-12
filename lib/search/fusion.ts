// ============================================
// TSI Search Engine — Reciprocal Rank Fusion (RRF)
// Combines results from multiple search layers
// ============================================

import { LayerResult, ResourceResult } from './types'

/**
 * Reciprocal Rank Fusion (RRF) — combines ranked lists from multiple retrieval layers.
 *
 * For each document d appearing in any layer's results:
 *   RRF_score(d) = Σ [ weight_i / (k + rank_i(d)) ]
 *
 * where:
 *   k = smoothing constant (default 60, standard in literature)
 *   rank_i(d) = position of d in layer i's ranked list (1-indexed)
 *   weight_i = layer weight (allows boosting certain layers)
 *
 * Reference: Cormack, Clarke, Buettcher (2009)
 */
export function reciprocalRankFusion(
  layers: {
    results: LayerResult[]
    weight: number
  }[],
  k: number = 60
): Map<string, { score: number; sources: string[] }> {
  const scores = new Map<string, { score: number; sources: string[] }>()

  for (const layer of layers) {
    for (let rank = 0; rank < layer.results.length; rank++) {
      const item = layer.results[rank]
      const rrfScore = layer.weight / (k + rank + 1) // rank is 0-indexed, formula is 1-indexed

      const existing = scores.get(item.id)
      if (existing) {
        existing.score += rrfScore
        if (!existing.sources.includes(item.source)) {
          existing.sources.push(item.source)
        }
      } else {
        scores.set(item.id, {
          score: rrfScore,
          sources: [item.source],
        })
      }
    }
  }

  return scores
}

/**
 * Apply trust and premium boosting to fused scores.
 *
 * Boost factors:
 * - Featured resources: +15%
 * - Premium tiers: canopy +10%, redwood +12%
 * - Verification: officially_verified +8%, community_verified +4%
 * - High trust score (>80): +5%
 */
export function applyBoosts(
  results: ResourceResult[],
  fusedScores: Map<string, { score: number; sources: string[] }>
): ResourceResult[] {
  return results.map(r => {
    const fused = fusedScores.get(r.id)
    if (!fused) return r

    let boostedScore = fused.score

    // Featured boost
    if (r.featured) boostedScore *= 1.15

    // Premium tier boost
    if (r.premiumTier === 'redwood') boostedScore *= 1.12
    else if (r.premiumTier === 'canopy') boostedScore *= 1.10
    else if (r.premiumTier === 'sprout') boostedScore *= 1.05

    // Verification boost
    if (r.verificationLevel === 'officially_verified') boostedScore *= 1.08
    else if (r.verificationLevel === 'community_verified') boostedScore *= 1.04

    // Trust score boost
    if (r.trustScore > 80) boostedScore *= 1.05

    return {
      ...r,
      relevanceScore: boostedScore,
      matchSource: fused.sources as any,
    }
  })
}

/**
 * Sort results by the specified sort option.
 */
export function sortResults(
  results: ResourceResult[],
  sort: string = 'relevance'
): ResourceResult[] {
  const sorted = [...results]

  switch (sort) {
    case 'relevance':
      sorted.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      break
    case 'rating':
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case 'distance':
      sorted.sort((a, b) => (a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity))
      break
    case 'trust':
      sorted.sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0))
      break
    case 'name_asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name_desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'newest':
      // Relies on ID ordering (UUIDv7 or created_at if available)
      sorted.reverse()
      break
    default:
      sorted.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
  }

  return sorted
}
