import { TradeHistoryPanel } from "@/features/portfolio/components/panels/TradeHistoryPanel";

type TradeHistorySectionProps = {
  walletAddress: string;
  loading: boolean;
};

export function TradeHistorySection({
  walletAddress,
  loading,
}: TradeHistorySectionProps) {
  return (
    <TradeHistoryPanel
      walletAddress={walletAddress}
      loading={loading}
    />
  );
}
