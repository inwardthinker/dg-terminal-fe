"use client";

import { usePortfolio } from "@/features/portfolio/components/hooks/usePortfolio";
import { PortfolioView } from "@/features/portfolio/components/PortfolioView";

type PortfolioContainerProps = {
    userWalletAddress: string;
};

export default function PortfolioContainer({
    userWalletAddress,
}: PortfolioContainerProps) {
    const { portfolio, loading, kpiLoading, error } = usePortfolio(userWalletAddress);
    const venueUnavailable = Boolean(error);

    return (
        <PortfolioView
            portfolio={portfolio}
            loading={loading}
            kpiLoading={kpiLoading}
            walletAddress={userWalletAddress}
            venueUnavailable={venueUnavailable}
        />
    );
}
