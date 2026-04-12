import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

// Simple in-memory rate limit (5 submissions per IP per hour)
const submissionsByIp = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = submissionsByIp.get(ip)

  if (!record || record.resetAt < now) {
    submissionsByIp.set(ip, { count: 1, resetAt: now + 3600000 }) // 1 hour
    return true
  }

  if (record.count >= 5) {
    return false
  }

  record.count += 1
  return true
}

function generateSlug(name: string, city?: string, state?: string): string {
  let slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

  if (city) {
    slug += `-${city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`
  }

  if (state) {
    slug += `-${state.toLowerCase()}`
  }

  return slug.trim()
}

function validateSubmission(data: any): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.type) errors.type = 'Resource type is required'
  if (!data.name || data.name.trim().length === 0) errors.name = 'Resource name is required'
  if (!data.description || data.description.length < 20)
    errors.description = 'Description must be at least 20 characters'
  if (data.description && data.description.length > 500)
    errors.description = 'Description must not exceed 500 characters'
  if (!data.short_description || data.short_description.trim() === '')
    errors.short_description = 'Short description is required'
  if (data.short_description && data.short_description.length > 150)
    errors.short_description = 'Short description must not exceed 150 characters'
  if (!data.city || data.city.trim().length === 0) errors.city = 'City is required'

  // Validate email if provided
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email address'
  }

  // Validate phone if provided
  if (data.phone && !/^[+\d\s\-().]+$/.test(data.phone)) {
    errors.phone = 'Invalid phone number'
  }

  // Validate website if provided
  if (data.website) {
    try {
      new URL(data.website)
    } catch {
      errors.website = 'Invalid website URL'
    }
  }

  return errors
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check rate limit
    const ip = getClientIp(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many submissions from this IP. Please try again in an hour.',
        },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate required fields
    const errors = validateSubmission(body)
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors,
        },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = generateSlug(body.name, body.city, body.state)

    // Initialize Supabase admin client
    const supabase = createAdminSupabaseClient()

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('resources')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            'A resource with this name in this location already exists. Please contact us if this is your organization.',
        },
        { status: 409 }
      )
    }

    // Insert resource with default values for submission
    const { data: resource, error: insertError } = await supabase
      .from('resources')
      .insert({
        name: body.name,
        slug: slug,
        type: body.type,
        description: body.description,
        short_description: body.short_description,
        city: body.city,
        state: body.state || 'TX',
        zip: body.zip || null,
        county: body.county || null,
        address: body.address || null,
        phone: body.phone || null,
        email: body.email || null,
        website: body.website || null,
        hours: body.hours || null,
        tags: body.tags && body.tags.length > 0 ? body.tags : null,
        verification_level: 'self_reported',
        source: 'manual',
        published: false, // Pending review
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create resource. Please try again.',
        },
        { status: 500 }
      )
    }

    // Link categories via resource_categories join table
    if (body.category_ids && body.category_ids.length > 0) {
      const categoryLinks = body.category_ids.map((categoryId: number) => ({
        resource_id: resource.id,
        category_id: categoryId,
      }))

      const { error: categoryError } = await supabase
        .from('resource_categories')
        .insert(categoryLinks)

      if (categoryError) {
        console.error('Database category error:', categoryError)
        // Don't fail the whole submission if category linking fails
        console.warn(`Categories could not be linked for resource ${resource.id}`)
      }
    }

    // Log submission
    console.log(`New resource submission: ${resource.id} - ${body.name}`)

    return NextResponse.json({
      success: true,
      resourceId: resource.id,
      message:
        'Your resource has been submitted for review. Our team will verify and publish it within 48 hours.',
    })
  } catch (err) {
    console.error('Submission error:', err)
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}
