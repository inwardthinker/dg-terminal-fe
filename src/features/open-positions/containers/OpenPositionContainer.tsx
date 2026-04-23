'use client'

import OpenPositionView from '@/features/open-positions/OpenPositionView'
import { useMemo } from 'react'
import { usePositions } from '../hooks/usePositions'
import { mapKpisToCards } from '../utils/mapKpisToCards'
import { computeSummaryKpis } from '../utils/summary'

export default function OpenPositionContainer() {
  const { positions, loading, error } = usePositions({ realtimeOnly: true })
  const summaryKpis = useMemo(() => computeSummaryKpis(positions), [positions])
  const cards = useMemo(() => mapKpisToCards(summaryKpis, Boolean(error)), [summaryKpis, error])

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
