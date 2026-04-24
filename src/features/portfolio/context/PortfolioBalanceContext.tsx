'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getUsdceBalance } from '@/features/portfolio/components/api/getUsdcBalance'
import {
  connectPortfolioKpiSocket,
  resolvePortfolioKpiSocketWalletAddress,
} from '@/features/portfolio/socket'
import type { PortfolioKpiUpdateEvent } from '@/features/portfolio/types'

type PortfolioBalanceContextValue = {
  balance: number | undefined
  loading: boolean
}

const PortfolioBalanceContext = createContext<PortfolioBalanceContextValue | null>(null)

type PortfolioBalanceProviderProps = Readonly<{
  children: React.ReactNode
  walletAddress?: string
}>

export function PortfolioBalanceProvider({
  children,
  walletAddress,
}: PortfolioBalanceProviderProps) {
  const [balance, setBalance] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = true
    const resolvedWalletAddress = resolvePortfolioKpiSocketWalletAddress(walletAddress)

    if (!resolvedWalletAddress) {
      setBalance(undefined)
      setLoading(false)
      return
    }

    setLoading(true)

    void (async () => {
      try {
        const onchainBalance = await getUsdceBalance(resolvedWalletAddress)
        if (!cancelled) return
        setBalance(onchainBalance)
      } finally {
        if (!cancelled) return
        setLoading(false)
      }
    })()

    const socket = connectPortfolioKpiSocket(resolvedWalletAddress)
    const handleKpiUpdate = ({ wallet, kpis }: PortfolioKpiUpdateEvent) => {
      if (wallet.trim().toLowerCase() !== resolvedWalletAddress) return
      if (typeof kpis.balance === 'number' && Number.isFinite(kpis.balance)) {
        setBalance(kpis.balance)
      }
      setLoading(false)
    }

    socket.on('kpi_update', handleKpiUpdate)
    socket.on('connect_error', () => {
      setLoading(false)
    })
    socket.connect()

    return () => {
      cancelled = false
      socket.off('kpi_update', handleKpiUpdate)
      socket.disconnect()
    }
  }, [walletAddress])

  const value = useMemo(() => ({ balance, loading }), [balance, loading])

  return (
    <PortfolioBalanceContext.Provider value={value}>{children}</PortfolioBalanceContext.Provider>
  )
}

export function usePortfolioBalance(): PortfolioBalanceContextValue {
  const context = useContext(PortfolioBalanceContext)
  if (!context) {
    throw new Error('usePortfolioBalance must be used within PortfolioBalanceProvider')
  }
  return context
}
