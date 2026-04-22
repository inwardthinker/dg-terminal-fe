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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Fetch the portfolio summary for a wallet address directly from the backend. */
export async function getPortfolio(walletAddress: string): Promise<PortfolioData> {
  const params = new URLSearchParams({ walletAddress });
  const headers: Record<string, string> = {};
  if (env.apiToken) {
    headers["Authorization"] = `Bearer ${env.apiToken}`;
  }

  const [summaryResult] = await Promise.allSettled([
    apiFetch<ApiPortfolioResponse>(
      `${API_ENDPOINTS.portfolio.summary}?${params.toString()}`,
      { headers }
    ),
  ]);

  const summaryData =
    summaryResult.status === "fulfilled" && isRecord(summaryResult.value)
      ? (summaryResult.value as ApiPortfolioResponse).summary
      : null;

  if (!summaryData) {
    throw new Error("Portfolio summary unavailable.");
  }

  return {
    kpis: {
      balance:        summaryData.balance,
      openExposure:   summaryData.open_exposure,
      deployedPct:    summaryData.deployment_rate_pct,
      unrealizedPnl:  summaryData.unrealized_pnl,
      realized30d:    summaryData.realized_30d,
      rewardsEarned:  summaryData.rewards_earned,
      rewardsPct:     summaryData.rewards_pct_of_pnl,
    },
    // Exposure, risk metrics, and trade history come from dedicated
    // endpoints that will be wired separately — fall back to mock until then.
    exposure:          MOCK_PORTFOLIO.exposure,
    riskMetrics:       MOCK_PORTFOLIO.riskMetrics,
    tradeHistory:      MOCK_PORTFOLIO.tradeHistory,
    tradeHistoryTotal: MOCK_PORTFOLIO.tradeHistoryTotal,
  };
}
