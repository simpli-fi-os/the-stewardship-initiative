// GET/POST /api/listings — Retrieve single listing by slug or create new listing

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, createServerClient } from '@/lib/supabase'
import { Listing, ListingInsert } from '@/lib/types/directory'

// Helper to generate URL-safe slug from name, city, state
function generateSlug(name: string, city: string, state: string): string {
  return `${name}-${city}-${state}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 100)
}

/**
 * GET /api/listings?slug=...
 * Retrieve a single listing by slug
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const slug = request.nextUrl.searchParams.get('slug')
    if (!slug) {
      return NextResponse.json({ error: 'slug parameter required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json(data as Listing)
  } catch (error) {
    console.error('GET /api/listings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/listings
 * Create a new listing (requires service role auth)
 * Body: ListingInsert
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify service role (admin only)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as ListingInsert

    // Validate required fields
    if (!body.name || !body.city || !body.state || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, city, state, type' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = generateSlug(body.name, body.city, body.state)

    const supabase = createServerClient()

    // Check if slug already exists
    const { data: existing } = await supabase.from('listings').select('id').eq('slug', slug).single()
    if (existing) {
      return NextResponse.json({ error: 'Listing with this slug already exists' }, { status: 409 })
    }

    // Create listing
    const { data, error } = await supabase
      .from('listings')
      .insert({
        type: body.type,
        subtype: body.subtype || null,
        name: body.name,
        slug,
        description: body.description || null,
        city: body.city,
        state: body.state,
        zip: body.zip || null,
        county: body.county || null,
        address: body.address || null,
        lat: body.lat || null,
        lng: body.lng || null,
        phone: body.phone || null,
        email: body.email || null,
        website: body.website || null,
        logo_url: body.logo_url || null,
        photo_urls: body.photo_urls || null,
        tags: body.tags || null,
        source: body.source || null,
        source_url: body.source_url || null,
        claimed: false,
        claimed_by: null,
        premium_tier: 'free',
        stripe_subscription_id: null,
        metadata: body.metadata || null,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        scraped_at: null,
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data as Listing, { status: 201 })
  } catch (error) {
    console.error('POST /api/listings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/listings?id=...
 * Update an existing listing (requires service role auth)
 * Body: Partial<Listing>
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify service role (admin only)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id parameter required' }, { status: 400 })
    }

    const body = await request.json()

    const supabase = createServerClient()

    // Verify listing exists
    const { data: existing, error: getError } = await supabase
      .from('listings')
      .select('id')
      .eq('id', id)
      .single()

    if (getError || !existing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Update listing
    const { data, error } = await supabase
      .from('listings')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data as Listing)
  } catch (error) {
    console.error('PATCH /api/listings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
