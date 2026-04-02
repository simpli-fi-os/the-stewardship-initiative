import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const TOPICS = [
  'How a Church Skills Directory Strengthens Your Congregation',
  'Why Your Church Members Don\'t Know Each Other\'s Gifts',
  '5 Ways to Activate the Hidden Talent in Your Pews',
  'The Stewardship Model: Beyond Tithes and Offerings',
  'How to Build a Volunteer Network That Actually Works',
  'What the Early Church Got Right About Community',
  'The Connection Gap: Why 1 in 4 Members Feel Invisible',
  'From Pews to Purpose: Making Every Member Matter',
  'Why Your Church Directory Isn\'t Enough',
  'Digital Stewardship: Technology in Service of Community',
  'Small Church, Big Impact: Community Skills on a Budget',
  'How One Church Discovered 47 Hidden Skills in 30 Days',
]

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 250))
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  try {
    const { createServerClient } = await import('@/lib/supabase')
    const supabase = createServerClient()

    // Check which topics already have articles to avoid duplicates
    const { data: existingArticles } = await supabase
      .from('articles')
      .select('title')

    const existingTitles = new Set((existingArticles || []).map((a: { title: string }) => a.title))
    const availableTopics = TOPICS.filter(t => !existingTitles.has(t))

    if (availableTopics.length === 0) {
      return NextResponse.json({ message: 'All topics exhausted', generated: false })
    }

    const topic = availableTopics[Math.floor(Math.random() * availableTopics.length)]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: `You are a content writer for The Stewardship Initiative, a church community skills directory platform. Write SEO-optimized articles for church leaders and administrators.

Voice: Pastoral but modern. Warm, not preachy. Grounded in scripture when relevant but not forced. Data-informed. Human.

NEVER use em dashes. NEVER use AI-sounding phrases like "In today's world" or "harness the power of" or "leverage" or "it's important to note."

Structure your response as JSON with these fields:
- title: The article title (H1)
- slug: URL-friendly slug (lowercase, hyphens, no special chars)
- description: Meta description (under 155 characters)
- category: One of: stewardship, community, leadership, technology, growth
- tags: Array of 3-5 relevant tags
- content: Full article in Markdown (1,200-2,000 words). Include intro, 3-5 sections with ## headers, conclusion with subtle CTA mentioning The Stewardship Initiative.

Return ONLY valid JSON, no markdown fences.`,
        messages: [
          { role: 'user', content: `Write an article about: ${topic}` }
        ],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    const article = JSON.parse(text)

    const readingTime = estimateReadingTime(article.content || '')

    const { error } = await supabase.from('articles').insert({
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: article.content,
      category: article.category || 'stewardship',
      tags: article.tags || [],
      reading_time_minutes: readingTime,
      published: false,
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      title: article.title,
      slug: article.slug,
      category: article.category,
      reading_time_minutes: readingTime,
    })
  } catch (err) {
    console.error('Article generation failed:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
