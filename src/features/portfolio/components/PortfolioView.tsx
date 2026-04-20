import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SummaryPanelContainer } from "@/features/open-positions";
import type { PortfolioData } from "../types";
// import { PortfolioTopBar } from "./layout/PortfolioTopBar";
import { ExposureSection } from "./sections/ExposureSection";
import { KpiSection } from "./sections/KpiSection";
import { RiskSection } from "./sections/RiskSection";
import { TradeHistorySection } from "./sections/TradeHistorySection";

type PortfolioViewProps = {
    portfolio: PortfolioData | null;
    loading: boolean;
};

export function PortfolioView({ portfolio, loading }: PortfolioViewProps) {
    const isNewUserNoTrades =
        !loading &&
        (portfolio?.tradeHistory.length ?? 0) === 0 &&
        (portfolio?.tradeHistoryTotal ?? 0) === 0;

    return (
        <>
            {/* <PortfolioTopBar /> */}
            <Breadcrumb
                items={[
                    { label: "Profile" },
                    { label: "Portfolio" },
                ]}
            />
            <main className="flex min-w-0 max-w-full flex-col gap-sp4 overflow-x-hidden bg-bg-0 px-sp5 py-sp4 sm:px-sp7">
                <KpiSection kpis={portfolio?.kpis} loading={loading} />
                {isNewUserNoTrades ? (
                    <SummaryPanelContainer limit={3} forceEmptyState />
                ) : (
                    <>
                        <ExposureSection portfolio={portfolio} loading={loading} />
                        <RiskSection portfolio={portfolio} loading={loading} />
                    </>
                )}
                <TradeHistorySection portfolio={portfolio} loading={loading} />
            </main>
        </>
    );
}