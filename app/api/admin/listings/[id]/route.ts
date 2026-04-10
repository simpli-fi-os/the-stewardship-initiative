import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = request.cookies.get('sb-access-token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const {
    name,
    description,
    published,
  } = body as {
    name?: string
    description?: string
    published?: boolean
  }

  const supabase = createAdminClient()

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (description !== undefined) updateData.description = description
  if (published !== undefined) {
    updateData.published = published
    if (published) {
      updateData.published_at = new Date().toISOString()
    } else {
      updateData.published_at = null
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('listings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ listing: data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = request.cookies.get('sb-access-token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
