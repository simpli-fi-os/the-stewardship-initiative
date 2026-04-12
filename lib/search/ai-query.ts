// ============================================
// TSI Search Engine — Layer 3: AI Query Interpretation
// Uses Claude API to understand natural language intent
// ============================================

import { AIQueryInterpretation } from './types'

const CATEGORY_SLUGS = [
  'food-assistance', 'housing-shelter', 'medical-health', 'mental-health',
  'legal-aid', 'financial-assistance', 'clothing-household', 'childcare-youth',
  'senior-services', 'disability-services', 'veteran-services', 'employment-training',
  'education-tutoring', 'transportation', 'utilities-assistance', 'crisis-emergency',
  'substance-recovery', 'domestic-violence', 'immigration-services', 'faith-based-services',
  'financial-advisors', 'tax-professionals', 'insurance-agents', 'estate-planning',
  'family-law', 'real-estate-agents', 'mortgage-brokers', 'bookkeepers-accountants',
  'business-coaches', 'home-repair-contractors', 'fitness-wellness',
]

const RESOURCE_TYPES = [
  'resource', 'provider', 'church', 'nonprofit', 'maker', 'farm', 'education', 'agency', 'government',
]

/**
 * Interpret a natural language search query using Claude API.
 * Extracts intent, suggested filters, and a reformulated query.
 *
 * Only called when enableAI=true (opt-in, for cost control).
 * Falls back gracefully if API key is missing or call fails.
 */
export async function interpretQuery(
  query: string
): Promise<AIQueryInterpretation | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: `You are a search query interpreter for a community resource directory covering Denton County, Texas. Your job is to understand what the user is looking for and extract structured search parameters.

Available resource types: ${RESOURCE_TYPES.join(', ')}
Available category slugs: ${CATEGORY_SLUGS.join(', ')}

Respond with ONLY valid JSON matching this schema:
{
  "intent": "find_resource" | "find_provider" | "compare" | "navigate" | "info",
  "suggestedFilters": {
    "type": "<resource_type or null>",
    "category": "<category_slug or null>",
    "city": "<city name or null>",
    "tags": ["<relevant tags>"]
  },
  "reformulatedQuery": "<cleaner search terms for full-text search>",
  "summary": "<1 sentence describing what user wants>",
  "confidence": <0.0 to 1.0>
}`,
        messages: [
          {
            role: 'user',
            content: `Interpret this search query: "${query}"`,
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error('AI query interpretation failed:', response.status)
      return null
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed = JSON.parse(jsonMatch[0]) as AIQueryInterpretation

    // Validate category slug if present
    if (parsed.suggestedFilters.category && !CATEGORY_SLUGS.includes(parsed.suggestedFilters.category)) {
      parsed.suggestedFilters.category = undefined
    }

    // Validate type if present
    if (parsed.suggestedFilters.type && !RESOURCE_TYPES.includes(parsed.suggestedFilters.type)) {
      parsed.suggestedFilters.type = undefined
    }

    return parsed
  } catch (error) {
    console.error('AI query interpretation error:', error)
    return null
  }
}

/**
 * Quick heuristic-based query classification (no API call).
 * Used as a fast pre-filter before deciding whether to invoke AI.
 */
export function classifyQueryLocally(query: string): {
  isSimple: boolean
  likelyCategory?: string
  likelyType?: string
} {
  const q = query.toLowerCase().trim()

  // Simple keyword matching for common intents
  const categoryMap: Record<string, string> = {
    'food': 'food-assistance',
    'hungry': 'food-assistance',
    'pantry': 'food-assistance',
    'groceries': 'food-assistance',
    'shelter': 'housing-shelter',
    'homeless': 'housing-shelter',
    'housing': 'housing-shelter',
    'rent help': 'housing-shelter',
    'doctor': 'medical-health',
    'clinic': 'medical-health',
    'medical': 'medical-health',
    'health': 'medical-health',
    'counseling': 'mental-health',
    'therapy': 'mental-health',
    'mental health': 'mental-health',
    'depression': 'mental-health',
    'anxiety': 'mental-health',
    'lawyer': 'legal-aid',
    'legal': 'legal-aid',
    'attorney': 'legal-aid',
    'bills': 'financial-assistance',
    'utility': 'utilities-assistance',
    'electric bill': 'utilities-assistance',
    'childcare': 'childcare-youth',
    'daycare': 'childcare-youth',
    'after school': 'childcare-youth',
    'veteran': 'veteran-services',
    'military': 'veteran-services',
    'va benefits': 'veteran-services',
    'job': 'employment-training',
    'employment': 'employment-training',
    'resume': 'employment-training',
    'tutor': 'education-tutoring',
    'homework': 'education-tutoring',
    'ride': 'transportation',
    'bus': 'transportation',
    'crisis': 'crisis-emergency',
    'emergency': 'crisis-emergency',
    'suicide': 'crisis-emergency',
    'addiction': 'substance-recovery',
    'rehab': 'substance-recovery',
    'sober': 'substance-recovery',
    'abuse': 'domestic-violence',
    'domestic violence': 'domestic-violence',
    'immigration': 'immigration-services',
    'citizenship': 'immigration-services',
    'church': 'faith-based-services',
    'financial advisor': 'financial-advisors',
    'investing': 'financial-advisors',
    'tax': 'tax-professionals',
    'cpa': 'tax-professionals',
    'insurance': 'insurance-agents',
    'dentist': 'fitness-wellness',
    'contractor': 'home-repair-contractors',
    'plumber': 'home-repair-contractors',
    'electrician': 'home-repair-contractors',
  }

  for (const [keyword, category] of Object.entries(categoryMap)) {
    if (q.includes(keyword)) {
      return { isSimple: true, likelyCategory: category }
    }
  }

  // Type detection
  if (q.includes('church') || q.includes('worship')) {
    return { isSimple: true, likelyType: 'church' }
  }
  if (q.includes('nonprofit') || q.includes('non-profit')) {
    return { isSimple: true, likelyType: 'nonprofit' }
  }

  // Complex query — might benefit from AI
  return { isSimple: false }
}
