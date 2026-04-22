"use client";

import { useEffect, useMemo, useState } from "react";

import { apiFetch } from "@/lib/api/client";
import type { ApiKpis } from "../types";

type OpenPositionsSummaryResponse = {
  open_positions: number;
  total_exposure: number;
  largest_position: number;
  unrealized_pnl: number;
};

type UseOpenPositionsSummaryResult = {
  kpis: ApiKpis | null;
  loading: boolean;
  error: string | null;
  walletAddress: string | null;
};

const REFRESH_INTERVAL_MS = 15_000;

function normalizeWalletAddress(value: string): string {
  return value.trim().toLowerCase();
}

function resolveWalletAddress(): string | null {
  const rawAddress =
    process.env.NEXT_PUBLIC_PORTFOLIO_KPI_WALLET_ADDRESS ??
    process.env.NEXT_PUBLIC_POSITIONS_SOCKET_USER_ADDRESS ??
    null;

  if (!rawAddress) {
    return null;
  }

  const normalized = normalizeWalletAddress(rawAddress);
  return /^0x[a-fA-F0-9]{40}$/.test(normalized) ? normalized : null;
}

function mapSummaryToKpis(summary: OpenPositionsSummaryResponse): ApiKpis {
  const largestPositionPct =
    summary.total_exposure > 0
      ? (summary.largest_position / summary.total_exposure) * 100
      : 0;

  return {
    totalOpen: summary.open_positions,
    totalExposure: summary.total_exposure,
    unrealizedPnl: summary.unrealized_pnl,
    largestPositionValue: summary.largest_position,
    largestPositionPct,
  };
}

export function useOpenPositionsSummary(): UseOpenPositionsSummaryResult {
  const walletAddress = useMemo(resolveWalletAddress, []);
  const [kpis, setKpis] = useState<ApiKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      if (!walletAddress) {
        setKpis(null);
        setError("Wallet address is not configured");
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({ wallet: walletAddress });
        const summary = await apiFetch<OpenPositionsSummaryResponse>(
          `/api/portfolio/open-positions-summary?${params.toString()}`
        );

        if (!active) {
          return;
        }

        setKpis(mapSummaryToKpis(summary));
        setError(null);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setKpis(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load open positions summary"
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSummary();
    const intervalId = window.setInterval(() => {
      void loadSummary();
    }, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [walletAddress]);

  return { kpis, loading, error, walletAddress };
}
