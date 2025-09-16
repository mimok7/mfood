import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import RestaurantSwitcher from '../RestaurantSwitcher'
import { headers } from 'next/headers'

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

  // Get current pathname for active menu highlighting
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || ''

  const tabs = [
    { href: `/admin/restaurants/${rid}`, label: '개요', icon: '📊' },
    { href: `/admin/restaurants/${rid}/menu`, label: '메뉴', icon: '🍽️' },
    { href: `/admin/restaurants/${rid}/settings`, label: '설정', icon: '⚙️' },
    { href: `/admin/restaurants/${rid}/tables`, label: '테이블', icon: '🪑' },
    { href: `/admin/restaurants/${rid}/users`, label: '사용자', icon: '👥' },
    { href: `/admin/restaurants/${rid}/qr`, label: 'QR', icon: '📱' },
    { href: `/admin/restaurants/${rid}/security`, label: '보안', icon: '🔒' },
    { href: `/admin/restaurants/${rid}/traffic`, label: '트래픽', icon: '📈' },
    { href: `/admin/restaurants/${rid}/usage`, label: '사용량', icon: '📊' },
  ]
  return (
    <div className="w-full print:p-0">
      <div className="bg-white border rounded mb-4 px-4 py-3 flex items-center justify-between print:hidden">
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
        <aside className="w-36 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden print:hidden">
          <div className="px-3 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🏪</span>
              메뉴
            </h2>
          </div>
          <nav className="p-2">
            <div className="space-y-1">
              {tabs.map(t => {
                const isActive = pathname === t.href
                return (
                  <Link
                    key={t.href}
                    href={t.href as any}
                    className={`group flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      isActive
                        ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-base mr-2 group-hover:scale-110 transition-transform duration-200">
                      {t.icon}
                    </span>
                    <div className={`font-semibold ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                      {t.label}
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        </aside>
        <main className="flex-1 min-w-0 print:w-full print:m-0 print:p-0">{children}</main>
      </div>
    </div>
  )
}
