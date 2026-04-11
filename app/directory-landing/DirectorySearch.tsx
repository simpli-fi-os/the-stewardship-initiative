'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DirectorySearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/search')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search resources, providers, or services..."
        className="flex-1 px-5 py-4 bg-eden-lush border border-eden-marigold/30 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold text-base"
      />
      <button
        type="submit"
        className="px-8 py-4 bg-eden-marigold text-eden-jungle font-semibold rounded-lg hover:bg-eden-marigold/90 transition-colors"
      >
        Search
      </button>
    </form>
  )
}
