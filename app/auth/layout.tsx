export const metadata = {
  title: '인증 - Restaurant POS',
  description: '로그인/회원가입 레이아웃',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
