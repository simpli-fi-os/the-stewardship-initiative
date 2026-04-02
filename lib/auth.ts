import { createAdminClient } from './supabase-server'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'member' | 'admin' | 'super_admin'
  org_id: string | null
  avatar_url: string | null
}

// Get user profile by ID (server-side, uses service role)
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    email: data.email || '',
    full_name: data.full_name || '',
    role: data.role || 'member',
    org_id: data.org_id,
    avatar_url: data.avatar_url,
  }
}

// Check if a user is an admin for a given org
export async function isOrgAdmin(userId: string, orgId: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  if (!profile) return false
  if (profile.role === 'super_admin') return true
  return profile.role === 'admin' && profile.org_id === orgId
}

// Get all members for admin view (includes unapproved)
export async function getAdminMembers(orgId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('members')
    .select(`
      id, org_id, name, title, email, phone, website, photo_url, bio, description,
      available, approved, featured, created_at, approved_at, rejected_at, rejection_reason,
      member_skills (
        skills (id, name, color, icon)
      )
    `)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  if (error) return []

  return (data || []).map((m: Record<string, unknown>) => ({
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
    approved: m.approved as boolean,
    featured: m.featured as boolean,
    created_at: m.created_at as string,
    approved_at: m.approved_at as string | null,
    rejected_at: m.rejected_at as string | null,
    rejection_reason: m.rejection_reason as string | null,
    skills: ((m.member_skills as Array<{ skills: { id: string; name: string; color: string } }>) || []).map(ms => ms.skills),
  }))
}

// Approve a member
export async function approveMember(memberId: string, approvedBy: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('members')
    .update({
      approved: true,
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      rejected_at: null,
      rejection_reason: null,
    })
    .eq('id', memberId)

  return !error
}

// Reject a member
export async function rejectMember(memberId: string, reason?: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('members')
    .update({
      approved: false,
      rejected_at: new Date().toISOString(),
      rejection_reason: reason || null,
    })
    .eq('id', memberId)

  return !error
}

// Toggle featured status
export async function toggleFeatured(memberId: string) {
  const supabase = createAdminClient()

  // Get current state
  const { data: member } = await supabase
    .from('members')
    .select('featured')
    .eq('id', memberId)
    .single()

  if (!member) return false

  const { error } = await supabase
    .from('members')
    .update({ featured: !member.featured })
    .eq('id', memberId)

  return !error
}

// Get admin dashboard stats
export async function getAdminStats(orgId: string) {
  const supabase = createAdminClient()

  const [
    { count: totalMembers },
    { count: approvedMembers },
    { count: pendingMembers },
    { count: recentSubmissions },
  ] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('approved', true),
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('approved', false).is('rejected_at', null),
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  return {
    totalMembers: totalMembers || 0,
    approvedMembers: approvedMembers || 0,
    pendingMembers: pendingMembers || 0,
    recentSubmissions: recentSubmissions || 0,
  }
}
