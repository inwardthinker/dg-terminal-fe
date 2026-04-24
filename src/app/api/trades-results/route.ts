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

  const [openRes, redeemRes, activityRes, closedRes] = await Promise.allSettled([
    fetch(openPositionsUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 30 } }),
    fetch(redeemablePositionsUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
    }),
    fetch(activityUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 30 } }),
    fetch(closedUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 30 } }),
  ])

  let openData: RawPolymarketPosition[] = []
  let redeemData: RawPolymarketPosition[] = []
  let activityData: Activity[] = []
  let closedData: RawPolymarketPosition[] = []

  if (openRes.status === 'fulfilled' && openRes.value.ok) {
    const json = await openRes.value.json()
    if (Array.isArray(json)) openData = json as RawPolymarketPosition[]
  }
  if (redeemRes.status === 'fulfilled' && redeemRes.value.ok) {
    const json = await redeemRes.value.json()
    if (Array.isArray(json)) redeemData = json as RawPolymarketPosition[]
  }
  if (activityRes.status === 'fulfilled' && activityRes.value.ok) {
    const json = await activityRes.value.json()
    if (Array.isArray(json)) activityData = json as Activity[]
  }
  if (closedRes.status === 'fulfilled' && closedRes.value.ok) {
    const json = await closedRes.value.json()
    if (Array.isArray(json)) closedData = json as RawPolymarketPosition[]
  }

  const mergedRaw = mergeOpenAndRedeemablePositions(openData, redeemData)

  const settledFromPositions: TradeResultRow[] = []
  const settledMergeKeys = new Set<string>()

  for (const raw of mergedRaw) {
    const parsed = parseMergedPositionRow(raw)
    if (!parsed?.redeemable) continue
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
      pnl: 0,
      result: 'UNRESOLVED',
      closedAt: ts,
    })
  }

  const rows = [...settledRows, ...unresolvedRows].sort((a, b) =>
    b.closedAt.localeCompare(a.closedAt),
  )
  return NextResponse.json(rows)
}
