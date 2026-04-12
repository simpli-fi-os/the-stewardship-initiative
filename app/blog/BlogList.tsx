'use client'

import { useState } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
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
  const [articles] = useState(initialArticles)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredArticles = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles

  // Split first article as "featured" for visual emphasis
  const featuredArticle = filteredArticles[0]
  const remainingArticles = filteredArticles.slice(1)

  if (articles.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-eden-tidal/10 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-eden-tidal" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <h2 className="font-display text-3xl text-eden-orchid mb-3">Content Coming Soon</h2>
        <p className="text-eden-gray max-w-md mx-auto leading-relaxed">
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
        <ScrollReveal>
          <div className="flex gap-2 mb-12 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                !activeCategory
                  ? 'bg-eden-marigold text-eden-jungle shadow-lg shadow-eden-marigold/20'
                  : 'bg-eden-lush/60 text-eden-gray border border-eden-tidal/20 hover:text-eden-orchid hover:border-eden-tidal/40'
              }`}
            >
              All ({totalCount})
            </button>
            {categories.map(({ category, count }) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 capitalize ${
                  activeCategory === category
                    ? 'bg-eden-tidal text-eden-jungle shadow-lg shadow-eden-tidal/20'
                    : 'bg-eden-lush/60 text-eden-gray border border-eden-tidal/20 hover:text-eden-orchid hover:border-eden-tidal/40'
                }`}
              >
                {category} ({count})
              </button>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Featured Article (first one, larger) */}
      {featuredArticle && (
        <ScrollReveal>
          <Link
            href={`/blog/${featuredArticle.slug}`}
            className="block eden-glass glow-marigold rounded-2xl p-8 md:p-10 mb-10 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-eden-marigold/0 group-hover:bg-eden-marigold/[0.02] transition-colors duration-500 pointer-events-none rounded-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-semibold bg-eden-tidal/20 text-eden-tidal rounded-full capitalize">
                  {featuredArticle.category}
                </span>
                {featuredArticle.reading_time_minutes && (
                  <span className="text-xs text-eden-gray flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {featuredArticle.reading_time_minutes} min read
                  </span>
                )}
                <span className="px-2 py-0.5 text-[10px] font-bold text-eden-marigold bg-eden-marigold/10 rounded-full uppercase tracking-wider">
                  Latest
                </span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold text-eden-orchid mb-3 group-hover:text-eden-marigold transition-colors duration-300">
                {featuredArticle.title}
              </h2>

              {featuredArticle.description && (
                <p className="text-eden-gray text-base leading-relaxed mb-5 max-w-3xl">
                  {featuredArticle.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-sm text-eden-gray">
                <div className="w-8 h-8 rounded-full bg-eden-tidal/20 flex items-center justify-center text-eden-tidal font-display font-bold text-sm">
                  {featuredArticle.author?.charAt(0) || 'T'}
                </div>
                <span className="font-medium text-eden-orchid">{featuredArticle.author}</span>
                <span className="text-eden-tidal/30">|</span>
                <span>{formatDate(featuredArticle.published_at || featuredArticle.created_at)}</span>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      )}

      {/* Remaining Articles Grid */}
      {remainingArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingArticles.map((article, i) => (
            <ScrollReveal key={article.id} delay={i * 75} direction="fade">
              <Link
                href={`/blog/${article.slug}`}
                className="block eden-glass rounded-xl p-6 group relative overflow-hidden h-full"
              >
                <div className="absolute inset-0 bg-eden-marigold/0 group-hover:bg-eden-marigold/[0.02] transition-colors duration-500 pointer-events-none rounded-xl" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-eden-tidal/15 text-eden-tidal rounded-full capitalize">
                      {article.category}
                    </span>
                    {article.reading_time_minutes && (
                      <span className="text-xs text-eden-gray">
                        {article.reading_time_minutes} min
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-eden-orchid mb-2 group-hover:text-eden-marigold transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>

                  {article.description && (
                    <p className="text-eden-gray text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                      {article.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-eden-gray mt-auto pt-4 border-t border-eden-tidal/10">
                    <span className="font-medium text-eden-orchid/80">{article.author}</span>
                    <span className="text-eden-tidal/30">|</span>
                    <span>{formatDate(article.published_at || article.created_at)}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}

      {filteredArticles.length === 0 && activeCategory && (
        <div className="text-center py-16">
          <p className="text-eden-gray text-lg mb-3">No articles in this category yet.</p>
          <button
            onClick={() => setActiveCategory(null)}
            className="text-eden-marigold font-medium hover:underline"
          >
            View all articles
          </button>
        </div>
      )}
    </>
  )
}
