"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { getChartPoints } from "./utils";

type EquityCurvePoint = {
    date: string;
    value: number;
};

type EquityCurveChartProps = {
    data: EquityCurvePoint[];
    width: number;
    loading: boolean;
    color: "pos" | "neg";
};

type InsufficientHistoryStateProps = {
    width: number;
    height: number;
};

function EquityCurveChartComponent({ data, width, loading, color }: EquityCurveChartProps) {
    const CHART_HEIGHT = 220;
    const TOOLTIP_HORIZONTAL_PADDING = 40;
    const TOOLTIP_Y_OFFSET = 44;

    const pathRef = useRef<SVGPathElement | null>(null);
    const [length, setLength] = useState(0);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const computed = getChartPoints(data, width, CHART_HEIGHT);

    useEffect(() => {
        if (pathRef.current) {
            const total = pathRef.current.getTotalLength();
            setLength(total);
        }
    }, [computed]);


    const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const rawIndex = Math.round((x / width) * (data.length - 1));
        const index = Math.max(0, Math.min(data.length - 1, rawIndex));
        setHoverIndex((prev) => (prev === index ? prev : index));
    }, [data.length, width]);

    if (loading) {
        return <div className="w-full h-full bg-bg-2 rounded-r4 animate-pulse" />;
    }

    if (!computed) {
        return <InsufficientHistoryState width={width} height={CHART_HEIGHT} />;
    }

    const { d, min, max } = computed;
    const mid = (min + max) / 2;


    const strokeColor = `var(--${color})`;

    const hoveredPoint =
        hoverIndex !== null
            ? computed.points[hoverIndex]
            : null;

    const hoveredData = hoverIndex !== null ? data[hoverIndex] : null;

    const prev =
        hoverIndex !== null && hoverIndex > 0
            ? data[hoverIndex - 1]
            : null;

    const change =
        prev && hoveredData
            ? ((hoveredData.value - prev.value) / prev.value) * 100
            : 0;

    const tooltipLeft =
        hoveredPoint && width
            ? Math.min(
                Math.max(hoveredPoint.x, TOOLTIP_HORIZONTAL_PADDING),
                width - TOOLTIP_HORIZONTAL_PADDING
            )
            : 0;

    return (
        <div className="relative w-full h-full">
            <div className="absolute right-0 top-0 h-full w-16 bg-linear-to-l from-bg-1 to-transparent pointer-events-none" />

            <svg width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
                preserveAspectRatio="none"
                className="transition-all duration-300"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverIndex(null)}
            >

                {/* Gradient */}
                <defs>

                    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />

                    </linearGradient>
                </defs>

                {/* Area */}
                <path
                    key={`area-${d}`}
                    d={`${d} L ${width} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`}
                    fill="url(#area)"
                    className="opacity-0 animate-enter-fade"
                />

                {/* Line */}
                <path
                    key={d}
                    ref={pathRef}
                    d={d}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.8"
                    strokeDasharray={length}
                    strokeDashoffset={length}
                    className="animate-draw"
                />

                {hoveredPoint && (
                    <line
                        x1={hoveredPoint.x}
                        x2={hoveredPoint.x}
                        y1={0}
                        y2={CHART_HEIGHT}
                        stroke="var(--linec)"
                        strokeDasharray="3 6"
                    />
                )}

                {hoveredPoint && (
                    <circle
                        cx={hoveredPoint.x}
                        cy={hoveredPoint.y}
                        r={3}
                        fill={strokeColor}
                    />
                )}

                {hoveredPoint && (
                    <line
                        x1={0}
                        x2={width}
                        y1={hoveredPoint.y}
                        y2={hoveredPoint.y}
                        stroke="var(--linec)"
                        strokeDasharray="3 6"
                        strokeOpacity={0.85}
                    />
                )}

            </svg>

            <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-t-3 text-xs pointer-events-none opacity-60">
                <span>${max.toFixed(0)}</span>
                <span>${mid.toFixed(0)}</span>
                <span>${min.toFixed(0)}</span>
            </div>


            {hoveredPoint && hoveredData && (
                <div
                    className="absolute text-xs bg-bg-2 border border-line-c rounded-r2 pointer-events-none px-sp3 py-sp2"
                    style={{
                        left: tooltipLeft,
                        top: hoveredPoint.y - TOOLTIP_Y_OFFSET,
                        transform: "translateX(-50%)",
                    }}
                >
                    {/* Date */}
                    <div className="text-t-1">{hoveredData.date}</div>

                    {/* Balance */}
                    <div className="text-t-2">
                        ${hoveredData.value.toFixed(0)}
                    </div>

                    {/* Daily change */}
                    <div className={change >= 0 ? "text-pos" : "text-neg"}>
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(2)}%
                    </div>
                </div>
            )}

        </div>
    );
}

function InsufficientHistoryState({ width, height }: InsufficientHistoryStateProps) {
    return (
        <div className="relative w-full h-full">
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
            >
                <line
                    x1={0}
                    x2={width}
                    y1={height / 2}
                    y2={height / 2}
                    stroke="var(--linec)"
                    strokeDasharray="6 6"
                    opacity={0.6}
                />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-support text-t-3">
                Insufficient history
            </div>
        </div>
    );
}

export const EquityCurveChart = memo(EquityCurveChartComponent);