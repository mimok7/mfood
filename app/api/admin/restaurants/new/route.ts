import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  // 관리자 권한 확인
  await requireRole('admin')

  const supabase = createSupabaseServer()

  let payload: Record<string, any>

  // Content-Type에 따라 처리 방식 결정
  const contentType = request.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    // JSON 요청 처리
    const body = await request.json()
    payload = {
      name: body.name,
      slug: body.slug || null,
      address: body.address || null,
    }
  } else {
    // FormData 요청 처리 (기존 호환성 유지)
    const form = await request.formData()
    payload = {
      name: String(form.get('name') || ''),
      slug: String(form.get('slug') || '') || null,
    }

    const table_count_raw = form.get('table_count')
    const default_table_capacity_raw = form.get('default_table_capacity')
    if (table_count_raw !== null) payload.table_count = Number(String(table_count_raw))
    if (default_table_capacity_raw !== null) payload.default_table_capacity = Number(String(default_table_capacity_raw))
  }

  if (!payload.name) {
    return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 })
  }

  const { data, error } = await supabase.from('restaurants').insert(payload).select().maybeSingle()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  // JSON 요청인 경우 JSON 응답 반환
  if (contentType?.includes('application/json')) {
    return NextResponse.json({ ok: true, restaurant: data })
  }

  // FormData 요청인 경우 리다이렉트 (기존 동작 유지)
  const base = new URL(request.url).origin
  return NextResponse.redirect(new URL('/admin/restaurants', base), 303)
}
