import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const token = String(form.get('token') || '')
  const name = String(form.get('name') || '')
  const phone = String(form.get('phone') || '')
  const party_size = Number(form.get('party_size') || 2)
  if (!token || !name) return NextResponse.redirect(req.headers.get('referer') || '/', 303)

  const supabase = supabaseAdmin()
  const { data: table } = await supabase.from('tables').select('restaurant_id').eq('token', token).maybeSingle()
  if (!table?.restaurant_id) return NextResponse.redirect(req.headers.get('referer') || '/', 303)

  await supabase.from('waitlist').insert({
    restaurant_id: table.restaurant_id,
    name,
    phone,
    party_size,
    status: 'waiting',
  })

  return NextResponse.redirect(req.headers.get('referer') || '/', 303)
}
