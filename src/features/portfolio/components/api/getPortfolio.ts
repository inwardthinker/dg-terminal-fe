// Portfolio service — calls the backend directly via apiFetch.
// No Next.js proxy route; NEXT_PUBLIC_API_BASE_URL is the backend origin.

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { env } from "@/lib/constants/env";
import { MOCK_PORTFOLIO } from "@/features/portfolio/constants/mockPortfolio";
import type { PortfolioData } from "../../types";

type ApiPortfolioSummary = {
  balance: number;
  open_exposure: number;
  unrealized_pnl: number;
  realized_30d: number;
  rewards_earned: number;
  rewards_pct_of_pnl: number;
  deployment_rate_pct: number;
};

type ApiPortfolioResponse = {
  summary: ApiPortfolioSummary;
};

/** Fetch the portfolio summary for a wallet address directly from the backend. */
export async function getPortfolio(walletAddress: string): Promise<PortfolioData> {
  const params = new URLSearchParams({ walletAddress });
  const headers: Record<string, string> = {};
  if (env.apiToken) {
    headers["Authorization"] = `Bearer ${env.apiToken}`;
  }

  const response = await apiFetch<ApiPortfolioResponse>(
    `${API_ENDPOINTS.portfolio.summary}?${params.toString()}`,
    { headers }
  );

  const s = response.summary;

  return {
    kpis: {
      balance:       s.balance,
      openExposure:  s.open_exposure,
      deployedPct:   s.deployment_rate_pct,
      unrealizedPnl: s.unrealized_pnl,
      realized30d:   s.realized_30d,
      rewardsEarned: s.rewards_earned,
      rewardsPct:    s.rewards_pct_of_pnl,
    },
    // Exposure, risk metrics, and trade history come from dedicated
    // endpoints that will be wired separately — fall back to mock until then.
    exposure:          MOCK_PORTFOLIO.exposure,
    riskMetrics:       MOCK_PORTFOLIO.riskMetrics,
    tradeHistory:      MOCK_PORTFOLIO.tradeHistory,
    tradeHistoryTotal: MOCK_PORTFOLIO.tradeHistoryTotal,
  };
}
