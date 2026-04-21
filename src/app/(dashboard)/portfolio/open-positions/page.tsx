"use client"

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PositionsTableContainer } from '@/features/open-positions/components/PositionTableContainer'
import { mapKpisToCards } from '@/features/open-positions/utils/mapKpisToCards'
import { KpiCard } from '@/features/portfolio/components/cards/KpiCard'
import { isVenueApiUnavailablePreview } from '@/features/portfolio/constants/previewState'
import { usePositions } from '@/features/open-positions/hooks/usePositions'
import React, { Suspense, useMemo } from 'react'

const Page = () => {
    const { positions, error } = usePositions({ realtimeOnly: true })
    const venueUnavailable = isVenueApiUnavailablePreview || Boolean(error)
    const kpis = useMemo(() => {
        const totalOpen = positions.length
        const totalExposure = positions.reduce((sum, position) => sum + position.size, 0)
        const unrealizedPnl = positions.reduce((sum, position) => sum + position.pnl, 0)
        const largestPositionValue = positions.reduce(
            (max, position) => Math.max(max, position.size),
            0
        )
        const largestPositionPct = totalExposure > 0 ? (largestPositionValue / totalExposure) * 100 : 0

        return {
            totalOpen,
            totalExposure,
            unrealizedPnl,
            largestPositionValue,
            largestPositionPct,
        }
    }, [positions])

    const cards = mapKpisToCards(kpis, venueUnavailable)

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
                    {cards.map(({ id, ...rest }) => (
                        <KpiCard key={`${id}-${positions[0]?.liveTick ?? 0}`} {...rest} />
                    ))}

                </div>
                <Suspense fallback={null}>
                    <PositionsTableContainer />
                </Suspense>
            </div>
        </div>
    )
}

export default Page