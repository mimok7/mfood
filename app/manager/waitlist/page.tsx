export const dynamic = 'force-dynamic'
import { requireRole } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import WaitlistClient from './WaitlistClient'

export default async function WaitlistPage() {
  const { restaurant_id } = await requireRole('manager')
  const supabase = createSupabaseServer() as any

  // 웨이팅 리스트에서 현재 활성 상태인 항목들 가져오기
  const { data: waitlistItemsRaw } = await supabase
    .from('waitlist')
    .select(`
      *,
      tables(name)
    `)
    .eq('restaurant_id', restaurant_id)
    .in('status', ['waiting', 'called', 'seated'])
    .order('created_at', { ascending: true })

  // 빈 테이블 목록 가져오기
  const { data: tablesData } = await supabase
    .from('tables')
    .select('id, name, capacity')
    .eq('restaurant_id', restaurant_id)
    .order('name', { ascending: true })

  const tables = (tablesData ?? []) as any[]

  const waitlistItems = (waitlistItemsRaw ?? []) as import('@/lib/types').WaitlistRow[]

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'waiting': return { text: '대기중', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' }
      case 'called': return { text: '호출됨', color: 'bg-blue-100 text-blue-800', icon: '📢' }
      case 'seated': return { text: '배정', color: 'bg-green-100 text-green-800', icon: '✅' }
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
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-yellow-600'>대기중: {waitlistItems?.filter(item => item.status === 'waiting').length || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-blue-600'>호출됨: {waitlistItems?.filter(item => item.status === 'called').length || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-green-600'>배정: {waitlistItems?.filter(item => item.status === 'seated').length || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-purple-600'>예약: {waitlistItems?.filter(item => item.is_reservation).length || 0}</div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-3'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-indigo-600'>총인원: {waitlistItems?.reduce((sum, item) => sum + item.party_size, 0) || 0}</div>
          </div>
        </div>
      </div>

      {/* 상태별 웨이팅 목록 */}
      <div className='grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6'>
        <WaitlistClient initialItems={waitlistItems} tables={tables} />
      </div>

      {/* 웨이팅이 없을 때 */}
      {waitlistItems.length === 0 && (
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
