"use client";

import { useEffect, useMemo, useState } from "react";

import type { Position, UsePositionsParams, UsePositionsResult } from "../types";

const mockPositions: Position[] = [
  {
    id: "pos-1",
    market: "Will BTC close above $80k this quarter?",
    category: "Crypto",
    side: "YES",
    entryPrice: 0.54,
    currentPrice: 0.68,
    size: 420,
    pnl: 58.8,
    pnlPct: 25.93,
  },
  {
    id: "pos-2",
    market: "US CPI prints below 3.0% by June",
    category: "Macro",
    side: "YES",
    entryPrice: 0.48,
    currentPrice: 0.59,
    size: 360,
    pnl: 39.6,
    pnlPct: 22.92,
  },
  {
    id: "pos-3",
    market: "Premier League winner: Arsenal",
    category: "Sports",
    side: "NO",
    entryPrice: 0.61,
    currentPrice: 0.52,
    size: 300,
    pnl: 27,
    pnlPct: 14.75,
  },
  {
    id: "pos-4",
    market: "ETH ETF approval before year-end",
    category: "Crypto",
    side: "YES",
    entryPrice: 0.44,
    currentPrice: 0.5,
    size: 280,
    pnl: 16.8,
    pnlPct: 13.64,
  },
  {
    id: "pos-5",
    market: "US election winner: Democratic nominee",
    category: "Politics",
    side: "YES",
    entryPrice: 0.49,
    currentPrice: 0.53,
    size: 200,
    pnl: 8,
    pnlPct: 8.16,
  },
  {
    id: "pos-6",
    market: "Fed cuts rates 2+ times this year",
    category: "Macro",
    side: "NO",
    entryPrice: 0.57,
    currentPrice: 0.56,
    size: 250,
    pnl: -2.5,
    pnlPct: -1.75,
  },
  {
    id: "pos-7",
    market: "Lakers reach conference finals",
    category: "Sports",
    side: "YES",
    entryPrice: 0.41,
    currentPrice: 0.38,
    size: 300,
    pnl: -9,
    pnlPct: -7.32,
  },
  {
    id: "pos-8",
    market: "SOL closes above $250 by September",
    category: "Crypto",
    side: "NO",
    entryPrice: 0.35,
    currentPrice: 0.3,
    size: 260,
    pnl: -13,
    pnlPct: -14.29,
  },
  {
    id: "pos-9",
    market: "NATO expands membership this year",
    category: "Politics",
    side: "YES",
    entryPrice: 0.39,
    currentPrice: 0.42,
    size: 190,
    pnl: 5.7,
    pnlPct: 7.69,
  },
  {
    id: "pos-10",
    market: "S&P 500 closes above 6200 by Q4",
    category: "Macro",
    side: "YES",
    entryPrice: 0.46,
    currentPrice: 0.51,
    size: 340,
    pnl: 17,
    pnlPct: 10.87,
  },
  {
    id: "pos-11",
    market: "Oscar winner: Best Picture contender A",
    category: "Other",
    side: "NO",
    entryPrice: 0.62,
    currentPrice: 0.57,
    size: 210,
    pnl: 10.5,
    pnlPct: 8.06,
  },
  {
    id: "pos-12",
    market: "India GDP growth above 7% this FY",
    category: "Macro",
    side: "YES",
    entryPrice: 0.52,
    currentPrice: 0.6,
    size: 260,
    pnl: 20.8,
    pnlPct: 15.38,
  },
];

export function usePositions({ limit, sortBy = "pnl" }: UsePositionsParams = {}): UsePositionsResult {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoading(false)
      setError(null)
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const totalCount = mockPositions.length

  const positions = useMemo(() => {
    let data = [...mockPositions]

    if (sortBy === "pnl") {
      data.sort((a, b) => b.pnl - a.pnl)
    }

    if (limit) {
      data = data.slice(0, limit)
    }

    return data
  }, [limit, sortBy])

  return { positions, totalCount, loading, error }
}