'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { resolvePortfolioKpiSocketWalletAddress } from '@/features/portfolio/socket'
import {
  getKpisFromPolymarket,
  type PolymarketDerivedKpis,
} from '../components/api/getKpisFromPolymarket'

type PortfolioKpisContextValue = {
  kpis: PolymarketDerivedKpis | null
  loading: boolean
  error: string | null
}

const PortfolioKpisContext = createContext<PortfolioKpisContextValue | null>(null)

type PortfolioKpisProviderProps = Readonly<{
  children: React.ReactNode
  walletAddress?: string
}>

export function PortfolioKpisProvider({ children, walletAddress }: PortfolioKpisProviderProps) {
  const [kpis, setKpis] = useState<PolymarketDerivedKpis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const resolvedAddress = resolvePortfolioKpiSocketWalletAddress(walletAddress)
    if (!resolvedAddress) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    void (async () => {
      try {
        const derived = await getKpisFromPolymarket(resolvedAddress)
        if (!cancelled) setKpis(derived)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load KPIs')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [walletAddress])

  const value = useMemo(() => ({ kpis, loading, error }), [kpis, loading, error])

  return <PortfolioKpisContext.Provider value={value}>{children}</PortfolioKpisContext.Provider>
}

export function usePortfolioKpis(): PortfolioKpisContextValue {
  const ctx = useContext(PortfolioKpisContext)
  if (!ctx) throw new Error('usePortfolioKpis must be used within PortfolioKpisProvider')
  return ctx
}
