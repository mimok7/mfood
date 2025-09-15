import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token') || ''
  if (!token) return NextResponse.json([], { status: 200 })

  const supabase = supabaseAdmin()
  const { data: table } = await supabase.from('tables').select('id, restaurant_id').eq('token', token).maybeSingle()
  if (!table?.restaurant_id) return NextResponse.json([], { status: 200 })

  const { data: items } = await supabase
    .from('menu_items')
    .select('id, name, price')
    .eq('restaurant_id', table.restaurant_id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  return NextResponse.json(items ?? [])
}
