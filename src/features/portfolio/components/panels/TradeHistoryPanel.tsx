'use client'

import { useEffect, useState } from 'react'
import type { TradeHistoryEntry, TradeHistoryPeriod } from '@/features/portfolio/types'
import { useModal } from '@/lib/modals/hooks/useModal'
import { getTrades } from '@/features/portfolio/components/api/getTrades'

const PERIODS: TradeHistoryPeriod[] = ['7d', '30d', '90d', 'All']
const PER_PAGE = 10

const TRADE_HISTORY_GRID_TEMPLATE =
  'grid-cols-[minmax(64px,0.9fr)_minmax(220px,2.5fr)_minmax(48px,0.7fr)_minmax(64px,0.9fr)_minmax(56px,0.8fr)_minmax(72px,0.9fr)_minmax(90px,1.1fr)_minmax(76px,1fr)]'
const TRADE_HISTORY_GRID_CLASS = `grid ${TRADE_HISTORY_GRID_TEMPLATE} gap-sp2`

type TradeHistoryPanelProps = {
  walletAddress: string
  /** If true the panel renders its empty/loading skeleton without fetching. */
  loading?: boolean
}

const formatUsd = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(n))

function ResultBadge({ result }: { result: TradeHistoryEntry['result'] }) {
  const cls = {
    WON: 'bg-[rgba(76,175,125,0.18)]  border border-[rgba(76,175,125,0.3)]   text-pos',
    LOST: 'bg-[rgba(224,92,92,0.18)]   border border-[rgba(224,92,92,0.3)]    text-neg',
    UNRESOLVED: 'bg-[rgba(154,148,136,0.15)] border border-[rgba(154,148,136,0.3)]  text-t-3',
  }[result]

  return (
    <span className={`inline-block rounded-r3 px-[9px] py-[3px] text-button ${cls}`}>{result}</span>
  )
}

/** Full-panel skeleton — shown only on the very first load. */
function Skeleton() {
  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5 flex flex-col gap-[4px]">
      <div className="h-[14px] w-1/3 bg-bg-2 rounded-r2 animate-pulse mb-sp2" />
      {Array.from({ length: PER_PAGE }).map((_, i) => (
        <div key={i} className="h-[28px] bg-bg-2 rounded-r2 animate-pulse" />
      ))}
    </div>
  )
}

/**
 * Rows-only skeleton — shown when changing page / period.
 * Mirrors the exact padding and border of real data rows so the panel
 * height stays perfectly stable during loading.
 */
function RowsSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: PER_PAGE }).map((_, i) => (
        <div key={i} className="py-[5px] border-b border-[rgba(255,255,255,0.05)] last:border-0">
          <div className="h-[26px] bg-bg-2 rounded-r2 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function downloadCsv(trades: TradeHistoryEntry[], filename: string) {
  const headers = ['Date', 'Market', 'Side', 'Entry', 'Exit', 'Size (USD)', 'Result', 'P&L (USD)']
  const rows = trades.map((t) => [
    t.date,
    `"${t.market.replace(/"/g, '""')}"`,
    t.side,
    t.entry.toFixed(2),
    t.exit.toFixed(2),
    t.size.toFixed(2),
    t.result,
    t.pnl.toFixed(2),
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function fetchAllTradesForExport(
  walletAddress: string,
  period: TradeHistoryPeriod,
): Promise<TradeHistoryEntry[]> {
  const EXPORT_PAGE_SIZE = 100
  const all: TradeHistoryEntry[] = []

  // Fetch first page to learn totalPages, then fetch the rest in parallel.
  const first = await getTrades({ walletAddress, period, page: 1, perPage: EXPORT_PAGE_SIZE })
  all.push(...first.trades)

  if (first.totalPages > 1) {
    const remaining = Array.from({ length: first.totalPages - 1 }, (_, i) =>
      getTrades({ walletAddress, period, page: i + 2, perPage: EXPORT_PAGE_SIZE }),
    )
    const results = await Promise.all(remaining)
    for (const r of results) all.push(...r.trades)
  }

  return all
}

export function TradeHistoryPanel({
  walletAddress,
  loading: parentLoading,
}: TradeHistoryPanelProps) {
  const [period, setPeriod] = useState<TradeHistoryPeriod>('30d')
  const [page, setPage] = useState(1)

  const [trades, setTrades] = useState<TradeHistoryEntry[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const { openModal } = useModal()

  async function handleExport() {
    if (exporting || !walletAddress) return
    setExporting(true)
    try {
      const all = await fetchAllTradesForExport(walletAddress, period)
      const filename = `trade-history-${period.toLowerCase()}.csv`
      downloadCsv(all, filename)
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    if (!walletAddress) return

    let cancelled = false

    async function load() {
      setFetching(true)
      setFetchError(null)
      try {
        // All periods (including "All" → period=all) use the same server-side
        // pagination: one request per page, trust total_count / total_pages.
        const result = await getTrades({
          walletAddress,
          period,
          page,
          perPage: PER_PAGE,
        })
        if (cancelled) return
        setTrades(result.trades)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
      } catch {
        if (cancelled) return
        setFetchError('Failed to load trade history.')
      } finally {
        if (!cancelled) setFetching(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [walletAddress, period, page])

  function handlePeriodChange(p: TradeHistoryPeriod) {
    setPeriod(p)
    setPage(1) // reset to page 1 on filter change
  }

  // Full skeleton only on the very first load (parent hasn't resolved yet).
  if (parentLoading) return <Skeleton />

  // Empty / error states (only when we're not mid-fetch to avoid flicker).
  if (!fetching && fetchError) {
    return (
      <div className="bg-bg-1/35 border border-line-c rounded-r7 p-sp5 flex flex-col gap-sp4">
        <div className="text-primary-muted">Trade history</div>
        <div className="h-[180px] grid place-items-center text-neg">{fetchError}</div>
      </div>
    )
  }

  if (!fetching && totalCount === 0 && page === 1) {
    return (
      <div className="bg-bg-1/35 border border-line-c rounded-r7 p-sp5 flex flex-col gap-sp4">
        <div className="text-primary-muted">Trade history</div>
        <div className="h-[180px] grid place-items-center text-support">
          {period === 'All' ? 'No trade history yet' : `No trades in the last ${period}`}
        </div>
      </div>
    )
  }

  // Start index of the current page (0-indexed, for the footer label).
  const start = (page - 1) * PER_PAGE

  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5">
      {/* ── Header (always visible) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sp3 mb-sp4">
        <span className="text-primary">Trade history</span>

        <div className="flex items-center gap-sp5 sm:gap-sp7 flex-wrap">
          {/* Period tabs */}
          <div className="flex gap-[3px]">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                aria-pressed={period === p}
                className={`px-sp3 py-sp2 rounded-r2 text-button cursor-pointer transition-colors ${
                  period === p ? 'bg-[rgba(205,189,112,0.12)] text-g-3' : 'text-t-3 hover:text-t-2'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="text-action disabled:opacity-40 disabled:cursor-default"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting…' : 'Export CSV ↓'}
          </button>
        </div>
      </div>

      {/* ── Table (rows replaced by skeleton while fetching) ── */}
      <div className="overflow-x-auto -mx-sp5 px-sp5">
        <div className="min-w-[720px]">
          {/* Column headers */}
          <div
            className={`${TRADE_HISTORY_GRID_CLASS} text-support pb-[5px] border-b border-line-c mb-[2px]`}
          >
            <span>Date</span>
            <span>Market</span>
            <span>Side</span>
            <span>Entry</span>
            <span>Exit</span>
            <span>Size</span>
            <span>Result</span>
            <span className="text-right">P&amp;L</span>
          </div>

          {/* Rows — skeleton while fetching, real data when ready */}
          {fetching ? (
            <RowsSkeleton />
          ) : trades.length === 0 ? (
            <div className="text-support py-sp7 text-center">No trades in this period.</div>
          ) : (
            trades.map((trade, idx) => (
              <div
                // Composite key: condition_id is not unique per row (same market
                // can have multiple settlement records with different closed_at).
                key={`${trade.id}_${trade.isoDate}_${idx}`}
                role="button"
                tabIndex={0}
                onClick={() => openModal('tradeDetail', { id: trade.id, trade })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (e.key === ' ') e.preventDefault()
                    openModal('tradeDetail', { id: trade.id, trade })
                  }
                }}
                className={`${TRADE_HISTORY_GRID_CLASS} items-center py-[5px] border-b border-[rgba(255,255,255,0.05)] last:border-0 text-secondary cursor-pointer hover:bg-[rgba(255,255,255,0.025)] transition-colors`}
              >
                <span className="text-t-3">{trade.date}</span>

                <span
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  title={trade.market}
                >
                  {trade.market}
                </span>

                <span
                  className={trade.side === 'YES' ? 'text-pos font-bold' : 'text-neg font-bold'}
                >
                  {trade.side}
                </span>

                <span>{trade.entry.toFixed(2)}</span>
                <span>{trade.exit.toFixed(2)}</span>
                <span>{formatUsd(trade.size)}</span>

                <span>
                  <ResultBadge result={trade.result} />
                </span>

                <span
                  className={`text-right font-semibold ${
                    trade.result === 'LOST' || trade.pnl < 0 ? 'text-neg' : 'text-pos'
                  }`}
                >
                  {trade.result === 'LOST' || trade.pnl < 0 ? '-' : '+'}
                  {formatUsd(trade.pnl)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Pagination footer (always visible once we have data) ── */}
      {totalCount > 0 && (
        <div className="pt-[7px] border-t border-[rgba(255,255,255,0.05)] text-support mt-[3px] flex items-center justify-between gap-sp3">
          <span>
            Showing {start + 1}–{Math.min(start + PER_PAGE, totalCount)} of {totalCount} trades
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-[2px]">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || fetching}
                className="px-sp3 py-sp2 rounded-r2 text-button cursor-pointer transition-colors text-t-3 hover:text-t-2 disabled:opacity-30 disabled:cursor-default"
              >
                ← Prev
              </button>
              <span className="px-sp2 text-t-3">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || fetching}
                className="px-sp3 py-sp2 rounded-r2 text-button cursor-pointer transition-colors text-t-3 hover:text-t-2 disabled:opacity-30 disabled:cursor-default"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
