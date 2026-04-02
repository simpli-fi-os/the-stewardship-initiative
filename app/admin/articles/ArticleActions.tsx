'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ArticleActions() {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/cron/generate-article', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'manual-trigger'}`,
        },
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error('Generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={generating}
      className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ padding: '0.625rem 1.5rem' }}
    >
      {generating ? 'Generating...' : 'Generate Article'}
    </button>
  )
}
