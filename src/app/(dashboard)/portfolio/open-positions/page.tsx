"use client"

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PositionsTableContainer } from '@/features/open-positions/components/PositionTableContainer'
import { useOpenPositionsSummary } from '@/features/open-positions/hooks/useOpenPositionsSummary'
import { mapKpisToCards } from '@/features/open-positions/utils/mapKpisToCards'
import { KpiCard } from '@/features/portfolio/components/cards/KpiCard'
import { usePositions } from '@/features/open-positions/hooks/usePositions'
import React, { Suspense } from 'react'

const Page = () => {
    const { positions, loading, error } = usePositions({ realtimeOnly: true })
    const {
        kpis: summaryKpis,
        loading: summaryLoading,
        error: summaryError,
        walletAddress,
    } = useOpenPositionsSummary()
    const cards = summaryKpis ? mapKpisToCards(summaryKpis, Boolean(summaryError)) : []

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
                    {summaryLoading && (
                        <>
                            <KpiCard label="Total Open" value="--" />
                            <KpiCard label="Total Exposure" value="--" />
                            <KpiCard label="Total Unrealized P&L" value="--" />
                            <KpiCard label="Largest Position" value="--" />
                        </>
                    )}
                    {!summaryLoading && cards.map(({ id, ...rest }) => (
                        <KpiCard key={id} {...rest} />
                    ))}
                    {!summaryLoading && cards.length === 0 && (
                        <>
                            <KpiCard label="Total Open" value="--" />
                            <KpiCard label="Total Exposure" value="--" />
                            <KpiCard label="Total Unrealized P&L" value="--" />
                            <KpiCard label="Largest Position" value="--" />
                        </>
                    )}

                </div>
                {!summaryLoading && (
                    <p className={`text-support ${summaryError ? "text-neg" : "text-t-3"}`}>
                        {summaryError
                            ? summaryError
                            : walletAddress
                                ? "Live data from open-positions summary endpoint"
                                : "Wallet address is not configured"}
                    </p>
                )}
                <Suspense fallback={null}>
                    <PositionsTableContainer
                        positions={positions}
                        loading={loading}
                        error={error}
                    />
                </Suspense>
            </div>
        </div>
    )
}

export default Page
