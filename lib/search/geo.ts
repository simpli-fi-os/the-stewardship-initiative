// ============================================
// TSI Search Engine — Geographic Search Layer
// PostGIS-powered radius search + distance calculation
// ============================================

import { SupabaseClient } from '@supabase/supabase-js'
import { LayerResult } from './types'

/**
 * Search resources within a geographic radius using PostGIS.
 * Returns results sorted by distance with normalized scores.
 */
export async function searchNearby(
  supabase: SupabaseClient,
  lat: number,
  lng: number,
  radiusMiles: number = 25,
  filters: {
    type?: string
    categorySlug?: string
  } = {},
  limit: number = 50
): Promise<{ results: LayerResult[]; raw: any[]; timeMs: number }> {
  const start = performance.now()

  const { data, error } = await supabase.rpc('search_resources_nearby', {
    search_lat: lat,
    search_lng: lng,
    radius_miles: radiusMiles,
    filter_type: filters.type || null,
    filter_category_slug: filters.categorySlug || null,
    result_limit: limit,
  })

  if (error || !data || data.length === 0) {
    return {
      results: [],
      raw: [],
      timeMs: performance.now() - start,
    }
  }

  // Normalize distance to score: closer = higher score
  // Score = 1 - (distance / radiusMiles), clamped to [0, 1]
  const results: LayerResult[] = data.map((r: any) => ({
    id: r.id,
    score: Math.max(0, 1 - (r.distance_miles || 0) / radiusMiles),
    source: 'geo' as const,
  }))

  return {
    results,
    raw: data,
    timeMs: performance.now() - start,
  }
}

/**
 * Haversine distance in miles (client-side fallback).
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959 // Earth radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Geocode a location string to lat/lng using free Nominatim API.
 * Rate-limited, cached results recommended.
 */
export async function geocodeLocation(
  locationStr: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const encoded = encodeURIComponent(`${locationStr}, Texas, USA`)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'TSI-Platform/1.0 (contact: info@thestewardshipinitiative.org)',
        },
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    if (data.length === 0) return null

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    }
  } catch {
    return null
  }
}
