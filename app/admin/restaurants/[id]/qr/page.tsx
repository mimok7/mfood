export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase-admin'

function Qr({ url }: { url: string }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  return <img src={src} alt="QR" className="border rounded" />
}

export default async function RestaurantQrPage({ params }: { params?: Promise<{ id: string }> }) {
  const sb = supabaseAdmin()
  const resolvedParams = params ? await params : undefined
  const rid = resolvedParams?.id
  const { data: tables } = await sb.from('tables').select('id, name, token').eq('restaurant_id', rid).order('created_at')
  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">QR 코드</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(tables ?? []).map(t => {
          const url = `${base}/guest/qr/${t.token}`
          return (
            <div key={t.id} className="bg-white border rounded p-3 flex flex-col gap-2 items-center">
              <div className="font-medium">{t.name}</div>
              <Qr url={url} />
              <a className="text-blue-600 text-sm break-all" href={url} target="_blank">{url}</a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
