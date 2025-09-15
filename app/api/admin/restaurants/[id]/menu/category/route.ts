import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  await requireRole('manager', { targetRestaurantId: resolvedParams.id })
  const form = await req.formData()
  const name = String(form.get('name') || '')
  const position = Number(form.get('position') || 0)
  if (!name) return NextResponse.redirect(`/admin/restaurants/${resolvedParams.id}/menu`, 303)
  const sb = supabaseAdmin()
  await sb.from('menu_categories').insert({ restaurant_id: resolvedParams.id, name, position })
  return NextResponse.redirect(`/admin/restaurants/${resolvedParams.id}/menu`, 303)
}
