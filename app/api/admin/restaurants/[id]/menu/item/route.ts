import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  await requireRole('manager', { targetRestaurantId: resolvedParams.id })
  const form = await req.formData()
  const name = String(form.get('name') || '')
  const price = Number(form.get('price') || 0)
  const category_id = String(form.get('category_id') || '') || null
  const is_active = String(form.get('is_active') || 'true') === 'true'
  if (!name || !price) return NextResponse.redirect(`/admin/restaurants/${resolvedParams.id}/menu`, 303)
  const sb = supabaseAdmin()
  await sb.from('menu_items').insert({ restaurant_id: resolvedParams.id, name, price, category_id, is_active })
  return NextResponse.redirect(`/admin/restaurants/${resolvedParams.id}/menu`, 303)
}
