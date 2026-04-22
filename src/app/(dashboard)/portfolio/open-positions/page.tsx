"use client"

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PositionsTableContainer } from '@/features/open-positions/components/PositionTableContainer'
import { useOpenPositionsSummary } from '@/features/open-positions/hooks/useOpenPositionsSummary'
import { mapKpisToCards } from '@/features/open-positions/utils/mapKpisToCards'
import { KpiCard } from '@/features/portfolio/components/KpiCard'
import React from 'react'

const OpenPositionsPage = () => {
    const { kpis, loading, error, walletAddress } = useOpenPositionsSummary();
    const cards = kpis ? mapKpisToCards(kpis) : []
    const loadingCards = [
        { id: "totalOpen", label: "Total Open" },
        { id: "totalExposure", label: "Total Exposure" },
        { id: "unrealizedPnl", label: "Total Unrealized P&L" },
        { id: "largestPosition", label: "Largest Position" },
    ];


    return (
        <div className="w-full space-y-4">
            <Breadcrumb
                items={[
                    { label: "Profile", href: "/profile" },
                    { label: "Portfolio", href: "/portfolio" },
                    { label: "Open Positions" },
                ]}
            />

            <div className="w-full px-sp5 sm:px-sp7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading && loadingCards.map(({ id, label }) => (
                        <KpiCard key={id} label={label} value="--" />
                    ))}
                    {!loading && cards.map(({ id, ...rest }) => (
                      <KpiCard key={id} {...rest} />
                    ))}
                    {!loading && !cards.length && loadingCards.map(({ id, label }) => (
                      <KpiCard key={id} label={label} value="--" />
                    ))}

                </div>
                {!loading && (
                  <p className={`text-support ${error ? "text-neg" : "text-t-3"}`}>
                    {error
                      ? error
                      : walletAddress
                        ? cards.length
                          ? "Live data from open-positions summary endpoint"
                          : "No open positions summary available for this wallet"
                        : "Set wallet env var to load open positions summary"}
                  </p>
                )}
                <PositionsTableContainer />
            </div>
        </div>
    )
}

export default OpenPositionsPage