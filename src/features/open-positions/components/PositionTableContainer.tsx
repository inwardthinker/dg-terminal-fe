// features/open-positions/components/PositionsTableContainer.tsx
"use client";


import { PositionsTableSkeleton } from "./PositionsTableSkeleton";
import { SummaryError } from "./SummaryError";
import type { Position } from "../types";
import { PositionsTable } from "./PositionsTable";
import { useMemo, useState } from "react";
import { PositionsFiltersBar } from "./PositionFiltersBar";
import { buildCategoryData } from "../utils/categoryExposure";
import { DotSeparator } from "@/components/ui/DotSeparator";
import { useModal } from "@/lib/modals/hooks/useModal";
import { Button } from "@/components/ui/Button";
import { VenueUnavailableBanner } from "@/components/ui/VenueUnavailableBanner";

type Category = Position["category"] | "All"

type PositionsTableContainerProps = {
    positions: Position[];
    loading: boolean;
    error: string | null;
}

export function PositionsTableContainer({ positions, loading, error }: PositionsTableContainerProps) {
    const { openModal } = useModal();
    const venueUnavailable = Boolean(error);
    const [selectedCategory, setSelectedCategory] = useState<Category>("All")
    const [selectedSide, setSelectedSide] = useState<"All" | "YES" | "NO">("All")
    const [sortBy, setSortBy] = useState<"pnl" | "size" | "entry" | "current">("pnl")
    const [selectedPositionIds, setSelectedPositionIds] = useState<Set<string>>(new Set())
    const [closingPositionIds, setClosingPositionIds] = useState<Set<string>>(new Set())
    const [closedPositionIds, setClosedPositionIds] = useState<Set<string>>(new Set())

    const scheduleRemovalAfterAnimation = (positionsToClose: Position[]) => {
        if (positionsToClose.length === 0) return

        const ids = positionsToClose.map((item) => item.id)

        setClosingPositionIds((prev) => {
            const next = new Set(prev)
            ids.forEach((id) => next.add(id))
            return next
        })

        window.setTimeout(() => {
            setClosedPositionIds((prev) => {
                const next = new Set(prev)
                ids.forEach((id) => next.add(id))
                return next
            })
            setClosingPositionIds((prev) => {
                const next = new Set(prev)
                ids.forEach((id) => next.delete(id))
                return next
            })
            setSelectedPositionIds((prev) => {
                const next = new Set(prev)
                ids.forEach((id) => next.delete(id))
                return next
            })
        }, 360)
    }

    const rankedCategoryData = useMemo(() => buildCategoryData(positions), [positions])

    const mappedPositions = useMemo(() => {
        return positions.map((position) => ({
            ...position,
            category: (rankedCategoryData.presentation[position.category]?.label ??
                position.category) as Position["category"],
        }))
    }, [positions, rankedCategoryData.presentation])

    const categoryData = useMemo(() => buildCategoryData(mappedPositions), [mappedPositions])

    const processedPositions = useMemo(() => {
        return mappedPositions
            .filter((p) => !closedPositionIds.has(p.id))
            .filter((p) => {
                const categoryMatch =
                    selectedCategory === "All" || p.category === selectedCategory
                const sideMatch = selectedSide === "All" || p.side === selectedSide
                return categoryMatch && sideMatch
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "pnl":
                        return b.pnl - a.pnl
                    case "size":
                        return b.size - a.size
                    case "entry":
                        return b.entryPrice - a.entryPrice
                    case "current":
                        return b.currentPrice - a.currentPrice
                    default:
                        return 0
                }
            })
    }, [mappedPositions, closedPositionIds, selectedCategory, selectedSide, sortBy])
    const selectedPositions = useMemo(
        () => processedPositions.filter((position) => selectedPositionIds.has(position.id)),
        [processedPositions, selectedPositionIds]
    )
    const selectedExposure = useMemo(
        () => selectedPositions.reduce((sum, position) => sum + position.size, 0),
        [selectedPositions]
    )

    function handleOpen(position: Position) {
        console.info("M5 open trigger", position.id);
    }

    function handleClose(position: Position) {
        openModal("close", {
            id: position.id,
            position,
            onConfirmClose: scheduleRemovalAfterAnimation,
        });
    }

    function handleTogglePositionSelect(position: Position, checked: boolean) {
        setSelectedPositionIds((prev) => {
            const next = new Set(prev)
            if (checked) {
                next.add(position.id)
            } else {
                next.delete(position.id)
            }
            return next
        })
    }

    function handleCloseSelected() {
        const firstSelected = selectedPositions[0]
        if (!firstSelected) return
        openModal("close", {
            id: firstSelected.id,
            position: firstSelected,
            selectedPositions,
            onConfirmClose: scheduleRemovalAfterAnimation,
        })
    }

    function handleDeselectAll() {
        setSelectedPositionIds(new Set())
    }

    if (loading) return <PositionsTableSkeleton />;
    if (error && positions.length === 0) return <SummaryError message={error} />;

    return (
        <div className="w-full space-y-4">
            {venueUnavailable && <VenueUnavailableBanner />}
            {venueUnavailable && (
                <div className="text-support text-xs border border-line-c rounded-r4 bg-bg-1/40 px-3 py-2">
                    P&amp;L values are stale. Close actions remain available.
                </div>
            )}
            <PositionsFiltersBar
                categories={categoryData.counts}
                totalCount={positions.length}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedSide={selectedSide}
                onSelectSide={setSelectedSide}
                sortBy={sortBy}
                onChangeSort={setSortBy}
            />
            <div className="text-support text-t-3!/20! items-center hidden max-sm:flex">
                <span>Tap row for detail</span>
                <DotSeparator size={2} color="bg-t-3" />
                <span>Tap Close to exit position</span>
            </div>

            {selectedPositions.length > 1 && (
                <div className="hidden sm:flex items-center justify-between rounded-r6 border border-line-g bg-g-3/10 px-3 py-2">
                    <div className="flex items-center gap-2 text-secondary text-g-3!">
                        {selectedPositions.length} positions selected
                        <DotSeparator size={4} color="bg-g-3" />
                        ${Math.round(selectedExposure).toLocaleString()} exposure
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="destructive" size="sm" onClick={handleCloseSelected}>
                            Close selected
                        </Button>
                        <Button type="button" variant="muted" size="sm" onClick={handleDeselectAll}>
                            Deselect all
                        </Button>
                    </div>
                </div>
            )}

            <PositionsTable
                positions={processedPositions}
                categoryPresentation={categoryData.presentation}
                onOpenPosition={handleOpen}
                onClosePosition={handleClose}
                selectedPositionIds={selectedPositionIds}
                onTogglePositionSelect={handleTogglePositionSelect}
                closingPositionIds={closingPositionIds}
                venueUnavailable={venueUnavailable}
            />

            <div className="text-support text-t-3!/20! items-center hidden max-sm:flex my-4 justify-center">
                <span>All {positions.length} positions shown</span>
                <DotSeparator size={2} color="bg-t-3" />
                <span>Tap any row to view detail</span>
            </div>

        </div>
    );
}