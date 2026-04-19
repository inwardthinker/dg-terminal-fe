"use client";

import React, { type MouseEvent } from "react";

import { CategoryPill } from "./CategoryPill";
import type { Position } from "../types";
import { Button } from "@/components/ui/Button";
import type { CategoryPresentation } from "../utils/categoryExposure";
import { useModal } from "@/lib/modals/hooks/useModal";
import {
  SUMMARY_GRID_COLUMNS,
  SUMMARY_GRID_COLUMNS_MOBILE,
} from "../constants/layout";

type PositionRowSummaryProps = {
  position: Position;
  categoryPresentation?: Record<Position["category"], CategoryPresentation>;
  onOpen: (position: Position) => void;
  onClose: (position: Position) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function pnlTextClass(pnl: number) {
  return pnl >= 0 ? "text-pos" : "text-neg";
}

function sideTextClass(side: string) {
  if (side === "YES") return "text-pos!";
  if (side === "NO") return "text-neg!";
  return "text-secondary";
}

function stopAndClose(
  event: MouseEvent<HTMLButtonElement>,
  position: Position,
  openModal: ReturnType<typeof useModal>["openModal"],
) {
  event.stopPropagation();
  openModal("close", {
    id: position.id,
    position,
  });
}

export const PositionRowSummary = React.memo(function PositionRowSummary({
  position,
  categoryPresentation,
  onOpen,
}: PositionRowSummaryProps) {
  const { openModal } = useModal();
  const categoryStyle = categoryPresentation?.[position.category] ?? {
    label: position.category,
    colorClass: "bg-t-3",
  };

  const handleOpen = () => onOpen(position)

  const gridClass =
    `grid ${SUMMARY_GRID_COLUMNS} items-center gap-4 border-b border-line-c text-right text-secondary transition-colors ${SUMMARY_GRID_COLUMNS_MOBILE} max-sm:gap-2 max-sm:text-[11px]`;

  return (
    <div className={gridClass}>
      <div className="contents cursor-pointer" onClick={handleOpen}>
        <div className="truncate py-2 text-left max-sm:text-[10px] text-white" title={position.market}>
          {position.market}
        </div>
        <div className="flex justify-start py-2 max-sm:hidden">
          <CategoryPill
            label={categoryStyle.label}
            colorClass={categoryStyle.colorClass}
          />
        </div>
        <span className={`font-bold text-left ${sideTextClass(position.side)}`}>
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
        onClick={(event) => stopAndClose(event, position, openModal)}
      >
        Close
      </Button>
    </div>
  );
}
);
