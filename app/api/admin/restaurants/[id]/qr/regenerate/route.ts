import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireRole('admin')
  const resolvedParams = await params
  const form = await req.formData()
  const tableId = String(form.get('table_id') || '')

  if (!tableId) return NextResponse.json({ error: 'missing table_id' }, { status: 400 })

  const sb = supabaseAdmin()

  // Verify table belongs to restaurant
  const { data: table } = await sb.from('tables').select('id, restaurant_id').eq('id', tableId).maybeSingle()
  if (!table || table.restaurant_id !== resolvedParams.id) {
    return NextResponse.json({ error: 'invalid table' }, { status: 400 })
  }

  const newToken = crypto.randomUUID()
  await sb.from('tables').update({ token: newToken }).eq('id', tableId)

  return NextResponse.json({ success: true, table_id: tableId, token: newToken })
}
