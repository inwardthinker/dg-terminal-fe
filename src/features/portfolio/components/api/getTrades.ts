import { getPolymarketTrades } from './getPolymarketTrades'
import type { TradeHistoryEntry } from '../../types'

export type GetTradesParams = {
  walletAddress: string
  period?: '7d' | '30d' | '90d' | 'All'
  /** Page number (1-indexed). Defaults to 1. */
  page?: number
  /** Rows per page. Defaults to 10 (matches MAX_ROWS in the panel). */
  perPage?: number
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
}: GetTradesParams): Promise<GetTradesResult> {
  return getPolymarketTrades({ walletAddress, period, page, perPage })
}
