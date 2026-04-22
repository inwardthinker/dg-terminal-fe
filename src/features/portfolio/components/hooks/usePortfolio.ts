"use client";

import { useEffect, useState } from "react";
import { getPortfolio } from "@/features/portfolio/components/api/getPortfolio";
import { MOCK_PORTFOLIO } from "@/features/portfolio/constants/mockPortfolio";
import type { PortfolioData, UsePortfolioResult } from "../../types";

export function usePortfolio(walletAddress = ""): UsePortfolioResult {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    let isMounted = true;

    async function loadPortfolio() {
      setLoading(true);

      try {
        const data = await getPortfolio(walletAddress);
        if (!isMounted) return;
        setPortfolio(data);
        setError(null);
      } catch {
        if (!isMounted) return;
        // Backend unreachable in dev — use mock so the UI stays deterministic.
        setPortfolio(MOCK_PORTFOLIO);
        setError(null);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    void loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, [walletAddress]);

  return { portfolio, loading, error };
}
