// Portfolio service — all API calls live here, never inside components.
// Swap the mock in hooks.ts for these once the backend is ready.

import { apiFetch } from "@/lib/api/client";
import type { PortfolioData } from "./types";

const PORTFOLIO_ENDPOINTS = {
  summary: "/portfolio/summary",
} as const;

/** Fetch the full portfolio snapshot for the authenticated user. */
export async function fetchPortfolio(): Promise<PortfolioData> {
  return apiFetch<PortfolioData>(PORTFOLIO_ENDPOINTS.summary);
}
