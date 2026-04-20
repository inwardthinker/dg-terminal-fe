import { EquityCurvePanel } from "@/features/equity-curve/components/EquityCurvePanel";
import { ExposureCategoryPanel } from "@/features/portfolio/components/panels/ExposureCategoryPanel";
import type { PortfolioData } from "@/features/portfolio/types";

type ExposureSectionProps = {
    portfolio: PortfolioData | null;
    loading: boolean;
};

export function ExposureSection({ portfolio, loading }: ExposureSectionProps) {
    const hasHistory = (portfolio?.tradeHistory.length ?? 0) > 0;
    const exposure = portfolio?.exposure ?? [];

    return (
        <div className="grid min-w-0 gap-sp4 lg:grid-cols-[1.4fr_1fr]">
            {loading || hasHistory ? (
                <EquityCurvePanel />
            ) : (
                <div className="bg-bg-1/35 border border-line-c rounded-r7 p-sp5 flex flex-col gap-sp4">
                    <div className="text-primary-muted leading-none">Equity curve</div>
                    <div className="h-[180px] flex flex-col justify-center gap-sp3">
                        <div className="h-px w-full bg-[rgba(255,255,255,0.12)]" />
                        <div className="text-support text-center">No history yet</div>
                    </div>
                </div>
            )}
            <ExposureCategoryPanel exposure={exposure} loading={loading} />
        </div>
    );
}
