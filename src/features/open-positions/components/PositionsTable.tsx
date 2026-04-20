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
};

export function PositionsTable({
    positions,
    categoryPresentation,
    onOpenPosition,
    onClosePosition,
    selectedPositionIds,
    onTogglePositionSelect,
    closingPositionIds,
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
            <table className="w-full text-sm max-sm:text-[13px]">
                <thead className="sticky top-0 z-10 border-b border-line-c bg-bg-1 text-support max-sm:text-[12px]">
                    <tr>
                        <th className="px-3 py-2 text-left pl-9 max-sm:pl-3">
                            <span className="inline-flex items-center gap-1">
                                <span>Market</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Market contract name for the position." />
                                </span>
                            </span>
                        </th>
                        <th className="px-3 py-2 text-left max-sm:hidden">
                            <span className="inline-flex items-center gap-1">
                                <span>Category</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Exposure category assigned by ranked category mapping." />
                                </span>
                            </span>
                        </th>
                        <th className="px-3 py-2 text-left">
                            <span className="inline-flex items-center gap-1">
                                <span>Side</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Your position direction: YES or NO." />
                                </span>
                            </span>
                        </th>
                        <th className="px-3 py-2 text-right max-sm:hidden">
                            <span className="inline-flex items-center gap-1">
                                <span>Entry</span>
                                <InfoTooltip text="Average entry price of this position." />
                            </span>
                        </th>
                        <th className="px-3 py-2 text-right max-sm:hidden">
                            <span className="inline-flex items-center gap-1">
                                <span>Current</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Latest mark/current price." />
                                </span>
                            </span>
                        </th>
                        <th className="px-3 py-2 text-right max-sm:hidden">
                            <span className="inline-flex items-center gap-1">
                                <span>Size</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Current notional exposure size." />
                                </span>
                            </span>
                        </th>
                        <th className="px-3 py-2 text-right">
                            <span className="inline-flex items-center gap-1">
                                <span>P&amp;L</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Unrealized profit/loss in absolute value." />
                                </span>
                            </span>
                        </th>
                        <th className="px-3 py-2 text-right max-sm:hidden">
                            <span className="inline-flex items-center gap-1">
                                <span>P&amp;L %</span>
                                <span className="max-sm:hidden">
                                    <InfoTooltip text="Unrealized profit/loss as percentage return." />
                                </span>
                            </span>
                        </th>
                        <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {positions.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="py-6 text-center text-support">
                                No positions found
                            </td>
                        </tr>
                    ) : shouldVirtualize ? (
                        <tr>
                            <td className="p-0" colSpan={9}>
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
                                            <table
                                                key={virtualRow.key}
                                                className="w-full table-fixed text-sm max-sm:text-[13px]"
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    transform: `translateY(${virtualRow.start}px)`,
                                                }}
                                            >
                                                <tbody>
                                                    <PositionRowTable
                                                        position={position}
                                                        categoryPresentation={categoryPresentation}
                                                        onOpen={onOpenPosition}
                                                        onClose={onClosePosition}
                                                        isSelected={selectedPositionIds?.has(position.id)}
                                                        onToggleSelect={onTogglePositionSelect}
                                                        isClosing={closingPositionIds?.has(position.id)}
                                                    />
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            </td>
                        </tr>
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
                            />
                        ))
                    )}
                </tbody>
            </table>
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