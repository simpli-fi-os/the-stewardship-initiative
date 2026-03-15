'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'

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

export default function DirectoryView({ members, orgName, orgSlug, orgLogoUrl, orgHeroUrl }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const categories = useMemo(() => {
    const all = members.flatMap(m => m.skills.map(s => s.name))
    return ['All', ...Array.from(new Set(all)).sort()]
  }, [members])

  const filtered = useMemo(() => {
    return members.filter(m => {
      const nameMatch = m.name.toLowerCase().includes(search.toLowerCase())
      const categoryMatch = activeCategory === 'All' || m.skills.some(s => s.name === activeCategory)
      return nameMatch && categoryMatch
    })
  }, [members, search, activeCategory])

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#333] font-body">
      {/* Top Banner */}
      <div className="bg-[#333] text-white text-center py-2 px-4">
        <a href="/" className="text-sm font-semibold tracking-wider hover:underline">
          The Stewardship Initiative
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
            <a
              href={`/directory/${orgSlug}/join`}
              className="inline-block mt-4 bg-white text-[#082A52] font-semibold px-6 py-2 rounded-md hover:bg-gray-100 transition text-sm"
            >
              Join This Directory
            </a>
          </div>
        </header>

        {/* Search & Filter */}
        <section
          className="mb-12 p-6 bg-white rounded-lg shadow-md sticky top-4 z-10"
          role="search"
          aria-label="Directory search and filters"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label htmlFor="name-search" className="block text-sm font-semibold text-gray-500 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                id="name-search"
                placeholder="e.g., Matt Chandler"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    onClick={() => setActiveCategory(cat)}
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
          </div>
        </section>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="font-display text-2xl font-bold text-[#333]">No Members Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <main
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            role="list"
            aria-label="Directory members"
          >
            {filtered.map(member => (
              <article
                key={member.id}
                className="directory-card bg-white rounded-lg shadow-sm overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl cursor-pointer"
                role="listitem"
                onClick={() => setSelectedMember(member)}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedMember(member)}
                tabIndex={0}
                aria-label={`View profile for ${member.name}`}
              >
                <div className="overflow-hidden h-64">
                  <img
                    src={member.photo_url || 'https://placehold.co/400x400/F9F9F9/333333?text=Photo'}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="font-display text-xl font-bold text-[#333]">{member.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{member.title}</p>
                  <p className="text-sm text-[#333] flex-grow">{member.description}</p>
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
        )}
      </div>

      {/* Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-[#082A52]/70 flex items-center justify-center z-50 transition-opacity"
          onClick={() => setSelectedMember(null)}
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
                onClick={() => setSelectedMember(null)}
                className="absolute top-2 right-4 text-gray-400 hover:text-gray-800 text-3xl font-bold"
                aria-label="Close profile"
              >
                &times;
              </button>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={selectedMember.photo_url || 'https://placehold.co/400x400/F9F9F9/333333?text=Photo'}
                  alt={selectedMember.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover object-top shadow-md flex-shrink-0"
                />
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
            </div>
            <div className="p-6 bg-[#F9F9F9] border-t border-gray-200 flex items-center gap-4">
              <a
                href={`mailto:${selectedMember.email}`}
                className="flex-1 text-center bg-[#007398] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#007398]/80 transition"
              >
                Contact {selectedMember.name.split(' ')[0]}
              </a>
              <button
                disabled
                className="flex-1 text-center bg-gray-400/50 text-white px-4 py-2 rounded-md text-sm font-semibold cursor-not-allowed"
                title="Scheduling Feature Coming Soon"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
