import { NextRequest, NextResponse } from 'next/server'
import type { TradeResultRow } from './types'
import {
  mergeOpenAndRedeemablePositions,
  parseMergedPositionRow,
  parsedRowToTradeResult,
  positionMergeKey,
  type RawPolymarketPosition,
} from '@/lib/polymarket/positionsParity'

export const dynamic = 'force-dynamic'

const DATA_API = 'https://data-api.polymarket.com'

type Activity = {
  timestamp: number
  conditionId: string
  type: 'TRADE' | 'REDEEM' | 'DEPOSIT' | 'WITHDRAWAL'
  size: number
  usdcSize: number
  transactionHash: string
  price: number
  side: 'BUY' | 'SELL' | ''
  outcomeIndex: number
  title: string
  outcome: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const user = searchParams.get('user')
  const limit = searchParams.get('limit') ?? '200'

  if (!user) return NextResponse.json({ error: 'user query param is required' }, { status: 400 })
  if (!/^0x[a-fA-F0-9]{40}$/.test(user)) {
    return NextResponse.json({ error: 'Invalid wallet address format' }, { status: 400 })
  }

  const openPositionsUrl =
    `${DATA_API}/positions?user=${encodeURIComponent(user)}` +
    `&sizeThreshold=0.1&limit=${encodeURIComponent(limit)}&offset=0&sortBy=CURRENT&sortDirection=DESC`
  const redeemablePositionsUrl =
    `${DATA_API}/positions?user=${encodeURIComponent(user)}` +
    `&sizeThreshold=0&redeemable=true&limit=${encodeURIComponent(limit)}&offset=0&sortBy=CURRENT&sortDirection=DESC`
  const activityUrl =
    `${DATA_API}/activity?user=${encodeURIComponent(user)}` +
    `&limit=${encodeURIComponent(limit)}&offset=0&excludeDepositsWithdrawals=true&sortBy=TIMESTAMP&sortDirection=DESC`
  const closedUrl =
    `${DATA_API}/closed-positions?user=${encodeURIComponent(user)}` +
    `&limit=${encodeURIComponent(limit)}&offset=0&sortBy=TIMESTAMP&sortDirection=DESC`

  async function parseArrayResult<T>(result: PromiseSettledResult<Response>): Promise<T[]> {
    if (result.status !== 'fulfilled' || !result.value.ok) return []
    const json: unknown = await result.value.json()
    return Array.isArray(json) ? (json as T[]) : []
  }

  const [openRes, redeemRes, activityRes, closedRes] = await Promise.allSettled([
    fetch(openPositionsUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 30 } }),
    fetch(redeemablePositionsUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
    }),
    fetch(activityUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 30 } }),
    fetch(closedUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 30 } }),
  ])

  const [openData, redeemData, activityData, closedData] = await Promise.all([
    parseArrayResult<RawPolymarketPosition>(openRes),
    parseArrayResult<RawPolymarketPosition>(redeemRes),
    parseArrayResult<Activity>(activityRes),
    parseArrayResult<RawPolymarketPosition>(closedRes),
  ])

  const mergedRaw = mergeOpenAndRedeemablePositions(openData, redeemData)

  const settledFromPositions: TradeResultRow[] = []
  const settledMergeKeys = new Set<string>()
  // legKey → unrealized P&L for non-redeemable open positions, built in the same pass.
  const openPositionPnl = new Map<string, number>()

  for (const raw of mergedRaw) {
    const parsed = parseMergedPositionRow(raw)
    if (!parsed) continue
    if (!parsed.redeemable) {
      openPositionPnl.set(`leg:${parsed.conditionId}:${parsed.outcomeIndex}`, parsed.pnl)
      continue
    }
    settledMergeKeys.add(positionMergeKey(raw))
    settledMergeKeys.add(`leg:${parsed.conditionId}:${parsed.outcomeIndex}`)
    const row = parsedRowToTradeResult(parsed, 'pos')
    settledFromPositions.push({ ...row, redeemable: true, status: parsed.status })
  }

  const settledRows: TradeResultRow[] = [...settledFromPositions]

  for (const raw of closedData) {
    const mk = positionMergeKey(raw)
    if (settledMergeKeys.has(mk)) continue
    const parsed = parseMergedPositionRow(raw, { closedEnrichment: true })
    if (!parsed || parsed.status === 'open') continue
    settledMergeKeys.add(mk)
    settledMergeKeys.add(`leg:${parsed.conditionId}:${parsed.outcomeIndex}`)
    const row = parsedRowToTradeResult(parsed, 'closed')
    settledRows.push({
      ...row,
      id: `closed-${parsed.conditionId}-${parsed.outcomeIndex}-${parsed.placedAt}`,
      redeemable: false,
      status: parsed.status,
    })
  }

  const settledLegKeys = new Set<string>()
  for (const r of settledRows) {
    settledLegKeys.add(`leg:${r.conditionId}:${r.outcomeIndex}`)
  }

  const unresolvedRows: TradeResultRow[] = []
  for (const a of activityData) {
    if (a.type !== 'TRADE') continue
    const legKey = `leg:${a.conditionId}:${a.outcomeIndex}`
    if (settledLegKeys.has(legKey)) continue
    const ts = new Date(a.timestamp * 1000).toISOString()
    unresolvedRows.push({
      id: `trade-${a.transactionHash}-${a.conditionId}-${a.outcomeIndex}`,
      conditionId: a.conditionId,
      outcomeIndex: a.outcomeIndex,
      market: a.title || 'Unknown Market',
      outcome: a.outcome || '',
      side: a.side === 'SELL' ? 'SELL' : 'BUY',
      entryPrice: a.price ?? 0,
      exitPrice: a.price ?? 0,
      shares: a.size,
      amount: Math.abs(a.usdcSize),
      pnl: openPositionPnl.get(legKey) ?? 0,
      result: 'UNRESOLVED',
      // 'open' only when this leg still exists in the /positions endpoint (currently held).
      status: openPositionPnl.has(legKey) ? 'open' : undefined,
      closedAt: ts,
    })
  }

  const rows = [...settledRows, ...unresolvedRows].sort((a, b) =>
    b.closedAt.localeCompare(a.closedAt),
  )
  return NextResponse.json(rows)
}
