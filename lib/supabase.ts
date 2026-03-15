import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for cron jobs, admin operations)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
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
