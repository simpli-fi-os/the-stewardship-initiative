import { getAdminMembers } from '@/lib/auth'
import MembersManager from './MembersManager'

const VILLAGE_CHURCH_ORG_ID = 'a1b2c3d4-0000-0000-0000-000000000001'

export const revalidate = 0 // Always fresh for admin

export default async function MembersPage() {
  const members = await getAdminMembers(VILLAGE_CHURCH_ORG_ID)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-eden-orchid">Members</h1>
        <p className="text-eden-gray mt-1">Manage directory members — approve, reject, feature, or edit profiles.</p>
      </div>
      <MembersManager initialMembers={members} />
    </div>
  )
}
