import { NextRequest, NextResponse } from 'next/server'
import { sendServiceRequestEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { memberId, memberEmail, memberName, requesterName, message } = body

    if (!memberId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log(`[Service Request] Community: ${slug}, To: ${memberName} <${memberEmail}>`)

    if (memberEmail) {
      await sendServiceRequestEmail(
        memberEmail,
        memberName || 'Member',
        requesterName || 'A community member',
        message
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 })
  }
}
