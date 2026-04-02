import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase-server'
import AnalyticsDashboard from './AnalyticsDashboard'

export const dynamic = 'force-dynamic'

async function getOrgId() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value
  const refreshToken = cookieStore.get('sb-refresh-token')?.value
  if (!accessToken || !refreshToken) return null

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

  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  return profile?.org_id || null
}

interface ViewRow {
  event_type: string
  created_at: string
  metadata: Record<string, unknown>
  member_id: string | null
}

export default async function AdminAnalyticsPage() {
  const orgId = await getOrgId()

  if (!orgId) {
    return (
      <div>
        <h1 className="font-display text-3xl font-bold text-eden-orchid mb-4">Analytics</h1>
        <div className="eden-card text-center py-12">
          <p className="text-eden-gray">Unable to load analytics.</p>
        </div>
      </div>
    )
  }

  const supabase = createAdminClient()

  // Fetch last 90 days of events
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

  const { data: events } = await supabase
    .from('directory_views')
    .select('event_type, created_at, metadata, member_id')
    .eq('org_id', orgId)
    .gte('created_at', ninetyDaysAgo)
    .order('created_at', { ascending: false })
    .limit(5000)

  const typedEvents = (events || []) as ViewRow[]

  // Aggregate stats
  const totalViews = typedEvents.filter(e => e.event_type === 'page_view').length
  const totalSearches = typedEvents.filter(e => e.event_type === 'search').length
  const totalContactClicks = typedEvents.filter(e => e.event_type === 'contact_click').length
  const totalProfileViews = typedEvents.filter(e => e.event_type === 'profile_view').length

  // Unique sessions
  const sessions = new Set(typedEvents.map(e => (e.metadata as Record<string, string>)?.session_id).filter(Boolean))

  // Top searched skills
  const skillSearches = new Map<string, number>()
  typedEvents
    .filter(e => e.event_type === 'search' || e.event_type === 'filter')
    .forEach(e => {
      const term = ((e.metadata as Record<string, string>)?.query || (e.metadata as Record<string, string>)?.skill || '') as string
      if (term) {
        skillSearches.set(term, (skillSearches.get(term) || 0) + 1)
      }
    })

  const topSkills = Array.from(skillSearches.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Views by day (last 30 days)
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const dailyViews = new Map<string, number>()
  typedEvents
    .filter(e => e.event_type === 'page_view' && new Date(e.created_at).getTime() > thirtyDaysAgo)
    .forEach(e => {
      const day = new Date(e.created_at).toISOString().split('T')[0]
      dailyViews.set(day, (dailyViews.get(day) || 0) + 1)
    })

  const viewsByDay = Array.from(dailyViews.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-eden-orchid mb-8">Analytics</h1>
      <AnalyticsDashboard
        totalViews={totalViews}
        uniqueVisitors={sessions.size}
        totalSearches={totalSearches}
        totalContactClicks={totalContactClicks}
        totalProfileViews={totalProfileViews}
        topSkills={topSkills}
        viewsByDay={viewsByDay}
      />
    </div>
  )
}
