import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VenueUnavailableBanner } from "@/components/ui/VenueUnavailableBanner";
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
    kpiLoading?: boolean;
    venueUnavailable?: boolean;
};

export function PortfolioView({
    portfolio,
    loading,
    kpiLoading = false,
    venueUnavailable = false,
}: PortfolioViewProps) {
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
                {venueUnavailable && <VenueUnavailableBanner />}
                <KpiSection
                    kpis={portfolio?.kpis}
                    loading={loading || kpiLoading}
                    venueUnavailable={venueUnavailable}
                />
                {isNewUserNoTrades ? (
                    <SummaryPanelContainer limit={3} forceEmptyState />
                ) : (
                    <>
                        <ExposureSection portfolio={portfolio} loading={loading} venueUnavailable={venueUnavailable} />
                        <RiskSection portfolio={portfolio} loading={loading} venueUnavailable={venueUnavailable} />
                    </>
                )}
                <TradeHistorySection portfolio={portfolio} loading={loading} />
            </main>
        </>
    );
}