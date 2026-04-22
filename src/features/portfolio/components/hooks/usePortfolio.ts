"use client";

import { useEffect, useState } from "react";
import { getPortfolio } from "@/features/portfolio/components/api/getPortfolio";
import {
  connectPortfolioKpiSocket,
  resolvePortfolioKpiSocketWalletAddress,
} from "@/features/portfolio/socket";
import type {
  PortfolioData,
  PortfolioKpiUpdateEvent,
  UsePortfolioResult,
} from "../../types";

function pickNumber(
  value: number | undefined,
  fallback: number | undefined
): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

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
    { name: "Sports", amount: 14200, pct: 45, color: "#4A90D9" },
    { name: "Politics", amount: 8400, pct: 27, color: "#4CAF7D" },
    { name: "Crypto", amount: 5600, pct: 18, color: "#E05C5C" },
    { name: "Macro", amount: 3440, pct: 11, color: "#CDBD70" },
    { name: "Tech", amount: 1200, pct: 4, color: "#B496DC" },
    { name: "Energy", amount: 800, pct: 3, color: "#3EC6C6" },
  ],
  riskMetrics: [
    {
      key: "sharpe",
      label: "Sharpe (90d)",
      value: "2.14",
      valueType: "positive",
      tooltip: "Mean daily return divided by standard deviation, annualized. Measures return per unit of total risk. Risk-free rate = 0.",
    },
    {
      key: "sortino",
      label: "Sortino",
      value: "3.02",
      valueType: "positive",
      tooltip: "Like Sharpe, but only penalizes downside volatility. A higher Sortino means fewer bad days relative to good ones.",
    },
    {
      key: "maxDrawdown",
      label: "Max drawdown",
      value: "-4.2%",
      valueType: "negative",
      tooltip: "The largest peak-to-trough drop in portfolio value over the last 90 days.",
    },
    {
      key: "var",
      label: "VaR (95%)",
      value: "$1,840",
      valueType: "neutral",
      tooltip: "Value at Risk: the maximum expected 1-day loss at 95% confidence, based on the last 90 days of returns.",
    },
    {
      key: "largestPosition",
      label: "Largest position",
      value: "8.4%",
      valueType: "neutral",
      tooltip: "Your biggest single open bet expressed as a percentage of your total balance.",
    },
    {
      key: "correlationCluster",
      label: "Correlation cluster",
      value: "3 watch",
      valueType: "gold",
      tooltip: "Open positions that share the same underlying event or theme, increasing concentrated exposure.",
    },
  ],
  tradeHistory: [
    // ── Last 7 days (Apr 10–16) ──
    { id: "t1", date: "Apr 16", isoDate: "2026-04-16", market: "Lakers vs Warriors · Game 3", side: "YES", entry: 0.38, exit: 1.00, size: 1800, result: "WON", pnl: 2916, settlementDate: "Apr 17", closeType: "settlement", rewardsEarned: 145, venue: "Polymarket", feePaid: 18 },
    { id: "t2", date: "Apr 15", isoDate: "2026-04-15", market: "ECB rate decision — hold", side: "YES", entry: 0.72, exit: 0.00, size: 900, result: "LOST", pnl: -900, settlementDate: "Apr 16", closeType: "settlement", venue: "Polymarket", feePaid: 9 },
    { id: "t3", date: "Apr 14", isoDate: "2026-04-14", market: "US CPI below 2.8% March", side: "NO", entry: 0.29, exit: 0.00, size: 1200, result: "WON", pnl: 854, settlementDate: "Apr 15", closeType: "settlement", rewardsEarned: 62, isMarketLive: true, venue: "Polymarket", feePaid: 12 },
    { id: "t4", date: "Apr 12", isoDate: "2026-04-12", market: "Arsenal win FA Cup 2026", side: "YES", entry: 0.54, exit: 1.00, size: 2400, result: "WON", pnl: 1080, settlementDate: "Apr 13", closeType: "settlement", rewardsEarned: 84, isMarketLive: true, venue: "Polymarket", feePaid: 24 },
    { id: "t5", date: "Apr 11", isoDate: "2026-04-11", market: "ETH flips BTC market cap", side: "NO", entry: 0.11, exit: 0.00, size: 500, result: "WON", pnl: 391, settlementDate: "Apr 12", closeType: "settlement", venue: "Polymarket", feePaid: 5 },
    { id: "t6", date: "Apr 10", isoDate: "2026-04-10", market: "Trump tariffs extended 90d", side: "YES", entry: 0.61, exit: 0.00, size: 700, result: "LOST", pnl: -700, settlementDate: "Apr 11", closeType: "settlement", venue: "Polymarket", feePaid: 7 },
    // ── 8–30 days ago (Mar 17–Apr 9) ──
    { id: "t7", date: "Apr 9", isoDate: "2026-04-09", market: "NBA East · Celtics win series", side: "YES", entry: 0.42, exit: 1.00, size: 2000, result: "WON", pnl: 2762, settlementDate: "Apr 10", closeType: "settlement", rewardsEarned: 210, venue: "Polymarket", feePaid: 10 },
    { id: "t8", date: "Apr 7", isoDate: "2026-04-07", market: "Fed rate cut April", side: "NO", entry: 0.31, exit: 0.00, size: 1500, result: "WON", pnl: 1068, settlementDate: "Apr 8", closeType: "settlement", rewardsEarned: 78, venue: "Polymarket", feePaid: 15 },
    { id: "t9", date: "Apr 5", isoDate: "2026-04-05", market: "Macron confidence vote", side: "YES", entry: 0.68, exit: 0.00, size: 800, result: "LOST", pnl: -800, settlementDate: "Apr 6", closeType: "settlement", venue: "Polymarket", feePaid: 8 },
    { id: "t10", date: "Apr 3", isoDate: "2026-04-03", market: "RM wins UCL semi-final", side: "YES", entry: 0.55, exit: 1.00, size: 1200, result: "WON", pnl: 540, settlementDate: "Apr 4", closeType: "settlement", rewardsEarned: 41, venue: "Polymarket", feePaid: 12 },
    { id: "t11", date: "Apr 1", isoDate: "2026-04-01", market: "BTC above $100k by April", side: "YES", entry: 0.48, exit: 0.00, size: 600, result: "LOST", pnl: -600, settlementDate: "Apr 2", closeType: "settlement", venue: "Polymarket", feePaid: 6 },
    { id: "t12", date: "Mar 30", isoDate: "2026-03-30", market: "SNL election — incumbent wins", side: "NO", entry: 0.44, exit: 0.50, size: 1000, result: "PUSHED", pnl: 0, settlementDate: "Mar 31", closeType: "manual", isMarketLive: true, venue: "Polymarket", feePaid: 0 },
    // NOTE: Mock rows below intentionally omit settlementDate/closeType to exercise modal fallbacks until real API data is wired.
    { id: "t13", date: "Mar 28", isoDate: "2026-03-28", market: "SpaceX Starship orbital 2026 Q1", side: "YES", entry: 0.62, exit: 1.00, size: 2200, result: "WON", pnl: 836 },
    { id: "t14", date: "Mar 25", isoDate: "2026-03-25", market: "Apple WWDC keynote — Vision 2", side: "NO", entry: 0.19, exit: 0.00, size: 400, result: "WON", pnl: 325 },
    { id: "t15", date: "Mar 22", isoDate: "2026-03-22", market: "Gold above $3200 by March end", side: "YES", entry: 0.57, exit: 1.00, size: 1600, result: "WON", pnl: 686 },
    { id: "t16", date: "Mar 19", isoDate: "2026-03-19", market: "Nvidia Q1 beats EPS estimate", side: "YES", entry: 0.71, exit: 0.00, size: 900, result: "LOST", pnl: -900 },
    { id: "t17", date: "Mar 17", isoDate: "2026-03-17", market: "Man City win Premier League title", side: "NO", entry: 0.35, exit: 0.00, size: 1100, result: "WON", pnl: 715 },
    // ── 31–90 days ago (Jan 16–Mar 16) ──
    { id: "t18", date: "Mar 14", isoDate: "2026-03-14", market: "US unemployment below 4.5%", side: "YES", entry: 0.66, exit: 1.00, size: 1300, result: "WON", pnl: 442 },
    { id: "t19", date: "Mar 10", isoDate: "2026-03-10", market: "OPEC cuts output Q2 2026", side: "NO", entry: 0.27, exit: 0.00, size: 750, result: "WON", pnl: 547 },
    { id: "t20", date: "Mar 5", isoDate: "2026-03-05", market: "DJT approval above 50% March", side: "NO", entry: 0.38, exit: 0.00, size: 950, result: "WON", pnl: 617 },
    { id: "t21", date: "Feb 28", isoDate: "2026-02-28", market: "Super Bowl LX — Chiefs win", side: "YES", entry: 0.53, exit: 0.00, size: 3000, result: "LOST", pnl: -3000 },
    { id: "t22", date: "Feb 20", isoDate: "2026-02-20", market: "Tesla FSD Level 4 approved 2026", side: "NO", entry: 0.14, exit: 0.00, size: 300, result: "WON", pnl: 259 },
    { id: "t23", date: "Feb 14", isoDate: "2026-02-14", market: "Fed pivots — rate cut March", side: "YES", entry: 0.41, exit: 1.00, size: 1700, result: "WON", pnl: 2146 },
    { id: "t24", date: "Feb 7", isoDate: "2026-02-07", market: "Zelensky peace deal signed Q1", side: "NO", entry: 0.23, exit: 0.00, size: 600, result: "WON", pnl: 461 },
    { id: "t25", date: "Jan 30", isoDate: "2026-01-30", market: "S&P 500 new ATH by Jan end", side: "YES", entry: 0.59, exit: 0.00, size: 1400, result: "LOST", pnl: -1400 },
    { id: "t26", date: "Jan 22", isoDate: "2026-01-22", market: "OpenAI GPT-5 released Q1 2026", side: "YES", entry: 0.74, exit: 1.00, size: 1100, result: "WON", pnl: 286 },
    { id: "t27", date: "Jan 16", isoDate: "2026-01-16", market: "Bitcoin above $120k Jan 2026", side: "YES", entry: 0.49, exit: 0.00, size: 2500, result: "LOST", pnl: -2500 },
    // ── Older (before 90 days) ──
    { id: "t28", date: "Jan 8", isoDate: "2026-01-08", market: "Apple Q4 revenue beats $110B", side: "YES", entry: 0.63, exit: 1.00, size: 1800, result: "WON", pnl: 666 },
    { id: "t29", date: "Dec 28", isoDate: "2025-12-28", market: "US PCE inflation Dec 2025 < 2.5%", side: "NO", entry: 0.33, exit: 0.00, size: 850, result: "WON", pnl: 568 },
    { id: "t30", date: "Dec 15", isoDate: "2025-12-15", market: "Fed holds rates Dec meeting", side: "YES", entry: 0.77, exit: 1.00, size: 2100, result: "WON", pnl: 483 },
  ],
  tradeHistoryTotal: 30,
};

export function usePortfolio(walletAddress = ""): UsePortfolioResult {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const normalizedWalletAddress = walletAddress.trim();

    async function loadPortfolio() {
      if (normalizedWalletAddress.length === 0) {
        setPortfolio(MOCK_PORTFOLIO);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getPortfolio(normalizedWalletAddress);
        if (!isMounted) return;
        setPortfolio(data);
        setError(null);
      } catch {
        if (!isMounted) return;
        // Local fallback keeps UI deterministic until backend endpoints are ready.
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

  useEffect(() => {
    const resolvedWalletAddress =
      resolvePortfolioKpiSocketWalletAddress(walletAddress);
    if (!resolvedWalletAddress) {
      return;
    }

    const socket = connectPortfolioKpiSocket(resolvedWalletAddress);

    const handleKpiUpdate = ({ wallet, kpis }: PortfolioKpiUpdateEvent) => {
      if (wallet.trim().toLowerCase() !== resolvedWalletAddress) {
        return;
      }

      setPortfolio((current) => {
        const base = current ?? MOCK_PORTFOLIO;

        return {
          ...base,
          kpis: {
            ...base.kpis,
            balance: pickNumber(kpis.balance, base.kpis.balance) ?? 0,
            openExposure: pickNumber(kpis.open_exposure, base.kpis.openExposure),
            deployedPct: pickNumber(kpis.pc_exposure, base.kpis.deployedPct),
            unrealizedPnl: pickNumber(kpis.unrealized_pnl, base.kpis.unrealizedPnl),
            unrealizedPct: pickNumber(kpis.un_pnl_pc, base.kpis.unrealizedPct),
            realized30d: pickNumber(kpis.realized_30d, base.kpis.realized30d),
            trades30d: pickNumber(kpis.num_trades, base.kpis.trades30d),
            rewardsEarned: pickNumber(kpis.rewards_earned, base.kpis.rewardsEarned),
            rewardsPct: pickNumber(kpis.reward_pc, base.kpis.rewardsPct),
          },
        };
      });
    };

    socket.on("kpi_update", handleKpiUpdate);
    socket.on("connect_error", () => {
      // Keep REST-loaded values when live KPI stream is unavailable.
    });
    socket.connect();

    return () => {
      socket.off("kpi_update", handleKpiUpdate);
      socket.disconnect();
    };
  }, [walletAddress]);
  return { portfolio, loading, error };
}
