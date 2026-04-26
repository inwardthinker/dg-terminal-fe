'use client'

import { usePrivy } from '@privy-io/react-auth'
import { env } from '@/lib/constants/env'
import { Button } from '@/components/ui/Button'
import { usePathname, useRouter } from 'next/navigation'

const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

function PrivyAuthButton() {
  const { ready, authenticated, logout, user } = usePrivy()
  const router = useRouter()
  const pathname = usePathname()

  const handleAuthClick = () => {
    if (!ready) return
    if (authenticated) {
      logout()
      return
    }
    router.push(`${pathname}?modal=login`)
  }

  const label = !ready
    ? 'Loading...'
    : authenticated
      ? user?.wallet?.address
        ? shortenAddress(user.wallet.address)
        : 'Logout'
      : 'Login'

  return (
    <Button variant="primary" size="sm" onClick={handleAuthClick} disabled={!ready}>
      {label}
    </Button>
  )
}

export function AuthButton() {
  if (!env.privyAppId) {
    return (
      <Button
        variant="primary"
        size="sm"
        disabled
        title="Set NEXT_PUBLIC_PRIVY_APP_ID to enable auth"
      >
        Login
      </Button>
    )
  }

  return <PrivyAuthButton />
}
