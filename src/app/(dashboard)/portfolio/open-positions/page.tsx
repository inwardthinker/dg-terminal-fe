"use client"

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PositionsTableContainer } from '@/features/open-positions/components/PositionTableContainer'
import { OpenPositionsSummaryKpis } from '@/features/open-positions/components/OpenPositionsSummaryKpis'
import { useOpenPositionsSummary } from '@/features/open-positions/hooks/useOpenPositionsSummary'
import React from 'react'

const OpenPositionsPage = () => {
    const { summary, loading, error } = useOpenPositionsSummary()

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
                <OpenPositionsSummaryKpis
                    summary={summary}
                    loading={loading}
                    error={error}
                />
                <PositionsTableContainer />
            </div>
        </div>
    )
}

export default OpenPositionsPage