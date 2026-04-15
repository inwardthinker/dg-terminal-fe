"use client";

import React, { type MouseEvent } from "react";

import { CategoryPill } from "./CategoryPill";
import type { Position } from "../types";
import { Button } from "@/components/ui/Button";
import type { CategoryPresentation } from "../utils/categoryExposure";
import {
  SUMMARY_GRID_COLUMNS,
  SUMMARY_GRID_COLUMNS_MOBILE,
} from "../constants/layout";

type PositionRowProps = {
  position: Position;
  variant: "summary" | "table";
  categoryPresentation?: Record<Position["category"], CategoryPresentation>;
  onOpen: (position: Position) => void;
  onClose: (position: Position) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function truncateMarketName(market: string) {
  if (market.length <= 28) {
    return market;
  }
  return `${market.slice(0, 28)}...`;
}

function pnlTextClass(pnl: number) {
  return pnl >= 0 ? "text-pos" : "text-neg";
}

function stopAndClose(
  event: MouseEvent<HTMLButtonElement>,
  position: Position,
  onClose: (position: Position) => void,
) {
  event.stopPropagation();
  onClose(position);
}

export const PositionRow = React.memo(function PositionRow({
  position,
  variant,
  categoryPresentation,
  onOpen,
  onClose,
}: PositionRowProps) {
  const categoryStyle = categoryPresentation?.[position.category] ?? {
    label: position.category,
    colorClass: "bg-t-3",
  };

  const handleOpen = () => onOpen(position)

  if (variant === "summary") {
    const gridClass =
      `grid ${SUMMARY_GRID_COLUMNS} items-center gap-4 border-b border-line-c text-right text-secondary transition-colors ${SUMMARY_GRID_COLUMNS_MOBILE} max-sm:gap-2`;

    return (
      <div className={gridClass}>
        <div className="contents cursor-pointer" onClick={handleOpen}>
          <div className="truncate py-2 text-left" title={position.market}>
            {truncateMarketName(position.market)}
          </div>
          <div className="flex justify-start py-2">
            <CategoryPill
              label={categoryStyle.label}
              colorClass={categoryStyle.colorClass}
            />
          </div>
          <span className={`font-bold text-left ${position.side === "YES" ? "text-pos!" : "text-neg!"}`}>
            {position.side}
          </span>
          <span className="py-2 text-right max-sm:hidden">
            {currencyFormatter.format(position.size)}
          </span>
          <span
            className={`inline-flex flex-col items-end leading-tight transition-colors duration-200 py-2 ${pnlTextClass(position.pnl)}`}
          >
            <span className="whitespace-nowrap">{position.pnl >= 0 ? "+" : ""}{currencyFormatter.format(position.pnl)}</span>
            <span className="text-[0.82em] max-sm:text-[0.78em]">
              {position.pnlPct >= 0 ? "+" : ""}
              {position.pnlPct.toFixed(1)}%
            </span>
          </span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={(event) => stopAndClose(event, position, onClose)}
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <tr
      className="cursor-pointer border-b border-line-c text-support transition-colors"
      onClick={() => onOpen(position)}
    >
      <td className="hidden">
        <input type="checkbox" aria-label={`Select ${position.market}`} />
      </td>
      <td className="max-w-[220px] px-3 py-3 text-secondary" title={position.market}>
        <span className="block truncate">{truncateMarketName(position.market)}</span>
      </td>
      <td className="px-3 py-3">
        <CategoryPill
          label={categoryStyle.label}
          colorClass={categoryStyle.colorClass}
        />
      </td>
      <td className={`px-3 py-3 font-bold ${position.side === "YES" ? "text-pos" : "text-neg"}`}>
        {position.side}
      </td>
      <td className="px-3 py-3 text-secondary">{currencyFormatter.format(position.entryPrice)}</td>
      <td className="px-3 py-3 text-secondary">{currencyFormatter.format(position.currentPrice)}</td>
      <td className="px-3 py-3 text-secondary">{currencyFormatter.format(position.size)}</td>
      <td className={`px-3 py-3 transition-colors duration-200 ${pnlTextClass(position.pnl)}`}>
        {currencyFormatter.format(position.pnl)}
      </td>
      <td className={`px-3 py-3 transition-colors duration-200 ${pnlTextClass(position.pnlPct)}`}>
        {position.pnlPct.toFixed(2)}%
      </td>
      <td className="px-3 py-3">
        <button
          type="button"
          className="rounded-r3 border border-neg bg-bg-2 px-3 py-1 text-[10px] font-bold text-neg transition-colors hover:bg-bg-3"
          onClick={(event) => stopAndClose(event, position, onClose)}
        >
          Close
        </button>
      </td>
    </tr>
  );
});
