// features/open-positions/components/PositionsTable.tsx
"use client";

import { useRef } from "react";
import { PositionRowTable } from "./PositionRowTable";
import type { Position } from "../types";
import type { CategoryPresentation } from "../utils/categoryExposure";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
    POSITION_TABLE_GRID_COLUMNS,
    POSITION_TABLE_GRID_COLUMNS_MOBILE,
    POSITION_TABLE_ROW_HEIGHT_PX,
    VIRTUALIZATION_THRESHOLD,
    VIRTUAL_ROW_OVERSCAN,
} from "../constants/layout";

type Props = {
    positions: Position[];
    categoryPresentation: Record<Position["category"], CategoryPresentation>;
    onOpenPosition: (position: Position) => void;
    onClosePosition: (position: Position) => void;
    selectedPositionIds?: Set<string>;
    onTogglePositionSelect?: (position: Position, checked: boolean) => void;
    closingPositionIds?: Set<string>;
    venueUnavailable?: boolean;
};

export function PositionsTable({
    positions,
    categoryPresentation,
    onOpenPosition,
    onClosePosition,
    selectedPositionIds,
    onTogglePositionSelect,
    closingPositionIds,
    venueUnavailable = false,
}: Props) {
    const shouldVirtualize = positions.length > VIRTUALIZATION_THRESHOLD;
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const rowVirtualizer = useVirtualizer({
        count: positions.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => POSITION_TABLE_ROW_HEIGHT_PX,
        overscan: VIRTUAL_ROW_OVERSCAN,
        enabled: shouldVirtualize,
        // Stable row identity (default is index-based and breaks when order/filter changes).
        getItemKey: (index) => positions[index]?.id ?? index,
    });

    const virtualRows = shouldVirtualize ? rowVirtualizer.getVirtualItems() : [];

    return (
        <div className="w-full rounded-r7 border border-line-c bg-bg-1 overflow-x-hidden">
            <div
                ref={scrollContainerRef}
                className={
                    shouldVirtualize
                        ? "max-h-[calc(100vh-280px)] overflow-y-auto scroll-smooth"
                        : undefined
                }
            >
                <div className="text-sm max-sm:text-[13px]">
                    <div className={`sticky top-0 z-10 grid ${POSITION_TABLE_GRID_COLUMNS} items-center border-b border-line-c bg-bg-1 text-support ${POSITION_TABLE_GRID_COLUMNS_MOBILE} max-sm:text-[12px]`}>
                        <div className="px-3 py-2 text-left pl-9 max-sm:pl-3">
                            <span className="inline-flex items-center justify-start gap-1">
                                <span>Market</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Market contract name for the position." />
                                </span>
                            </span>
                        </div>
                        <div className="px-3 py-2 text-center max-sm:hidden">
                            <span className="inline-flex items-center justify-end gap-0">
                                <span>Category</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Exposure category assigned by ranked category mapping." />
                                </span>
                            </span>
                        </div>
                        <div className="px-3 py-2 text-left">
                            <span className="inline-flex items-center justify-center gap-1">
                                <span>Side</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Your position direction: YES or NO." />
                                </span>
                            </span>
                        </div>
                        <div className="py-2 text-right max-sm:hidden">
                            <span className="flex items-center justify-end">
                                <span>Entry</span>
                                <InfoTooltip text="Average entry price of this position." />
                            </span>
                        </div>
                        <div className="px-3 py-2 text-center max-sm:hidden">
                            <span className="inline-flex items-center justify-center gap-1">
                                <span>Current</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Latest mark/current price." />
                                </span>
                            </span>
                        </div>
                        <div className="px-3 py-2 text-right max-sm:hidden">
                            <span className="inline-flex items-center justify-center gap-1">
                                <span>Size</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Current notional exposure size." />
                                </span>
                            </span>
                        </div>
                        <div className="px-3 py-2 text-right">
                            <span className="inline-flex items-center justify-center gap-1">
                                <span>P&amp;L</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Unrealized profit/loss in absolute value." />
                                </span>
                            </span>
                        </div>
                        <div className="px-3 py-2 text-center max-sm:hidden">
                            <span className="inline-flex items-center justify-center gap-1">
                                <span>P&amp;L %</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Unrealized profit/loss as percentage return." />
                                </span>
                            </span>
                        </div>
                        <div className="px-3 py-2 text-center">Action</div>
                    </div>

                    {positions.length === 0 ? (
                        <div className="py-6 text-center text-support">No positions found</div>
                    ) : shouldVirtualize ? (
                        <div
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                position: "relative",
                                width: "100%",
                            }}
                        >
                            {virtualRows.map((virtualRow) => {
                                const position = positions[virtualRow.index];
                                if (!position) return null;

                                return (
                                    <PositionRowTable
                                        key={virtualRow.key}
                                        position={position}
                                        categoryPresentation={categoryPresentation}
                                        onOpen={onOpenPosition}
                                        onClose={onClosePosition}
                                        isSelected={selectedPositionIds?.has(position.id)}
                                        onToggleSelect={onTogglePositionSelect}
                                        isClosing={closingPositionIds?.has(position.id)}
                                        showStalePnl={venueUnavailable || Boolean(position.priceStale)}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            transform: `translateY(${virtualRow.start}px)`,
                                            width: "100%",
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        positions.map((position) => (
                            <PositionRowTable
                                key={position.id}
                                position={position}
                                categoryPresentation={categoryPresentation}
                                onOpen={onOpenPosition}
                                onClose={onClosePosition}
                                isSelected={selectedPositionIds?.has(position.id)}
                                onToggleSelect={onTogglePositionSelect}
                                isClosing={closingPositionIds?.has(position.id)}
                                showStalePnl={false}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-between max-sm:hidden">
                <div className="text-support text-xs! flex items-center px-2 py-2">
                    All {positions.length} positions shown · Checkboxes activate in Phase 1 bulk-close
                </div>

                <Link href="/portfolio" className="text-g-3! text-xs! flex items-center px-2 py-2 space-x-1 max-sm:self-start">
                    <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
                    <span>Back to portfolio</span>
                </Link>
            </div>
        </div>
    );
}