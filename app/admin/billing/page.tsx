import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase-server'
import BillingClient from './BillingClient'

export const dynamic = 'force-dynamic'

async function getOrgForCurrentUser() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value
  const refreshToken = cookieStore.get('sb-refresh-token')?.value

  if (!accessToken || !refreshToken) return null

  const supabase = createAdminClient()

  // Get user from token
  const { createClient } = await import('@supabase/supabase-js')
  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { user } } = await userClient.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  if (!user) return null

  // Get profile → org
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (!profile?.org_id) return null

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', profile.org_id)
    .single()

  // Count members
  const { count } = await supabase
    .from('members')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', profile.org_id)
    .eq('approved', true)

  return org ? { ...org, memberCount: count || 0 } : null
}

export default async function AdminBillingPage() {
  const org = await getOrgForCurrentUser()

  if (!org) {
    return (
      <div>
        <h1 className="font-display text-3xl font-bold text-eden-orchid mb-4">Billing</h1>
        <div className="eden-card text-center py-12">
          <p className="text-eden-gray">Unable to load billing information.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-eden-orchid mb-8">Billing</h1>
      <BillingClient org={org} />
    </div>
  )
}
