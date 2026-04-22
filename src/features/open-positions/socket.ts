"use client";

import { io, type Socket } from "socket.io-client";

import { env } from "@/lib/constants/env";

export type PositionPriceEvent = {
  position_id: string;
  outcome: string | null;
  title: string | null;
  no_of_shares: number | null;
  avg_price: number | null;
  current_price: number | null;
  position_value: number | null;
  pnl_amount: number | null;
  pnl_percent: number | null;
  stale: boolean;
};

type SocketErrorPayload = {
  message?: string;
};

export function isValidEvmAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function normalizeUserAddress(value: string): string {
  return value.trim().toLowerCase();
}

export function resolvePositionsPriceSocketUserAddress(explicitUserAddress?: string): string | null {
  const rawAddress =
    explicitUserAddress ??
    process.env.NEXT_PUBLIC_POSITIONS_SOCKET_USER_ADDRESS ??
    null;

  if (!rawAddress) {
    return null;
  }

  const normalizedAddress = normalizeUserAddress(rawAddress);
  return isValidEvmAddress(normalizedAddress) ? normalizedAddress : null;
}

export function connectPositionsPriceSocket(userAddress: string): Socket {
  const apiBaseUrl = env.apiBaseUrl.replace(/\/+$/, "");

  return io(`${apiBaseUrl}/positions-prices`, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    auth: { userAddress },
    withCredentials: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 16_000,
    randomizationFactor: 0,
    timeout: 10_000,
  });
}

export function parseSocketError(payload: unknown): string {
  if (typeof payload === "object" && payload !== null) {
    const typedPayload = payload as SocketErrorPayload;
    if (typedPayload.message) {
      return typedPayload.message;
    }
  }

  return "Failed to subscribe to position prices";
}
