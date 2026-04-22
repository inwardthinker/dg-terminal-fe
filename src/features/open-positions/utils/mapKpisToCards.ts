import { ApiKpis, KpiCardData } from "../types";

export function mapKpisToCards(kpis: ApiKpis): KpiCardData[] {
    const fmtCurrency = (value: number) => `$${value.toLocaleString("en-US")}`;
    const fmtSignedCurrency = (value: number) =>
        `${value >= 0 ? "+" : ""}$${Math.abs(value).toLocaleString("en-US")}`;

    return [
        {
            id: "totalOpen",
            label: "Total Open",
            value: kpis.totalOpen.toLocaleString("en-US"),
            tooltip: "Number of currently open positions",
        },
        {
            id: "totalExposure",
            label: "Total Exposure",
            value: fmtCurrency(kpis.totalExposure),
            tooltip: "Total capital deployed",
        },
        {
            id: "unrealizedPnl",
            label: "Total Unrealized P&L",
            value: fmtSignedCurrency(kpis.unrealizedPnl),
            valueVariant: kpis.unrealizedPnl >= 0 ? "positive" : "negative",
            tooltip: "Unrealized profit or loss",
        },
        {
            id: "largestPosition",
            label: "Largest Position",
            value: fmtCurrency(kpis.largestPositionValue),
            meta: `${kpis.largestPositionPct.toFixed(1)}%`,
            tooltip: "Biggest position by size",
        },
    ]
}
