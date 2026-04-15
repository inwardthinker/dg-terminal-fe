"use client";

import { useState } from "react";
import type { TradeHistoryEntry, TradeHistoryPeriod } from "../types";

const PERIODS: TradeHistoryPeriod[] = ["7d", "30d", "90d", "All"];

type TradeHistoryPanelProps = {
  trades: TradeHistoryEntry[];
  total: number;
  loading?: boolean;
};

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(n));

function ResultBadge({ result }: { result: TradeHistoryEntry["result"] }) {
  const cls = {
    WON:    "bg-[rgba(76,175,125,0.18)]  border border-[rgba(76,175,125,0.3)]   text-pos",
    LOST:   "bg-[rgba(224,92,92,0.18)]   border border-[rgba(224,92,92,0.3)]    text-neg",
    PUSHED: "bg-[rgba(154,148,136,0.15)] border border-[rgba(154,148,136,0.3)]  text-t-3",
  }[result];

  return (
    <span className={`inline-block rounded-r3 px-[9px] py-[3px] text-[10px] font-[700] ${cls}`}>
      {result}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 px-[14px] py-[12px] flex flex-col gap-[4px]">
      <div className="h-[14px] w-1/3 bg-bg-2 rounded-r2 animate-pulse mb-sp2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-[28px] bg-bg-2 rounded-r2 animate-pulse" />
      ))}
    </div>
  );
}

export function TradeHistoryPanel({
  trades,
  total,
  loading,
}: TradeHistoryPanelProps) {
  const [period, setPeriod] = useState<TradeHistoryPeriod>("30d");

  if (loading) return <Skeleton />;

  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 px-[14px] py-[12px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-sp4">
        <span className="text-panel">Trade history</span>

        <div className="flex items-center gap-sp7">
          {/* Period tabs */}
          <div className="flex gap-[3px]">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                aria-pressed={period === p}
                className={`px-sp3 py-[2px] rounded-r2 text-[9px] cursor-pointer transition-colors ${
                  period === p
                    ? "bg-[rgba(205,189,112,0.12)] text-g-3"
                    : "text-t-3 hover:text-t-2"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button className="text-action">Export CSV ↓</button>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[58px_1fr_34px_58px_48px_48px_60px_54px] gap-[3px] text-[8.5px] text-t-3 pb-[5px] border-b border-line-c mb-[2px]">
        <span>Date</span>
        <span>Market</span>
        <span>Side</span>
        <span>Entry</span>
        <span>Exit</span>
        <span>Size</span>
        <span>Result</span>
        <span className="text-right">P&amp;L</span>
      </div>

      {/* Rows */}
      {trades.map((trade) => (
        <div
          key={trade.id}
          className="grid grid-cols-[58px_1fr_34px_58px_48px_48px_60px_54px] gap-[3px] items-center py-[5px] border-b border-[rgba(255,255,255,0.05)] last:border-0 text-[10px] text-t-2 cursor-pointer hover:bg-[rgba(255,255,255,0.025)] transition-colors"
        >
          <span className="text-t-3">{trade.date}</span>

          <span
            className="overflow-hidden text-ellipsis whitespace-nowrap"
            title={trade.market}
          >
            {trade.market}
          </span>

          <span
            className={
              trade.side === "YES"
                ? "text-pos font-[700]"
                : "text-neg font-[700]"
            }
          >
            {trade.side}
          </span>

          <span>{trade.entry.toFixed(2)}</span>
          <span>{trade.exit.toFixed(2)}</span>
          <span>{formatUsd(trade.size)}</span>

          <span>
            <ResultBadge result={trade.result} />
          </span>

          <span
            className={`text-right font-[600] ${
              trade.pnl >= 0 ? "text-pos" : "text-neg"
            }`}
          >
            {trade.pnl >= 0 ? "+" : ""}
            {formatUsd(trade.pnl)}
          </span>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-between items-center pt-[7px] border-t border-[rgba(255,255,255,0.05)] text-[10px] text-t-3 mt-[3px]">
        <span>
          Showing 1–{trades.length} of {total} trades
        </span>
        <div className="flex gap-sp7">
          <button className="text-t-3 cursor-pointer hover:text-t-2 transition-colors">
            ← Prev
          </button>
          <button className="text-g-3 font-[600] cursor-pointer">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
