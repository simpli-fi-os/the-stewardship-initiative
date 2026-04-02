import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { createBillingPortalSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('sb-access-token')?.value
  const refreshToken = request.cookies.get('sb-refresh-token')?.value

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user
    const { createClient } = await import('@supabase/supabase-js')
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user } } = await userClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Get org via profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile?.org_id) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    const { data: org } = await supabase
      .from('organizations')
      .select('stripe_customer_id')
      .eq('id', profile.org_id)
      .single()

    if (!org?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account' }, { status: 404 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thestewardshipinitiative.org'
    const url = await createBillingPortalSession(
      org.stripe_customer_id,
      `${siteUrl}/admin/billing`
    )

    return NextResponse.redirect(url)
  } catch (err) {
    console.error('Billing portal error:', err)
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
  }
}
