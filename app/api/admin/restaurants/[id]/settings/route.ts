import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireRole('admin')
  const resolvedParams = await params
  const form = await req.formData()
  const fields = ['name', 'slug', 'phone', 'email', 'address', 'table_count', 'default_table_capacity'] as const
  const updates: Record<string, any> = {}
  for (const f of fields) {
    const v = form.get(f)
    if (v === null) continue
    if (f === 'table_count' || f === 'default_table_capacity') {
      const n = Number(String(v))
      if (!Number.isNaN(n)) updates[f] = n
      continue
    }
    updates[f] = String(v)
  }
  const sb = supabaseAdmin()
  await sb.from('restaurants').update(updates).eq('id', resolvedParams.id)

  // Handle existing table updates
  const tableIds = form.getAll('table_id[]') as string[]
  const tableNames = form.getAll('table_name[]') as string[]
  const tableCaps = form.getAll('table_capacity[]') as string[]

  for (let i = 0; i < tableIds.length; i++) {
    const tid = tableIds[i]
    const name = tableNames[i]
    const cap = Number(tableCaps[i]) || 4
    if (!tid) continue
    await sb.from('tables').update({ name: String(name), capacity: cap }).eq('id', tid).eq('restaurant_id', resolvedParams.id)
  }

  // Create new tables if requested
  const addCount = Number(form.get('add_table_count') ?? 0)
  const newCap = Number(form.get('new_table_capacity') ?? 4)
  if (addCount > 0) {
    const inserts = [] as any[]
    for (let i = 0; i < addCount; i++) {
      inserts.push({ restaurant_id: resolvedParams.id, name: `Table ${Date.now()}_${i+1}`, capacity: newCap })
    }
    if (inserts.length) await sb.from('tables').insert(inserts)
  }

  return redirect(`/admin/restaurants/${resolvedParams.id}/settings`)
}
