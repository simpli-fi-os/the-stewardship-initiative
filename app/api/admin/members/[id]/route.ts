import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { sendMemberApprovedEmail } from '@/lib/email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify auth via cookie
  const accessToken = request.cookies.get('sb-access-token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: memberId } = await params
  const body = await request.json()
  const { action } = body as { action: 'approve' | 'reject' | 'toggle-featured' }

  const supabase = createAdminClient()

  if (action === 'approve') {
    const { data, error } = await supabase
      .from('members')
      .update({
        approved: true,
        approved_at: new Date().toISOString(),
        rejected_at: null,
        rejection_reason: null,
      })
      .eq('id', memberId)
      .select('approved, approved_at, rejected_at, rejection_reason, featured')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Send approval notification email
    const { data: memberInfo } = await supabase
      .from('members')
      .select('name, email, org_id')
      .eq('id', memberId)
      .single()

    if (memberInfo?.email) {
      const { data: org } = await supabase
        .from('organizations')
        .select('slug')
        .eq('id', memberInfo.org_id)
        .single()

      const directoryUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://thestewardshipinitiative.org'}/directory/${org?.slug || ''}`
      await sendMemberApprovedEmail(memberInfo.email, memberInfo.name, directoryUrl)
    }

    return NextResponse.json({ member: data })
  }

  if (action === 'reject') {
    const reason = body.reason || null
    const { data, error } = await supabase
      .from('members')
      .update({
        approved: false,
        rejected_at: new Date().toISOString(),
        rejection_reason: reason,
        approved_at: null,
      })
      .eq('id', memberId)
      .select('approved, approved_at, rejected_at, rejection_reason, featured')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ member: data })
  }

  if (action === 'toggle-featured') {
    // Get current state
    const { data: current } = await supabase
      .from('members')
      .select('featured')
      .eq('id', memberId)
      .single()

    if (!current) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

    const { data, error } = await supabase
      .from('members')
      .update({ featured: !current.featured })
      .eq('id', memberId)
      .select('approved, approved_at, rejected_at, rejection_reason, featured')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ member: data })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
