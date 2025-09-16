import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireRole } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireRole('admin')
  const resolvedParams = await params
  const form = await req.formData()

  const totalTables = Number(form.get('total_tables')) || 0

  // table_capacity_{id} 형식의 필드들을 수집
  const tableCapacities: { [key: string]: number } = {}
  for (const [key, value] of form.entries()) {
    if (key.startsWith('table_capacity_')) {
      const tableId = key.replace('table_capacity_', '')
      tableCapacities[tableId] = Number(String(value)) || 4
    }
  }

  const sb = supabaseAdmin()

  // 현재 테이블들 조회
  const { data: existingTables } = await sb
    .from('tables')
    .select('id')
    .eq('restaurant_id', resolvedParams.id)
    .order('created_at')

  const existingCount = existingTables?.length ?? 0

  if (totalTables > existingCount) {
    // 테이블 추가
    const tablesToAdd = totalTables - existingCount
    const inserts = []

    for (let i = 0; i < tablesToAdd; i++) {
      const tableIndex = existingCount + i
      const capacity = 4 // 새 테이블은 기본값 4로 설정

      inserts.push({
        restaurant_id: resolvedParams.id,
        name: `테이블 ${tableIndex + 1}`,
        capacity: capacity,
        token: crypto.randomUUID()
      })
    }

    if (inserts.length > 0) {
      await sb.from('tables').insert(inserts)
    }
  } else if (totalTables < existingCount) {
    // 테이블 삭제 (가장 최근에 추가된 것부터)
    const tablesToDelete = existingCount - totalTables
    const idsToDelete = existingTables?.slice(-tablesToDelete).map(t => t.id) ?? []

    if (idsToDelete.length > 0) {
      await sb.from('tables').delete().in('id', idsToDelete)
    }
  }

  // 기존 테이블들의 용량 업데이트
  if (existingTables && existingTables.length > 0) {
    for (const table of existingTables) {
      const newCapacity = tableCapacities[table.id] || 4

      await sb
        .from('tables')
        .update({ capacity: newCapacity })
        .eq('id', table.id)
    }
  }

  return redirect(`/admin/restaurants/${resolvedParams.id}/tables`)
}