import '../styles/globals.css'
import Shell from './components/Shell'

export const metadata = {
  title: 'Mfood POS',
  description: '매장 운영 통합 패널',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
