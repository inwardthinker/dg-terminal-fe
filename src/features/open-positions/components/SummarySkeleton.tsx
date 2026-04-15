"use client";

import { SUMMARY_GRID_COLUMNS, SUMMARY_GRID_COLUMNS_MOBILE } from "../constants/layout";

export function SummarySkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-6">
      <section className="rounded-r7 border border-line-c bg-bg-1 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-bg-2" />
          <div className="h-5 w-20 animate-pulse rounded bg-bg-2" />
        </div>

        <div className="space-y-2">
          <div
            className={`grid ${SUMMARY_GRID_COLUMNS} items-center gap-4 border-b border-line-c pb-2 ${SUMMARY_GRID_COLUMNS_MOBILE} max-sm:gap-2`}
          >
            <div className="h-4 w-14 animate-pulse rounded bg-bg-2" />
            <div className="h-4 w-10 animate-pulse rounded bg-bg-2" />
            <div className="h-4 w-10 animate-pulse rounded bg-bg-2" />
            <div className="h-4 w-10 animate-pulse rounded bg-bg-2 max-sm:hidden" />
            <div className="h-4 w-10 animate-pulse rounded bg-bg-2 justify-self-end" />
            <div className="h-4 w-8 animate-pulse rounded bg-bg-2 justify-self-end" />
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`grid ${SUMMARY_GRID_COLUMNS} items-center gap-4 border-b border-line-c py-2 ${SUMMARY_GRID_COLUMNS_MOBILE} max-sm:gap-2`}
            >
              <div className="h-5 w-full max-w-[220px] animate-pulse rounded bg-bg-2" />
              <div className="h-6 w-18 animate-pulse rounded-full bg-bg-2" />
              <div className="h-5 w-9 animate-pulse rounded bg-bg-2" />
              <div className="h-5 w-12 animate-pulse rounded bg-bg-2 justify-self-end max-sm:hidden" />
              <div className="h-9 w-14 animate-pulse rounded bg-bg-2 justify-self-end" />
              <div className="h-7 w-16 animate-pulse rounded-r3 bg-bg-2 justify-self-end" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
