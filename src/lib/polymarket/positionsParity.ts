/**
 * Polymarket `/positions` merge + status parity (mirror open-positions two-fetch pattern).
 * Primary signal for resolved won/lost: redeemable legs with same rules as Poly-Clone open-positions.
 */

export type RawPolymarketPosition = {
  asset?: string
  conditionId?: string
  condition_id?: string
  outcome?: string
  outcomeIndex?: number | string
  outcome_index?: number | string
  size?: number | string
  avgPrice?: number | string
  avg_price?: number | string
  initialValue?: number | string
  initial_value?: number | string
  currentValue?: number | string
  current_value?: number | string
  totalBought?: number | string
  total_bought?: number | string
  cashPnl?: number | string
  cash_pnl?: number | string
  curPrice?: number | string
  cur_price?: number | string
  redeemable?: boolean
  title?: string
  timestamp?: number | string
  endDate?: string
  end_date?: string
}

export type PositionStatus = 'open' | 'won' | 'lost'

export type ParsePositionOptions = {
  /**
   * Rows from `/closed-positions` missing from the merged `/positions` list.
   * Widens the candidate filter and applies the same redeemable-style won/lost rule.
   */
  closedEnrichment?: boolean
}

export type ParsedPositionRow = {
  conditionId: string
  outcomeIndex: number
  asset: string | undefined
  market: string
  outcome: string
  redeemable: boolean
  size: number
  avgPrice: number
  curPrice: number
  cashPnl: number
  currentValue: number
  totalBought: number
  initialValue: number
  betAmount: number
  pnl: number
  status: PositionStatus
  placedAt: string
}

export function toNum(v: number | string | undefined | null): number {
  if (v == null) return 0
  return typeof v === 'number' ? v : parseFloat(String(v))
}

/** Normalize API price to 0..1 (handles cent-style values). */
export function toUnitPrice(v: number): number {
  return v > 1 ? v / 100 : v
}

export function positionMergeKey(p: RawPolymarketPosition): string {
  const asset = p.asset?.trim()
  if (asset) return `asset:${asset}`
  const cid = p.conditionId ?? p.condition_id ?? ''
  const oi = toNum(p.outcomeIndex ?? p.outcome_index)
  return `leg:${cid}:${oi}`
}

/**
 * Merge open-ish positions first, then redeemable-only rows not already present (open wins on duplicate).
 */
export function mergeOpenAndRedeemablePositions(
  openList: RawPolymarketPosition[],
  redeemableList: RawPolymarketPosition[]
): RawPolymarketPosition[] {
  const seen = new Set<string>()
  const merged: RawPolymarketPosition[] = []
  for (const p of openList) {
    const k = positionMergeKey(p)
    if (seen.has(k)) continue
    seen.add(k)
    merged.push(p)
  }
  for (const p of redeemableList) {
    const k = positionMergeKey(p)
    if (seen.has(k)) continue
    seen.add(k)
    merged.push(p)
  }
  return merged
}

function parseTimestamp(p: RawPolymarketPosition): string {
  const raw = p.timestamp
  if (raw != null) {
    const n = typeof raw === 'number' ? raw : parseFloat(String(raw))
    return new Date(n < 1e12 ? n * 1000 : n).toISOString()
  }
  const d = p.endDate ?? p.end_date
  if (d) return new Date(d).toISOString()
  return new Date().toISOString()
}

/**
 * Candidate filter: size > 0 OR redeemable === true (Poly-Clone parity).
 * Status when redeemable: won if any signal matches; else lost.
 * When not redeemable: status open (live book).
 */
export function redeemableStyleIsWon(args: {
  cashPnl: number
  currentValue: number
  curPrice: number
  size: number
}): boolean {
  const { cashPnl, currentValue, curPrice, size } = args
  // size > 0 && curPrice > 0.5: redeemable position still holds shares above the
  // 50% threshold — treat as won (Polymarket resolves YES at 1, so >50¢ ≈ winning leg).
  return cashPnl > 0 || currentValue > 0 || curPrice >= 0.99 || (size > 0 && curPrice > 0.5)
}

export function parseMergedPositionRow(
  p: RawPolymarketPosition,
  opts?: ParsePositionOptions
): ParsedPositionRow | null {
  const conditionId = p.conditionId ?? p.condition_id
  if (!conditionId) return null

  const outcomeIndex = toNum(p.outcomeIndex ?? p.outcome_index)
  const size = toNum(p.size)
  const redeemable = p.redeemable === true

  const avgPrice = toUnitPrice(toNum(p.avgPrice ?? p.avg_price))
  const curPrice = toUnitPrice(toNum(p.curPrice ?? p.cur_price))
  const cashPnl = toNum(p.cashPnl ?? p.cash_pnl)
  const currentValue = toNum(p.currentValue ?? p.current_value)

  const closedEnrichment = opts?.closedEnrichment === true
  const candidate =
    size > 0 ||
    redeemable ||
    (closedEnrichment &&
      (curPrice >= 0.99 || curPrice <= 0.02 || cashPnl !== 0 || currentValue > 0))

  if (!candidate) return null

  const totalBought = toNum(p.totalBought ?? p.total_bought)
  const initialValue = toNum(p.initialValue ?? p.initial_value)

  const betAmount =
    initialValue > 0
      ? initialValue
      : totalBought > 0 && totalBought !== size
        ? totalBought
        : avgPrice * size

  const pnl = cashPnl !== 0 ? cashPnl : currentValue > 0 ? currentValue - betAmount : 0

  let status: PositionStatus
  if (redeemable || closedEnrichment) {
    const isWon = redeemableStyleIsWon({ cashPnl, currentValue, curPrice, size })
    status = isWon ? 'won' : 'lost'
  } else {
    status = 'open'
  }

  return {
    conditionId,
    outcomeIndex,
    asset: p.asset?.trim() || undefined,
    market: p.title ?? 'Unknown Market',
    outcome: (p.outcome ?? '').trim(),
    redeemable,
    size,
    avgPrice,
    curPrice,
    cashPnl,
    currentValue,
    totalBought,
    initialValue,
    betAmount,
    pnl,
    status,
    placedAt: parseTimestamp(p),
  }
}

/** Trade row from a parsed merged position (redeemable → WON/LOST only). */
export function parsedRowToTradeResult(row: ParsedPositionRow, idSuffix: string) {
  const side: 'BUY' | 'SELL' = row.outcomeIndex === 0 ? 'BUY' : 'SELL'
  const result: 'WON' | 'LOST' = row.status === 'won' ? 'WON' : 'LOST'
  const exitPrice = result === 'WON' ? 1 : 0

  // For won positions the API may not set cashPnl/currentValue (especially after
  // shares are redeemed). Derive P&L from shares × $1 exit − cost basis:
  //   unredeemed: size shares worth $1 each
  //   redeemed:   implied shares = betAmount / avgPrice
  let pnl = row.pnl
  if (result === 'WON' && pnl === 0 && row.betAmount > 0) {
    const shares = row.size > 0 ? row.size : row.avgPrice > 0 ? row.betAmount / row.avgPrice : 0
    pnl = shares - row.betAmount
  }

  return {
    id: `pos-${row.conditionId}-${row.outcomeIndex}-${idSuffix}`,
    conditionId: row.conditionId,
    outcomeIndex: row.outcomeIndex,
    market: row.market,
    outcome: row.outcome,
    side,
    entryPrice: row.avgPrice,
    exitPrice,
    shares: row.size,
    amount: row.betAmount,
    pnl,
    result,
    closedAt: row.placedAt,
    redeemable: row.redeemable,
    status: row.status,
  }
}
