// Portfolio service — all API calls live here, never inside components.
// Swap endpoint details when the backend contract is finalized.

import { apiFetch } from "@/lib/api/client";
import type { PortfolioData } from "../../types";

const PORTFOLIO_ENDPOINTS = {
  positions: "/api/portfolio/positions",
  closedPositions: "/api/portfolio/closed-positions",
} as const;

/** Fetch the full portfolio snapshot for a wallet address. */
export async function getPortfolio(walletAddress: string): Promise<PortfolioData> {
  const params = new URLSearchParams({ wallet: walletAddress });
  const authHeaders = { Authorization: "Bearer dev" };

  const [openPositions, closedPositions] = await Promise.all([
    apiFetch<unknown>(`${PORTFOLIO_ENDPOINTS.positions}?${params.toString()}`, {
      headers: authHeaders,
    }),
    apiFetch<unknown>(`${PORTFOLIO_ENDPOINTS.closedPositions}?${params.toString()}`, {
      headers: authHeaders,
    }),
  ]);

  // Backend contract is still evolving; keep strict UI shape guard.
  const maybePortfolio = {
    ...(typeof openPositions === "object" && openPositions !== null ? openPositions : {}),
    ...(typeof closedPositions === "object" && closedPositions !== null ? closedPositions : {}),
  };

  if (
    !("kpis" in maybePortfolio) ||
    !("exposure" in maybePortfolio) ||
    !("riskMetrics" in maybePortfolio) ||
    !("tradeHistory" in maybePortfolio)
  ) {
    throw new Error("Portfolio response shape is incomplete.");
  }

  return maybePortfolio as PortfolioData;
}
