import type { TradeResultRow } from '@/app/api/trades-results/types'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { PortfolioKpis } from '../../types'

export type PolymarketDerivedKpis = Pick<
  PortfolioKpis,
  'openExposure' | 'openCount' | 'unrealizedPnl' | 'realized30d' | 'trades30d' | 'todayPnl'
> & { totalSettledTrades: number }

/** Local-timezone YYYY-MM-DD string for a given Date. */
function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function getKpisFromPolymarket(walletAddress: string): Promise<PolymarketDerivedKpis> {
  const params = new URLSearchParams({ user: walletAddress, limit: '200' })
  const res = await fetch(`${API_ENDPOINTS.portfolio.polymarketTrades}?${params}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Polymarket trades error: ${res.status}`)

  const body: unknown = await res.json()
  if (!Array.isArray(body)) throw new Error('Unexpected response from trades API')
  const rows = body as TradeResultRow[]

  const now = new Date()
  const todayStr = localDateStr(now)
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - 30)
  const cutoffStr = localDateStr(cutoff)

  // Deduplicate held positions by conditionId:outcomeIndex.
  // status === 'open' means the leg exists in the /positions endpoint (currently held).
  // Other UNRESOLVED rows are historical activity for positions no longer held.
  const heldPositionKeys = new Set<string>()
  let openExposure = 0
  let unrealizedPnl = 0
  let realized30d = 0
  let trades30dCount = 0
  let todayPnlSum = 0
  let todayTradeCount = 0
  let totalSettledTrades = 0

  for (const row of rows) {
    if (row.result === 'UNRESOLVED') {
      if (row.status !== 'open') continue
      const posKey = `${row.conditionId}:${row.outcomeIndex}`
      if (heldPositionKeys.has(posKey)) continue
      heldPositionKeys.add(posKey)
      openExposure += row.amount
      unrealizedPnl += row.pnl
    } else {
      totalSettledTrades++
      const isoDate = row.closedAt.slice(0, 10)
      if (isoDate === todayStr) {
        todayPnlSum += row.pnl
        todayTradeCount++
      }
      if (isoDate >= cutoffStr) {
        realized30d += row.pnl
        trades30dCount++
      }
    }
  }

  return {
    openExposure,
    openCount: heldPositionKeys.size,
    unrealizedPnl,
    realized30d,
    trades30d: trades30dCount,
    // undefined when no trades settled today — navbar shows "--" rather than "+$0"
    todayPnl: todayTradeCount > 0 ? todayPnlSum : undefined,
    totalSettledTrades,
  }
}
