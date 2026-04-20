"use client";

import { EquityCurvePanel } from "@/features/equity-curve/components/EquityCurvePanel";
import { SummaryPanelContainer } from "@/features/open-positions";
import { usePortfolio } from "@/features/portfolio/hooks";
import { KpiCard } from "@/features/portfolio/components/KpiCard";
import { ExposureCategoryPanel } from "@/features/portfolio/components/ExposureCategoryPanel";
import { RiskMetricsPanel } from "@/features/portfolio/components/RiskMetricsPanel";
import { TradeHistoryPanel } from "@/features/portfolio/components/TradeHistoryPanel";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";

// Formatting helpers — pure functions, never depend on component state
const fmtBalance = (n: number) => `$${n.toLocaleString("en-US")}`;
const fmtSigned = (n: number) =>
  `${n >= 0 ? "+" : ""}$${Math.abs(n).toLocaleString("en-US")}`;
const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

function safeValue<T>(value: T | undefined, formatter: (v: T) => string) {
  return value !== undefined ? formatter(value) : "--"
}

function getVariant(value?: number) {
  if (value === undefined) return "default"
  if (value > 0) return "positive"
  if (value < 0) return "negative"
  return "default"
}

export default function PortfolioPage() {
  const { portfolio, loading } = usePortfolio();
  const kpis = portfolio?.kpis;


  return (
    <>
      {/* ── Breadcrumb ── */}
      <Breadcrumb
        items={[
          { label: "Profile" },
          { label: "Portfolio" },
        ]}
      />


      {/* ── Page body ── */}
      <main className="flex min-w-0 max-w-full flex-col gap-sp4 overflow-x-hidden bg-bg-0 px-sp5 py-sp4 sm:px-sp7">

        {/* KPI row — mobile: 2-tile row + 3-tile row; md+: 3 cols; lg+: 5 */}
        <div className="grid max-md:grid-cols-6 gap-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Balance */}
          <div className="h-full max-md:order-1 max-md:col-span-3 md:col-span-1">
            <KpiCard
              label="Balance"
              value={safeValue(kpis?.balance, fmtBalance)}
              sub={safeValue(kpis?.change24h, fmtSigned)}
              subVariant={getVariant(kpis?.change24h)}
              footer={
                <div className="flex gap-sp2">
                  <Button variant="accent" size="sm" className="flex-1">
                    Deposit
                  </Button>
                  <Button variant="muted" size="sm" className="flex-1">
                    Withdraw
                  </Button>
                </div>
              }
            />
          </div>

          {/* Open Exposure */}
          <div className="h-full max-md:order-3 max-md:col-span-2 md:col-span-1">
            <KpiCard
              label="Open Exposure"
              value={safeValue(kpis?.openExposure, fmtBalance)}
              sub={safeValue(kpis?.deployedPct, fmtPct)}
              tooltip="Total cost basis of all open positions. Capital currently at risk."
            />
          </div>

          {/* Unrealized P&L */}
          <div className="h-full max-md:order-2 max-md:col-span-3 md:col-span-1">
            <KpiCard
              label="Unrealized P&L"
              value={safeValue(kpis?.unrealizedPnl, fmtSigned)}
              valueVariant={getVariant(kpis?.unrealizedPnl)}
              sub={safeValue(kpis?.unrealizedPct, fmtPct)}
              subVariant={getVariant(kpis?.unrealizedPct)}
              tooltip="Mark-to-market gain or loss on open positions at current mid price."
            />
          </div>

          {/* Realized 30D */}
          <div className="h-full max-md:order-4 max-md:col-span-2 md:col-span-1">
            <KpiCard
              label="Realized 30D"
              value={safeValue(kpis?.realized30d, fmtSigned)}
              valueVariant={getVariant(kpis?.realized30d)}
              sub={safeValue(kpis?.trades30d, (value) => `${value} trades`)}
              tooltip="Settled profit and loss from trades closed in the last 30 calendar days."
            />
          </div>

          {/* Rewards Earned */}
          <div className="h-full max-md:order-5 max-md:col-span-2 md:col-span-1">
            <KpiCard
              label="Rewards Earned"
              value={safeValue(kpis?.rewardsEarned, (value) => `$${value.toLocaleString("en-US")}`)}
              valueVariant="accent"
              sub={safeValue(kpis?.rewardsPct, (value) => `${value}% of P&L`)}
              tooltip="Maker rebates and referral bonuses earned in the last 30 days."
            />
          </div>
        </div>

        {/* Row 2: Equity curve + Exposure — single column below lg */}
        <div className="grid min-w-0 gap-sp4 lg:grid-cols-[1.4fr_1fr]">
          <EquityCurvePanel />
          <ExposureCategoryPanel
            exposure={portfolio?.exposure ?? []}
            loading={loading}
          />
        </div>

        {/* Row 3: Risk metrics + Open positions — single column below lg */}
        <div className="grid min-w-0 gap-sp4 lg:grid-cols-[1fr_1.85fr]">
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
    </>
  );
}
