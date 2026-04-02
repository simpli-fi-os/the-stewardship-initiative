import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchPublishedArticles, fetchArticleCategories } from '@/lib/articles'
import BlogList from './BlogList'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Insights for Community Leaders',
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
      <div className="px-6 pt-10">
        <Header />
      </div>

      <main id="main-content" className="flex-1 w-full max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-eden-orchid mb-4">
            Insights for Community Leaders
          </h1>
          <p className="text-eden-gray text-lg max-w-2xl mx-auto">
            Practical wisdom for building stronger, more connected congregations
            through stewardship of gifts and skills.
          </p>
        </div>

        <BlogList
          initialArticles={articles}
          totalCount={count}
          categories={categories}
        />
      </main>

      <div className="px-6 pb-10">
        <Footer />
      </div>
    </div>
  )
}
