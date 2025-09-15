export const metadata = {
  title: '게스트 - Restaurant POS',
  description: '게스트 전용 페이지',
}

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </main>
    </>
  )
}
