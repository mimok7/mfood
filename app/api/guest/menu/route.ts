import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get('restaurant_id') || ''
  const token = searchParams.get('token') || ''

  if (!restaurantId || !token) return NextResponse.json([], { status: 200 })

  const supabase = supabaseAdmin()

  // 토큰으로 테이블 확인 (보안을 위해)
  const { data: table } = await supabase.from('tables').select('id, restaurant_id').eq('token', token).eq('restaurant_id', restaurantId).maybeSingle()
  if (!table?.restaurant_id) return NextResponse.json([], { status: 200 })

  const { data: items } = await supabase
    .from('menu_items')
    .select('id, name, price')
    .eq('restaurant_id', table.restaurant_id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  return NextResponse.json(items ?? [])
}
