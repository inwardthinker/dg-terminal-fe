'use client'

import OpenPositionView from '@/features/open-positions/OpenPositionView'
import { useMemo } from 'react'
import { usePositions } from '../hooks/usePositions'
import { mapKpisToCards } from '../utils/mapKpisToCards'

export default function OpenPositionContainer() {
  const { positions, loading, error } = usePositions({ realtimeOnly: true })
  const summaryKpis = useMemo(() => {
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
  }, [positions])

  const cards = mapKpisToCards(summaryKpis, Boolean(error))

  return (
    <OpenPositionView
      summaryLoading={loading}
      summaryError={error}
      cards={cards}
      positions={positions}
      loading={loading}
      error={error}
    />
  )
}
