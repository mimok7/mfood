import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import RestaurantSwitcher from '../RestaurantSwitcher'

export default async function RestaurantAdminLayout({ children, params }: { children: React.ReactNode; params?: Promise<{ id: string }> }) {
  const resolvedParams = params ? (await params) as { id: string } : undefined
  const rid = resolvedParams?.id

  // This layout is for a specific restaurant, so we require at least 'manager' role
  // for this specific restaurant ID. Admins will also pass this check.
  await requireRole('manager', { targetRestaurantId: rid, redirectTo: '/admin' as any })

  // Fetch restaurant info to show name in header for all child pages
  const sb = createSupabaseServer()
  const { data: restaurant } = await sb.from('restaurants').select('id, name, slug').eq('id', rid).maybeSingle()
  const { data: all } = await sb.from('restaurants').select('id, name, slug').order('created_at')

  const tabs = [
    { href: `/admin/restaurants/${rid}`, label: '개요' },
    { href: `/admin/restaurants/${rid}/settings`, label: '설정' },
    { href: `/admin/restaurants/${rid}/tables`, label: '테이블' },
    { href: `/admin/restaurants/${rid}/users`, label: '사용자' },
    { href: `/admin/restaurants/${rid}/qr`, label: 'QR' },
    { href: `/admin/restaurants/${rid}/security`, label: '보안' },
    { href: `/admin/restaurants/${rid}/traffic`, label: '트래픽' },
    { href: `/admin/restaurants/${rid}/usage`, label: '사용량' },
  ]
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-white border rounded mb-4 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{restaurant?.name ?? '식당'}</h1>
          <p className="text-sm text-gray-500">식당 관리 · ID: {rid}</p>
        </div>
        <div>
          {/* @ts-ignore */}
          <RestaurantSwitcher currentId={rid!} items={all ?? []} />
        </div>
      </div>

      <div className="flex gap-4">
        <aside className="w-48 bg-white border rounded p-2 h-max">
          <nav className="flex flex-col gap-1 text-sm">
            {tabs.map(t => (
              <Link key={t.href} href={t.href as any} className="px-3 py-2 rounded hover:bg-gray-100">{t.label}</Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
