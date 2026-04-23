'use client'

import { useMemo } from 'react'
import { PositionRowSummary } from './PositionRowSummary'
import type { Position } from '../types'
import { ArrowLink } from '@/components/ui/ArrowLink'
import Link from 'next/link'
import { DotSeparator } from '@/components/ui/DotSeparator'
import { buildCategoryPresentation } from '../utils/categoryExposure'
import { SUMMARY_GRID_COLUMNS, SUMMARY_GRID_COLUMNS_MOBILE } from '../constants/layout'
import { InfoTooltip } from '@/components/ui/InfoTooltip'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import clsx from 'clsx'
import type { PositionsConnectionState } from '../types'

type SummaryPanelProps = {
  positions: Position[]
  totalCount: number
  onOpenPosition: (position: Position) => void
  onClosePosition: (position: Position) => void
  venueUnavailable?: boolean
  connectionState?: PositionsConnectionState
}

const OPEN_POSITIONS_URL = '/portfolio/open-positions'

const SUMMARY_COLUMNS = [
  {
    key: 'market',
    label: 'Market',
    tooltip: 'The event or outcome you have a position on.',
    align: 'left',
  },
  {
    key: 'category',
    label: 'Cat.',
    tooltip: 'The topic area this market belongs to.',
    align: 'left',
    hideOnMobile: true,
  },
  {
    key: 'side',
    label: 'Side',
    tooltip: 'Whether you bet YES (outcome happens) or NO (outcome does not happen).',
    align: 'left',
  },
  {
    key: 'size',
    label: 'Size',
    tooltip: 'Total amount paid to open this position (cost basis).',
    align: 'right',
    hideOnMobile: true,
  },
  {
    key: 'pnl',
    label: 'P&L',
    tooltip: 'Unrealized gain or loss in dollars at current price.',
    align: 'right',
  },
  {
    key: 'action',
    label: 'Action',
    align: 'right',
  },
]

export function SummaryPanel({
  positions,
  totalCount,
  onOpenPosition,
  onClosePosition,
  venueUnavailable = false,
  connectionState = 'connected',
}: SummaryPanelProps) {
  const isEmpty = totalCount === 0

  const remaining = Math.max(totalCount - positions.length, 0)

  const categoryPresentation = useMemo(() => {
    return buildCategoryPresentation(positions)
  }, [positions])

  const liveDotColorClass =
    connectionState === 'connected'
      ? 'bg-pos'
      : connectionState === 'reconnecting'
        ? 'bg-warn'
        : 'bg-neg'
  const showReconnectTooltip = connectionState !== 'connected'

  return (
    <section
      className={clsx(
        'rounded-r7 border border-line-c p-4 h-full flex flex-col',
        isEmpty ? 'bg-bg-1/35' : 'bg-bg-1',
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex items-center ${isEmpty ? 'text-primary-muted' : 'text-primary'}`}>
          {!isEmpty && (
            <>
              <h2 className="">Open Positions </h2>
              <DotSeparator size={4} />
              <h2 className="">{totalCount}</h2>
              <span className="relative mx-2 inline-flex items-center group">
                <span
                  className={clsx(
                    'h-2 w-2 rounded-full',
                    venueUnavailable ? 'bg-neg' : liveDotColorClass,
                  )}
                  aria-label={
                    showReconnectTooltip
                      ? 'Live prices paused. Reconnecting...'
                      : 'Live prices connected'
                  }
                />
                {showReconnectTooltip ? (
                  <span className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-20 hidden w-max -translate-x-1/2 rounded-r3 border border-line-c bg-bg-2 px-2 py-1 text-support text-[11px] text-t-2 group-hover:block">
                    Live prices paused. Reconnecting...
                  </span>
                ) : null}
              </span>
              <InfoTooltip text="Total number of open positions in the portfolio" />
            </>
          )}
        </div>
        {!isEmpty && remaining > 0 && (
          <div className="text-secondary">
            <ArrowLink href={OPEN_POSITIONS_URL} label="View all" direction="down" />
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="flex-1 grid place-items-center text-center">
          <div className="max-w-[320px] space-y-2 px-2">
            <div className="text-[22px]" aria-hidden="true">
              📥
            </div>
            <p className="text-secondary font-semibold">No open positions yet</p>

            <p className="hidden sm:block text-support">
              Search a market in the terminal to place your first trade
            </p>
            <div className="hidden sm:block pt-1">
              <Link
                href="/"
                className="inline-flex min-h-8 items-center justify-center rounded-r3 border border-line-g bg-[rgba(205,189,112,0.12)] px-3 py-1 text-action hover:bg-[rgba(205,189,112,0.18)] transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Go to terminal
              </Link>
            </div>

            <p className="sm:hidden text-support">
              Deposit funds and search a market in the terminal to place your first trade
            </p>
            <div className="pt-2 flex flex-col items-center gap-2 sm:hidden">
              <Link
                href="/"
                className="inline-flex min-h-8 items-center justify-center rounded-r3 border border-line-g bg-[rgba(205,189,112,0.12)] px-3 py-1 text-action hover:bg-[rgba(205,189,112,0.18)] transition-colors"
              >
                + Deposit funds
              </Link>
              <Link
                href="/"
                className="text-support underline-offset-2 hover:text-t-2 transition-colors underline!"
              >
                Find a market instead <ArrowRightIcon className="h-2.5 w-2.5 inline-block" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            className={`grid ${SUMMARY_GRID_COLUMNS} items-center gap-4 border-b border-line-c text-right text-support ${SUMMARY_GRID_COLUMNS_MOBILE} max-sm:gap-2 max-sm:text-[10px]`}
          >
            {SUMMARY_COLUMNS.map((col) => (
              <div
                key={col.key}
                className={`
        py-2 flex items-center gap-1
        ${col.align === 'right' ? 'justify-end text-right' : 'text-left'}
        ${col.hideOnMobile ? 'max-sm:hidden' : ''}
      `}
              >
                <span>{col.label}</span>
                {col.tooltip && <InfoTooltip text={col.tooltip} />}
              </div>
            ))}
          </div>
          {positions.map((position) => (
            <PositionRowSummary
              key={position.id}
              position={position}
              categoryPresentation={categoryPresentation}
              onOpen={onOpenPosition}
              onClose={onClosePosition}
            />
          ))}
          {remaining > 0 && (
            <div className="py-2 text-support text-xs! flex items-center">
              <span>+{remaining} more positions</span>
              <DotSeparator size={2} />
              <ArrowLink href={OPEN_POSITIONS_URL} label="View all" direction="down" />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
