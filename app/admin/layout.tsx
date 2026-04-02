import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-server'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value
  const refreshToken = cookieStore.get('sb-refresh-token')?.value

  if (!accessToken) {
    redirect('/login?redirect=/admin')
  }

  // Verify the token and get user info
  const supabase = createAdminClient()

  // Decode the JWT to get user ID (the service role client can verify)
  let userEmail = ''
  let userName = ''
  try {
    // Use the access token to get user
    const { createClient } = await import('@supabase/supabase-js')
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    if (accessToken && refreshToken) {
      const { data: { user } } = await userClient.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (user) {
        userEmail = user.email || ''
        userName = user.user_metadata?.full_name || userEmail.split('@')[0]
      }
    }
  } catch {
    // If token is invalid, redirect to login
    redirect('/login?redirect=/admin')
  }

  return (
    <div className="min-h-screen bg-eden-jungle flex">
      <AdminSidebar userEmail={userEmail} userName={userName} />
      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
