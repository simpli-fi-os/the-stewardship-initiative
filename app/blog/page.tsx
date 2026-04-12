import { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import { fetchPublishedArticles, fetchArticleCategories } from '@/lib/articles'
import BlogList from './BlogList'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Insights for Community Leaders | The Stewardship Initiative',
  description: 'Practical wisdom for church leaders building stronger, more connected congregations through stewardship of gifts and skills.',
  openGraph: {
    title: 'Insights for Community Leaders | The Stewardship Initiative',
    description: 'Practical wisdom for church leaders building stronger, more connected congregations.',
  },
}

export default async function BlogPage() {
  const [{ articles, count }, categories] = await Promise.all([
    fetchPublishedArticles(12, 0),
    fetchArticleCategories(),
  ])

  return (
    <div className="min-h-screen bg-eden-jungle flex flex-col">
      <main id="main-content" className="flex-1">
        {/* ═══════════════════════════════════════
            HERO — Atmospheric blog header
           ═══════════════════════════════════════ */}
        <section className="relative py-20 md:py-28 px-6 overflow-hidden">
          {/* Background atmosphere */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-eden-tidal/4 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-eden-marigold/3 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <p className="text-eden-marigold font-semibold tracking-widest text-xs uppercase mb-4">
                The TSI Blog
              </p>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-eden-orchid mb-6 leading-tight">
                Insights for{' '}
                <span className="text-eden-tidal">Community Leaders</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-lg md:text-xl text-eden-gray max-w-2xl mx-auto leading-relaxed">
                Practical wisdom for building stronger, more connected congregations through stewardship of gifts and skills.
              </p>
            </ScrollReveal>

            {/* Decorative divider */}
            <ScrollReveal delay={300}>
              <div className="flex items-center justify-center gap-3 mt-10">
                <div className="w-12 h-px bg-eden-tidal/30" />
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#FDB833" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" />
                </svg>
                <div className="w-12 h-px bg-eden-tidal/30" />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            CONTENT — Articles grid
           ═══════════════════════════════════════ */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="max-w-6xl mx-auto">
            <BlogList
              initialArticles={articles}
              totalCount={count}
              categories={categories}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════
            CTA — Newsletter / community
           ═══════════════════════════════════════ */}
        <section className="relative px-6 py-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-eden-lush/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-eden-tidal/4 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-eden-orchid mb-4">
                Want to Build a More Connected Community?
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-eden-gray mb-8 leading-relaxed">
                TSI helps churches, nonprofits, and community organizations discover and activate the hidden talent sitting right beside them. Start free today.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started" className="btn-primary text-sm">
                  Start Your Community Directory
                </Link>
                <Link href="/directory-landing" className="btn-secondary text-sm">
                  Explore the Directory
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
