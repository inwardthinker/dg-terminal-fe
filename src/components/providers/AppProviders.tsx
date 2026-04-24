'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { PortfolioBalanceProvider } from '@/features/portfolio/context/PortfolioBalanceContext'
import { PortfolioKpisProvider } from '@/features/portfolio/context/PortfolioKpisContext'

type RootProvidersProps = Readonly<{
  children: React.ReactNode
}>

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })
}

export function RootProviders({ children }: RootProvidersProps) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioBalanceProvider>
        <PortfolioKpisProvider>{children}</PortfolioKpisProvider>
      </PortfolioBalanceProvider>
    </QueryClientProvider>
  )
}
