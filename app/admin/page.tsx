import { getAdminStats, getAdminMembers } from '@/lib/auth'

// Village Church org ID (from seed data)
const VILLAGE_CHURCH_ORG_ID = 'a1b2c3d4-0000-0000-0000-000000000001'

export const revalidate = 30

export default async function AdminDashboard() {
  const stats = await getAdminStats(VILLAGE_CHURCH_ORG_ID)
  const recentMembers = await getAdminMembers(VILLAGE_CHURCH_ORG_ID)
  const pending = recentMembers.filter(m => !m.approved && !m.rejected_at)
  const recent = recentMembers.slice(0, 5)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-eden-orchid">Dashboard</h1>
        <p className="text-eden-gray mt-1">The Village Church — Member Directory Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Members"
          value={stats.totalMembers}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          color="marigold"
        />
        <StatCard
          label="Approved"
          value={stats.approvedMembers}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
          color="tidal"
        />
        <StatCard
          label="Pending Review"
          value={stats.pendingMembers}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          color="hibiscus"
          highlight={stats.pendingMembers > 0}
        />
        <StatCard
          label="This Week"
          value={stats.recentSubmissions}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          }
          color="marigold"
        />
      </div>

      {/* Pending Approvals */}
      {pending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-eden-orchid">
              Pending Approvals
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-eden-hibiscus text-white text-xs font-bold">
                {pending.length}
              </span>
            </h2>
            <a href="/admin/members" className="text-sm text-eden-marigold hover:text-eden-marigold/80 transition font-medium">
              View All Members →
            </a>
          </div>
          <div className="space-y-3">
            {pending.slice(0, 3).map(member => (
              <div key={member.id} className="eden-card p-4 flex items-center gap-4">
                <img
                  src={member.photo_url || 'https://placehold.co/80x80/033F32/FDB833?text=' + member.name.charAt(0)}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-eden-orchid">{member.name}</p>
                  <p className="text-sm text-eden-gray truncate">{member.title || 'No title'}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-eden-gray">
                    {new Date(member.created_at).toLocaleDateString()}
                  </span>
                </div>
                <a
                  href="/admin/members"
                  className="text-sm text-eden-marigold hover:text-eden-marigold/80 font-medium transition"
                >
                  Review
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-bold text-eden-orchid mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a
            href="/admin/articles"
            className="eden-card flex items-center gap-3 hover:border-eden-marigold/40 transition"
            style={{ padding: '0.875rem 1rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm text-eden-orchid font-medium">Generate Article</span>
          </a>
          <a
            href="/directory/village-church"
            target="_blank"
            className="eden-card flex items-center gap-3 hover:border-eden-marigold/40 transition"
            style={{ padding: '0.875rem 1rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal shrink-0" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span className="text-sm text-eden-orchid font-medium">View Directory</span>
          </a>
          <a
            href="/admin/analytics"
            className="eden-card flex items-center gap-3 hover:border-eden-marigold/40 transition"
            style={{ padding: '0.875rem 1rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal shrink-0" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span className="text-sm text-eden-orchid font-medium">View Analytics</span>
          </a>
          <a
            href="/admin/billing"
            className="eden-card flex items-center gap-3 hover:border-eden-marigold/40 transition"
            style={{ padding: '0.875rem 1rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal shrink-0" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span className="text-sm text-eden-orchid font-medium">Manage Billing</span>
          </a>
        </div>
      </div>

      {/* Recent Members */}
      <div>
        <h2 className="font-display text-xl font-bold text-eden-orchid mb-4">Recent Members</h2>
        <div className="eden-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-eden-marigold/20">
                <th className="text-left p-4 text-xs font-semibold text-eden-gray uppercase tracking-wider">Member</th>
                <th className="text-left p-4 text-xs font-semibold text-eden-gray uppercase tracking-wider">Skills</th>
                <th className="text-left p-4 text-xs font-semibold text-eden-gray uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-eden-gray uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(member => (
                <tr key={member.id} className="border-b border-eden-jungle/50 hover:bg-eden-jungle/30 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.photo_url || 'https://placehold.co/40x40/033F32/FDB833?text=' + member.name.charAt(0)}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-eden-orchid text-sm">{member.name}</p>
                        <p className="text-xs text-eden-gray">{member.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map(s => (
                        <span key={s.id} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: s.color }}>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      member.approved
                        ? 'bg-eden-tidal/10 text-eden-tidal'
                        : member.rejected_at
                        ? 'bg-eden-redwood/10 text-eden-redwood'
                        : 'bg-eden-marigold/10 text-eden-marigold'
                    }`}>
                      {member.approved ? 'Approved' : member.rejected_at ? 'Rejected' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-eden-gray">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, highlight }: {
  label: string
  value: number
  icon: React.ReactNode
  color: 'marigold' | 'tidal' | 'hibiscus'
  highlight?: boolean
}) {
  const colorClasses = {
    marigold: 'text-eden-marigold bg-eden-marigold/10 border-eden-marigold/20',
    tidal: 'text-eden-tidal bg-eden-tidal/10 border-eden-tidal/20',
    hibiscus: 'text-eden-hibiscus bg-eden-hibiscus/10 border-eden-hibiscus/20',
  }

  return (
    <div className={`eden-card p-6 ${highlight ? 'ring-2 ring-eden-hibiscus/30' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold text-eden-orchid font-display">{value}</p>
      <p className="text-sm text-eden-gray mt-1">{label}</p>
    </div>
  )
}
