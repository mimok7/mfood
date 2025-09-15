import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  await requireRole('admin')

  const body = await request.json().catch(() => ({}))
  const { email, password, role = 'manager', restaurant_id } = body ?? {}

  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'email and password required' }, { status: 400 })
  }

  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!adminKey) {
    return NextResponse.json({ success: false, error: 'service role key missing' }, { status: 500 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const admin = createClient(url, adminKey)

  // 1) auth 사용자 생성
  const { data: userRes, error: userErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (userErr || !userRes?.user) {
    return NextResponse.json({ success: false, error: userErr?.message || 'createUser failed' }, { status: 500 })
  }

  // 2) profile 생성 (RLS 우회 위해 REST 사용)
  const res = await fetch(`${url}/rest/v1/user_profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': adminKey,
      'Authorization': `Bearer ${adminKey}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ id: userRes.user.id, role, restaurant_id }),
  })

  if (!res.ok) {
    // 실패 시 auth 유저 롤백
    await admin.auth.admin.deleteUser(userRes.user.id)
    return NextResponse.json({ success: false, error: `profile insert failed: ${await res.text()}` }, { status: 500 })
  }

  const profile = await res.json()
  return NextResponse.json({ success: true, data: { user: userRes.user, profile } })
}
