'use client'

import { useState, useMemo } from 'react'

interface Skill {
  id: string
  name: string
  color: string
}

interface AdminMember {
  id: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  photo_url: string | null
  bio: string | null
  description: string | null
  available: boolean
  approved: boolean
  featured: boolean
  created_at: string
  approved_at: string | null
  rejected_at: string | null
  rejection_reason: string | null
  skills: Skill[]
}

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected'

export default function MembersManager({ initialMembers }: { initialMembers: AdminMember[] }) {
  const [members, setMembers] = useState(initialMembers)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')
  const [expandedMember, setExpandedMember] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = members
    if (activeTab === 'pending') result = result.filter(m => !m.approved && !m.rejected_at)
    if (activeTab === 'approved') result = result.filter(m => m.approved)
    if (activeTab === 'rejected') result = result.filter(m => m.rejected_at)
    if (search) result = result.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    return result
  }, [members, activeTab, search])

  const counts = useMemo(() => ({
    all: members.length,
    pending: members.filter(m => !m.approved && !m.rejected_at).length,
    approved: members.filter(m => m.approved).length,
    rejected: members.filter(m => m.rejected_at).length,
  }), [members])

  const handleAction = async (memberId: string, action: 'approve' | 'reject' | 'toggle-featured') => {
    setActionLoading(memberId)
    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (res.ok) {
        const updated = await res.json()
        setMembers(prev =>
          prev.map(m => m.id === memberId ? { ...m, ...updated.member } : m)
        )
      }
    } catch (err) {
      console.error('Action failed:', err)
    }
    setActionLoading(null)
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ]

  return (
    <div>
      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex bg-eden-lush rounded-lg p-1 border border-eden-marigold/20">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-eden-marigold text-eden-jungle'
                  : 'text-eden-gray hover:text-eden-orchid'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">({counts[tab.key]})</span>
            </button>
          ))}
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 bg-eden-jungle border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder:text-eden-gray/50 focus:outline-none focus:ring-2 focus:ring-eden-marigold/50 text-sm"
          />
        </div>
      </div>

      {/* Members List */}
      {filtered.length === 0 ? (
        <div className="eden-card p-12 text-center">
          <p className="text-eden-gray">No members found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(member => (
            <div key={member.id} className="eden-card overflow-hidden">
              {/* Member Row */}
              <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-eden-jungle/30 transition"
                onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
              >
                <img
                  src={member.photo_url || `https://placehold.co/80x80/033F32/FDB833?text=${member.name.charAt(0)}`}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-eden-orchid">{member.name}</p>
                    {member.featured && (
                      <span className="text-xs text-eden-marigold">★ Featured</span>
                    )}
                  </div>
                  <p className="text-sm text-eden-gray truncate">{member.title || 'No title'} · {member.email || 'No email'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {member.skills.slice(0, 2).map(s => (
                      <span key={s.id} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: s.color }}>
                        {s.name}
                      </span>
                    ))}
                    {member.skills.length > 2 && (
                      <span className="text-xs text-eden-gray">+{member.skills.length - 2}</span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    member.approved
                      ? 'bg-eden-tidal/10 text-eden-tidal'
                      : member.rejected_at
                      ? 'bg-eden-redwood/10 text-eden-redwood'
                      : 'bg-eden-marigold/10 text-eden-marigold'
                  }`}>
                    {member.approved ? 'Approved' : member.rejected_at ? 'Rejected' : 'Pending'}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`text-eden-gray transition-transform ${expandedMember === member.id ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Expanded Detail */}
              {expandedMember === member.id && (
                <div className="border-t border-eden-marigold/10 p-6 bg-eden-jungle/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Profile Info */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-1">About</p>
                        <p className="text-sm text-eden-orchid">{member.bio || 'No bio provided.'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-1">Services</p>
                        <p className="text-sm text-eden-orchid">{member.description || 'No services listed.'}</p>
                      </div>
                      <div className="flex gap-4 text-sm">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="text-eden-tidal hover:underline">
                            {member.email}
                          </a>
                        )}
                        {member.phone && (
                          <a href={`tel:${member.phone}`} className="text-eden-tidal hover:underline">
                            {member.phone}
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map(s => (
                          <span key={s.id} className="text-xs px-3 py-1 rounded-full text-white" style={{ backgroundColor: s.color }}>
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-2">Actions</p>

                      {!member.approved && !member.rejected_at && (
                        <button
                          onClick={() => handleAction(member.id, 'approve')}
                          disabled={actionLoading === member.id}
                          className="w-full py-2.5 rounded-lg text-sm font-bold bg-eden-tidal text-white hover:bg-eden-tidal/90 transition disabled:opacity-50"
                        >
                          {actionLoading === member.id ? 'Processing...' : 'Approve Member'}
                        </button>
                      )}

                      {!member.rejected_at && !member.approved && (
                        <button
                          onClick={() => handleAction(member.id, 'reject')}
                          disabled={actionLoading === member.id}
                          className="w-full py-2.5 rounded-lg text-sm font-bold bg-eden-redwood/20 text-eden-redwood hover:bg-eden-redwood/30 transition disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}

                      {member.approved && (
                        <button
                          onClick={() => handleAction(member.id, 'reject')}
                          disabled={actionLoading === member.id}
                          className="w-full py-2.5 rounded-lg text-sm font-bold bg-eden-redwood/10 text-eden-redwood hover:bg-eden-redwood/20 transition disabled:opacity-50"
                        >
                          Revoke Approval
                        </button>
                      )}

                      {member.rejected_at && (
                        <button
                          onClick={() => handleAction(member.id, 'approve')}
                          disabled={actionLoading === member.id}
                          className="w-full py-2.5 rounded-lg text-sm font-bold bg-eden-tidal/20 text-eden-tidal hover:bg-eden-tidal/30 transition disabled:opacity-50"
                        >
                          Re-approve Member
                        </button>
                      )}

                      <button
                        onClick={() => handleAction(member.id, 'toggle-featured')}
                        disabled={actionLoading === member.id}
                        className="w-full py-2.5 rounded-lg text-sm font-bold bg-eden-marigold/10 text-eden-marigold hover:bg-eden-marigold/20 transition disabled:opacity-50"
                      >
                        {member.featured ? 'Remove from Featured' : 'Mark as Featured'}
                      </button>

                      <div className="text-xs text-eden-gray pt-2 space-y-1">
                        <p>Submitted: {new Date(member.created_at).toLocaleString()}</p>
                        {member.approved_at && <p>Approved: {new Date(member.approved_at).toLocaleString()}</p>}
                        {member.rejected_at && <p>Rejected: {new Date(member.rejected_at).toLocaleString()}</p>}
                        {member.rejection_reason && <p>Reason: {member.rejection_reason}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
