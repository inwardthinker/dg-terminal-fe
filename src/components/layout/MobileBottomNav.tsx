'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChartNoAxesColumnIncreasing, Search, SquareTerminal, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const items = [
  {
    href: '/',
    label: 'Terminal',
    Icon: SquareTerminal,
    isActive: (p: string) => p === '/',
  },
  {
    href: '/portfolio',
    label: 'Portfolio',
    Icon: ChartNoAxesColumnIncreasing,
    isActive: (p: string) => p === '/portfolio' || p.startsWith('/portfolio/'),
  },
  {
    href: '/search',
    label: 'Search',
    Icon: Search,
    isActive: (p: string) => p === '/search' || p.startsWith('/search/'),
  },
  {
    href: '/settings',
    label: 'Profile',
    Icon: User,
    isActive: (p: string) => p === '/settings' || p.startsWith('/settings/'),
  },
] as const

export function MobileBottomNav() {
  const pathname = usePathname() ?? '/'

  if (pathname.startsWith('/login')) {
    return null
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-c bg-bg-0 md:hidden"
    >
      <div className="mx-auto flex max-w-[1400px] items-stretch justify-around px-sp2 pt-sp3 pb-[max(10px,env(safe-area-inset-bottom))]">
        {items.map(({ href, label, Icon, isActive }) => {
          const active = isActive(pathname)
          return (
            <Link
              key={href}
              href={href}
              data-active={active ? 'true' : undefined}
              className={cn(
                'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-r4 px-sp2 py-sp2 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-g-3/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-0',
                active ? 'text-g-3!' : 'text-t-3! hover:bg-bg-2/50 hover:text-t2',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0 transition-[stroke-width]',
                  active && 'drop-shadow-[0_0_8px_rgba(205,189,112,0.35)]',
                )}
                strokeWidth={active ? 2.35 : 1.75}
                aria-hidden
              />
              <span className="text-[10px] font-semibold leading-none tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
