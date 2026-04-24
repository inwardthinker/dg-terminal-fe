'use client'

import { useMemo } from 'react'
import { MOCK_PORTFOLIO } from '@/features/portfolio/constants/mockPortfolio'
import { usePortfolioBalance } from '@/features/portfolio/context/PortfolioBalanceContext'
import { usePortfolioKpis } from '@/features/portfolio/context/PortfolioKpisContext'
import type { PortfolioData, UsePortfolioResult } from '../../types'

export function usePortfolio(): UsePortfolioResult {
  const { balance } = usePortfolioBalance()
  const { kpis: derived, loading: kpiLoading, error } = usePortfolioKpis()

  const portfolio = useMemo<PortfolioData>(() => {
    const bal = balance ?? 0

    if (!derived) {
      return { ...MOCK_PORTFOLIO, kpis: { balance: bal }, tradeHistoryTotal: 0 }
    }

    const { totalSettledTrades, ...kpiFields } = derived
    const deployedPct =
      bal > 0 && kpiFields.openExposure !== undefined
        ? Math.round((kpiFields.openExposure / bal) * 100)
        : undefined

    return {
      ...MOCK_PORTFOLIO,
      kpis: { ...kpiFields, balance: bal, deployedPct },
      tradeHistoryTotal: totalSettledTrades,
    }
  }, [balance, derived])

  return { portfolio, loading: kpiLoading, kpiLoading, error }
}
