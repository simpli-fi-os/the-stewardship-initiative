'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ArticleActions() {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      // Call a server-side API route that holds the secret,
      // not the cron endpoint directly from the client
      const res = await fetch('/api/admin/articles/generate', {
        method: 'POST',
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Generation failed')
      }
    } catch (err) {
      console.error('Generation failed:', err)
      setError('Network error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ padding: '0.625rem 1.5rem' }}
      >
        {generating ? 'Generating...' : 'Generate Article'}
      </button>
      {error && <span className="text-eden-redwood text-sm">{error}</span>}
    </div>
  )
}
