import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TOPICS = [
  'Why Every Church Needs a Skills Directory (Not Just a Photo Directory)',
  'The Biblical Case for Stewardship of Gifts in Your Congregation',
  'How to Set Up a Church Community Directory in 10 Minutes',
  '5 Ways to Strengthen Church Community Connection in 2026',
  'Church Volunteer Fatigue: Why a Skills Directory Solves What Sign-Up Sheets Cannot',
  'From Pews to Purpose: Making Your Church Talent Visible',
  'The Connection Gap: Why 1 in 4 Churchgoers Feel Disconnected (And How to Fix It)',
  'Finding an Accountant in Your Church: How Skills Directories Build Trust',
]

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { createServerClient } = await import('@/lib/supabase')
    const supabase = createServerClient()

    // Pick a random topic
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]

    // Generate article via Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
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
- slug: URL-friendly slug
- description: Meta description (under 155 characters)
- content: Full article in Markdown (1,200-1,800 words)

Return ONLY valid JSON, no markdown fences.`,
        messages: [
          { role: 'user', content: `Write an article about: ${topic}` }
        ],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    // Parse the JSON response
    const article = JSON.parse(text)

    // Save to Supabase (unpublished, for admin review)
    const { error } = await supabase.from('articles').insert({
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: article.content,
      published: false,
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      title: article.title,
      slug: article.slug,
    })
  } catch (err) {
    console.error('Article generation failed:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
