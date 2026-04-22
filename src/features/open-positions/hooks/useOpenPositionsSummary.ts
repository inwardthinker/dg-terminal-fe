"use client";

import { useEffect, useState } from "react";

import { fetchOpenPositionsSummary } from "@/features/portfolio/service";
import { resolvePortfolioKpiSocketWalletAddress } from "@/features/portfolio/socket";
import type { OpenPositionsSummary } from "@/features/portfolio/types";

type UseOpenPositionsSummaryResult = {
  summary: OpenPositionsSummary | null;
  loading: boolean;
  error: string | null;
};

export function useOpenPositionsSummary(
  walletAddress?: string
): UseOpenPositionsSummaryResult {
  const resolvedWalletAddress =
    resolvePortfolioKpiSocketWalletAddress(walletAddress);
  const [summary, setSummary] = useState<OpenPositionsSummary | null>(null);
  const [loading, setLoading] = useState(Boolean(resolvedWalletAddress));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resolvedWalletAddress) {
      setSummary(null);
      setError(null);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(null);

    fetchOpenPositionsSummary(resolvedWalletAddress)
      .then((payload) => {
        if (isCancelled) return;
        setSummary(payload);
      })
      .catch((requestError) => {
        if (isCancelled) return;
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Failed to load open positions summary";
        setError(message);
        setSummary(null);
      })
      .finally(() => {
        if (isCancelled) return;
        setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [resolvedWalletAddress]);

  return { summary, loading, error };
}
