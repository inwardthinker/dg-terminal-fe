'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { Position, UsePositionsParams, UsePositionsResult } from '../types'
import { getOpenPositions, mapApiPositionToViewModel } from '../api/getOpenPositions'
import { ApiError } from '@/lib/api/client'

const REFRESH_INTERVAL_MS = 5_000
const STALE_TIME_MS = REFRESH_INTERVAL_MS
const GC_TIME_MS = 5 * 60_000

function normalizeWalletAddress(value?: string): string {
  return (value ?? '').trim().toLowerCase()
}

function resolveWalletAddress(userAddress?: string): string {
  if (userAddress && normalizeWalletAddress(userAddress).length > 0) {
    return normalizeWalletAddress(userAddress)
  }

  return normalizeWalletAddress(process.env.NEXT_PUBLIC_POSITIONS_SOCKET_USER_ADDRESS ?? '')
}

export function usePositions({
  limit,
  sortBy = 'pnl',
  userAddress,
}: UsePositionsParams = {}): UsePositionsResult {
  const wallet = resolveWalletAddress(userAddress)

  const query = useQuery({
    queryKey: ['open-positions', wallet],
    enabled: wallet.length > 0,
    queryFn: async () => {
      const response = await getOpenPositions({ userAddress: wallet })
      return response.map((position) => mapApiPositionToViewModel(position) as Position)
    },
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    placeholderData: keepPreviousData,
  })

  const allPositions = query.data
  const totalCount = allPositions?.length ?? 0

  const positions = useMemo(() => {
    if (!allPositions || allPositions.length === 0) return []
    let data = allPositions

    if (sortBy === 'pnl') {
      data = [...data].sort((a, b) => b.pnl - a.pnl)
    }

    if (limit && limit < data.length) {
      data = data === allPositions ? data.slice(0, limit) : data.slice(0, limit)
    }

    return data
  }, [allPositions, limit, sortBy])

  const error = useMemo<string | null>(() => {
    if (wallet.length === 0) return 'Wallet address is not configured'
    if (query.error instanceof ApiError) return `${query.error.status}: ${query.error.message}`
    if (query.error instanceof Error) return query.error.message
    return null
  }, [wallet, query.error])

  const connectionState = error
    ? 'disconnected'
    : query.isFetching && allPositions
      ? 'reconnecting'
      : 'connected'

  return {
    positions,
    totalCount,
    loading: query.isPending,
    error,
    connectionState,
  }
}
