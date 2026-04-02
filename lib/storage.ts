import { createServerClient } from '@/lib/supabase'

export async function uploadMemberPhoto(file: File, memberId: string): Promise<string | null> {
  const supabase = createServerClient()

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${memberId}.${ext}`

  const { error } = await supabase.storage
    .from('member-photos')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Photo upload error:', error)
    return null
  }

  const { data } = supabase.storage.from('member-photos').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadOrgLogo(file: File, orgId: string): Promise<string | null> {
  const supabase = createServerClient()

  const ext = file.name.split('.').pop() || 'png'
  const path = `${orgId}.${ext}`

  const { error } = await supabase.storage
    .from('org-logos')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Logo upload error:', error)
    return null
  }

  const { data } = supabase.storage.from('org-logos').getPublicUrl(path)
  return data.publicUrl
}
