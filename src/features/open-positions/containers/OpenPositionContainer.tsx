'use client'

import OpenPositionView from '@/features/open-positions/OpenPositionView'
import { usePositions } from '../hooks/usePositions'
import { useOpenPositionsSummary } from '../hooks/useOpenPositionsSummary'
import { mapKpisToCards } from '../utils/mapKpisToCards'

export default function OpenPositionContainer() {
  const { positions, loading, error } = usePositions({ realtimeOnly: true })
  const {
    kpis: summaryKpis,
    loading: summaryLoading,
    error: summaryError,
  } = useOpenPositionsSummary()

  const cards = summaryKpis ? mapKpisToCards(summaryKpis, Boolean(summaryError)) : []

  return (
    <OpenPositionView
      summaryLoading={summaryLoading}
      summaryError={summaryError}
      cards={cards}
      positions={positions}
      loading={loading}
      error={error}
    />
  )
}
