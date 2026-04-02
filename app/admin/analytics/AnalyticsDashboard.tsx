'use client'

import { useState } from 'react'

interface Props {
  totalViews: number
  uniqueVisitors: number
  totalSearches: number
  totalContactClicks: number
  totalProfileViews: number
  topSkills: [string, number][]
  viewsByDay: [string, number][]
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-eden-jungle/50 rounded-lg p-4 border border-eden-tidal/10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-eden-tidal">{icon}</span>
        <p className="text-xs text-eden-gray uppercase tracking-wide">{label}</p>
      </div>
      <p className="font-display text-2xl font-bold text-eden-orchid">
        {value.toLocaleString()}
      </p>
    </div>
  )
}

export default function AnalyticsDashboard({
  totalViews,
  uniqueVisitors,
  totalSearches,
  totalContactClicks,
  totalProfileViews,
  topSkills,
  viewsByDay,
}: Props) {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')

  const maxDailyViews = Math.max(...viewsByDay.map(([, v]) => v), 1)

  // Filter viewsByDay based on range
  const now = Date.now()
  const rangeDays = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const cutoff = now - rangeDays * 24 * 60 * 60 * 1000
  const filteredViews = viewsByDay.filter(([date]) => new Date(date).getTime() > cutoff)

  const hasData = totalViews > 0 || totalSearches > 0

  if (!hasData) {
    return (
      <div className="eden-card text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-eden-tidal/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-bold text-eden-orchid mb-2">No data yet</h2>
        <p className="text-eden-gray text-sm max-w-md mx-auto">
          Analytics will appear here once members start visiting your directory.
          Share your directory link to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex gap-2">
        {(['7d', '30d', '90d'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`text-sm px-3 py-1.5 rounded-full transition ${
              range === r
                ? 'bg-eden-marigold text-eden-jungle font-semibold'
                : 'bg-eden-lush text-eden-gray border border-eden-tidal/20 hover:text-eden-orchid'
            }`}
          >
            {r === '7d' ? '7 days' : r === '30d' ? '30 days' : '90 days'}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Page Views"
          value={totalViews}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
        />
        <StatCard
          label="Unique Visitors"
          value={uniqueVisitors}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>}
        />
        <StatCard
          label="Searches"
          value={totalSearches}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
        />
        <StatCard
          label="Contact Clicks"
          value={totalContactClicks}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" /></svg>}
        />
      </div>

      {/* Views Chart */}
      {filteredViews.length > 0 && (
        <div className="eden-card">
          <h2 className="font-display text-lg font-bold text-eden-orchid mb-4">Views Over Time</h2>
          <div className="flex items-end gap-1 h-40">
            {filteredViews.map(([date, count]) => {
              const height = Math.max(4, (count / maxDailyViews) * 100)
              return (
                <div
                  key={date}
                  className="flex-1 bg-eden-tidal/60 rounded-t hover:bg-eden-tidal transition relative group"
                  style={{ height: `${height}%` }}
                  title={`${date}: ${count} views`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-eden-jungle border border-eden-tidal/30 rounded px-2 py-0.5 text-xs text-eden-orchid opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    {count}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-eden-gray">
            <span>{filteredViews[0]?.[0]}</span>
            <span>{filteredViews[filteredViews.length - 1]?.[0]}</span>
          </div>
        </div>
      )}

      {/* Top Skills */}
      {topSkills.length > 0 && (
        <div className="eden-card">
          <h2 className="font-display text-lg font-bold text-eden-orchid mb-4">Top Searched Skills</h2>
          <div className="space-y-3">
            {topSkills.map(([skill, count]) => {
              const maxCount = topSkills[0][1]
              const width = Math.max(10, (count / maxCount) * 100)
              return (
                <div key={skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-eden-orchid">{skill}</span>
                    <span className="text-eden-gray">{count}</span>
                  </div>
                  <div className="h-2 bg-eden-jungle/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-eden-marigold rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
