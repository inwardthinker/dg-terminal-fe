"use client";

import { useMemo, useState } from "react";
import type { TradeHistoryEntry, TradeHistoryPeriod } from "../types";

const PERIODS: TradeHistoryPeriod[] = ["7d", "30d", "90d", "All"];
const PAGE_SIZE = 10;

const TRADE_HISTORY_GRID_TEMPLATE =
  "grid-cols-[minmax(64px,0.9fr)_minmax(220px,2.5fr)_minmax(48px,0.7fr)_minmax(64px,0.9fr)_minmax(56px,0.8fr)_minmax(72px,0.9fr)_minmax(90px,1.1fr)_minmax(76px,1fr)]";
const TRADE_HISTORY_GRID_CLASS = `grid ${TRADE_HISTORY_GRID_TEMPLATE} gap-sp2`;

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
    <span className={`inline-block rounded-r3 px-[9px] py-[3px] text-button ${cls}`}>
      {result}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5 flex flex-col gap-[4px]">
      <div className="h-[14px] w-1/3 bg-bg-2 rounded-r2 animate-pulse mb-sp2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-[28px] bg-bg-2 rounded-r2 animate-pulse" />
      ))}
    </div>
  );
}

/** Returns a cutoff ISO date string for the given period relative to today. */
function getCutoffDate(period: TradeHistoryPeriod): string | null {
  if (period === "All") return null;
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function exportCsv(trades: TradeHistoryEntry[]) {
  const headers = ["Date", "Market", "Side", "Entry", "Exit", "Size (USD)", "Result", "P&L (USD)"];
  const rows = trades.map((t) => [
    t.date,
    `"${t.market.replace(/"/g, '""')}"`,
    t.side,
    t.entry.toFixed(2),
    t.exit.toFixed(2),
    t.size,
    t.result,
    t.pnl,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trade-history.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function TradeHistoryPanel({
  trades,
  total: _total,
  loading,
}: TradeHistoryPanelProps) {
  const [period, setPeriod] = useState<TradeHistoryPeriod>("30d");
  const [page, setPage] = useState(1);

  // Filter by period
  const filtered = useMemo(() => {
    const cutoff = getCutoffDate(period);
    if (!cutoff) return trades;
    return trades.filter((t) => t.isoDate >= cutoff);
  }, [trades, period]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  function handlePeriodChange(p: TradeHistoryPeriod) {
    setPeriod(p);
    setPage(1);
  }

  if (loading) return <Skeleton />;

  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sp3 mb-sp4">
        <span className="text-primary">Trade history</span>

        <div className="flex items-center gap-sp5 sm:gap-sp7 flex-wrap">
          {/* Period tabs */}
          <div className="flex gap-[3px]">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                aria-pressed={period === p}
                className={`px-sp3 py-sp2 rounded-r2 text-button cursor-pointer transition-colors ${
                  period === p
                    ? "bg-[rgba(205,189,112,0.12)] text-g-3"
                    : "text-t-3 hover:text-t-2"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="text-action"
            onClick={() => exportCsv(filtered)}
          >
            Export CSV ↓
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-sp5 px-sp5">
      <div className="min-w-[720px]">
      {/* Column headers */}
      <div className={`${TRADE_HISTORY_GRID_CLASS} text-support pb-[5px] border-b border-line-c mb-[2px]`}>
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
      {pageRows.length === 0 ? (
        <div className="text-support py-sp7 text-center">No trades in this period.</div>
      ) : (
        pageRows.map((trade) => (
          <div
            key={trade.id}
            className={`${TRADE_HISTORY_GRID_CLASS} items-center py-[5px] border-b border-[rgba(255,255,255,0.05)] last:border-0 text-secondary cursor-pointer hover:bg-[rgba(255,255,255,0.025)] transition-colors`}
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
                  ? "text-pos font-bold"
                  : "text-neg font-bold"
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
              className={`text-right font-semibold ${
                trade.pnl >= 0 ? "text-pos" : "text-neg"
              }`}
            >
              {trade.pnl >= 0 ? "+" : ""}
              {formatUsd(trade.pnl)}
            </span>
          </div>
        ))
      )}

      </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-[7px] border-t border-[rgba(255,255,255,0.05)] text-support mt-[3px] gap-sp3 flex-wrap">
        <span>
          {filtered.length === 0
            ? "No trades"
            : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length} trades`}
        </span>
        <div className="flex gap-sp7">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className={`cursor-pointer transition-colors ${
              safePage <= 1
                ? "text-t-3 opacity-40 cursor-default"
                : "text-t-3 hover:text-t-2"
            }`}
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className={`font-semibold cursor-pointer transition-colors ${
              safePage >= totalPages
                ? "text-t-3 opacity-40 cursor-default"
                : "text-g-3"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
