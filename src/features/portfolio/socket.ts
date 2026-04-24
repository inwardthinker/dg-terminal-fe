'use client'

import { io, type Socket } from 'socket.io-client'

import { env } from '@/lib/constants/env'

import type { PortfolioKpiSubscribedEvent, PortfolioKpiUpdateEvent } from './types'

export type PortfolioKpiSocketEvents = {
  subscribed: (payload: PortfolioKpiSubscribedEvent) => void
  kpi_update: (payload: PortfolioKpiUpdateEvent) => void
  connect_error: (error: Error) => void
  error: (payload: { message?: string }) => void
}

export function isValidEvmAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

export function normalizeWalletAddress(value: string): string {
  return value.trim().toLowerCase()
}

export function resolvePortfolioKpiSocketWalletAddress(
  explicitWalletAddress?: string,
): string | null {
  const rawAddress =
    explicitWalletAddress ?? process.env.NEXT_PUBLIC_POSITIONS_SOCKET_USER_ADDRESS ?? null

  if (!rawAddress) {
    return null
  }

  const normalized = normalizeWalletAddress(rawAddress)
  return isValidEvmAddress(normalized) ? normalized : null
}

export function connectPortfolioKpiSocket(walletAddress: string): Socket {
  const apiBaseUrl = env.apiBaseUrl || 'http://localhost:3000'

  return io(`${apiBaseUrl}/portfolio-kpis`, {
    transports: ['websocket'],
    auth: { walletAddress, userAddress: walletAddress },
    autoConnect: false,
  })
}
