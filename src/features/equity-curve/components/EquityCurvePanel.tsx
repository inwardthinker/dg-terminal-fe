// src/features/equity-curve/EquityCurvePanel.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import { EquityCurveChart } from "@/features/equity-curve/components/EquityCurveChart";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { getXAxisLabels, type Period } from "../utils";
import { useEquityCurve } from "@/features/equity-curve/hooks/useEquityCurve";
import { DotSeparator } from "@/components/ui/DotSeparator";

const periods = ["7d", "30d", "90d", "All"] as const;

type EquityCurvePanelProps = {
    venueUnavailable?: boolean;
};

export function EquityCurvePanel({ venueUnavailable = false }: EquityCurvePanelProps) {
    const [period, setPeriod] = useState<Period>("30d");
    const { data, summaryByPeriod, loading } = useEquityCurve();
    const currentData = data[period] || [];
    const xAxisLabels = getXAxisLabels(period);
    const midIndex = currentData.length > 0 ? Math.floor((currentData.length - 1) / 2) : 0;
    const dateXAxisLabels: [string, string, string] = [
        currentData[0]?.date ?? xAxisLabels[0],
        currentData[midIndex]?.date ?? xAxisLabels[1],
        currentData[currentData.length - 1]?.date ?? xAxisLabels[2],
    ];

    const firstValue = currentData[0]?.value;
    const lastValue = currentData[currentData.length - 1]?.value;
    const fallbackChange =
        currentData.length > 1 && firstValue !== 0
            ? ((lastValue - firstValue) / firstValue) *
            100
            : 0;
    const change = summaryByPeriod[period]?.changePct ?? fallbackChange;

    const isPositive = change >= 0;
    const changeClassName = isPositive ? "text-pos!" : "text-neg!";
    const sign = isPositive ? "+" : "";

    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const nextWidth = Math.round(entry.contentRect.width);
            setWidth((prevWidth) => (prevWidth === nextWidth ? prevWidth : nextWidth));
        });

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5 flex flex-col gap-sp4">

            {/* Header */}
            <div className="flex flex-col gap-sp3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1">
                    <span className="text-primary leading-none">Equity curve</span>
                    <DotSeparator size={4} />
                    {venueUnavailable ? (
                        <span className="leading-none text-support">Unavailable</span>
                    ) : (
                        <span className={`leading-none text-secondary ${changeClassName}`}>
                            {sign}
                            {change.toFixed(1)}%
                        </span>
                    )}

                    <InfoTooltip text="Your total portfolio balance over time, including unrealized positions valued at current price." />
                </div>



                <div className="flex gap-sp2" role="group" aria-label="Equity curve period selector">
                    {periods.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            aria-pressed={period === p}
                            disabled={venueUnavailable}
                            className={`px-sp3 py-sp2 rounded-r2 text-button ${period === p
                                ? "bg-line-g text-g3"
                                : "text-t-2"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

            </div>

            {/* Chart */}
            <div>
                <div ref={ref} className="h-[180px]">
                    {venueUnavailable && (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-r4 text-center">
                            <p className="text-support">Unavailable - retry to reload</p>
                            <button
                                type="button"
                                className="rounded-r3 border border-line-c px-3 py-1 text-action transition-colors hover:bg-bg-2"
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    {!venueUnavailable && loading && (
                        <div className="w-full h-full bg-bg-2 rounded-r4 animate-pulse" />
                    )}
                    {!venueUnavailable && !loading && width > 0 && (
                        <EquityCurveChart
                            data={currentData}
                            width={width}
                            loading={false}
                            color={isPositive ? "pos" : "neg"}
                        />
                    )}
                    {!venueUnavailable && !loading && width === 0 && (
                        <div className="w-full h-full bg-bg-2 rounded-r4 animate-pulse" />
                    )}
                </div>

                <div className="flex justify-between mt-sp2 text-support text-t-3">
                    <span>{dateXAxisLabels[0]}</span>
                    <span>{dateXAxisLabels[1]}</span>
                    <span>{dateXAxisLabels[2]}</span>
                </div>

            </div>
        </div>
    );
}