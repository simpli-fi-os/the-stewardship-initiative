import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchArticleBySlug, fetchRelatedArticles } from '@/lib/articles'
import ArticleBody from './ArticleBody'

export const revalidate = 600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: article.title,
    description: article.description || undefined,
    openGraph: {
      title: article.title,
      description: article.description || undefined,
      type: 'article',
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at,
      authors: [article.author],
      images: article.og_image_url ? [article.og_image_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description || undefined,
    },
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await fetchRelatedArticles(slug, article.category, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    datePublished: article.published_at,
    dateModified: article.updated_at,
    publisher: {
      '@type': 'Organization',
      name: 'The Stewardship Initiative',
      url: 'https://thestewardshipinitiative.org',
    },
  }

  return (
    <div className="min-h-screen bg-eden-jungle flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="px-6 pt-10">
        <Header />
      </div>

      <main id="main-content" className="flex-1 w-full max-w-3xl mx-auto px-6 py-16">
        {/* Article Header */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="text-sm text-eden-tidal hover:text-eden-tidal/80 transition mb-6 inline-block"
          >
            &larr; Back to Insights
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="skill-pill bg-eden-tidal/20 text-eden-tidal capitalize">
              {article.category}
            </span>
            {article.reading_time_minutes && (
              <span className="text-sm text-eden-gray">
                {article.reading_time_minutes} min read
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-eden-orchid mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-eden-gray">
            <span>{article.author}</span>
            <span className="text-eden-tidal/40">|</span>
            <time dateTime={article.published_at || article.created_at}>
              {formatDate(article.published_at || article.created_at)}
            </time>
          </div>

          <div className="h-px bg-eden-tidal/30 mt-6" />
        </div>

        {/* Article Body - content is admin-authored via service role, not user-generated */}
        <ArticleBody content={article.content} />

        {/* CTA Section */}
        <div className="mt-16 eden-card text-center">
          <h2 className="font-display text-2xl font-bold text-eden-orchid mb-3">
            Ready to build your community&apos;s directory?
          </h2>
          <p className="text-eden-gray mb-6 max-w-lg mx-auto">
            Make the hidden talents in your congregation visible, searchable, and actionable.
          </p>
          <Link href="/onboard" className="btn-primary">
            Onboard Your Community
          </Link>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-eden-orchid mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="eden-card group block"
                  style={{ padding: '1.25rem' }}
                >
                  <span className="skill-pill bg-eden-tidal/20 text-eden-tidal capitalize text-xs">
                    {related.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-eden-orchid mt-2 group-hover:text-eden-marigold transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-xs text-eden-gray mt-2">
                    {formatDate(related.published_at || related.created_at)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="px-6 pb-10">
        <Footer backLink="/blog" backLabel="Back to Insights" />
      </div>
    </div>
  )
}
