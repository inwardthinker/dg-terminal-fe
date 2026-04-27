'use client'

import { useMemo } from 'react'
import { SummaryPanel } from '@/features/open-positions/components/SummaryPanel'
import { SummarySkeleton } from '@/features/open-positions/components/SummarySkeleton'
import { SummaryError } from '@/features/open-positions/components/SummaryError'
import { usePositions } from '@/features/open-positions/hooks/usePositions'
import { buildCategoryPresentation } from '@/features/open-positions/utils/categoryExposure'
import { useModal } from '@/lib/modals/hooks/useModal'
import type { Position } from '@/features/open-positions/types'

type Props = {
  limit?: number
  forceEmptyState?: boolean
  venueUnavailableOverride?: boolean
}

export function SummaryPanelContainer({
  limit = 3,
  forceEmptyState = false,
  venueUnavailableOverride = false,
}: Props) {
  const { positions, totalCount, loading, error, connectionState } = usePositions(
    forceEmptyState ? { limit: 0, userAddress: '' } : { limit },
  )
  const venueUnavailable = venueUnavailableOverride || Boolean(error)
  const { openModal } = useModal()

  const categoryPresentation = useMemo(() => buildCategoryPresentation(positions), [positions])

  function handleOpen(position: Position) {
    openModal('positionDetail', { position, categoryPresentation })
  }

  function handleClose(position: Position) {
    openModal('close', { position })
  }

  if (!forceEmptyState && loading) return <SummarySkeleton />
  if (!forceEmptyState && error && positions.length === 0) return <SummaryError message={error} />

  return (
    <SummaryPanel
      positions={forceEmptyState ? [] : positions}
      totalCount={forceEmptyState ? 0 : totalCount}
      onOpenPosition={handleOpen}
      onClosePosition={handleClose}
      venueUnavailable={venueUnavailable}
      connectionState={connectionState}
    />
  )
}
