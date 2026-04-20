// Portfolio service — all API calls live here, never inside components.
// Swap endpoint details when the backend contract is finalized.

import { apiFetch } from "@/lib/api/client";
import type { PortfolioData } from "../../types";

const PORTFOLIO_ENDPOINTS = {
  summary: "/portfolio/summary",
} as const;

/** Fetch the full portfolio snapshot for a wallet address. */
export async function getPortfolio(walletAddress: string): Promise<PortfolioData> {
  const params = new URLSearchParams({ walletAddress });
  return apiFetch<PortfolioData>(`${PORTFOLIO_ENDPOINTS.summary}?${params.toString()}`);
}
