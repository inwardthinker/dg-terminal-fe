'use client'

import { useEffect, useState } from 'react'
import { getPortfolio } from '@/features/portfolio/components/api/getPortfolio'
import { MOCK_PORTFOLIO } from '@/features/portfolio/constants/mockPortfolio'
import {
  connectPortfolioKpiSocket,
  resolvePortfolioKpiSocketWalletAddress,
} from '@/features/portfolio/socket'
import { ApiError } from '@/lib/api/client'
import type { PortfolioData, PortfolioKpiUpdateEvent, UsePortfolioResult } from '../../types'

function pickNumber(value: number | undefined, fallback: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function usePortfolio(walletAddress = ''): UsePortfolioResult {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [kpiLoading, setKpiLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const normalizedWalletAddress = walletAddress.trim()

    async function loadPortfolio() {
      if (normalizedWalletAddress.length === 0) {
        setPortfolio(MOCK_PORTFOLIO)
        setKpiLoading(false)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const data = await getPortfolio(normalizedWalletAddress)
        if (!isMounted) return
        setPortfolio(data)
        setError(null)
      } catch (err) {
        if (!isMounted) return
        if (err instanceof ApiError) {
          // The server responded with an error (4xx / 5xx) — surface it so the
          // user knows something is wrong rather than silently showing stale data.
          setError(`${err.status}: ${err.message}`)
          setPortfolio(null)
        } else {
          // Network / CORS error — backend likely not running locally.
          // Fall back to mock so the UI stays usable during development.
          setPortfolio(MOCK_PORTFOLIO)
          setError(null)
        }
      } finally {
        if (!isMounted) return
        setLoading(false)
        // Tiles can render from REST data immediately; socket updates on top.
        setKpiLoading(false)
      }
    }

    void loadPortfolio()

    return () => {
      isMounted = false
    }
  }, [walletAddress])

  useEffect(() => {
    const resolvedWalletAddress = resolvePortfolioKpiSocketWalletAddress(walletAddress)
    if (!resolvedWalletAddress) {
      setKpiLoading(false)
      return
    }

    setKpiLoading(true)
    const socket = connectPortfolioKpiSocket(resolvedWalletAddress)

    const handleKpiUpdate = ({ wallet, kpis }: PortfolioKpiUpdateEvent) => {
      if (wallet.trim().toLowerCase() !== resolvedWalletAddress) {
        return
      }

      setPortfolio((current) => {
        const base = current ?? MOCK_PORTFOLIO

        return {
          ...base,
          kpis: {
            ...base.kpis,
            balance: pickNumber(kpis.balance, base.kpis.balance) ?? 0,
            openExposure: pickNumber(kpis.open_exposure, base.kpis.openExposure),
            deployedPct: pickNumber(kpis.pc_exposure, base.kpis.deployedPct),
            unrealizedPnl: pickNumber(kpis.unrealized_pnl, base.kpis.unrealizedPnl),
            unrealizedPct: pickNumber(kpis.un_pnl_pc, base.kpis.unrealizedPct),
            realized30d: pickNumber(kpis.realized_30d, base.kpis.realized30d),
            trades30d: pickNumber(kpis.num_trades, base.kpis.trades30d),
            rewardsEarned: pickNumber(kpis.rewards_earned, base.kpis.rewardsEarned),
            rewardsPct: pickNumber(kpis.reward_pc, base.kpis.rewardsPct),
          },
        }
      })
      setKpiLoading(false)
    }

    socket.on('kpi_update', handleKpiUpdate)
    socket.on('connect_error', () => {
      // Keep REST-loaded values when live KPI stream is unavailable.
    })
    socket.connect()

    return () => {
      socket.off('kpi_update', handleKpiUpdate)
      socket.disconnect()
    }
  }, [walletAddress])
  return { portfolio, loading, kpiLoading, error }
}
