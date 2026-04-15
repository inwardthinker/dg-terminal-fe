"use client";

import { EquityCurvePanel } from "@/features/equity-curve/EquityCurvePanel";
import { SummaryPanelContainer } from "@/features/open-positions";
import { usePortfolio } from "@/features/portfolio/hooks";
import { KpiTile } from "@/features/portfolio/components/KpiTile";
import { ExposureCategoryPanel } from "@/features/portfolio/components/ExposureCategoryPanel";
import { RiskMetricsPanel } from "@/features/portfolio/components/RiskMetricsPanel";
import { TradeHistoryPanel } from "@/features/portfolio/components/TradeHistoryPanel";
import { PortfolioTopBar } from "@/features/portfolio/components/PortfolioTopBar";

// Formatting helpers — pure functions, never depend on component state
const fmtBalance = (n: number) => `$${n.toLocaleString("en-US")}`;
const fmtSigned  = (n: number) =>
  `${n >= 0 ? "+" : ""}$${Math.abs(n).toLocaleString("en-US")}`;
const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export default function PortfolioPage() {
  const { portfolio, loading } = usePortfolio();
  const kpis = portfolio?.kpis;

  return (
    <div className="min-h-screen bg-bg-0 flex flex-col">
      {/* ── Top bar ── */}
      <PortfolioTopBar kpis={kpis} loading={loading} />

      {/* ── Breadcrumb ── */}
      <div className="bg-bg-1 border-b border-[rgba(255,255,255,0.06)] h-8 flex items-center justify-between px-sp7 flex-shrink-0">
        <span className="text-[11px] text-t-3">
          Profile ›{" "}
          <span className="text-t-1 font-[600]">Portfolio</span>
        </span>
        <span className="text-[10px] text-[#3A3A3A] border border-line-c rounded-r2 px-[7px] py-[1px] font-mono">
          ⌘P to close
        </span>
      </div>

      {/* ── Page body ── */}
      <main className="px-sp7 py-[12px] flex flex-col gap-sp4 bg-bg-0">

        {/* KPI row — 5 equal columns */}
        <div className="grid grid-cols-5 gap-[6px]">

          {/* Balance */}
          <KpiTile
            label="Balance"
            value={kpis ? fmtBalance(kpis.balance) : "--"}
            sub={kpis ? `${fmtSigned(kpis.change24h)} (24h)` : "--"}
            subPositive={kpis ? kpis.change24h >= 0 : false}
            subNegative={kpis ? kpis.change24h < 0 : false}
            footer={
              <div className="flex gap-sp2">
                <button className="flex-1 py-[4px] bg-[rgba(205,189,112,0.14)] border border-[rgba(205,189,112,0.35)] rounded-r2 text-[8.5px] font-[700] text-g-3 text-center cursor-pointer hover:bg-[rgba(205,189,112,0.22)] transition-colors">
                  + Deposit
                </button>
                <button className="flex-1 py-[4px] bg-transparent border border-line-c rounded-r2 text-[8.5px] text-t-3 text-center cursor-pointer hover:text-t-2 transition-colors">
                  Withdraw
                </button>
              </div>
            }
          />

          {/* Open Exposure */}
          <KpiTile
            label="Open Exposure"
            value={kpis ? fmtBalance(kpis.openExposure) : "--"}
            sub={kpis ? `${kpis.deployedPct}% deployed` : "--"}
            tooltip="Total cost basis of all open positions. Capital currently at risk."
          />

          {/* Unrealized P&L */}
          <KpiTile
            label="Unrealized P&L"
            value={kpis ? fmtSigned(kpis.unrealizedPnl) : "--"}
            valueClass={
              kpis
                ? kpis.unrealizedPnl >= 0 ? "text-pos" : "text-neg"
                : undefined
            }
            sub={kpis ? fmtPct(kpis.unrealizedPct) : "--"}
            subPositive={kpis ? kpis.unrealizedPct >= 0 : false}
            subNegative={kpis ? kpis.unrealizedPct < 0 : false}
            tooltip="Mark-to-market gain or loss on open positions at current mid price."
          />

          {/* Realized 30D */}
          <KpiTile
            label="Realized 30D"
            value={kpis ? fmtSigned(kpis.realized30d) : "--"}
            valueClass={
              kpis
                ? kpis.realized30d >= 0 ? "text-pos" : "text-neg"
                : undefined
            }
            sub={kpis ? `${kpis.trades30d} trades` : "--"}
            tooltip="Settled profit and loss from trades closed in the last 30 calendar days."
          />

          {/* Rewards Earned */}
          <KpiTile
            label="Rewards Earned"
            value={kpis ? `$${kpis.rewardsEarned.toLocaleString("en-US")}` : "--"}
            valueClass="text-g-3"
            sub={kpis ? `${kpis.rewardsPct}% of P&L` : "--"}
            tooltip="Maker rebates and referral bonuses earned in the last 30 days."
          />
        </div>

        {/* Row 2: Equity curve (wider) + Exposure by category */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-sp4">
          <EquityCurvePanel />
          <ExposureCategoryPanel
            exposure={portfolio?.exposure ?? []}
            loading={loading}
          />
        </div>

        {/* Row 3: Risk metrics + Open positions */}
        <div className="grid grid-cols-[1fr_1.85fr] gap-sp4">
          <RiskMetricsPanel
            metrics={portfolio?.riskMetrics ?? []}
            loading={loading}
          />
          <SummaryPanelContainer limit={3} />
        </div>

        {/* Trade history (full width) */}
        <TradeHistoryPanel
          trades={portfolio?.tradeHistory ?? []}
          total={portfolio?.tradeHistoryTotal ?? 0}
          loading={loading}
        />
      </main>
    </div>
  );
}
