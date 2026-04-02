'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Article } from '@/lib/articles'

interface Props {
  article: Article
}

export default function ArticleEditor({ article }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(article.title)
  const [slug, setSlug] = useState(article.slug)
  const [description, setDescription] = useState(article.description || '')
  const [content, setContent] = useState(article.content)
  const [category, setCategory] = useState(article.category)
  const [published, setPublished] = useState(article.published)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          content,
          category,
          published,
        }),
      })

      if (res.ok) {
        setMessage('Saved successfully')
        router.refresh()
      } else {
        const data = await res.json()
        setMessage(data.error || 'Failed to save')
      }
    } catch {
      setMessage('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="text-sm text-eden-tidal hover:text-eden-tidal/80 transition"
          >
            &larr; Back
          </Link>
          <h1 className="font-display text-2xl font-bold text-eden-orchid">Edit Article</h1>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-sm ${message.includes('success') ? 'text-eden-tidal' : 'text-eden-redwood'}`}>
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm disabled:opacity-50"
            style={{ padding: '0.625rem 1.5rem' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Published Toggle */}
        <div className="eden-card flex items-center justify-between" style={{ padding: '1rem 1.5rem' }}>
          <div>
            <span className="text-sm font-medium text-eden-orchid">Status</span>
            <p className="text-xs text-eden-gray mt-0.5">
              {published ? 'Visible on the public blog' : 'Only visible in admin'}
            </p>
          </div>
          <button
            onClick={() => setPublished(!published)}
            className={`relative w-12 h-6 rounded-full transition ${
              published ? 'bg-eden-tidal' : 'bg-eden-gray/30'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                published ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-eden-orchid mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-eden-orchid mb-2">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-eden-orchid mb-2">
            Meta Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            maxLength={155}
          />
          <p className="text-xs text-eden-gray mt-1">{description.length}/155</p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-eden-orchid mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
          >
            <option value="stewardship">Stewardship</option>
            <option value="community">Community</option>
            <option value="leadership">Leadership</option>
            <option value="technology">Technology</option>
            <option value="growth">Growth</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-eden-orchid mb-2">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={24}
            className="form-input font-mono text-sm"
          />
        </div>
      </div>
    </div>
  )
}
