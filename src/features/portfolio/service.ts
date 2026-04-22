// Portfolio service — all API calls live here, never inside components.
// Swap the mock in hooks.ts for these once the backend is ready.

import { apiFetch } from "@/lib/api/client";
import type {
  OpenPositionsSummary,
  OpenPositionsSummaryResponse,
  PortfolioData,
} from "./types";

const PORTFOLIO_ENDPOINTS = {
  summary: "/portfolio/summary",
  openPositionsSummary: "/api/portfolio/open-positions-summary",
} as const;

/** Fetch the full portfolio snapshot for the authenticated user. */
export async function fetchPortfolio(): Promise<PortfolioData> {
  return apiFetch<PortfolioData>(PORTFOLIO_ENDPOINTS.summary);
}

/** Fetch wallet-level open positions KPI summary. */
export async function fetchOpenPositionsSummary(
  walletAddress: string
): Promise<OpenPositionsSummary> {
  const searchParams = new URLSearchParams({ wallet: walletAddress });
  const payload = await apiFetch<OpenPositionsSummaryResponse>(
    `${PORTFOLIO_ENDPOINTS.openPositionsSummary}?${searchParams.toString()}`
  );

  return {
    openPositions: payload.open_positions,
    totalExposure: payload.total_exposure,
    largestPosition: payload.largest_position,
    unrealizedPnl: payload.unrealized_pnl,
  };
}
