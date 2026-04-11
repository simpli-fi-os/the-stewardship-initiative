import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-server'
import ListingsManager from './ListingsManager'
import { Listing } from '@/lib/types/directory'

export const metadata = {
  title: 'Listings - TSI Admin',
  description: 'Review and manage submitted listings',
}

export default async function ListingsPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value

  if (!accessToken) {
    redirect('/login?redirect=/admin/listings')
  }

  const supabase = createAdminClient()

  // Fetch all listings from the database
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching listings:', error)
    return (
      <div className="max-w-7xl">
        <h1 className="text-3xl font-display font-bold text-eden-marigold mb-2">Listings</h1>
        <p className="text-eden-gray mb-6">Manage submitted directory listings</p>
        <div className="bg-eden-redwood/10 border border-eden-redwood text-eden-redwood p-4 rounded-lg">
          Failed to load listings. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-display font-bold text-eden-marigold mb-2">Listings</h1>
      <p className="text-eden-gray mb-6">Manage submitted directory listings</p>
      <ListingsManager initialListings={(listings as Listing[]) || []} />
    </div>
  )
}
