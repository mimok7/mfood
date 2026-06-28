import '../styles/globals.css'
import Shell from './components/Shell'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Mfood POS',
  description: '매장 운영 통합 패널',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'mfood',
  },
}

export const viewport: Viewport = {
  themeColor: '#006241',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-starbucks-canvas">
        <Shell>{children}</Shell>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(reg) {
                console.log('PWA ServiceWorker registered');
              }).catch(function(err) {
                console.log('PWA ServiceWorker registration failed: ', err);
              });
            });
          }
        `}} />
      </body>
    </html>
  )
}
