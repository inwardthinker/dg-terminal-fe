import { ApiKpis, KpiCardData } from "../types";

export function mapKpisToCards(kpis: ApiKpis, venueUnavailable = false): KpiCardData[] {
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
            value: venueUnavailable ? "?" : `${kpis.unrealizedPnl >= 0 ? "+" : ""}$${kpis.unrealizedPnl}`,
            valueVariant: venueUnavailable ? "default" : (kpis.unrealizedPnl >= 0 ? "positive" : "negative"),
            tooltip: venueUnavailable ? "Prices are stale while venue API is unavailable" : "Unrealized profit or loss",
            dimmed: venueUnavailable,
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
