'use client'

import React, { type CSSProperties, type KeyboardEvent, type MouseEvent, useCallback } from 'react'

import { CategoryPill } from './CategoryPill'
import type { Position } from '../types'
import type { CategoryPresentation } from '../utils/categoryExposure'
import { Button } from '@/components/ui/Button'
import {
  POSITION_TABLE_GRID_COLUMNS,
  POSITION_TABLE_GRID_COLUMNS_MOBILE,
  POSITION_TABLE_ROW_HEIGHT_PX,
} from '../constants/layout'

type PositionRowTableProps = {
  position: Position
  categoryPresentation?: Record<Position['category'], CategoryPresentation>
  onOpen: (position: Position) => void
  onClose: (position: Position) => void
  isSelected?: boolean
  onToggleSelect?: (position: Position, checked: boolean) => void
  style?: CSSProperties
  isClosing?: boolean
  showStalePnl?: boolean
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

function pnlTextClass(value: number) {
  return value >= 0 ? 'text-pos' : 'text-neg'
}

function sideTextClass(side: string) {
  if (side === 'YES') return 'text-pos'
  if (side === 'NO') return 'text-neg'
  return 'text-secondary'
}

export const PositionRowTable = React.memo(function PositionRowTable({
  position,
  categoryPresentation,
  onOpen,
  onClose,
  isSelected = false,
  onToggleSelect,
  style,
  isClosing = false,
  showStalePnl = false,
}: PositionRowTableProps) {
  const categoryStyle = categoryPresentation?.[position.category] ?? {
    label: position.category,
    colorClass: 'bg-t-3',
  }

  const handleOpen = useCallback(() => {
    onOpen(position)
  }, [onOpen, position])

  const handleRowClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      handleOpen()
    },
    [handleOpen],
  )

  const handleClose = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onClose(position)
    },
    [onClose, position],
  )

  const handleRowKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleOpen()
      }
    },
    [handleOpen],
  )

  const currentPriceCents = `${Math.round(position.currentPrice * 100)}¢`
  const pnlText = `${position.pnl >= 0 ? '+' : ''}${currencyFormatter.format(position.pnl)}`
  const pnlPctText = `${position.pnlPct >= 0 ? '+' : ''}${position.pnlPct.toFixed(2)}%`

  return (
    <div
      className={`grid ${POSITION_TABLE_GRID_COLUMNS} items-center cursor-pointer overflow-hidden border-b border-line-c text-support transition-colors hover:bg-bg-2 ${POSITION_TABLE_GRID_COLUMNS_MOBILE} max-sm:text-[13px]`}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      role="button"
      tabIndex={0}
      style={{
        height: isClosing ? 0 : POSITION_TABLE_ROW_HEIGHT_PX,
        maxHeight: isClosing ? 0 : POSITION_TABLE_ROW_HEIGHT_PX,
        ...style,
      }}
    >
      {/* Checkbox (Phase 0 hidden) */}
      <div className="px-3 py-0">
        <div className="flex w-full items-center gap-2 text-secondary max-sm:gap-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            aria-label={`Select ${position.market}`}
            onClick={(e) => e.stopPropagation()}
            onChange={(event) => onToggleSelect?.(position, event.target.checked)}
            className="h-[10px] w-[10px] shrink-0 rounded-[2px] border border-line-c bg-transparent appearance-none cursor-pointer relative transition-all checked:bg-g-3 checked:border-g-3 before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-[#0B0E14] before:text-[12px] before:font-semibold before:content-[''] checked:before:content-['✓'] max-sm:hidden"
          />

          {/* Market */}
          <span
            className="block min-w-0 flex-1 truncate text-left max-sm:text-[12px]"
            title={position.market}
          >
            {position.market}
          </span>
        </div>
      </div>

      {/* Category */}
      <div className="px-3 py-0 max-sm:hidden">
        <div className="flex justify-center">
          <CategoryPill label={categoryStyle.label} colorClass={categoryStyle.colorClass} />
        </div>
      </div>

      {/* Side */}
      <div
        className={`px-3 py-0 text-left font-bold text-xs! sm:text-[14px]! ${sideTextClass(position.side)}`}
      >
        {position.side}
      </div>

      {/* Entry */}
      <div className="px-3 py-0 text-right text-secondary max-sm:hidden">
        {`${Math.round(position.entryPrice * 100)}¢`}
      </div>

      {/* Current */}
      <div className="px-3 py-0 text-right text-secondary max-sm:hidden">
        <span key={`current-${currentPriceCents}`} className="inline-block live-value-flash px-1">
          {currentPriceCents}
        </span>
      </div>

      {/* Size */}
      <div className="px-3 py-0 text-right text-secondary max-sm:hidden">
        {currencyFormatter.format(position.size)}
      </div>

      {/* P&L */}
      <div
        className={`py-0 text-right transition-colors duration-200 ${
          showStalePnl ? 'text-support opacity-60' : pnlTextClass(position.pnl)
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        <span key={`pnl-${pnlText}`} className="inline-block live-value-flash px-1">
          {pnlText}
        </span>
      </div>

      {/* P&L % */}
      <div
        className={`px-3 py-0 text-center transition-colors duration-200 ${
          showStalePnl ? 'text-support opacity-60' : pnlTextClass(position.pnlPct)
        } max-sm:hidden`}
      >
        <span key={`pnlpct-${pnlPctText}`} className="inline-block live-value-flash px-1">
          {pnlPctText}
        </span>
      </div>

      {/* Action */}
      <div className="px-3 py-0 text-center">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClose}
          className="w-fit max-sm:text-[10px] max-sm:w-10"
        >
          Close
        </Button>
      </div>
    </div>
  )
})
