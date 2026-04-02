import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

const FROM = 'The Stewardship Initiative <noreply@thestewardshipinitiative.org>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thestewardshipinitiative.org'

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#022C22;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="color:#FDB833;font-size:18px;font-weight:700;letter-spacing:1px;">The Stewardship Initiative</span>
    </div>
    <div style="background-color:#033F32;border:1px solid rgba(253,184,51,0.2);border-radius:12px;padding:32px;">
      ${content}
    </div>
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#D1D5DB;font-size:12px;">A Simpli-FI OS Initiative</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendWelcomeEmail(to: string, orgName: string, slug: string): Promise<void> {
  const resend = getResend()
  if (!resend) {
    console.log(`[EMAIL] Welcome email to ${to} for ${orgName} (Resend not configured)`)
    return
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to The Stewardship Initiative, ${orgName}!`,
    html: emailWrapper(`
      <h1 style="color:#FDFDFF;font-size:24px;margin:0 0 16px 0;">Welcome aboard!</h1>
      <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0 0 16px 0;">
        Your community directory for <strong style="color:#FDFDFF;">${orgName}</strong> is now live.
        Share it with your congregation and start connecting gifts with needs.
      </p>
      <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
        Members can join at:<br>
        <a href="${SITE_URL}/directory/${slug}/join" style="color:#FDB833;">${SITE_URL}/directory/${slug}/join</a>
      </p>
      <div style="text-align:center;">
        <a href="${SITE_URL}/admin" style="display:inline-block;background-color:#FDB833;color:#022C22;font-weight:700;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;">Go to Dashboard</a>
      </div>
    `),
  })
}

export async function sendMemberApprovedEmail(
  to: string,
  memberName: string,
  directoryUrl: string
): Promise<void> {
  const resend = getResend()
  if (!resend) {
    console.log(`[EMAIL] Approval email to ${to} for ${memberName} (Resend not configured)`)
    return
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Your profile has been approved!',
    html: emailWrapper(`
      <h1 style="color:#FDFDFF;font-size:24px;margin:0 0 16px 0;">You&apos;re in, ${memberName}!</h1>
      <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
        Your profile has been approved and is now live in the community directory.
        Members can find you, see your skills, and reach out when they need help.
      </p>
      <div style="text-align:center;">
        <a href="${directoryUrl}" style="display:inline-block;background-color:#FDB833;color:#022C22;font-weight:700;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;">View Directory</a>
      </div>
    `),
  })
}

export async function sendNewMemberNotification(
  adminEmail: string,
  memberName: string,
  orgName: string
): Promise<void> {
  const resend = getResend()
  if (!resend) {
    console.log(`[EMAIL] New member notification to ${adminEmail}: ${memberName} joined ${orgName} (Resend not configured)`)
    return
  }

  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `New member request: ${memberName}`,
    html: emailWrapper(`
      <h1 style="color:#FDFDFF;font-size:24px;margin:0 0 16px 0;">New member request</h1>
      <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
        <strong style="color:#FDFDFF;">${memberName}</strong> has submitted a profile to the
        <strong style="color:#FDFDFF;">${orgName}</strong> directory and is waiting for your review.
      </p>
      <div style="text-align:center;">
        <a href="${SITE_URL}/admin/members" style="display:inline-block;background-color:#FDB833;color:#022C22;font-weight:700;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;">Review Members</a>
      </div>
    `),
  })
}

export async function sendServiceRequestEmail(
  to: string,
  memberName: string,
  requesterName: string,
  requesterMessage: string
): Promise<void> {
  const resend = getResend()
  if (!resend) {
    console.log(`[EMAIL] Service request to ${to}: ${requesterName} wants to connect with ${memberName} (Resend not configured)`)
    return
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Someone needs your help, ${memberName}!`,
    html: emailWrapper(`
      <h1 style="color:#FDFDFF;font-size:24px;margin:0 0 16px 0;">Service request</h1>
      <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0 0 16px 0;">
        <strong style="color:#FDFDFF;">${requesterName}</strong> found your profile in the community directory
        and would like to connect with you.
      </p>
      <div style="background-color:rgba(38,166,154,0.1);border-left:4px solid #26A69A;padding:16px;border-radius:0 8px 8px 0;margin:0 0 24px 0;">
        <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0;font-style:italic;">
          "${requesterMessage}"
        </p>
      </div>
      <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0;">
        Reply directly to this message or reach out to them through your church.
      </p>
    `),
  })
}
