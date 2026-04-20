"use client";

import { usePortfolio } from "@/features/portfolio/components/hooks/usePortfolio";
import { PortfolioView } from "@/features/portfolio/components/PortfolioView";
import type { PortfolioData } from "@/features/portfolio/types";

type PortfolioPreviewState = "live" | "newUserNoTrades" | "hasHistoryNoOpenPositions";
const PREVIEW_STATE: PortfolioPreviewState = "newUserNoTrades";

type PortfolioContainerProps = {
    userWalletAddress: string;
};

export default function PortfolioContainer({
    userWalletAddress,
}: PortfolioContainerProps) {
    const { portfolio, loading } = usePortfolio(userWalletAddress);

    const effectivePortfolio: PortfolioData | null = (() => {
        if (!portfolio) return portfolio;

        if (PREVIEW_STATE === "newUserNoTrades") {
            return {
                ...portfolio,
                kpis: {
                    balance: portfolio.kpis.balance,
                },
                exposure: [],
                riskMetrics: [],
                tradeHistory: [],
                tradeHistoryTotal: 0,
            };
        }

        if (PREVIEW_STATE === "hasHistoryNoOpenPositions") {
            return {
                ...portfolio,
                kpis: {
                    ...portfolio.kpis,
                    openCount: 0,
                    openExposure: 0,
                    deployedPct: 0,
                    unrealizedPnl: undefined,
                    unrealizedPct: undefined,
                },
            };
        }

        return portfolio;
    })();

    return <PortfolioView portfolio={effectivePortfolio} loading={loading} />;
}