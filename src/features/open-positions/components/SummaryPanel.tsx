"use client";

import { useMemo } from "react";
import { PositionRow } from "./PositionRow";
import type { Position } from "../types";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { DotSeparator } from "@/components/ui/DotSeparator";
import { buildCategoryPresentation } from "../utils/categoryExposure";
import {
  SUMMARY_GRID_COLUMNS,
  SUMMARY_GRID_COLUMNS_MOBILE,
} from "../constants/layout";

type SummaryPanelProps = {
  positions: Position[];
  totalCount: number;
  onOpenPosition: (position: Position) => void;
  onClosePosition: (position: Position) => void;
};

export function SummaryPanel({
  positions,
  totalCount,
  onOpenPosition,
  onClosePosition,
}: SummaryPanelProps) {

  const remaining = Math.max(totalCount - positions.length, 0)

  const categoryPresentation = useMemo(() => {
    return buildCategoryPresentation(positions)
  }, [positions])

  return (
    <section className="rounded-r7 border border-line-c bg-bg-1 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center text-primary">
          <h2 className="">Open Positions </h2>
          <DotSeparator size={4} />
          <h2 className="">{totalCount}</h2>
          <DotSeparator size={8} color="bg-pos" className="animate-pulse" />
        </div>
        {remaining > 0 &&
          <div className="text-secondary">
            <ArrowLink href="#positions-table" label="View all" direction="down" />
          </div>
        }
      </div>

      <div className="space-y-2">
        <div
          className={`grid ${SUMMARY_GRID_COLUMNS} items-center gap-4 border-b border-line-c text-right text-secondary tracking-wide text-t-3! ${SUMMARY_GRID_COLUMNS_MOBILE} max-sm:gap-2`}
        >
          <span className="pb-2 text-left">Market</span>
          <span className="pb-2 text-left">Cat.</span>
          <span className="pb-2 text-left">Side</span>
          <span className="pb-2 max-sm:hidden">Size</span>
          <span className="pb-2">P&amp;L</span>
          <span className="pb-2">Act</span>
        </div>
        {positions.map((position) => (
          <PositionRow
            key={position.id}
            position={position}
            variant="summary"
            categoryPresentation={categoryPresentation}
            onOpen={onOpenPosition}
            onClose={onClosePosition}
          />
        ))}
        {remaining > 0 && (
          <div className="py-2 text-support text-xs! flex items-center">
            <span>+{remaining} more positions</span>
            <DotSeparator size={2} />
            <ArrowLink href="#positions-table" label="View all" direction="down" />
          </div>
        )}
      </div>
    </section>
  );
}
