// src/features/equity-curve/useEquityCurve.ts
"use client";

import { useEffect, useState } from "react";
import { type Period, type Point } from "./utils";

type EquityCurveDataByPeriod = Record<Period, Point[]>;
type RangeSummary = {
    startValue: number | null;
    endValue: number | null;
    changePct: number;
    insufficientHistory: boolean;
};
type EquityCurveRangeSummaryByPeriod = Record<Period, RangeSummary>;

const PERIOD_KEYS: Period[] = ["7d", "30d", "90d", "All"];
const MOCK_FETCH_DELAY_MS = 500;

type ApiPoint = {
    date: string;
    balanceValue: number;
    dailyChange: number;
};

type ApiRange = {
    startIndex: number;
    endIndex: number;
    pointsCount: number;
    insufficientHistory: boolean;
    startValue?: number;
    endValue?: number;
    changePct?: number;
};

type EquityCurveApiResponse = {
    userId: number;
    asOfDate: string;
    points: ApiPoint[];
    ranges: {
        "7d": ApiRange;
        "30d": ApiRange;
        "90d": ApiRange;
        all: ApiRange;
    };
};

type ApiRangeKey = keyof EquityCurveApiResponse["ranges"];

const EMPTY_DATA_BY_PERIOD: EquityCurveDataByPeriod = {
    "7d": [],
    "30d": [],
    "90d": [],
    All: [],
};

const EMPTY_SUMMARY_BY_PERIOD: EquityCurveRangeSummaryByPeriod = {
    "7d": { startValue: null, endValue: null, changePct: 0, insufficientHistory: false },
    "30d": { startValue: null, endValue: null, changePct: 0, insufficientHistory: false },
    "90d": { startValue: null, endValue: null, changePct: 0, insufficientHistory: false },
    All: { startValue: null, endValue: null, changePct: 0, insufficientHistory: false },
};

function calculateChangePct(points: Point[]) {
    const firstValue = points[0]?.value;
    const lastValue = points[points.length - 1]?.value;
    if (points.length < 2 || firstValue === undefined || firstValue === 0 || lastValue === undefined) {
        return 0;
    }
    return ((lastValue - firstValue) / firstValue) * 100;
}

function toRangeKey(period: Period): keyof EquityCurveApiResponse["ranges"] {
    return period === "All" ? "all" : period;
}

function mapApiResponse(response: EquityCurveApiResponse) {
    const dataByPeriod = { ...EMPTY_DATA_BY_PERIOD };
    const summaryByPeriod = { ...EMPTY_SUMMARY_BY_PERIOD };

    for (const period of PERIOD_KEYS) {
        const range = response.ranges[toRangeKey(period)];
        const slicedPoints = response.points
            .slice(range.startIndex, range.endIndex + 1)
            .map((point) => ({
                date: point.date,
                value: point.balanceValue,
            }));

        dataByPeriod[period] = slicedPoints;

        const startValue = range.startValue ?? slicedPoints[0]?.value ?? null;
        const endValue = range.endValue ?? slicedPoints[slicedPoints.length - 1]?.value ?? null;
        const changePct = range.changePct ?? calculateChangePct(slicedPoints);

        summaryByPeriod[period] = {
            startValue,
            endValue,
            changePct,
            insufficientHistory: range.insufficientHistory,
        };
    }

    return { dataByPeriod, summaryByPeriod };
}

function toIsoDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function generateSampleApiPoints(totalDays: number): ApiPoint[] {
    const startDate = new Date("2026-01-01T00:00:00.000Z");
    let currentBalance = 18000;
    const points: ApiPoint[] = [];

    for (let i = 0; i < totalDays; i++) {
        if (i > 0) {
            let delta = 0;

            if (i <= 30) {
                delta = 25; // Early steady growth
            } else if (i <= 60) {
                delta = -35; // Drawdown phase
            } else if (i <= 90) {
                delta = 35 + (i % 2 === 0 ? 40 : -20); // Volatile recovery
            } else if (i <= 112) {
                delta = -45; // Recent downtrend (impacts 30d)
            } else {
                delta = 90; // Sharp rebound (impacts 7d)
            }

            currentBalance += delta;
        }

        const pointDate = new Date(startDate);
        pointDate.setUTCDate(startDate.getUTCDate() + i);

        const previousValue = points[i - 1]?.balanceValue ?? currentBalance;
        points.push({
            date: toIsoDate(pointDate),
            balanceValue: Number(currentBalance.toFixed(2)),
            dailyChange: Number((currentBalance - previousValue).toFixed(2)),
        });
    }

    return points;
}

function buildRange(points: ApiPoint[], startIndex: number, endIndex: number): ApiRange {
    const clampedStart = Math.max(0, startIndex);
    const clampedEnd = Math.min(points.length - 1, endIndex);
    const rangePoints = points.slice(clampedStart, clampedEnd + 1);
    const startValue = rangePoints[0]?.balanceValue;
    const endValue = rangePoints[rangePoints.length - 1]?.balanceValue;
    const changePct =
        startValue && startValue !== 0 && endValue !== undefined
            ? Number((((endValue - startValue) / startValue) * 100).toFixed(2))
            : 0;

    return {
        startIndex: clampedStart,
        endIndex: clampedEnd,
        pointsCount: rangePoints.length,
        insufficientHistory: rangePoints.length < 3,
        startValue: startValue ?? 0,
        endValue: endValue ?? 0,
        changePct,
    };
}

function buildSampleRanges(points: ApiPoint[]): EquityCurveApiResponse["ranges"] {
    const lastIndex = points.length - 1;
    const periodStart: Record<ApiRangeKey, number> = {
        "7d": Math.max(0, points.length - 7),
        "30d": Math.max(0, points.length - 30),
        "90d": Math.max(0, points.length - 90),
        all: 0,
    };

    return {
        "7d": buildRange(points, periodStart["7d"], lastIndex),
        "30d": buildRange(points, periodStart["30d"], lastIndex),
        "90d": buildRange(points, periodStart["90d"], lastIndex),
        all: buildRange(points, periodStart.all, lastIndex),
    };
}

export function useEquityCurve() {
    const [data, setData] = useState<EquityCurveDataByPeriod>(EMPTY_DATA_BY_PERIOD);
    const [summaryByPeriod, setSummaryByPeriod] = useState<EquityCurveRangeSummaryByPeriod>(EMPTY_SUMMARY_BY_PERIOD);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const timeoutId = window.setTimeout(() => {
            const mapped = mapApiResponse(SAMPLE_BACKEND_RESPONSE);
            setData(mapped.dataByPeriod);
            setSummaryByPeriod(mapped.summaryByPeriod);
            setLoading(false);
        }, MOCK_FETCH_DELAY_MS);

        return () => window.clearTimeout(timeoutId);
    }, []);

    return { data, summaryByPeriod, loading };
}

// Sample payload shape expected from backend.
// Replace mock generation with this response object once API is ready.
export const SAMPLE_BACKEND_RESPONSE: EquityCurveApiResponse = {
    userId: 1878,
    asOfDate: "2026-04-14",
    points: generateSampleApiPoints(120),
    ranges: buildSampleRanges(generateSampleApiPoints(120)),
};