import React from "react";
import { KpiCard } from "@/features/portfolio/components/KpiCard";
import type { OpenPositionsSummary } from "@/features/portfolio/types";
import { mapKpisToCards } from "@/features/open-positions/utils/mapKpisToCards";
import type { ApiKpis } from "@/features/open-positions/types";

type OpenPositionsSummaryKpisProps = {
  summary: OpenPositionsSummary | null;
  loading: boolean;
  error: string | null;
};

const EMPTY_VALUE = "--";

function toKpis(summary: OpenPositionsSummary): ApiKpis {
  return {
    totalOpen: summary.openPositions,
    totalExposure: summary.totalExposure,
    unrealizedPnl: summary.unrealizedPnl,
    largestPositionValue: summary.largestPosition,
    largestPositionPct: 0,
  };
}

function emptyCards() {
  return mapKpisToCards({
    totalOpen: 0,
    totalExposure: 0,
    unrealizedPnl: 0,
    largestPositionValue: 0,
    largestPositionPct: 0,
  }).map((card) => ({ ...card, value: EMPTY_VALUE, meta: undefined }));
}

export function OpenPositionsSummaryKpis({
  summary,
  loading,
  error,
}: OpenPositionsSummaryKpisProps) {
  const cards = summary ? mapKpisToCards(toKpis(summary)) : emptyCards();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ id, ...card }) => (
        <KpiCard
          key={id}
          {...card}
          meta={error && id === "totalOpen" ? "Error" : card.meta}
          tooltip={
            error && id === "totalOpen"
              ? `Failed to load summary: ${error}`
              : card.tooltip
          }
          dimmed={loading || !summary}
        />
      ))}
    </div>
  );
}
