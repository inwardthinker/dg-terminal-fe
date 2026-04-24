'use client'

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PositionsTableContainer } from '@/features/open-positions/components/PositionTableContainer'
import { KpiCard } from '@/features/portfolio/components/cards/KpiCard'
import React, { Suspense } from 'react'
import { KpiCardData, Position } from './types'

type OpenPositionViewProps = {
  summaryLoading: boolean
  summaryError: string | null
  cards: KpiCardData[]
  positions: Position[]
  loading: boolean
  error: string | null
}

const OpenPositionView = ({
  summaryLoading,
  summaryError,
  cards,
  positions,
  loading,
  error,
}: OpenPositionViewProps) => {
  return (
    <div className="w-full space-y-4">
      <Breadcrumb
        items={[
          { label: 'Profile', href: '/profile' },
          { label: 'Portfolio', href: '/portfolio' },
          { label: 'Open Positions' },
        ]}
      />

      <div className="w-full px-sp5 sm:px-sp7 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryLoading && (
            <>
              <KpiCard label="Total Open" value="--" />
              <KpiCard label="Total Exposure" value="--" />
              <KpiCard label="Total Unrealized P&L" value="--" />
              <KpiCard label="Largest Position" value="--" />
            </>
          )}
          {!summaryLoading && cards.map(({ id, ...rest }) => <KpiCard key={id} {...rest} />)}
          {!summaryLoading && cards.length === 0 && (
            <>
              <KpiCard label="Total Open" value="--" />
              <KpiCard label="Total Exposure" value="--" />
              <KpiCard label="Total Unrealized P&L" value="--" />
              <KpiCard label="Largest Position" value="--" />
            </>
          )}
        </div>
        {!summaryLoading && summaryError && (
          <p className={'text-support text-neg'}>{summaryError}</p>
        )}
        <Suspense fallback={null}>
          <PositionsTableContainer positions={positions} loading={loading} error={error} />
        </Suspense>
      </div>
    </div>
  )
}

export default OpenPositionView
