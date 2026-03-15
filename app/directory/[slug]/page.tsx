import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchDirectoryData } from '@/lib/supabase'
import DirectoryView from './DirectoryView'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await fetchDirectoryData(params.slug)
  if (!data) return { title: 'Directory Not Found' }
  return {
    title: `${data.org.name} Directory`,
    description: data.org.description || `Member & Skills Directory for ${data.org.name}`,
  }
}

export default async function DirectoryPage({ params }: { params: { slug: string } }) {
  const data = await fetchDirectoryData(params.slug)
  if (!data) notFound()

  return (
    <DirectoryView
      members={data.members}
      orgName={data.org.name}
      orgSlug={params.slug}
      orgLogoUrl={data.org.logo_url || undefined}
      orgHeroUrl={data.org.hero_image_url || undefined}
    />
  )
}
