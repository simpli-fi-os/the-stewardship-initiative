import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { createServerClient } = await import('@/lib/supabase')
  const supabase = createServerClient()

  // Look up org by slug
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', params.slug)
    .single()

  if (orgError || !org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  }

  const formData = await request.formData()
  const name = formData.get('name') as string
  const title = formData.get('title') as string | null
  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const bio = formData.get('bio') as string | null
  const description = formData.get('description') as string | null
  const skillIds = formData.getAll('skillIds') as string[]
  const photo = formData.get('photo') as File | null

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  let photo_url: string | null = null

  // Upload photo if provided
  if (photo && photo.size > 0) {
    const ext = photo.name.split('.').pop() || 'jpg'
    const fileName = `${params.slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('member-photos')
      .upload(fileName, photo, { contentType: photo.type })

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from('member-photos')
        .getPublicUrl(fileName)
      photo_url = urlData.publicUrl
    }
  }

  // Insert member (approved: false by default)
  const { data: member, error: memberError } = await supabase
    .from('members')
    .insert({
      org_id: org.id,
      name: name.trim(),
      title: title?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      bio: bio?.trim() || null,
      description: description?.trim() || null,
      photo_url,
      approved: false,
      available: false,
    })
    .select('id')
    .single()

  if (memberError || !member) {
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }

  // Insert member_skills
  if (skillIds.length > 0) {
    const memberSkillRows = skillIds.map(skillId => ({
      member_id: member.id,
      skill_id: skillId,
    }))
    await supabase.from('member_skills').insert(memberSkillRows)
  }

  return NextResponse.json({ success: true, memberId: member.id })
}
