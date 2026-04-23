'use client'

import { useState } from 'react'
import { ArrowDownWideNarrow } from 'lucide-react'
import { BaseModal } from '@/components/modals/BaseModal'
import type { Position } from '../types'

type Category = Position['category'] | 'All'

type Props = {
  categories: { label: string; count: number }[]
  totalCount: number
  selectedCategory: Category
  onSelectCategory: (cat: Category) => void
  selectedSide: 'All' | 'YES' | 'NO'
  onSelectSide: (side: 'All' | 'YES' | 'NO') => void
  sortBy: string
  onChangeSort: (value: 'pnl' | 'size' | 'entry' | 'current') => void
}

export function PositionsFiltersBar({
  categories,
  totalCount,
  selectedCategory,
  onSelectCategory,
  selectedSide,
  onSelectSide,
  sortBy,
  onChangeSort,
}: Props) {
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false)
  const sortLabelByValue: Record<'pnl' | 'size' | 'entry' | 'current', string> = {
    pnl: 'Sort by P&L',
    size: 'Sort by Size',
    entry: 'Sort by Entry',
    current: 'Sort by Current',
  }

  return (
    <div className="border border-line-c rounded-r6 bg-bg-1 max-sm:bg-transparent max-sm:border-none px-3 py-2 sm:px-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex items-center">
          <div className="inline-flex items-center gap-2 min-w-max">
            <span className="text-secondary text-xs tracking-wide max-sm:hidden">FILTER:</span>

            <button
              onClick={() => onSelectCategory('All')}
              className={`px-3 py-1 rounded-full text-xs! border transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-g-3/20 border-g-3 text-g-3'
                  : 'border-line-c text-support hover:text-primary'
              }`}
            >
              All {totalCount}
            </button>

            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => onSelectCategory(category.label as Category)}
                className={`px-3 py-1 rounded-full text-xs! border transition-colors ${
                  selectedCategory === category.label
                    ? 'bg-g-3/20 border-g-3 text-g-3'
                    : 'border-line-c text-support hover:text-primary'
                }`}
              >
                {category.label} · {category.count}
              </button>
            ))}

            {/* Side filter */}
            <div className="mx-1 h-5 w-px shrink-0 bg-line-c/70" aria-hidden />
            <button
              onClick={() => onSelectSide(selectedSide === 'YES' ? 'All' : 'YES')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs transition-colors ${
                selectedSide === 'YES'
                  ? 'bg-g-3/20 border-g-3 text-g-3'
                  : 'border-line-c text-secondary hover:text-primary'
              }`}
            >
              Yes
              {selectedSide === 'YES' ? <span aria-hidden>×</span> : null}
            </button>
            <button
              onClick={() => onSelectSide(selectedSide === 'NO' ? 'All' : 'NO')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs transition-colors ${
                selectedSide === 'NO'
                  ? 'bg-g-3/20 border-g-3 text-g-3'
                  : 'border-line-c text-secondary hover:text-primary'
              }`}
            >
              No
              {selectedSide === 'NO' ? <span aria-hidden>×</span> : null}
            </button>
          </div>
        </div>

        <div className="shrink-0">
          <div className="relative inline-flex h-8 items-center justify-center rounded border border-line-c bg-bg-2 px-2 text-xs text-secondary">
            <button
              type="button"
              onClick={() => setIsSortDrawerOpen(true)}
              aria-label="Open sort options"
              className="inline-flex items-center justify-center leading-none sm:hidden"
            >
              <ArrowDownWideNarrow size={16} aria-hidden="true" />
            </button>
            <span className="hidden sm:inline-flex sm:items-center sm:gap-1">
              {sortLabelByValue[sortBy as 'pnl' | 'size' | 'entry' | 'current']}
              <ArrowDownWideNarrow size={16} aria-hidden="true" />
            </span>
            <select
              aria-label="Sort positions"
              value={sortBy}
              onChange={(e) => onChangeSort(e.target.value as 'pnl' | 'size' | 'entry' | 'current')}
              className="absolute inset-0 cursor-pointer opacity-0 max-sm:hidden"
            >
              <option value="pnl">P&L</option>
              <option value="size">Size</option>
              <option value="entry">Entry</option>
              <option value="current">Current</option>
            </select>
          </div>
        </div>
      </div>
      {isSortDrawerOpen ? (
        <BaseModal
          variant="drawer"
          // title="Sort Positions"
          showClose={false}
          onClose={() => setIsSortDrawerOpen(false)}
        >
          <div className="space-y-4">
            <div className="text-primary font-semibold">Sort Positions</div>
            <div className="space-y-1">
              {(
                [
                  ['pnl', 'P&L'],
                  ['size', 'Size'],
                  ['entry', 'Entry'],
                  ['current', 'Current'],
                ] as const
              ).map(([value, label]) => {
                const isSelected = sortBy === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      onChangeSort(value)
                      setIsSortDrawerOpen(false)
                    }}
                    className={`w-full rounded-r4 border px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? 'border-g-3 bg-g-3/10 text-g-3'
                        : 'border-line-c text-secondary text-t-3! hover:text-primary'
                    }`}
                  >
                    Sort by {label}
                  </button>
                )
              })}
            </div>
          </div>
        </BaseModal>
      ) : null}
    </div>
  )
}
