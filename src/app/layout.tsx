import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { ModalRenderer } from '@/components/modals/ModalRenderer'
import { Toaster } from '@/components/ui/Toaster'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { MobileSearchFab } from '@/components/layout/MobileSearchFab'
import { TopBar } from '@/components/layout/TopBar'
import { PrivyProviders } from '@/components/PrivyProviders'
import { RootProviders } from '@/components/providers/AppProviders'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
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
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexSans.variable} ${jetBrainsMono.variable}`}
    >
      <body className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-bg-0 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pt-[env(safe-area-inset-top,0px)]">
        <PrivyProviders>
          <RootProviders>
            <TopBar />
            <div className="mx-auto w-full min-w-0 max-w-[1400px] flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
              {children}
            </div>
            <MobileSearchFab />
            <MobileBottomNav />
            <ModalRenderer />
            <Toaster />
          </RootProviders>
        </PrivyProviders>
      </body>
    </html>
  )
}
