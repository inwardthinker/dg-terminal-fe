import type { TradeHistoryEntry, TradeHistoryPeriod, TradeSide } from '../../types'
import type { TradeResultRow } from '@/app/api/trades-results/types'
import { API_ENDPOINTS } from '@/lib/api/endpoints'

/** Format an ISO timestamp -> "Apr 7" display string. */
function formatDisplayDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Extract "YYYY-MM-DD" from an ISO timestamp. */
function toIsoDate(iso: string): string {
  return iso.slice(0, 10)
}

/** Cutoff date string (YYYY-MM-DD) for a given period filter. */
function periodCutoff(period: TradeHistoryPeriod): string | null {
  if (period === 'All') return null
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

/**
 * Map normalized trades-result row into TradeHistoryEntry.
 */
function mapPolymarketTrade(t: TradeResultRow): TradeHistoryEntry {
  const side: TradeSide = t.side === 'SELL' ? 'NO' : 'YES'

  return {
    id: t.id,
    date: formatDisplayDate(t.closedAt),
    isoDate: toIsoDate(t.closedAt),
    market: t.market,
    side,
    entry: t.entryPrice,
    exit: t.exitPrice,
    size: t.amount,
    result: t.result,
    pnl: t.pnl,
    isMarketLive: t.result === 'UNRESOLVED',
    venue: 'Polymarket',
    closeType: t.result === 'UNRESOLVED' ? 'manual' : 'settlement',
  }
}

export type GetPolymarketTradesParams = {
  walletAddress: string
  period?: TradeHistoryPeriod
  page?: number
  perPage?: number
}

export type GetPolymarketTradesResult = {
  trades: TradeHistoryEntry[]
  totalCount: number
  totalPages: number
  page: number
}

/**
 * Fetch activity history from Polymarket via the Next.js proxy route.
 * Used as a fallback when the terminal backend is unavailable.
 *
 * Period filtering and pagination are applied client-side.
 */
export async function getPolymarketTrades({
  walletAddress,
  period = 'All',
  page = 1,
  perPage = 10,
}: GetPolymarketTradesParams): Promise<GetPolymarketTradesResult> {
  const fetchLimit = period === 'All' ? 200 : 100

  const params = new URLSearchParams({
    user: walletAddress,
    limit: String(fetchLimit),
    offset: '0',
  })

  const res = await fetch(`${API_ENDPOINTS.portfolio.polymarketTrades}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`Polymarket proxy error: ${res.status}`)
  }

  const raw: TradeResultRow[] = await res.json()

  let all: TradeHistoryEntry[] = raw.map(mapPolymarketTrade)

  // Client-side period filtering
  const cutoff = periodCutoff(period)
  if (cutoff) {
    all = all.filter((t) => t.isoDate >= cutoff)
  }

  // Newest first (activity API already returns DESC but enforce)
  all.sort((a, b) => b.isoDate.localeCompare(a.isoDate))

  const totalCount = all.length
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * perPage
  const trades = all.slice(start, start + perPage)

  return { trades, totalCount, totalPages, page: safePage }
}
