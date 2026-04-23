export type Position = {
  id: string
  no_of_shares: number
  market: string
  category: 'Sports' | 'Politics' | 'Crypto' | 'Macro' | 'Other'
  side: string
  entryPrice: number
  currentPrice: number
  size: number
  pnl: number
  pnlPct: number
  priceStale?: boolean
  liveTick?: number
}

export type PositionsConnectionState = 'connected' | 'reconnecting' | 'disconnected'

export type UsePositionsParams = {
  limit?: number
  sortBy?: 'pnl' | 'recent'
  userAddress?: string
  realtimeOnly?: boolean
}

export type UsePositionsResult = {
  positions: Position[]
  totalCount: number
  loading: boolean
  error: string | null
  connectionState: PositionsConnectionState
}

export interface ApiKpis {
  totalOpen: number
  totalExposure: number
  unrealizedPnl: number
  largestPositionValue: number
  largestPositionPct: number
}

export type Variant = 'default' | 'positive' | 'negative' | 'accent'

export type KpiCardData = {
  id: string
  label: string
  value: string
  tooltip?: string
  valueVariant?: Variant
  meta?: string
  dimmed?: boolean
}
