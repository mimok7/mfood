import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const token = String(form.get('token') || '')
  const item_id = String(form.get('item_id') || '')
  const qty = Number(form.get('qty') || 1)
  if (!token || !item_id || qty < 1) return NextResponse.redirect(req.headers.get('referer') || '/', 303)

  const supabase = supabaseAdmin()
  const { data: table } = await supabase.from('tables').select('id, restaurant_id').eq('token', token).maybeSingle()
  if (!table?.restaurant_id) return NextResponse.redirect(req.headers.get('referer') || '/', 303)

  // find or create open order
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('restaurant_id', table.restaurant_id)
    .eq('table_id', table.id)
    .eq('status', 'open')
    .limit(1)
  let order_id = existing?.[0]?.id
  if (!order_id) {
    const { data: created, error } = await supabase
      .from('orders')
      .insert({ restaurant_id: table.restaurant_id, table_id: table.id, status: 'open' })
      .select('id')
      .single()
    if (error || !created) return NextResponse.redirect(req.headers.get('referer') || '/', 303)
    order_id = created.id
  }

  // price lookup
  const { data: mi } = await supabase.from('menu_items').select('price').eq('id', item_id).maybeSingle()
  const price = mi?.price ?? 0

  await supabase.from('order_items').insert({ order_id, item_id, qty, price })

  return NextResponse.redirect(req.headers.get('referer') || '/', 303)
}
