'use client'

import { useMemo } from 'react'
import type { ApiKpis } from '../types'
import { computeSummaryKpis } from '../utils/summary'
import { usePositions } from './usePositions'

type UseOpenPositionsSummaryResult = {
  kpis: ApiKpis | null
  loading: boolean
  error: string | null
  walletAddress: string | null
}

export function useOpenPositionsSummary(): UseOpenPositionsSummaryResult {
  const { positions, loading, error } = usePositions()
  const kpis = useMemo(() => computeSummaryKpis(positions), [positions])
  const walletAddress = process.env.NEXT_PUBLIC_POSITIONS_SOCKET_USER_ADDRESS ?? null

  return { kpis, loading, error, walletAddress }
}
