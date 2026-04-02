import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { memberId, memberEmail, memberName, message } = body

    if (!memberId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For now, log the request. In production, send via Resend/SendGrid.
    // Once Resend is configured, this will send an email to the member.
    console.log(`[Service Request] Community: ${params.slug}`)
    console.log(`[Service Request] To: ${memberName} <${memberEmail}>`)
    console.log(`[Service Request] Message: ${message}`)

    // TODO: When Resend is configured, uncomment:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'TSI Requests <requests@thestewardshipinitiative.org>',
    //   to: memberEmail,
    //   subject: `New service request from your community directory`,
    //   text: `Someone in your community is requesting your help:\n\n${message}\n\nReply to this email to connect.`,
    // })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 })
  }
}
