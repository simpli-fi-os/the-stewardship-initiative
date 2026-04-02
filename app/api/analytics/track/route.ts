import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { org_id, event_type, metadata, member_id, session_id } = body as {
      org_id: string
      event_type: string
      metadata: Record<string, unknown>
      member_id: string | null
      session_id: string
    }

    const validTypes = ['page_view', 'search', 'filter', 'contact_click', 'profile_view', 'request_service']
    if (!org_id || !event_type || !validTypes.includes(event_type)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    }

    const supabase = createAdminClient()

    await supabase.from('directory_views').insert({
      org_id,
      event_type,
      metadata,
      member_id: member_id || null,
      session_id: session_id || null,
    })

    return NextResponse.json({ tracked: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
