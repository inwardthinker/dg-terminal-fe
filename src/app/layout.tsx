import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ModalRenderer } from '@/components/modals/ModalRenderer'
import { Toaster } from '@/components/ui/Toaster'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { MobileSearchFab } from '@/components/layout/MobileSearchFab'
import { TopBar } from '@/components/layout/TopBar'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'DG Terminal',
  description: 'Production-ready Next.js frontend scaffold',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-bg-0 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pt-[env(safe-area-inset-top,0px)]">
        <TopBar />
        <div className="mx-auto w-full min-w-0 max-w-[1400px] flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
          {children}
        </div>
        <MobileSearchFab />
        <MobileBottomNav />
        <ModalRenderer />
        <Toaster />
      </body>
    </html>
  )
}
