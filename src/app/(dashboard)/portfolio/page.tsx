import { Suspense } from 'react'
import PortfolioContainer from '@/features/portfolio/components/containers/PortfolioContainer'

const DEFAULT_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_PORTFOLIO_KPIS_SOCKET_WALLET_ADDRESS ??
  process.env.NEXT_PUBLIC_POSITIONS_SOCKET_USER_ADDRESS ??
  ''

export default function PortfolioPage() {
  return (
    <Suspense fallback={null}>
      <PortfolioContainer userWalletAddress={DEFAULT_WALLET_ADDRESS} />
    </Suspense>
  )
}
