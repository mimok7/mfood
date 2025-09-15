import { NextRequest, NextResponse } from 'next/server'
import { getSession, requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  // 관리자 권한
  await requireRole('admin')

  const supabase = createSupabaseServer()
  const form = await request.formData()

  const payload = {
    name: String(form.get('name') || ''),
    slug: String(form.get('slug') || ''),
  }

  if (!payload.name) {
    return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('restaurants')
    .insert(payload)
    .select()
    .maybeSingle()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
