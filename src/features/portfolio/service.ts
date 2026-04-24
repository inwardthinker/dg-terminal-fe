import { apiFetch } from '@/lib/api/client'

export type OpenPositionsSummaryResponse = {
  open_positions: number
  total_exposure: number
  largest_position: number
  unrealized_pnl: number
}

export function fetchOpenPositionsSummary(wallet: string) {
  const qs = new URLSearchParams({ wallet })
  return apiFetch<OpenPositionsSummaryResponse>(
    `/api/portfolio/open-positions-summary?${qs.toString()}`,
  )
}
