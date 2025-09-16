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
    const restaurant_param = payload.restaurant || payload.restaurant_id || null
    const token = payload.token || null

    const supabase = supabaseAdmin()

    // resolve restaurant_id from token if needed
    let restaurant_id = restaurant_param
    if (!restaurant_id && token) {
      const { data: table } = await supabase.from('tables').select('restaurant_id').eq('token', token).maybeSingle()
      restaurant_id = table?.restaurant_id ?? null
    }

    if (!name) {
      if (contentType.includes('application/json')) return NextResponse.json({ error: 'name required' }, { status: 400 })
      return NextResponse.redirect(req.headers.get('referer') || '/', 303)
    }

    if (!partySize || partySize <= 0) {
      if (contentType.includes('application/json')) return NextResponse.json({ error: 'party_size required' }, { status: 400 })
      return NextResponse.redirect(req.headers.get('referer') || '/', 303)
    }

    if (!restaurant_id) {
      if (contentType.includes('application/json')) return NextResponse.json({ error: 'restaurant required' }, { status: 400 })
      return NextResponse.redirect(req.headers.get('referer') || '/', 303)
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
