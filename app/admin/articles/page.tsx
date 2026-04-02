import Link from 'next/link'
import { fetchAllArticles } from '@/lib/articles'
import ArticleActions from './ArticleActions'

export const dynamic = 'force-dynamic'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AdminArticlesPage() {
  const articles = await fetchAllArticles()

  const publishedCount = articles.filter((a) => a.published).length
  const draftCount = articles.filter((a) => !a.published).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-eden-orchid">Articles</h1>
          <p className="text-eden-gray text-sm mt-1">
            {publishedCount} published, {draftCount} drafts
          </p>
        </div>
        <ArticleActions />
      </div>

      {articles.length === 0 ? (
        <div className="eden-card text-center py-12">
          <p className="text-eden-gray mb-4">No articles yet. Generate your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.id}`}
              className="eden-card block hover:border-eden-marigold/40 transition"
              style={{ padding: '1rem 1.5rem' }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        article.published ? 'bg-eden-tidal' : 'bg-eden-gray/50'
                      }`}
                    />
                    <span className="text-xs text-eden-gray uppercase tracking-wide">
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-eden-gray">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-eden-orchid truncate">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-sm text-eden-gray truncate mt-1">
                      {article.description}
                    </p>
                  )}
                </div>
                <div className="text-right text-xs text-eden-gray shrink-0">
                  <p>{formatDate(article.published_at || article.created_at)}</p>
                  {article.reading_time_minutes && (
                    <p className="mt-1">{article.reading_time_minutes} min read</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
