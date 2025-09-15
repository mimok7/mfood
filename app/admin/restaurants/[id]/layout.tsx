import Link from 'next/link'

export default async function RestaurantAdminLayout({ children, params }: { children: React.ReactNode; params?: Promise<{ id: string }> }) {
  const resolvedParams = params ? (await params) as { id: string } : undefined
  const rid = resolvedParams?.id
  const tabs = [
    { href: `/admin/restaurants/${rid}`, label: '개요' },
    { href: `/admin/restaurants/${rid}/users`, label: '사용자' },
    { href: `/admin/restaurants/${rid}/menu`, label: '메뉴' },
    { href: `/admin/restaurants/${rid}/settings`, label: '설정' },
    { href: `/admin/restaurants/${rid}/qr`, label: 'QR' },
  ]
  return (
    <div>
      <div className="border-b mb-4 bg-white">
        <div className="flex gap-3 px-2 py-2">
          {tabs.map(t => (
            <Link key={t.href} href={t.href as any} className="px-3 py-1.5 rounded hover:bg-gray-100">{t.label}</Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}
