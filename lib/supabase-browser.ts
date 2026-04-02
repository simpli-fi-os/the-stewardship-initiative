import { createClient } from '@supabase/supabase-js'

// Browser-side Supabase client (singleton)
let browserClient: ReturnType<typeof createClient> | null = null

export function createBrowserClient() {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  browserClient = createClient(url, key, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return browserClient
}
