import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/features/portfolio/components/cards/KpiCard";
import type { PortfolioKpis } from "@/features/portfolio/types";
import {
  formatBalance,
  formatKpiFallback,
  formatRewardsShare,
  formatSignedCurrency,
  formatSignedPercent,
  getKpiVariant,
} from "@/features/portfolio/utils/formatters";

type KpiSectionProps = {
  kpis?: PortfolioKpis;
  loading?: boolean;
};

function KpiSkeletonTile() {
  return (
    <div className="h-full rounded-r6 px-sp5 py-sp4 border border-line-c bg-bg-1 animate-pulse">
      <div className="h-[10px] w-1/3 rounded-r1 bg-bg-2 mb-sp2" />
      <div className="h-[24px] w-1/2 rounded-r2 bg-bg-2 mb-sp2" />
      <div className="h-[12px] w-1/4 rounded-r1 bg-bg-2" />
    </div>
  );
}

export function KpiSection({ kpis, loading }: KpiSectionProps) {
  if (loading) {
    return (
      <div className="grid max-md:grid-cols-6 gap-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="h-full max-md:order-1 max-md:col-span-3 md:col-span-1">
          <KpiSkeletonTile />
        </div>
        <div className="h-full max-md:order-3 max-md:col-span-2 md:col-span-1">
          <KpiSkeletonTile />
        </div>
        <div className="h-full max-md:order-2 max-md:col-span-3 md:col-span-1">
          <KpiSkeletonTile />
        </div>
        <div className="h-full max-md:order-4 max-md:col-span-2 md:col-span-1">
          <KpiSkeletonTile />
        </div>
        <div className="h-full max-md:order-5 max-md:col-span-2 md:col-span-1">
          <KpiSkeletonTile />
        </div>
      </div>
    );
  }

  const isEmptyState =
    kpis?.openExposure === undefined &&
    kpis?.unrealizedPnl === undefined &&
    kpis?.realized30d === undefined &&
    kpis?.rewardsEarned === undefined;

  return (
    <div className="grid max-md:grid-cols-6 gap-2 md:grid-cols-3 lg:grid-cols-5">
      <div className="h-full max-md:order-1 max-md:col-span-3 md:col-span-1">
        <KpiCard
          label="Balance"
          value={formatKpiFallback(kpis?.balance, formatBalance)}
          sub={formatKpiFallback(kpis?.change24h, formatSignedCurrency)}
          subVariant={getKpiVariant(kpis?.change24h)}
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

      <div className="h-full max-md:order-3 max-md:col-span-2 md:col-span-1">
        <KpiCard
          label="Open Exposure"
          value={
            isEmptyState
              ? formatBalance(0)
              : formatKpiFallback(kpis?.openExposure, formatBalance)
          }
          sub={
            isEmptyState
              ? "0% deployed"
              : formatKpiFallback(kpis?.deployedPct, formatSignedPercent)
          }
          dimmed={isEmptyState}
          tooltip="Total cost basis of all open positions. Capital currently at risk."
        />
      </div>

      <div className="h-full max-md:order-2 max-md:col-span-3 md:col-span-1">
        <KpiCard
          label="Unrealized P&L"
          value={formatKpiFallback(kpis?.unrealizedPnl, formatSignedCurrency)}
          valueVariant={getKpiVariant(kpis?.unrealizedPnl)}
          sub={formatKpiFallback(kpis?.unrealizedPct, formatSignedPercent)}
          subVariant={getKpiVariant(kpis?.unrealizedPct)}
          dimmed={isEmptyState}
          tooltip="Mark-to-market gain or loss on open positions at current mid price."
        />
      </div>

      <div className="h-full max-md:order-4 max-md:col-span-2 md:col-span-1">
        <KpiCard
          label="Realized 30D"
          value={
            isEmptyState
              ? "--"
              : formatKpiFallback(kpis?.realized30d, formatSignedCurrency)
          }
          valueVariant={isEmptyState ? "default" : getKpiVariant(kpis?.realized30d)}
          sub={
            isEmptyState
              ? "0 trades"
              : formatKpiFallback(kpis?.trades30d, (value) => `${value} trades`)
          }
          dimmed={isEmptyState}
          tooltip="Settled profit and loss from trades closed in the last 30 calendar days."
        />
      </div>

      <div className="h-full max-md:order-5 max-md:col-span-2 md:col-span-1">
        <KpiCard
          label="Rewards Earned"
          value={
            isEmptyState
              ? formatBalance(0)
              : formatKpiFallback(kpis?.rewardsEarned, formatBalance)
          }
          valueVariant="accent"
          sub={formatKpiFallback(kpis?.rewardsPct, formatRewardsShare)}
          dimmed={isEmptyState}
          tooltip="Maker rebates and referral bonuses earned in the last 30 days."
        />
      </div>
    </div>
  );
}
