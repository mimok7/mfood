import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import WaitlistClient from './WaitlistClient'

export default async function WaitlistPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer()

  // 웨이팅 리스트에서 현재 활성 상태인 항목들 가져오기
  const { data: waitlistItemsRaw } = await supabase
    .from('waitlist')
    .select('*')
    .eq('restaurant_id', restaurant_id)
    .in('status', ['waiting', 'seated'])
    .order('created_at', { ascending: true })

  const waitlistItems = (waitlistItemsRaw ?? []) as import('@/lib/types').WaitlistRow[]

  // 상태별로 그룹화
  const itemsArray = (waitlistItems ?? []) as any[]

  const itemsByStatus = itemsArray.reduce((acc: Record<string, any[]>, item: any) => {
    const status = item.status
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(item)
    return acc
  }, {} as Record<string, any[]>)

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'waiting': return { text: '대기중', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' }
      case 'seated': return { text: '착석완료', color: 'bg-green-100 text-green-800', icon: '✅' }
      default: return { text: status, color: 'bg-gray-100 text-gray-800', icon: '❓' }
    }
  }

  const getWaitTime = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes}분`
    } else {
      const hours = Math.floor(diffMinutes / 60)
      const minutes = diffMinutes % 60
      return `${hours}시간 ${minutes}분`
    }
  }

  const formatReservationTime = (time: string | null) => {
    if (!time) return null
    return new Date(time).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className='space-y-6'>
      {/* 헤더 섹션 */}
      <div className='bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>⏳ 대기</h1>
            <p className='text-cyan-100'>웨이팅 신청과 예약을 실시간으로 관리</p>
          </div>
          <div className='ml-4'>
            <Link
              href="/manager"
              className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              <span className="mr-2">🏠</span>
              홈
            </Link>
          </div>
        </div>
      </div>

      {/* 요약 정보 - 위로 이동 */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-yellow-600'>대기중: {waitlistItems?.filter(item => item.status === 'waiting').length || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-green-600'>착석완료: {waitlistItems?.filter(item => item.status === 'seated').length || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-blue-600'>예약: {waitlistItems?.filter(item => item.is_reservation).length || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-purple-600'>총인원: {waitlistItems?.reduce((sum, item) => sum + item.party_size, 0) || 0}</div>
          </div>
        </div>
      </div>

      {/* 상태별 웨이팅 목록 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {Object.entries(itemsByStatus).map(([status, items]) => (
          <div key={status} className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 flex items-center justify-between'>
                <span className='flex items-center space-x-2'>
                  <span>{getStatusDisplay(status).icon}</span>
                  <span>{getStatusDisplay(status).text}</span>
                </span>
                <span className='text-sm text-gray-500'>({items.length}명)</span>
              </h2>
            </div>

            <div className='p-4 space-y-3 max-h-96 overflow-y-auto'>
              {items.length > 0 ? (
                <WaitlistClient initialItems={items} />
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <div className='text-4xl mb-2'>{getStatusDisplay(status).icon}</div>
                  <p>{status === 'waiting' ? '대기 중인 손님이 없습니다' : '착석한 손님이 없습니다'}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 웨이팅이 없을 때 */}
      {Object.keys(itemsByStatus).length === 0 && (
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
          <div className='p-12 text-center'>
            <div className='text-6xl mb-4'>👥</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>웨이팅이 없습니다</h3>
            <p className='text-gray-500'>새로운 웨이팅 신청이 들어오면 여기에 표시됩니다.</p>
          </div>
        </div>
      )}

    </div>
  )
}
