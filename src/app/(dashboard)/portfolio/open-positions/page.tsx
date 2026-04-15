"use client"

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { mapKpisToCards } from '@/features/open-positions/utils/mapKpisToCards'
import { KpiCard } from '@/features/portfolio/components/KpiCard'
import React from 'react'


const kpis = {
    totalOpen: 12,
    totalExposure: 31640,
    unrealizedPnl: 1872,
    largestPositionValue: 5000,
    largestPositionPct: 8.4,
}

const page = () => {

    const cards = kpis ? mapKpisToCards(kpis) : []

    return (
        <div className="space-y-4">
            <Breadcrumb
                items={[
                    { label: "Profile", href: "/profile" },
                    { label: "Portfolio", href: "/portfolio" },
                    { label: "Open Positions" },
                ]}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {cards.map(({ id, ...rest }) => (
                    <KpiCard key={id} {...rest} />
                ))}

            </div>
        </div>
    )
}

export default page