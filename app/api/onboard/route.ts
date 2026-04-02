import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const SKILL_COLORS = [
  '#26A69A', '#FDB833', '#D90368', '#A44A3F', '#6366F1',
  '#059669', '#D97706', '#DC2626', '#7C3AED', '#2563EB',
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      churchName,
      websiteUrl,
      city,
      state,
      congregationSize,
      adminName,
      adminEmail,
      adminPassword,
      skills,
    } = body as {
      churchName: string
      websiteUrl?: string
      city?: string
      state?: string
      congregationSize?: string
      adminName: string
      adminEmail: string
      adminPassword: string
      skills: string[]
    }

    if (!churchName || !adminName || !adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (adminPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Generate unique slug
    let slug = slugify(churchName)
    const { data: existing } = await supabase
      .from('organizations')
      .select('slug')
      .eq('slug', slug)
      .single()

    if (existing) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`
    }

    // Build description from location
    const locationParts = [city, state].filter(Boolean)
    const description = locationParts.length > 0
      ? `Community skills directory for ${churchName} in ${locationParts.join(', ')}`
      : `Community skills directory for ${churchName}`

    // 1. Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: churchName,
        slug,
        description,
        website_url: websiteUrl || null,
        tier: 'seed',
      })
      .select('id')
      .single()

    if (orgError || !org) {
      console.error('Org creation error:', orgError)
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
    }

    // 2. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: adminName },
    })

    if (authError || !authData.user) {
      console.error('Auth creation error:', authError)
      // Clean up org
      await supabase.from('organizations').delete().eq('id', org.id)
      return NextResponse.json({
        error: authError?.message || 'Failed to create admin account',
      }, { status: 400 })
    }

    // 3. Update profile with org and admin role
    // The profile is auto-created by the auth trigger
    await supabase
      .from('profiles')
      .update({
        org_id: org.id,
        role: 'admin',
        full_name: adminName,
      })
      .eq('id', authData.user.id)

    // 4. Create skill categories
    if (skills && skills.length > 0) {
      const skillRows = skills.map((name, i) => ({
        org_id: org.id,
        name,
        color: SKILL_COLORS[i % SKILL_COLORS.length],
      }))

      await supabase.from('skills').insert(skillRows)
    }

    return NextResponse.json({
      success: true,
      slug,
      orgId: org.id,
    })
  } catch (err) {
    console.error('Onboard error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
