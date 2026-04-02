import { MetadataRoute } from 'next'

const SITE_URL = 'https://thestewardshipinitiative.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${SITE_URL}/onboard`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/find-resources`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/get-started`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  // Dynamic: published articles
  let articleUrls: MetadataRoute.Sitemap = []
  try {
    const { createServerClient } = await import('@/lib/supabase')
    const supabase = createServerClient()

    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at')
      .eq('published', true)

    if (articles) {
      articleUrls = articles.map((a: { slug: string; updated_at: string }) => ({
        url: `${SITE_URL}/blog/${a.slug}`,
        lastModified: new Date(a.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // DB not available during build
  }

  // Dynamic: org directories
  let directoryUrls: MetadataRoute.Sitemap = []
  try {
    const { createServerClient } = await import('@/lib/supabase')
    const supabase = createServerClient()

    const { data: orgs } = await supabase
      .from('organizations')
      .select('slug, updated_at')

    if (orgs) {
      directoryUrls = orgs.map((o: { slug: string; updated_at: string }) => ({
        url: `${SITE_URL}/directory/${o.slug}`,
        lastModified: new Date(o.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch {
    // DB not available during build
  }

  return [...staticPages, ...articleUrls, ...directoryUrls]
}
