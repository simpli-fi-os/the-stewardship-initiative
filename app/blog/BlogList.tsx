'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ArticleListItem } from '@/lib/articles'

interface Props {
  initialArticles: ArticleListItem[]
  totalCount: number
  categories: { category: string; count: number }[]
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogList({ initialArticles, totalCount, categories }: Props) {
  const [articles, setArticles] = useState(initialArticles)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filteredArticles = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles

  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(category)
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-eden-tidal/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
            <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
            <polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-eden-orchid mb-2">Content Coming Soon</h2>
        <p className="text-eden-gray max-w-md mx-auto">
          We&apos;re preparing insights and guides to help you build a more connected community.
          Check back soon.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`skill-pill whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition ${
              !activeCategory
                ? 'bg-eden-marigold text-eden-jungle'
                : 'bg-eden-lush text-eden-gray border border-eden-tidal/20 hover:text-eden-orchid'
            }`}
          >
            All ({totalCount})
          </button>
          {categories.map(({ category, count }) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`skill-pill whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition capitalize ${
                activeCategory === category
                  ? 'bg-eden-tidal text-eden-jungle'
                  : 'bg-eden-lush text-eden-gray border border-eden-tidal/20 hover:text-eden-orchid'
              }`}
            >
              {category} ({count})
            </button>
          ))}
        </div>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="eden-card group block"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="skill-pill bg-eden-tidal/20 text-eden-tidal capitalize">
                {article.category}
              </span>
              {article.reading_time_minutes && (
                <span className="text-xs text-eden-gray">
                  {article.reading_time_minutes} min read
                </span>
              )}
            </div>

            <h2 className="font-display text-xl font-bold text-eden-orchid mb-2 group-hover:text-eden-marigold transition-colors">
              {article.title}
            </h2>

            {article.description && (
              <p className="text-eden-gray text-sm line-clamp-2 mb-4">
                {article.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-eden-gray">
              <span>{article.author}</span>
              <span className="text-eden-tidal/40">|</span>
              <span>{formatDate(article.published_at || article.created_at)}</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredArticles.length === 0 && activeCategory && (
        <div className="text-center py-12">
          <p className="text-eden-gray">No articles in this category yet.</p>
          <button
            onClick={() => setActiveCategory(null)}
            className="text-eden-marigold text-sm mt-2 hover:underline"
          >
            View all articles
          </button>
        </div>
      )}
    </>
  )
}
