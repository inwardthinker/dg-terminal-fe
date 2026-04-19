"use client";

import { useMemo } from "react";
import { PositionRowSummary } from "./PositionRowSummary";
import type { Position } from "../types";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { DotSeparator } from "@/components/ui/DotSeparator";
import { buildCategoryPresentation } from "../utils/categoryExposure";
import {
  SUMMARY_GRID_COLUMNS,
  SUMMARY_GRID_COLUMNS_MOBILE,
} from "../constants/layout";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

type SummaryPanelProps = {
  positions: Position[];
  totalCount: number;
  onOpenPosition: (position: Position) => void;
  onClosePosition: (position: Position) => void;
};

const OPEN_POSITIONS_URL = "/portfolio/open-positions";

const SUMMARY_COLUMNS = [
  {
    key: "market",
    label: "Market",
    tooltip: "The event or outcome you have a position on.",
    align: "left",
  },
  {
    key: "category",
    label: "Cat.",
    tooltip: "The topic area this market belongs to.",
    align: "left",
    hideOnMobile: true,
  },
  {
    key: "side",
    label: "Side",
    tooltip:
      "Whether you bet YES (outcome happens) or NO (outcome does not happen).",
    align: "left",
  },
  {
    key: "size",
    label: "Size",
    tooltip: "Total amount paid to open this position (cost basis).",
    align: "right",
    hideOnMobile: true,
  },
  {
    key: "pnl",
    label: "P&L",
    tooltip: "Unrealized gain or loss in dollars at current price.",
    align: "right",
  },
  {
    key: "action",
    label: "Action",
    align: "right",
  },
]

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
          <InfoTooltip text="Total number of open positions in the portfolio" />
        </div>
        {remaining > 0 &&
          <div className="text-secondary">
            <ArrowLink href={OPEN_POSITIONS_URL} label="View all" direction="down" />
          </div>
        }
      </div>

      <div className="space-y-2">
        <div
          className={`grid ${SUMMARY_GRID_COLUMNS} items-center gap-4 border-b border-line-c text-right text-support ${SUMMARY_GRID_COLUMNS_MOBILE} max-sm:gap-2 max-sm:text-[10px]`}
        >
          {SUMMARY_COLUMNS.map((col) => (
            <div
              key={col.key}
              className={`
        py-2 flex items-center gap-1
        ${col.align === "right" ? "justify-end text-right" : "text-left"}
        ${col.hideOnMobile ? "max-sm:hidden" : ""}
      `}
            >
              <span>{col.label}</span>
              {col.tooltip && <InfoTooltip text={col.tooltip} />}
            </div>
          ))}

        </div>
        {positions.map((position) => (
          <PositionRowSummary
            key={position.id}
            position={position}
            categoryPresentation={categoryPresentation}
            onOpen={onOpenPosition}
            onClose={onClosePosition}
          />
        ))}
        {remaining > 0 && (
          <div className="py-2 text-support text-xs! flex items-center">
            <span>+{remaining} more positions</span>
            <DotSeparator size={2} />
            <ArrowLink href={OPEN_POSITIONS_URL} label="View all" direction="down" />
          </div>
        )}
      </div>
    </section>
  );
}
