export type TradeResultRow = {
  id: string
  conditionId: string
  outcomeIndex: number
  market: string
  outcome: string
  side: 'BUY' | 'SELL'
  entryPrice: number
  exitPrice: number
  shares: number
  amount: number
  pnl: number
  result: 'WON' | 'LOST' | 'UNRESOLVED'
  closedAt: string
  /** Present when row came from merged `/positions` (parity with open-positions semantics). */
  redeemable?: boolean
  status?: 'open' | 'won' | 'lost'
}
