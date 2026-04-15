"use client";

// To connect real data: replace the setTimeout block with a call to fetchPortfolio()
// from service.ts, and update the PortfolioData shape to match the API response.

import { useEffect, useState } from "react";
import type { PortfolioData, UsePortfolioResult } from "./types";

const MOCK_PORTFOLIO: PortfolioData = {
  kpis: {
    balance: 84210,
    change24h: 2140,
    openExposure: 31640,
    deployedPct: 38,
    unrealizedPnl: 1872,
    unrealizedPct: 5.9,
    realized30d: 6420,
    trades30d: 42,
    rewardsEarned: 1284,
    rewardsPct: 21,
    openCount: 12,
    todayPnl: 340,
    portfolioPct: 5.9,
  },
  exposure: [
    { name: "Sports",   amount: 14200, pct: 45, color: "#4A90D9" },
    { name: "Politics", amount: 8400,  pct: 27, color: "#4CAF7D" },
    { name: "Crypto",   amount: 5600,  pct: 18, color: "#E05C5C" },
    { name: "Macro",    amount: 3440,  pct: 11, color: "#CDBD70" },
    { name: "Tech",     amount: 1200,  pct: 4,  color: "#B496DC" },
    { name: "Energy",   amount: 800,   pct: 3,  color: "#3EC6C6" },
  ],
  riskMetrics: [
    {
      key: "sharpe",
      label: "Sharpe (90d)",
      value: "2.14",
      valueType: "positive",
      tooltip: "Risk-adjusted return. Above 1 is healthy.",
    },
    {
      key: "sortino",
      label: "Sortino",
      value: "3.02",
      valueType: "positive",
      tooltip: "Like Sharpe but only penalises downside volatility.",
    },
    {
      key: "maxDrawdown",
      label: "Max drawdown",
      value: "-4.2%",
      valueType: "negative",
      tooltip: "Largest peak-to-trough decline in portfolio equity.",
    },
    {
      key: "var",
      label: "VaR (95%)",
      value: "$1,840",
      valueType: "neutral",
      tooltip: "Maximum expected loss in a single day at 95% confidence.",
    },
    {
      key: "largestPosition",
      label: "Largest position",
      value: "8.4%",
      valueType: "neutral",
      tooltip: "Largest single position as % of total balance.",
    },
    {
      key: "correlationCluster",
      label: "Correlation cluster",
      value: "3 watch",
      valueType: "gold",
      tooltip: "Groups of positions that may move together, amplifying risk.",
    },
  ],
  tradeHistory: [
    {
      id: "t1",
      date: "Apr 7",
      market: "NBA East · Celtics win series",
      side: "YES",
      entry: 0.42,
      exit: 1.0,
      size: 2000,
      result: "WON",
      pnl: 2762,
    },
    {
      id: "t2",
      date: "Apr 5",
      market: "Fed rate cut March",
      side: "NO",
      entry: 0.31,
      exit: 0.0,
      size: 1500,
      result: "WON",
      pnl: 1068,
    },
    {
      id: "t3",
      date: "Apr 3",
      market: "Macron confidence vote",
      side: "YES",
      entry: 0.68,
      exit: 0.0,
      size: 800,
      result: "LOST",
      pnl: -800,
    },
    {
      id: "t4",
      date: "Apr 1",
      market: "RM wins UCL semi-final",
      side: "YES",
      entry: 0.55,
      exit: 1.0,
      size: 1200,
      result: "WON",
      pnl: 540,
    },
    {
      id: "t5",
      date: "Mar 29",
      market: "BTC above $100k by April",
      side: "YES",
      entry: 0.48,
      exit: 0.0,
      size: 600,
      result: "LOST",
      pnl: -600,
    },
  ],
  tradeHistoryTotal: 84,
};

export function usePortfolio(): UsePortfolioResult {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setPortfolio(MOCK_PORTFOLIO);
      setLoading(false);
      setError(null);
    }, 500);

    return () => window.clearTimeout(id);
  }, []);

  return { portfolio, loading, error };
}
