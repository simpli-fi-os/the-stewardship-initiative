import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Lazy-initialized client — only connects when env vars are present
let _supabase: SupabaseClient | null = null

export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

// Server-side client with service role key (for cron jobs, admin operations)
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase server environment variables are not configured')
  }
  return createClient(url, key)
}

// Types matching our database schema
export interface Organization {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  hero_image_url: string | null
  website_url: string | null
  primary_color: string
  accent_color: string
  tier: 'seed' | 'growth' | 'whitelabel'
  created_at: string
}

export interface Member {
  id: string
  org_id: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  website: string | null
  photo_url: string | null
  bio: string | null
  description: string | null
  available: boolean
  featured: boolean
  skills: Skill[]
}

export interface Skill {
  id: string
  name: string
  color: string
  icon: string | null
}

export interface MemberInsert {
  name: string
  title?: string
  email?: string
  phone?: string
  bio?: string
  description?: string
  skillIds: string[]
  photo?: File
}

// Fetch directory data by org slug — returns org + approved members with skills
export async function fetchDirectoryData(slug: string): Promise<{ org: Organization; members: Member[] } | null> {
  const supabase = getSupabase()

  // Fetch organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (orgError || !org) return null

  // Fetch approved members with their skills via join
  const { data: membersData, error: membersError } = await supabase
    .from('members')
    .select(`
      id, org_id, name, title, email, phone, website, photo_url, bio, description, available, featured, approved,
      member_skills (
        skills (id, name, color, icon)
      )
    `)
    .eq('org_id', org.id)
    .eq('approved', true)
    .order('featured', { ascending: false })
    .order('name')

  if (membersError) return null

  // Transform nested PostgREST response into flat Member[] shape
  const members: Member[] = (membersData || []).map((m: Record<string, unknown>) => ({
    id: m.id as string,
    org_id: m.org_id as string,
    name: m.name as string,
    title: m.title as string | null,
    email: m.email as string | null,
    phone: m.phone as string | null,
    website: m.website as string | null,
    photo_url: m.photo_url as string | null,
    bio: m.bio as string | null,
    description: m.description as string | null,
    available: m.available as boolean,
    featured: m.featured as boolean,
    skills: ((m.member_skills as Array<{ skills: Skill }>) || []).map(ms => ms.skills),
  }))

  return { org, members }
}
