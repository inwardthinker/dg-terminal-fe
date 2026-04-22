"use client";

import {
  POSITION_TABLE_GRID_COLUMNS,
  POSITION_TABLE_GRID_COLUMNS_MOBILE,
  POSITION_TABLE_ROW_HEIGHT_PX,
} from "../constants/layout";

const SKELETON_ROW_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
  "sk-i",
  "sk-j",
] as const;

function FilterBarSkeleton() {
  return (
    <div className="border border-line-c rounded-r6 bg-bg-1 px-3 py-2 sm:px-4 max-sm:border-none max-sm:bg-transparent">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span
            className="h-3 w-14 shrink-0 animate-pulse rounded bg-bg-2 max-sm:hidden"
            aria-hidden
          />
          <span className="h-7 w-18 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-28 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-24 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-32 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-20 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="mx-1 h-5 w-px shrink-0 bg-line-c/50" aria-hidden />
          <span className="h-7 w-12 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-11 shrink-0 animate-pulse rounded-full bg-bg-2" />
        </div>
        <div className="h-8 w-29 shrink-0 animate-pulse rounded border border-line-c bg-bg-2" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="w-full rounded-r7 border border-line-c bg-bg-1 overflow-x-hidden">
      <div className="hidden sm:block text-sm">
        <div
          className={`sticky top-0 z-10 grid ${POSITION_TABLE_GRID_COLUMNS} items-center border-b border-line-c bg-bg-1 text-support`}
        >
          <div className="px-3 py-2 pl-9 max-sm:pl-3">
            <span className="inline-block h-3 w-14 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 max-sm:hidden">
            <span className="ml-auto block h-3 w-16 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2">
            <span className="inline-block h-3 w-9 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 text-right max-sm:hidden">
            <span className="ml-auto block h-3 w-11 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 text-right max-sm:hidden">
            <span className="ml-auto block h-3 w-14 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 text-right max-sm:hidden">
            <span className="ml-auto block h-3 w-10 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 text-right">
            <span className="ml-auto block h-3 w-10 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 text-right max-sm:hidden">
            <span className="ml-auto block h-3 w-12 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 text-right">
            <span className="ml-auto block h-3 w-14 animate-pulse rounded bg-bg-2" />
          </div>
        </div>

        {SKELETON_ROW_KEYS.map((rowKey) => (
          <div
            key={rowKey}
            className={`grid ${POSITION_TABLE_GRID_COLUMNS} items-center border-b border-line-c`}
            style={{
              height: POSITION_TABLE_ROW_HEIGHT_PX,
              maxHeight: POSITION_TABLE_ROW_HEIGHT_PX,
            }}
          >
            <div className="px-3 py-0 pl-9 max-sm:pl-3">
              <div className="flex items-center gap-2 max-sm:gap-1">
                <span className="h-3 w-3 shrink-0 animate-pulse rounded-[2px] border border-line-c/60 bg-bg-2 max-sm:hidden" />
                <span className="h-3.5 min-w-0 flex-1 animate-pulse rounded bg-bg-2" />
              </div>
            </div>
            <div className="px-3 py-0 max-sm:hidden">
              <span className="ml-auto inline-flex h-6 w-13 animate-pulse rounded-full bg-bg-2" />
            </div>
            <div className="px-3 py-0">
              <span className="inline-block h-3.5 w-12 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-0 text-right max-sm:hidden">
              <span className="ml-auto block h-3.5 w-8 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-0 text-right max-sm:hidden">
              <span className="ml-auto block h-3.5 w-9 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-0 text-right max-sm:hidden">
              <span className="ml-auto block h-3.5 w-14 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-0 text-right">
              <span className="ml-auto block h-3.5 w-16 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-0 text-right max-sm:hidden">
              <span className="ml-auto block h-3.5 w-10 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-1 py-0 text-right">
              <span className="ml-auto inline-flex h-6 w-10 animate-pulse rounded-r4 border border-neg/40 bg-neg/10" />
            </div>
          </div>
        ))}
      </div>
      <div className="sm:hidden text-[13px]">
        <div
          className={`sticky top-0 z-10 grid ${POSITION_TABLE_GRID_COLUMNS_MOBILE} items-center border-b border-line-c bg-bg-1 text-support max-sm:text-[12px]`}
        >
          <div className="px-3 py-2">
            <span className="inline-block h-3 w-14 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2">
            <span className="inline-block h-3 w-8 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 text-right">
            <span className="ml-auto block h-3 w-10 animate-pulse rounded bg-bg-2" />
          </div>
          <div className="px-3 py-2 text-right">
            <span className="ml-auto block h-3 w-12 animate-pulse rounded bg-bg-2" />
          </div>
        </div>

        {SKELETON_ROW_KEYS.map((rowKey) => (
          <div
            key={`mobile-${rowKey}`}
            className={`grid ${POSITION_TABLE_GRID_COLUMNS_MOBILE} items-center border-b border-line-c`}
            style={{
              height: POSITION_TABLE_ROW_HEIGHT_PX,
              maxHeight: POSITION_TABLE_ROW_HEIGHT_PX,
            }}
          >
            <div className="px-3 py-0">
              <span className="h-3.5 min-w-0 block animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-0">
              <span className="inline-block h-3.5 w-12 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-0 text-right">
              <span className="ml-auto block h-3.5 w-16 animate-pulse rounded bg-bg-2" />
            </div>
            <div className="px-3 py-0 text-right">
              <span className="ml-auto inline-flex h-7 w-13 animate-pulse rounded-r4 border border-neg/40 bg-neg/10" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex max-sm:hidden justify-between px-2 py-2">
        <div className="h-4 w-72 max-w-[58%] animate-pulse rounded bg-bg-2/70" />
        <div className="h-4 w-32 animate-pulse rounded bg-bg-2/70" />
      </div>
    </div>
  );
}

export function PositionsTableSkeleton() {
  return (
    <div className="w-full space-y-4" aria-busy aria-label="Loading open positions">
      <FilterBarSkeleton />
      <TableSkeleton />
    </div>
  );
}
