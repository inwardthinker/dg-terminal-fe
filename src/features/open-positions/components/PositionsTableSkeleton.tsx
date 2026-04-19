"use client";

import { POSITION_TABLE_ROW_HEIGHT_PX } from "../constants/layout";

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
          <span className="h-7 w-[4.5rem] shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-28 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-24 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-32 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-20 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="mx-1 h-5 w-px shrink-0 bg-line-c/50" aria-hidden />
          <span className="h-7 w-12 shrink-0 animate-pulse rounded-full bg-bg-2" />
          <span className="h-7 w-11 shrink-0 animate-pulse rounded-full bg-bg-2" />
        </div>
        <div className="h-8 w-[7.25rem] shrink-0 animate-pulse rounded border border-line-c bg-bg-2" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="w-full rounded-r7 border border-line-c bg-bg-1 overflow-x-hidden">
      <table className="w-full text-sm max-sm:text-[13px]">
        <thead className="sticky top-0 z-10 border-b border-line-c bg-bg-1 text-support max-sm:text-[12px]">
          <tr>
            <th className="px-3 py-2 text-left pl-9 max-sm:pl-3">
              <span className="inline-block h-3 w-14 animate-pulse rounded bg-bg-2" />
            </th>
            <th className="px-3 py-2 text-left max-sm:hidden">
              <span className="inline-block h-3 w-16 animate-pulse rounded bg-bg-2" />
            </th>
            <th className="px-3 py-2 text-left">
              <span className="inline-block h-3 w-9 animate-pulse rounded bg-bg-2" />
            </th>
            <th className="px-3 py-2 text-right max-sm:hidden">
              <span className="ml-auto block h-3 w-11 animate-pulse rounded bg-bg-2" />
            </th>
            <th className="px-3 py-2 text-right max-sm:hidden">
              <span className="ml-auto block h-3 w-14 animate-pulse rounded bg-bg-2" />
            </th>
            <th className="px-3 py-2 text-right max-sm:hidden">
              <span className="ml-auto block h-3 w-10 animate-pulse rounded bg-bg-2" />
            </th>
            <th className="px-3 py-2 text-right">
              <span className="ml-auto block h-3 w-12 animate-pulse rounded bg-bg-2" />
            </th>
            <th className="px-3 py-2 text-right max-sm:hidden">
              <span className="ml-auto block h-3 w-12 animate-pulse rounded bg-bg-2" />
            </th>
            <th className="px-3 py-2 text-right">
              <span className="ml-auto block h-3 w-14 animate-pulse rounded bg-bg-2" />
            </th>
          </tr>
        </thead>
        <tbody>
          {SKELETON_ROW_KEYS.map((rowKey) => (
            <tr
              key={rowKey}
              className="border-b border-line-c"
              style={{
                height: POSITION_TABLE_ROW_HEIGHT_PX,
                maxHeight: POSITION_TABLE_ROW_HEIGHT_PX,
              }}
            >
              <td className="px-3 py-0 align-middle pl-9 max-sm:pl-3">
                <div className="flex max-w-[240px] items-center gap-3 max-sm:max-w-[132px] max-sm:gap-1">
                  <span className="h-4 w-4 shrink-0 animate-pulse rounded border border-line-c/60 bg-bg-2 max-sm:hidden" />
                  <span className="h-3.5 min-w-0 flex-1 animate-pulse rounded bg-bg-2" />
                </div>
              </td>
              <td className="px-3 py-0 align-middle max-sm:hidden">
                <span className="inline-flex h-6 w-[4.25rem] animate-pulse rounded-full bg-bg-2" />
              </td>
              <td className="px-3 py-0 align-middle">
                <span className="inline-block h-3.5 w-8 animate-pulse rounded bg-bg-2" />
              </td>
              <td className="px-3 py-0 align-middle text-right max-sm:hidden">
                <span className="ml-auto block h-3.5 w-12 animate-pulse rounded bg-bg-2" />
              </td>
              <td className="px-3 py-0 align-middle text-right max-sm:hidden">
                <span className="ml-auto block h-3.5 w-12 animate-pulse rounded bg-bg-2" />
              </td>
              <td className="px-3 py-0 align-middle text-right max-sm:hidden">
                <span className="ml-auto block h-3.5 w-14 animate-pulse rounded bg-bg-2" />
              </td>
              <td className="px-3 py-0 align-middle text-right">
                <span className="ml-auto block h-3.5 w-14 animate-pulse rounded bg-bg-2" />
              </td>
              <td className="px-3 py-0 align-middle text-right max-sm:hidden">
                <span className="ml-auto block h-3.5 w-12 animate-pulse rounded bg-bg-2" />
              </td>
              <td className="px-3 py-0 align-middle text-right">
                <span className="ml-auto inline-flex h-7 w-[3.25rem] animate-pulse rounded-md border border-line-c bg-bg-2" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
