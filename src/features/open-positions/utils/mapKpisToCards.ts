import { ApiKpis, KpiCardData } from "../types";

export function mapKpisToCards(kpis: ApiKpis): KpiCardData[] {
    return [
        {
            id: "totalOpen",
            label: "Total Open",
            value: kpis.totalOpen.toString(),
            tooltip: "Number of currently open positions",
        },
        {
            id: "totalExposure",
            label: "Total Exposure",
            value: `$${kpis.totalExposure.toLocaleString()}`,
            tooltip: "Total capital deployed",
        },
        {
            id: "unrealizedPnl",
            label: "Total Unrealized P&L",
            value: `${kpis.unrealizedPnl >= 0 ? "+" : ""}$${kpis.unrealizedPnl}`,
            valueVariant: kpis.unrealizedPnl >= 0 ? "positive" : "negative",
            tooltip: "Unrealized profit or loss",
        },
        {
            id: "largestPosition",
            label: "Largest Position",
            value: `$${kpis.largestPositionValue.toLocaleString()}`,
            meta: `${kpis.largestPositionPct}%`,
            tooltip: "Biggest position by size",
        },
    ]
}
