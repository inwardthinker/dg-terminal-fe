// src/features/equity-curve/useEquityCurve.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api/client'
import { env } from '@/lib/constants/env'
import { EMPTY_EQUITY_CURVE_RESPONSE, EquityCurveApiResponse } from '@/features/equity-curve/types'

const EQUITY_CURVE_USER_ID = 7
const EQUITY_CURVE_PERIOD = 'all'

async function fetchEquityCurveHistory(userId: number, period: string) {
  const params = new URLSearchParams({
    userId: String(userId),
    period,
  })
  const headers: Record<string, string> = {}

  if (env.apiToken) {
    headers['Authorization'] = `Bearer ${env.apiToken}`
  }

  return apiFetch<EquityCurveApiResponse>(`/api/portfolio/history?${params.toString()}`, {
    headers,
  })
}

export function useEquityCurve() {
  const { data = EMPTY_EQUITY_CURVE_RESPONSE, isLoading } = useQuery({
    queryKey: ['equityCurve', EQUITY_CURVE_USER_ID, EQUITY_CURVE_PERIOD],
    queryFn: () => fetchEquityCurveHistory(EQUITY_CURVE_USER_ID, EQUITY_CURVE_PERIOD),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
    retry: 2,
  })

  return {
    data,
    loading: isLoading,
  }
}
