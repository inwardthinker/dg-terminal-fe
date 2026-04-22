// Portfolio service — all API calls live here, never inside components.
// Swap the mock in hooks.ts for these once the backend is ready.

import { apiFetch } from "@/lib/api/client";
import type { OpenPositionsSummary, PortfolioData } from "./types";

const PORTFOLIO_ENDPOINTS = {
  summary: "/portfolio/summary",
  openPositionsSummary: "/api/portfolio/open-positions-summary",
} as const;

/** Fetch the full portfolio snapshot for the authenticated user. */
export async function fetchPortfolio(): Promise<PortfolioData> {
  return apiFetch<PortfolioData>(PORTFOLIO_ENDPOINTS.summary);
}

/** Fetch open-positions summary for a specific wallet address. */
export async function fetchOpenPositionsSummary(
  walletAddress: string
): Promise<OpenPositionsSummary> {
  const params = new URLSearchParams({ wallet: walletAddress });
  return apiFetch<OpenPositionsSummary>(
    `${PORTFOLIO_ENDPOINTS.openPositionsSummary}?${params.toString()}`
  );
}
