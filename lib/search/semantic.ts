// ============================================
// TSI Search Engine — Layer 2: Semantic Search
// pgvector embeddings with cosine similarity
// ============================================

import { SupabaseClient } from '@supabase/supabase-js'
import { LayerResult } from './types'

/**
 * Generate embedding for a search query using OpenAI's API.
 * Uses text-embedding-3-small for cost efficiency (1536 dimensions).
 * Returns null if API key not configured (graceful degradation).
 */
async function generateEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 1536,
      }),
    })

    if (!response.ok) {
      console.error('Embedding API error:', response.status)
      return null
    }

    const data = await response.json()
    return data.data?.[0]?.embedding || null
  } catch (error) {
    console.error('Embedding generation failed:', error)
    return null
  }
}

/**
 * Execute semantic vector search using pgvector.
 * Generates an embedding for the query, then finds nearest neighbors.
 * Returns empty results if embeddings are not available (graceful degradation).
 */
export async function searchSemantic(
  supabase: SupabaseClient,
  query: string,
  filters: {
    type?: string
    city?: string
    state?: string
  } = {},
  limit: number = 50
): Promise<{ results: LayerResult[]; raw: any[]; timeMs: number }> {
  const start = performance.now()

  // Generate query embedding
  const embedding = await generateEmbedding(query)

  if (!embedding) {
    return {
      results: [],
      raw: [],
      timeMs: performance.now() - start,
    }
  }

  // Execute semantic search via RPC
  const { data, error } = await supabase.rpc('search_resources_semantic', {
    query_embedding: JSON.stringify(embedding),
    filter_type: filters.type || null,
    filter_city: filters.city || null,
    filter_state: filters.state || null,
    similarity_threshold: 0.45,
    result_limit: limit,
  })

  if (error || !data || data.length === 0) {
    return {
      results: [],
      raw: [],
      timeMs: performance.now() - start,
    }
  }

  const results: LayerResult[] = data.map((r: any) => ({
    id: r.id,
    score: r.semantic_score || 0, // already 0-1
    source: 'semantic' as const,
  }))

  return {
    results,
    raw: data,
    timeMs: performance.now() - start,
  }
}

/**
 * Generate and store an embedding for a resource.
 * Called when a resource is created or updated.
 */
export async function generateResourceEmbedding(
  supabase: SupabaseClient,
  resourceId: string,
  name: string,
  description: string | null,
  tags: string[] = [],
  city: string = '',
  type: string = ''
): Promise<boolean> {
  const text = [
    name,
    description || '',
    tags.join(', '),
    `Located in ${city}`,
    `Type: ${type}`,
  ].filter(Boolean).join('. ')

  const embedding = await generateEmbedding(text)
  if (!embedding) return false

  const { error } = await supabase
    .from('resources')
    .update({ embedding: JSON.stringify(embedding) })
    .eq('id', resourceId)

  return !error
}
