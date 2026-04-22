import { TradeHistoryPanel } from "@/features/portfolio/components/panels/TradeHistoryPanel";
import type { PortfolioData } from "@/features/portfolio/types";

type TradeHistorySectionProps = {
  portfolio: PortfolioData | null;
  loading: boolean;
};

export function TradeHistorySection({
  portfolio,
  loading,
}: TradeHistorySectionProps) {
  return (
    <TradeHistoryPanel
      trades={portfolio?.tradeHistory ?? []}
      total={portfolio?.tradeHistoryTotal ?? 0}
      loading={loading}
    />
  );
}
