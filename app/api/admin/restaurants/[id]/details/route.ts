import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { requireRole } from '@/lib/auth'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole('manager')
  const resolved = await params
  const sb = createSupabaseServer()
  const { data: restaurant } = await sb.from('restaurants').select('*').eq('id', resolved.id).maybeSingle()
  const { data: tables } = await sb.from('tables').select('id, name, capacity').eq('restaurant_id', resolved.id).order('created_at')
  return NextResponse.json({ restaurant, tables })
}
