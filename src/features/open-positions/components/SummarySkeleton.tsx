'use client'

import { SUMMARY_GRID_COLUMNS, SUMMARY_GRID_COLUMNS_MOBILE } from '../constants/layout'

const SKELETON_ROW_KEYS = ['row-a', 'row-b', 'row-c'] as const

export function SummarySkeleton() {
  return (
    <section className="rounded-r7 border border-line-c bg-bg-1 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-6 w-44 animate-pulse rounded bg-bg-2" />
        <div className="h-5 w-20 animate-pulse rounded bg-bg-2" />
      </div>

      <div className="space-y-2">
        <div
          className={`grid ${SUMMARY_GRID_COLUMNS} items-center gap-4 border-b border-line-c text-right text-support ${SUMMARY_GRID_COLUMNS_MOBILE} max-sm:gap-2 max-sm:text-[10px]`}
        >
          <div className="px-3 py-2">
            <div className="h-3 w-14 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 max-sm:hidden">
            <div className="h-3 w-8 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2">
            <div className="h-3 w-9 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 max-sm:hidden">
            <div className="ml-auto h-3 w-10 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2">
            <div className="ml-auto h-3 w-10 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2">
            <div className="h-3 w-12 animate-pulse rounded bg-bg-2" />
          </div>
        </div>

        {SKELETON_ROW_KEYS.map((rowKey) => (
          <div
            key={rowKey}
            className={`grid ${SUMMARY_GRID_COLUMNS} items-center border-b border-line-c text-right text-support transition-colors ${SUMMARY_GRID_COLUMNS_MOBILE} max-sm:text-[11px]`}
          >
            <div className="px-3 py-2 text-left">
              <div className="h-5 w-full max-w-[240px] animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-2 max-sm:hidden">
              <div className="h-6 w-18 animate-pulse rounded-full bg-bg-2" />
            </div>
            <div className="px-3 py-2 text-left">
              <div className="h-4 w-8 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-2 max-sm:hidden">
              <div className="ml-auto h-4 w-14 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-2">
              <div className="ml-auto h-8 w-14 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-2">
              <div className="ml-auto h-7 w-16 animate-pulse rounded-md bg-bg-2" />
            </div>
          </div>
        ))}

        <div className="flex items-center py-2 text-xs text-support">
          <div className="h-3 w-28 animate-pulse rounded bg-bg-2" />
          <div className="mx-2 h-[2px] w-[2px] rounded-full bg-bg-2" />
          <div className="h-3 w-16 animate-pulse rounded bg-bg-2" />
        </div>
      </div>
    </section>
  )
}
