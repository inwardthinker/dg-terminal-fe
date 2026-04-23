"use client";

import { useEffect, useState } from "react";
import { getPortfolio } from "@/features/portfolio/components/api/getPortfolio";
import { MOCK_PORTFOLIO } from "@/features/portfolio/constants/mockPortfolio";
import { ApiError } from "@/lib/api/client";
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
      } catch (err) {
        if (!isMounted) return;
        if (err instanceof ApiError) {
          // The server responded with an error (4xx / 5xx) — surface it so the
          // user knows something is wrong rather than silently showing stale data.
          setError(`${err.status}: ${err.message}`);
          setPortfolio(null);
        } else {
          // Network / CORS error — backend likely not running locally.
          // Fall back to mock so the UI stays usable during development.
          setPortfolio(MOCK_PORTFOLIO);
          setError(null);
        }
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
