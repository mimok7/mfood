import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  // 관리자 권한 확인
  await requireRole('admin')

  const supabase = createSupabaseServer()
  const form = await request.formData()

  const payload: Record<string, any> = {
    name: String(form.get('name') || ''),
    slug: String(form.get('slug') || '') || null,
  }

  const table_count_raw = form.get('table_count')
  const default_table_capacity_raw = form.get('default_table_capacity')
  if (table_count_raw !== null) payload.table_count = Number(String(table_count_raw))
  if (default_table_capacity_raw !== null) payload.default_table_capacity = Number(String(default_table_capacity_raw))

  if (!payload.name) {
    return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 })
  }

  const { data, error } = await supabase.from('restaurants').insert(payload).select().maybeSingle()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  // redirect back to list (use absolute URL)
  const base = new URL(request.url).origin
  return NextResponse.redirect(new URL('/admin/restaurants', base), 303)
}
