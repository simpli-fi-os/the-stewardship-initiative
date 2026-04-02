import { createAdminClient } from '@/lib/supabase-server'

const VILLAGE_CHURCH_ORG_ID = 'a1b2c3d4-0000-0000-0000-000000000001'

export default async function SettingsPage() {
  const supabase = createAdminClient()

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', VILLAGE_CHURCH_ORG_ID)
    .single()

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('org_id', VILLAGE_CHURCH_ORG_ID)
    .order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-eden-orchid">Settings</h1>
        <p className="text-eden-gray mt-1">Manage your community directory configuration.</p>
      </div>

      {/* Organization Info */}
      <div className="eden-card p-6 mb-6">
        <h2 className="font-display text-xl font-bold text-eden-orchid mb-4">Organization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-1">Name</p>
            <p className="text-eden-orchid">{org?.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-1">Slug</p>
            <p className="text-eden-orchid font-mono text-sm">/directory/{org?.slug || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-1">Website</p>
            <a href={org?.website_url || '#'} target="_blank" className="text-eden-tidal hover:underline text-sm">
              {org?.website_url || '—'}
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-1">Tier</p>
            <span className="text-xs px-3 py-1 rounded-full bg-eden-marigold/10 text-eden-marigold font-semibold capitalize">
              {org?.tier || 'seed'}
            </span>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-semibold text-eden-gray uppercase tracking-wider mb-1">Description</p>
            <p className="text-eden-orchid text-sm">{org?.description || '—'}</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="eden-card p-6 mb-6">
        <h2 className="font-display text-xl font-bold text-eden-orchid mb-4">
          Skills & Giftings
          <span className="ml-2 text-sm font-normal text-eden-gray">({skills?.length || 0})</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {(skills || []).map((skill: { id: string; name: string; color: string }) => (
            <div
              key={skill.id}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-eden-marigold/20 bg-eden-jungle/30"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skill.color }} />
              <span className="text-sm text-eden-orchid">{skill.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-eden-gray mt-4">
          Skill management coming soon. Contact support to add or modify skills.
        </p>
      </div>

      {/* Embed Code */}
      <div className="eden-card p-6">
        <h2 className="font-display text-xl font-bold text-eden-orchid mb-4">Embed Your Directory</h2>
        <p className="text-sm text-eden-gray mb-4">
          Share this link with your church community to let them browse and join the directory.
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-4 py-3 bg-eden-jungle rounded-lg text-sm text-eden-tidal font-mono border border-eden-marigold/20">
            {`${process.env.NEXT_PUBLIC_SITE_URL || 'https://thestewardshipinitiative.org'}/directory/${org?.slug || 'village-church'}`}
          </code>
        </div>
      </div>
    </div>
  )
}
