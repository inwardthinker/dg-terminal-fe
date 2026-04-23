'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { Position, UsePositionsParams, UsePositionsResult } from '../types'
import { getOpenPositions, mapApiPositionToViewModel } from '../api/getOpenPositions'
import { ApiError } from '@/lib/api/client'

const REFRESH_INTERVAL_MS = 5_000

function normalizeWalletAddress(value?: string): string {
  return (value ?? '').trim().toLowerCase()
}

function resolveWalletAddress(userAddress?: string): string {
  if (userAddress && normalizeWalletAddress(userAddress).length > 0) {
    return normalizeWalletAddress(userAddress)
  }

  return normalizeWalletAddress(
    process.env.NEXT_PUBLIC_PORTFOLIO_KPIS_SOCKET_WALLET_ADDRESS ??
      process.env.NEXT_PUBLIC_POSITIONS_SOCKET_USER_ADDRESS ??
      process.env.NEXT_PUBLIC_PORTFOLIO_KPI_WALLET_ADDRESS ??
      '',
  )
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
    staleTime: 4_000,
  })

  const allPositions = useMemo(() => query.data ?? [], [query.data])
  const totalCount = allPositions.length

  const positions = useMemo(() => {
    let data = [...allPositions]

    if (sortBy === 'pnl') {
      data.sort((a, b) => b.pnl - a.pnl)
    }

    if (limit) {
      data = data.slice(0, limit)
    }

    return data
  }, [allPositions, limit, sortBy])

  let error: string | null = null
  if (wallet.length === 0) {
    error = 'Wallet address is not configured'
  } else if (query.error instanceof ApiError) {
    error = `${query.error.status}: ${query.error.message}`
  } else if (query.error instanceof Error) {
    error = query.error.message
  }

  const connectionState =
    error || query.isError
      ? 'disconnected'
      : query.isFetching && query.data
        ? 'reconnecting'
        : 'connected'

  return {
    positions,
    totalCount,
    loading: query.isLoading,
    error,
    connectionState,
  }
}
