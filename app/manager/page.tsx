import { requireRole } from "@/lib/auth"
import { createSupabaseServer } from "@/lib/supabase-server"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ManagerPage() {
  const { restaurant_id } = await requireRole("manager")
  const supabase = createSupabaseServer() as any
  const { data: restaurantData } = await supabase.from("restaurants").select("name").eq("id", restaurant_id).single()
  const restaurant = restaurantData as { name: string } | null

  // 실시간 통계 데이터 가져오기 (정확한 스키마 기반)
  // - 주문/키친 상태는 kitchen_queue의 상태(queued, prepping, ready)를 사용
  // - 웨이팅은 waitlist의 status='waiting'
  const [queuedRes, preppingRes, readyRes, waitingRes] = await Promise.all([
    supabase
      .from("kitchen_queue")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurant_id)
      .eq("status", "queued"),
    supabase
      .from("kitchen_queue")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurant_id)
      .eq("status", "prepping"),
    supabase
      .from("kitchen_queue")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurant_id)
      .eq("status", "ready"),
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurant_id)
      .eq("status", "waiting"),
  ])

  const queuedCount = queuedRes.count ?? 0
  const preppingCount = preppingRes.count ?? 0
  const readyCount = readyRes.count ?? 0
  const waitingCount = waitingRes.count ?? 0

  async function signOut() {
    "use server"
    const supabase = createSupabaseServer()
    await supabase.auth.signOut()
    redirect("/auth/sign-in")
  }

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">👨‍💼 매니저 패널</h1>
            <p className="text-green-100">식당 운영 및 관리</p>
            <div className="mt-4 text-sm text-green-200">
              식당: <span className="font-semibold">{restaurant?.name ?? "알 수 없음"}</span>
            </div>
          </div>
          <div className="ml-4 flex space-x-2">
            <Link
              href="/manager"
              className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              <span className="mr-2">🏠</span>
              홈
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition-colors border border-red-300/30"
              >
                <span className="mr-2">🚪</span>
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 실시간 현황 대시보드 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">📊</span>
          실시간 현황 대시보드
        </h2>
        
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 주문 대기 카드 */}
          <div className="bg-white border border-orange-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-t-lg">
              <div className="flex items-center justify-between text-white">
                <span className="text-3xl">⏳</span>
                <span className="text-xl font-bold">주문 대기</span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-orange-600 mb-1">{queuedCount}</div>
              <div className="text-sm text-gray-600 mb-3">건의 주문이 대기 중</div>
              <Link 
                href="/manager/kitchen" 
                className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                처리하기 
              </Link>
            </div>
          </div>

          {/* 준비 중 카드 */}
          <div className="bg-white border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-t-lg">
              <div className="flex items-center justify-between text-white">
                <span className="text-3xl">👨‍🍳</span>
                <span className="text-xl font-bold">준비 중</span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">{preppingCount}</div>
              <div className="text-sm text-gray-600 mb-3">건의 주문을 준비 중</div>
              <Link 
                href="/manager/kitchen" 
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                확인하기 
              </Link>
            </div>
          </div>

          {/* 서빙 대기 카드 */}
          <div className="bg-white border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-t-lg">
              <div className="flex items-center justify-between text-white">
                <span className="text-3xl">🍽️</span>
                <span className="text-xl font-bold">서빙 대기</span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-1">{readyCount}</div>
              <div className="text-sm text-gray-600 mb-3">건의 주문이 서빙 대기</div>
              <Link 
                href="/manager/serving" 
                className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
              >
                서빙하기 
              </Link>
            </div>
          </div>

          {/* 웨이팅 고객 카드 */}
          <div className="bg-white border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-t-lg">
              <div className="flex items-center justify-between text-white">
                <span className="text-3xl">👥</span>
                <span className="text-xl font-bold">웨이팅</span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-600 mb-1">{waitingCount}</div>
              <div className="text-sm text-gray-600 mb-3">팀이 대기 중</div>
              <Link 
                href="/manager/waitlist" 
                className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                관리하기 
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 섹션 */}
      <h2 className="text-2xl font-bold text-gray-900 flex items-center mt-10">
        <span className="mr-2">🚀</span>
        빠른 이동
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Link href="/manager/billing" className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
            <div className="text-white text-2xl">🧮</div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">주문/계산</h3>
            <p className="text-sm text-gray-600">결제 처리 및 계산서 관리</p>
          </div>
        </Link>

        <Link href="/manager/kitchen" className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
            <div className="text-white text-2xl">👨‍🍳</div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">키친</h3>
            <p className="text-sm text-gray-600">주문 준비 및 서빙 상태 관리</p>
          </div>
        </Link>

        <Link href="/manager/serving" className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4">
            <div className="text-white text-2xl">🍽️</div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">서빙</h3>
            <p className="text-sm text-gray-600">준비 완료된 주문 서빙 관리</p>
          </div>
        </Link>

        <Link href="/manager/waitlist" className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
            <div className="text-white text-2xl">⏳</div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">대기</h3>
            <p className="text-sm text-gray-600">대기 고객 관리 및 호출 시스템</p>
          </div>
        </Link>

        <Link href="/manager/reports/sales" className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-200 group overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
            <div className="text-white text-2xl">💰</div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">매출</h3>
            <p className="text-sm text-gray-600">실시간 매출 현황 및 분석</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
