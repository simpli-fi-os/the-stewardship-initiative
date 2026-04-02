import { createServerClient } from '@/lib/supabase'

export interface Article {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  author: string
  category: string
  tags: string[]
  published: boolean
  published_at: string | null
  og_image_url: string | null
  reading_time_minutes: number | null
  created_at: string
  updated_at: string
}

export type ArticleListItem = Omit<Article, 'content'>

export async function fetchPublishedArticles(
  limit = 12,
  offset = 0,
  category?: string
): Promise<{ articles: ArticleListItem[]; count: number }> {
  const supabase = createServerClient()

  let query = supabase
    .from('articles')
    .select('id, slug, title, description, author, category, tags, published, published_at, og_image_url, reading_time_minutes, created_at, updated_at', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    return { articles: [], count: 0 }
  }

  return { articles: (data || []) as ArticleListItem[], count: count || 0 }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return data as Article
}

export async function fetchArticleCategories(): Promise<{ category: string; count: number }[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('articles')
    .select('category')
    .eq('published', true)

  if (error || !data) return []

  const counts = new Map<string, number>()
  for (const row of data) {
    const cat = (row as { category: string }).category
    counts.set(cat, (counts.get(cat) || 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export async function fetchRelatedArticles(
  currentSlug: string,
  category: string,
  limit = 3
): Promise<ArticleListItem[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, description, author, category, tags, published, published_at, og_image_url, reading_time_minutes, created_at, updated_at')
    .eq('published', true)
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data || []) as ArticleListItem[]
}

// Admin functions (use service role)
export async function fetchAllArticles(): Promise<Article[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all articles:', error)
    return []
  }

  return (data || []) as Article[]
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as Article
}
