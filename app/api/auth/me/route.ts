import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || ''
    const m = auth.match(/^Bearer (.+)$/)
    if (!m) return NextResponse.json({ success: false, error: 'missing token' }, { status: 401 })
    const token = m[1]

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    if (!url || !anon) return NextResponse.json({ success: false, error: 'supabase not configured' }, { status: 500 })

    const sb = createClient(url, anon)
    // verify token by calling auth.getUser
    const { data, error: sessionErr } = await sb.auth.getUser(token)
    const user = data?.user
    if (sessionErr || !user) {
      return NextResponse.json({ success: false, error: sessionErr?.message || 'invalid token' }, { status: 401 })
    }

    const uid = user.id
    // fetch user_profile via REST
    const res = await fetch(`${url}/rest/v1/user_profile?id=eq.${uid}&select=id,role`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` }
    })
    if (!res.ok) return NextResponse.json({ success: false, error: `profile fetch failed: ${await res.text()}` }, { status: 500 })
    const rows = await res.json()
    const profile = Array.isArray(rows) && rows[0] ? rows[0] : null
    return NextResponse.json({ success: true, profile })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 })
  }
}
