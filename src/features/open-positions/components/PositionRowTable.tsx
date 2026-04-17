"use client";

import React, { type CSSProperties, type MouseEvent, useCallback } from "react";

import { CategoryPill } from "./CategoryPill";
import type { Position } from "../types";
import type { CategoryPresentation } from "../utils/categoryExposure";
import { Button } from "@/components/ui/Button";
import { POSITION_TABLE_ROW_HEIGHT_PX } from "../constants/layout";

type PositionRowTableProps = {
    position: Position;
    categoryPresentation?: Record<Position["category"], CategoryPresentation>;
    onOpen: (position: Position) => void;
    onClose: (position: Position) => void;
    style?: CSSProperties;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
});

function pnlTextClass(value: number) {
    return value >= 0 ? "text-pos" : "text-neg";
}

export const PositionRowTable = React.memo(function PositionRowTable({
    position,
    categoryPresentation,
    onOpen,
    onClose,
    style,
}: PositionRowTableProps) {
    const categoryStyle = categoryPresentation?.[position.category] ?? {
        label: position.category,
        colorClass: "bg-t-3",
    };

    const handleOpen = useCallback(() => {
        onOpen(position);
    }, [onOpen, position]);

    const handleClose = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            onClose(position);
        },
        [onClose, position]
    );

    return (
        <tr
            className="cursor-pointer overflow-hidden border-b border-line-c align-middle text-support transition-colors hover:bg-bg-2 max-sm:text-[13px]"
            onClick={handleOpen}
            style={{
                height: POSITION_TABLE_ROW_HEIGHT_PX,
                maxHeight: POSITION_TABLE_ROW_HEIGHT_PX,
                ...style,
            }}
        >
            {/* Checkbox (Phase 0 hidden) */}
            <td className="px-3 py-0 align-middle">
                <div className="flex w-full min-w-0 items-center gap-3 text-secondary max-sm:max-w-[132px] max-sm:gap-1">
                    <input
                        type="checkbox"
                        aria-label={`Select ${position.market}`}
                        className="
                        h-[16px] w-[16px]
                        rounded-[4px]
                        border border-line-c
                        bg-transparent
                        appearance-none
                        cursor-pointer
                        relative
                        transition-all

                        checked:bg-g-3
                        checked:border-g-3

                        before:content-['']
                        before:absolute
                        before:inset-0
                        before:flex
                        before:items-center
                        before:justify-center
                        before:text-black
                        before:text-[13px]
                        before:font-bold

                        checked:before:content-['✓']
                        max-sm:hidden"
                        onClick={(e) => e.stopPropagation()}
                    />


                    <span
                        className="block min-w-0 truncate max-sm:text-[13px]"
                        title={position.market}
                    >
                        {position.market}
                    </span>
                </div>
            </td>

            {/* Category */}
            <td className="px-3 py-0 align-middle max-sm:hidden">
                <CategoryPill
                    label={categoryStyle.label}
                    colorClass={categoryStyle.colorClass}
                />
            </td>

            {/* Side */}
            <td
                className={`px-3 py-0 align-middle font-bold max-sm:text-[11px] ${position.side === "YES" ? "text-pos" : "text-neg"
                    }`}
            >
                {position.side}
            </td>

            {/* Entry */}
            <td className="px-3 py-0 align-middle text-right text-secondary max-sm:hidden">
                {currencyFormatter.format(position.entryPrice)}
            </td>

            {/* Current */}
            <td className="px-3 py-0 align-middle text-right text-secondary max-sm:hidden">
                {currencyFormatter.format(position.currentPrice)}
            </td>

            {/* Size */}
            <td className="px-3 py-0 align-middle text-right text-secondary max-sm:hidden">
                {currencyFormatter.format(position.size)}
            </td>

            {/* P&L */}
            <td
                className={`px-3 py-0 align-middle text-right transition-colors duration-200 ${pnlTextClass(
                    position.pnl
                )}`}
            >
                {position.pnl >= 0 ? "+" : ""}
                {currencyFormatter.format(position.pnl)}
            </td>

            {/* P&L % */}
            <td
                className={`px-3 py-0 align-middle text-right transition-colors duration-200 ${pnlTextClass(
                    position.pnlPct
                )} max-sm:hidden`}
            >
                {position.pnlPct >= 0 ? "+" : ""}
                {position.pnlPct.toFixed(2)}%
            </td>

            {/* Action */}
            <td className="px-3 py-0 align-middle text-right">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleClose}
                >
                    Close
                </Button>
            </td>
        </tr>
    );
});