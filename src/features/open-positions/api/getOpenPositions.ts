import { apiFetch } from '@/lib/api/client'

type ApiPosition = {
  asset: string
  conditionId: string
  size: number
  avgPrice: number
  initialValue: number
  currentValue: number
  cashPnl: number
  percentPnl: number
  curPrice: number
  title: string
  outcome: string
  slug?: string
  redeemable?: boolean
  mergeable?: boolean
  endDate?: string
}

type PositionCategory = 'Sports' | 'Politics' | 'Crypto' | 'Macro' | 'Other'

type GetOpenPositionsParams = {
  userAddress: string
}

function toNumber(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function inferCategory(title: string, slug?: string): PositionCategory {
  const raw = `${title} ${slug ?? ''}`.toLowerCase()
  if (
    /(nba|nfl|mlb|fifa|soccer|football|tennis|match|tournament|cup|league|playoff|super bowl)/.test(
      raw,
    )
  ) {
    return 'Sports'
  }
  if (
    /(election|president|senate|house|policy|government|vote|trump|biden|democrat|republican)/.test(
      raw,
    )
  ) {
    return 'Politics'
  }
  if (/(btc|bitcoin|eth|ethereum|sol|crypto|token|defi|blockchain)/.test(raw)) {
    return 'Crypto'
  }
  if (
    /(cpi|inflation|fed|fomc|rates|gdp|recession|treasury|economy|macro|sp500|nasdaq)/.test(raw)
  ) {
    return 'Macro'
  }
  return 'Other'
}

function isActiveOpenPosition(position: ApiPosition): boolean {
  if (position.redeemable || position.mergeable) {
    return false
  }

  const currentPrice = toNumber(position.curPrice)
  if (currentPrice <= 0) {
    return false
  }

  return true
}

export async function getOpenPositions({
  userAddress,
}: GetOpenPositionsParams): Promise<ApiPosition[]> {
  const params = new URLSearchParams({
    user: userAddress,
    limit: '500',
    offset: '0',
    sizeThreshold: '0',
    sortBy: 'CASHPNL',
    sortDirection: 'DESC',
  })

  const positions = await apiFetch<ApiPosition[]>(
    `/api/polymarket/positions?${params.toString()}`,
    {
      baseUrl: '',
    },
  )

  return positions.filter(isActiveOpenPosition)
}

export function mapApiPositionToViewModel(position: ApiPosition) {
  const shares = toNumber(position.size)
  const currentPrice = toNumber(position.curPrice)
  const deployedValue = toNumber(position.initialValue)
  const positionValue = toNumber(position.currentValue) || shares * currentPrice
  const pnl = toNumber(position.cashPnl)
  const pnlPct = toNumber(position.percentPnl)
  const outcome = String(position.outcome ?? '')
  const normalizedOutcome = outcome.trim().toUpperCase()
  const side =
    normalizedOutcome === 'YES' || normalizedOutcome === 'NO' ? normalizedOutcome : outcome

  return {
    id: `${position.conditionId}-${position.asset}`,
    no_of_shares: shares,
    market: position.title,
    category: inferCategory(position.title, position.slug),
    side,
    entryPrice: toNumber(position.avgPrice),
    currentPrice,
    size: positionValue,
    deployedValue,
    positionValue,
    pnl,
    pnlPct,
  }
}
