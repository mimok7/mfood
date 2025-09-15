import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const form = await req.formData()
  const fields = ['name','slug','phone','email','address'] as const
  const updates: Record<string, any> = {}
  for (const f of fields) {
    const v = form.get(f)
    if (v !== null) updates[f] = String(v)
  }
  const sb = supabaseAdmin()
  await sb.from('restaurants').update(updates).eq('id', resolvedParams.id)
  return NextResponse.redirect(`/admin/restaurants/${resolvedParams.id}/settings`, 303)
}
