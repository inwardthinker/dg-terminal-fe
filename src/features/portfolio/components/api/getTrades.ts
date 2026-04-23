import { apiFetch } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { env } from '@/lib/constants/env'
import type { TradeHistoryEntry, TradeResult, TradeSide } from '../../types'

// Shape returned by the backend trades endpoint.
type ApiTrade = {
  condition_id: string
  market_name: string
  side: string
  // Direct fields already computed by the backend —
  // prefer these over avg_entry_price / current_price / cost_basis.
  entry_price: number
  exit_price: number
  size: number
  pnl: number
  outcome: string // "WON" | "LOST" | "PUSHED"
  end_date: string | null
  closed_at: string | null
  date: string | null
  venue?: string
  category?: string
}

type ApiTradesResponse = {
  trades: ApiTrade[]
  page: number
  per_page: number
  total_count: number
  total_pages: number
}

/** Format an ISO timestamp → "Apr 7" display string. */
function formatDisplayDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Extract "YYYY-MM-DD" from an ISO timestamp for period filtering. */
function toIsoDate(iso: string): string {
  return iso.slice(0, 10)
}

function mapApiTrade(t: ApiTrade): TradeHistoryEntry | null {
  // Prefer closed_at, fall back to date or end_date.
  const closeDate = t.closed_at || t.date || t.end_date
  // Skip trades with no resolvable date — rendering Invalid Date is worse.
  if (!closeDate) return null

  const outcome = (
    ['WON', 'LOST', 'PUSHED'].includes(t.outcome) ? t.outcome : 'PUSHED'
  ) as TradeResult

  return {
    id: t.condition_id,
    date: formatDisplayDate(closeDate),
    isoDate: toIsoDate(closeDate),
    market: t.market_name,
    side: (t.side === 'YES' || t.side === 'NO' ? t.side : 'YES') as TradeSide,
    entry: t.entry_price,
    exit: t.exit_price,
    size: t.size,
    pnl: t.pnl,
    result: outcome,
    venue: t.venue,
    settlementDate: t.end_date ? formatDisplayDate(t.end_date) : undefined,
    closeType: t.exit_price >= 0.99 || t.exit_price <= 0.01 ? 'settlement' : 'manual',
  }
}

export type GetTradesParams = {
  walletAddress: string
  /**
   * Server-side period filter. Accepts the same values as the UI tabs.
   * "All" is lowercased to "all" before being sent — the backend treats it
   * as an explicit "no date filter" value.
   */
  period?: '7d' | '30d' | '90d' | 'All'
  /** Page number (1-indexed). Defaults to 1. */
  page?: number
  /** Rows per page. Defaults to 10 (matches MAX_ROWS in the panel). */
  perPage?: number
  /** Optional outcome filter sent to the server. */
  outcome?: 'WON' | 'LOST'
}

export type GetTradesResult = {
  trades: TradeHistoryEntry[]
  totalCount: number
  totalPages: number
  page: number
}

export async function getTrades({
  walletAddress,
  period,
  page = 1,
  perPage = 10,
  outcome,
}: GetTradesParams): Promise<GetTradesResult> {
  const params = new URLSearchParams({
    walletAddress,
    page: String(page),
    per_page: String(perPage),
    sort_by: 'date',
    sort_dir: 'desc',
  })

  // Backend accepts 7d / 30d / 90d / all — the UI uses "All" (capitalised),
  // so lowercase it on the way out.
  if (period) params.set('period', period === 'All' ? 'all' : period)
  if (outcome) params.set('outcome', outcome)

  const headers: Record<string, string> = {}
  if (env.apiToken) {
    headers['Authorization'] = `Bearer ${env.apiToken}`
  }

  const response = await apiFetch<ApiTradesResponse>(
    `${API_ENDPOINTS.portfolio.trades}?${params.toString()}`,
    { headers },
  )

  // Filter out any trades that couldn't be mapped (e.g. missing date fields).
  const trades = (response.trades ?? [])
    .map(mapApiTrade)
    .filter((t): t is TradeHistoryEntry => t !== null)

  return {
    trades,
    totalCount: response.total_count ?? trades.length,
    totalPages: response.total_pages ?? 1,
    page: response.page ?? page,
  }
}
