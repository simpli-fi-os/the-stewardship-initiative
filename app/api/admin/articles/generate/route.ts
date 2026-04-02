import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  // Verify admin session
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }

  // Forward to the cron endpoint with the server-side secret
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 3000}`
  const res = await fetch(`${baseUrl}/api/cron/generate-article`, {
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
