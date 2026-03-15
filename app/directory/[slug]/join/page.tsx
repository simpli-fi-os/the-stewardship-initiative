import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import type { Skill } from '@/lib/supabase'
import JoinForm from './JoinForm'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = getSupabase()
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('slug', params.slug)
    .single()

  if (!org) return { title: 'Directory Not Found' }
  return {
    title: `Join ${org.name} Directory`,
    description: `Submit your profile to the ${org.name} Member & Skills Directory.`,
  }
}

export default async function JoinPage({ params }: { params: { slug: string } }) {
  const supabase = getSupabase()

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug, logo_url')
    .eq('slug', params.slug)
    .single()

  if (!org) notFound()

  const { data: skills } = await supabase
    .from('skills')
    .select('id, name, color, icon')
    .eq('org_id', org.id)
    .order('name')

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#333] font-body">
      <div className="bg-[#333] text-white text-center py-2 px-4">
        <a href="/" className="text-sm font-semibold tracking-wider hover:underline">
          The Stewardship Initiative
        </a>
      </div>

      <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
        <header className="mb-8 text-center">
          {org.logo_url && (
            <img src={org.logo_url} alt={`${org.name} Logo`} className="h-10 w-auto mx-auto mb-4" />
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Join the {org.name} Directory
          </h1>
          <p className="mt-2 text-gray-500">
            Share your skills and gifts with your church family.
          </p>
        </header>

        <JoinForm slug={params.slug} skills={(skills || []) as Skill[]} />
      </div>
    </div>
  )
}
