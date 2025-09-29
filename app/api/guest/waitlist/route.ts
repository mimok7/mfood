import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let payload: any = {}

    if (contentType.includes('application/json')) {
      payload = await req.json()
    } else {
      const form = await req.formData()
      form.forEach((v, k) => {
        payload[k] = v
      })
    }

    const name = String(payload.name || '').trim()
    const phone = String(payload.phone || '').trim()
    const partySize = parseInt(String(payload.party_size || payload.partySize || '1'), 10) || 1
  const restaurant_id = payload.restaurant_id || null
  const token = payload.token || null
  const waitlistToken = payload.wt || payload.waitlist_token || null

  const supabase = supabaseAdmin()

    // restaurant_id 검증 (token으로 추가 검증)
    if (!restaurant_id) {
      if (contentType.includes('application/json')) return NextResponse.json({ error: 'restaurant_id required' }, { status: 400 })
      return NextResponse.redirect(req.headers.get('referer') || '/', 303)
    }

    // QR 필수: 대기 전용(wt) 또는 테이블 token 둘 중 하나는 반드시 제공
    if (!token && !waitlistToken) {
      if (contentType.includes('application/json')) return NextResponse.json({ error: 'qr required' }, { status: 400 })
      return NextResponse.redirect(req.headers.get('referer') || '/', 303)
    }

    // token이 제공된 경우 restaurant_id와 일치하는지 검증
    if (token) {
      const { data: table } = await supabase.from('tables').select('restaurant_id').eq('token', token).eq('restaurant_id', restaurant_id).maybeSingle()
      if (!table) {
        if (contentType.includes('application/json')) return NextResponse.json({ error: 'invalid token for restaurant' }, { status: 400 })
        return NextResponse.redirect(req.headers.get('referer') || '/', 303)
      }
    }

    // 웨이팅 토큰이 제공되면 레스토랑의 waitlist_token과 일치하는지 검증
    if (waitlistToken) {
      const { data: r } = await supabase.from('restaurants').select('id, waitlist_token').eq('id', restaurant_id).maybeSingle()
      if (!r || r.waitlist_token !== waitlistToken) {
        if (contentType.includes('application/json')) return NextResponse.json({ error: 'invalid waitlist token' }, { status: 400 })
        return NextResponse.redirect(req.headers.get('referer') || '/', 303)
      }
    }

    const insertPayload = {
      restaurant_id,
      name,
      phone,
      party_size: partySize,
      status: 'waiting',
    }

    const { data: inserted, error: insertError } = await supabase
      .from('waitlist')
      .insert([insertPayload])
      .select('id, created_at')
      .maybeSingle()

    if (insertError || !inserted) {
      console.error('waitlist insert error', insertError)
      if (contentType.includes('application/json')) return NextResponse.json({ error: 'insert failed' }, { status: 500 })
      return NextResponse.redirect(req.headers.get('referer') || '/', 303)
    }

    // count position: number of waiting items with created_at <= inserted.created_at
    const { count, error: countError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurant_id)
      .eq('status', 'waiting')
      .lte('created_at', inserted.created_at)

    if (countError) {
      console.error('waitlist count error', countError)
    }

    if (contentType.includes('application/json')) {
      return NextResponse.json({ id: inserted.id, position: typeof count === 'number' ? count : null }, { status: 201 })
    }

    // form submit: redirect back
    return NextResponse.redirect(req.headers.get('referer') || '/', 303)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const restaurant_id = url.searchParams.get('restaurant_id') || url.searchParams.get('restaurant') || url.searchParams.get('rid')
    const id = url.searchParams.get('id')
    if (!restaurant_id) {
      // During initial hydration or dev hot-reload, allow empty list instead of 400.
      return NextResponse.json({ items: [] }, { status: 200 })
    }

    const supabase = supabaseAdmin()

    // 단일 대기자 상태 조회 (호출 여부 확인용)
    if (id) {
      const { data, error } = await supabase
        .from('waitlist')
        .select('id, status, updated_at, created_at')
        .eq('id', id)
        .eq('restaurant_id', restaurant_id)
        .maybeSingle()

      if (error) {
        console.error('waitlist GET by id error', error)
        return NextResponse.json({ error: 'fetch failed' }, { status: 500 })
      }

      if (!data) {
        return NextResponse.json({ error: 'not found' }, { status: 404 })
      }

      return NextResponse.json({ item: { id: data.id, status: (data as any).status, updated_at: (data as any).updated_at, created_at: data.created_at } }, { status: 200 })
    }
    // fetch waiting list minimal fields only; do NOT return phone
    const { data, error } = await supabase
      .from('waitlist')
      .select('id, created_at, party_size, name, status')
      .eq('restaurant_id', restaurant_id)
      .eq('status', 'waiting')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('waitlist GET error', error)
      return NextResponse.json({ error: 'fetch failed' }, { status: 500 })
    }

    function maskName(n?: string | null) {
      const s = (n || '').trim()
      if (!s) return '손님'
      if (s.length === 1) return '*'
      if (s.length === 2) return s[0] + '*'
      return s[0] + '*'.repeat(Math.max(1, s.length - 2)) + s[s.length - 1]
    }

    const items = (data || []).map((row) => ({
      id: row.id,
      created_at: row.created_at,
      party_size: row.party_size,
      display_name: maskName((row as any).name),
    }))

    return NextResponse.json({ items }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
