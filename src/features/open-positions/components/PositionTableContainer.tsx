// features/open-positions/components/PositionsTableContainer.tsx
"use client";


import { PositionsTableSkeleton } from "./PositionsTableSkeleton";
import { SummaryError } from "./SummaryError";
import { usePositions } from "../hooks/usePositions";
import type { Position } from "../types";
import { PositionsTable } from "./PositionsTable";
import { useMemo, useState } from "react";
import { PositionsFiltersBar } from "./PositionFiltersBar";
import { buildCategoryData } from "../utils/categoryExposure";
import { DotSeparator } from "@/components/ui/DotSeparator";

type Category = Position["category"] | "All"

export function PositionsTableContainer() {
    const { positions, loading, error } = usePositions();

    const [selectedCategory, setSelectedCategory] = useState<Category>("All")
    const [selectedSide, setSelectedSide] = useState<"All" | "YES" | "NO">("All")
    const [sortBy, setSortBy] = useState<"pnl" | "size" | "entry" | "current">("pnl")

    const processedPositions = useMemo(() => {
        return positions
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
    }, [positions, selectedCategory, selectedSide, sortBy])

    const categoryData = useMemo(() => buildCategoryData(positions), [positions])

    function handleOpen(position: Position) {
        console.info("M5 open trigger", position.id);
    }

    function handleClose(position: Position) {
        console.info("M1 close trigger", position.id);
    }

    if (loading) return <PositionsTableSkeleton />;
    if (error) return <SummaryError />;

    return (
        <div className="w-full space-y-4">
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
            <PositionsTable
                positions={processedPositions}
                categoryPresentation={categoryData.presentation}
                onOpenPosition={handleOpen}
                onClosePosition={handleClose}
            />

            <div className="text-support text-t-3!/20! items-center hidden max-sm:flex my-4 justify-center">
                <span>All {positions.length} positions shown</span>
                <DotSeparator size={2} color="bg-t-3" />
                <span>Tap any row to view detail</span>
            </div>

        </div>
    );
}