import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { ListingSubmission, SubmissionResponse } from '@/lib/types/submission'

// Simple in-memory rate limit (5 submissions per IP per hour)
const submissionsByIp = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
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

function generateSlug(name: string, city: string, state: string): string {
  return `${name}-${city}-${state}`
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function validateSubmission(data: ListingSubmission): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!data.type) errors.type = 'Listing type is required'
  if (!data.name || data.name.trim().length === 0) errors.name = 'Organization/Business name is required'
  if (!data.category) errors.category = 'Category is required'
  if (!data.description || data.description.length < 20) errors.description = 'Description must be at least 20 characters'
  if (data.description && data.description.length > 500) errors.description = 'Description must not exceed 500 characters'
  if (!data.city || data.city.trim().length === 0) errors.city = 'City is required'
  if (!data.state) errors.state = 'State is required'
  if (!data.county) errors.county = 'County is required'
  if (!data.termsAccepted) errors.termsAccepted = 'You must accept the terms to submit'
  
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

export async function POST(request: NextRequest): Promise<NextResponse<SubmissionResponse>> {
  try {
    // Check rate limit
    const ip = getClientIp(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many submissions from this IP. Please try again in an hour.'
        },
        { status: 429 }
      )
    }
    
    const body = await request.json() as ListingSubmission
    
    // Validate required fields
    const errors = validateSubmission(body)
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      )
    }
    
    // Generate slug
    const slug = generateSlug(body.name, body.city, body.state)
    
    // Initialize Supabase
    const supabase = createAdminClient()
    
    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('listings')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'A listing with this name in this location already exists. Please contact us if this is your business.'
        },
        { status: 409 }
      )
    }
    
    // Build metadata from additional data
    const metadata: Record<string, unknown> = body.additionalData || {}
    
    // Insert listing
    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert({
        type: body.type,
        name: body.name,
        slug: slug,
        description: body.description,
        category: body.category,
        subtype: body.subcategory || null,
        city: body.city,
        state: body.state,
        county: body.county,
        zip: body.zip || null,
        address: body.address || null,
        phone: body.phone || null,
        email: body.email || null,
        website: body.website || null,
        tags: body.tags && body.tags.length > 0 ? body.tags : null,
        metadata: metadata,
        published: false, // Pending review
        source: 'user_submission',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create listing. Please try again.'
        },
        { status: 500 }
      )
    }
    
    // TODO: Send notification email via Resend API if configured
    // For now, just log
    console.log(`New listing submission: ${listing.id} - ${body.name}`)
    
    return NextResponse.json({
      success: true,
      listingId: listing.id,
      message: 'Your listing has been submitted for review. Our editorial team will publish it within 48 hours.'
    })
  } catch (err) {
    console.error('Submission error:', err)
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    )
  }
}
