'use client'

import { useMemo } from 'react'
import type { ApiKpis } from '../types'
import { usePositions } from './usePositions'

type UseOpenPositionsSummaryResult = {
  kpis: ApiKpis | null
  loading: boolean
  error: string | null
  walletAddress: string | null
}

function mapPositionsToKpis(
  positions: Array<{ size: number; pnl: number; deployedValue?: number; positionValue?: number }>,
): ApiKpis {
  const totalExposure = positions.reduce(
    (sum, position) => sum + (position.deployedValue ?? position.size),
    0,
  )
  const largestPositionValue = positions.reduce(
    (largest, position) => {
      const value = position.positionValue ?? position.size
      return value > largest ? value : largest
    },
    0,
  )
  const unrealizedPnl = positions.reduce((sum, position) => sum + position.pnl, 0)
  const largestPositionPct = totalExposure > 0 ? (largestPositionValue / totalExposure) * 100 : 0

  return {
    totalOpen: positions.length,
    totalExposure,
    unrealizedPnl,
    largestPositionValue,
    largestPositionPct,
  }
}

export function useOpenPositionsSummary(): UseOpenPositionsSummaryResult {
  const { positions, loading, error } = usePositions()
  const kpis = useMemo(() => mapPositionsToKpis(positions), [positions])
  const walletAddress =
    process.env.NEXT_PUBLIC_POSITIONS_SOCKET_USER_ADDRESS ??
    null

  return { kpis, loading, error, walletAddress }
}
