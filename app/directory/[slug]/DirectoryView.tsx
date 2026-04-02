'use client'

import { useState, useMemo } from 'react'

interface Skill {
  id: string
  name: string
  color: string
}

interface Member {
  id: string
  name: string
  title: string | null
  photo_url: string | null
  description: string | null
  bio: string | null
  skills: Skill[]
  email: string | null
  phone: string | null
  website: string | null
  available: boolean
  featured: boolean
}

interface Props {
  members: Member[]
  orgName: string
  orgSlug: string
  orgLogoUrl?: string
  orgHeroUrl?: string
}

const ITEMS_PER_PAGE = 12

export default function DirectoryView({ members, orgName, orgSlug, orgLogoUrl, orgHeroUrl }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestMessage, setRequestMessage] = useState('')
  const [requestSending, setRequestSending] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const categories = useMemo(() => {
    const all = members.flatMap(m => m.skills.map(s => s.name))
    return ['All', ...Array.from(new Set(all)).sort()]
  }, [members])

  const filtered = useMemo(() => {
    return members.filter(m => {
      const nameMatch = m.name.toLowerCase().includes(search.toLowerCase())
      const categoryMatch = activeCategory === 'All' || m.skills.some(s => s.name === activeCategory)
      const availableMatch = !availableOnly || m.available
      return nameMatch && categoryMatch && availableMatch
    })
  }, [members, search, activeCategory, availableOnly])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleRequestService = async () => {
    if (!selectedMember?.email || !requestMessage.trim()) return
    setRequestSending(true)

    try {
      await fetch(`/api/directory/${orgSlug}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: selectedMember.id,
          memberEmail: selectedMember.email,
          memberName: selectedMember.name,
          message: requestMessage,
        }),
      })
      setRequestSent(true)
      setRequestMessage('')
    } catch {
      // Silently handle — in production, show error
    }
    setRequestSending(false)
  }

  const closeModal = () => {
    setSelectedMember(null)
    setShowRequestForm(false)
    setRequestSent(false)
    setRequestMessage('')
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#333] font-body">
      {/* Top Banner */}
      <div className="bg-[#333] text-white text-center py-2 px-4 flex items-center justify-center gap-3">
        <a href="/" className="text-sm font-semibold tracking-wider hover:underline">
          The Stewardship Initiative
        </a>
        <span className="text-white/30">|</span>
        <a href="/login" className="text-sm text-white/70 hover:text-white transition">
          Admin Login
        </a>
      </div>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-12">
          {orgHeroUrl && (
            <div className="w-full mb-8 rounded-lg overflow-hidden shadow-lg" style={{ height: '300px' }}>
              <img
                src={orgHeroUrl}
                alt={`${orgName} Community`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="bg-[#082A52] text-center text-gray-100 p-8 rounded-lg shadow-md">
            {orgLogoUrl && (
              <img
                src={orgLogoUrl}
                alt={`${orgName} Logo`}
                className="h-12 w-auto mx-auto mb-4"
              />
            )}
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Member &amp; Skills Directory
            </h1>
            <p className="mt-2 text-lg opacity-90">
              Connecting needs with the giftedness of our church family.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {members.length} Members
              </span>
              <a
                href={`/directory/${orgSlug}/join`}
                className="inline-block bg-white text-[#082A52] font-semibold px-6 py-2 rounded-md hover:bg-gray-100 transition text-sm"
              >
                Join This Directory
              </a>
            </div>
          </div>
        </header>

        {/* Search & Filter */}
        <section
          className="mb-12 p-6 bg-white rounded-lg shadow-md sticky top-4 z-10"
          role="search"
          aria-label="Directory search and filters"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label htmlFor="name-search" className="block text-sm font-semibold text-gray-500 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                id="name-search"
                placeholder="e.g., Matt Chandler"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(ITEMS_PER_PAGE) }}
                className="w-full px-4 py-2 border border-gray-200 rounded-md transition focus:outline-none focus:ring-2 focus:ring-[#007398]"
                aria-label="Search members by name"
              />
            </div>
            <div className="md:col-span-2">
              <p className="block text-sm font-semibold text-gray-500 mb-2">Filter by Gifting</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by skill category">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setVisibleCount(ITEMS_PER_PAGE) }}
                    className={`text-sm font-medium px-3 py-1 rounded-full border border-gray-200 transition hover:bg-[#333] hover:text-white ${
                      activeCategory === cat
                        ? 'bg-[#333] text-white font-semibold'
                        : 'bg-[#F9F9F9] text-gray-500'
                    }`}
                    aria-pressed={activeCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-1 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => { setAvailableOnly(e.target.checked); setVisibleCount(ITEMS_PER_PAGE) }}
                  className="w-4 h-4 rounded border-gray-300 text-[#007398] focus:ring-[#007398]"
                />
                <span className="text-sm font-medium text-gray-600">Available Now</span>
                <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-green-400" />
              </label>
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400 mt-4">
            Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} members
          </p>
        </section>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="font-display text-2xl font-bold text-[#333]">No Members Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            <main
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              role="list"
              aria-label="Directory members"
            >
              {visible.map(member => (
                <article
                  key={member.id}
                  className="directory-card bg-white rounded-lg shadow-sm overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl cursor-pointer group"
                  role="listitem"
                  onClick={() => setSelectedMember(member)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedMember(member)}
                  tabIndex={0}
                  aria-label={`View profile for ${member.name}`}
                >
                  <div className="overflow-hidden h-64 relative">
                    <img
                      src={member.photo_url || `https://placehold.co/400x400/F9F9F9/333333?text=${member.name.charAt(0)}`}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {member.featured && (
                      <span className="absolute top-3 right-3 bg-[#FDB833] text-[#333] text-xs font-bold px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    {member.available && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Available
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-display text-xl font-bold text-[#333]">{member.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{member.title}</p>
                    <p className="text-sm text-[#333] flex-grow line-clamp-3">{member.description}</p>
                  </div>
                  <div className="p-5 border-t border-gray-100 bg-[#F9F9F9]/50">
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map(skill => (
                        <span
                          key={skill.id}
                          className="skill-pill"
                          style={{ backgroundColor: skill.color }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </main>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="px-8 py-3 bg-[#082A52] text-white rounded-lg font-semibold hover:bg-[#082A52]/90 transition"
                >
                  Load More Members
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Member Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-[#082A52]/70 flex items-center justify-center z-50 transition-opacity"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`Profile for ${selectedMember.name}`}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 md:p-8">
              <button
                onClick={closeModal}
                className="absolute top-2 right-4 text-gray-400 hover:text-gray-800 text-3xl font-bold"
                aria-label="Close profile"
              >
                &times;
              </button>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative flex-shrink-0">
                  <img
                    src={selectedMember.photo_url || `https://placehold.co/400x400/F9F9F9/333333?text=${selectedMember.name.charAt(0)}`}
                    alt={selectedMember.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover object-top shadow-md"
                  />
                  {selectedMember.available && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" title="Available" />
                  )}
                </div>
                <div>
                  <h2 className="font-display text-3xl font-bold text-[#333]">{selectedMember.name}</h2>
                  <p className="text-gray-500">{selectedMember.title}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedMember.skills.map(s => (
                      <span key={s.id} className="skill-pill" style={{ backgroundColor: s.color }}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider">About</h4>
                <p className="mt-2 text-[#333] leading-relaxed">{selectedMember.bio}</p>
                <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider mt-6">Services Offered</h4>
                <p className="mt-2 text-[#333] leading-relaxed">{selectedMember.description}</p>
              </div>

              {/* Contact Info */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-3">Contact</h4>
                <div className="space-y-2">
                  {selectedMember.email && (
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center gap-2 text-sm text-[#007398] hover:underline"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      {selectedMember.email}
                    </a>
                  )}
                  {selectedMember.phone && (
                    <a
                      href={`tel:${selectedMember.phone}`}
                      className="flex items-center gap-2 text-sm text-[#007398] hover:underline"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {selectedMember.phone}
                    </a>
                  )}
                  {selectedMember.website && (
                    <a
                      href={selectedMember.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#007398] hover:underline"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-6 bg-[#F9F9F9] border-t border-gray-200">
              {!showRequestForm && !requestSent ? (
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="flex-1 text-center bg-[#007398] text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-[#007398]/80 transition"
                  >
                    Email {selectedMember.name.split(' ')[0]}
                  </a>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="flex-1 text-center bg-[#082A52] text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-[#082A52]/80 transition"
                  >
                    Request Service
                  </button>
                </div>
              ) : requestSent ? (
                <div className="text-center py-2">
                  <p className="text-green-600 font-semibold">Request sent! {selectedMember.name.split(' ')[0]} will be notified.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder={`Hi ${selectedMember.name.split(' ')[0]}, I'd like to request your help with...`}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007398] text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleRequestService}
                      disabled={requestSending || !requestMessage.trim()}
                      className="flex-1 bg-[#082A52] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#082A52]/80 transition disabled:opacity-50"
                    >
                      {requestSending ? 'Sending...' : 'Send Request'}
                    </button>
                    <button
                      onClick={() => setShowRequestForm(false)}
                      className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
