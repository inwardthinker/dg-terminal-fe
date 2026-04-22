import { ApiKpis, KpiCardData } from "../types";

export function mapKpisToCards(kpis: ApiKpis): KpiCardData[] {
    const unrealizedPrefix = kpis.unrealizedPnl > 0 ? "+" : "";

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
            value: `${unrealizedPrefix}$${kpis.unrealizedPnl.toLocaleString("en-US")}`,
            valueVariant: kpis.unrealizedPnl > 0 ? "positive" : kpis.unrealizedPnl < 0 ? "negative" : "default",
            tooltip: "Unrealized profit or loss",
        },
        {
            id: "largestPosition",
            label: "Largest Position",
            value: `$${kpis.largestPositionValue.toLocaleString()}`,
            meta: kpis.largestPositionPct > 0 ? `${kpis.largestPositionPct}%` : undefined,
            tooltip: "Biggest position by size",
        },
    ]
}
