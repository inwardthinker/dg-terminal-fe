"use client";

import { useEffect, useRef, useState } from "react";
import type { ExposureCategory } from "@/features/portfolio/types";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import clsx from "clsx";

type ExposureCategoryPanelProps = {
  exposure: ExposureCategory[];
  loading?: boolean;
  className?: string;
};

const formatAmount = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function Skeleton() {
  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5 flex flex-col gap-sp3">
      <div className="h-[14px] w-2/5 bg-bg-2 rounded-r2 animate-pulse" />
      <div className="flex flex-col gap-[7px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-[4px]">
            <div className="h-[11px] bg-bg-2 rounded-r1 animate-pulse" />
            <div className="h-[3px] bg-bg-2 rounded-r1 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExposureCategoryPanel({
  exposure,
  loading,
  className,
}: ExposureCategoryPanelProps) {
  const isEmpty = exposure.length === 0;
  const listRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const check = () => setIsScrollable(el.scrollHeight > el.clientHeight);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [exposure]);

  if (loading) return <Skeleton />;

  return (
    <div
      className={clsx(
        "border border-line-c rounded-r7 p-sp5 flex flex-col h-full",
        isEmpty ? "bg-bg-1/35" : "bg-bg-1",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-sp4">
        <div className="flex items-center gap-sp2">
          <span className={clsx(isEmpty ? "text-primary-muted" : "text-primary")}>Exposure by category</span>
          <InfoTooltip text="How your open capital is split across market categories. Based on cost basis of open positions only." />
        </div>
      </div>

      {/* Scrollable category list — flex-1 fills available height */}
      {isEmpty ? (
        <div className="flex-1 grid place-items-center text-support">No history yet</div>
      ) : (
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto pr-[4px] flex flex-col gap-[7px] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:bg-[rgba(255,255,255,0.1)] [&::-webkit-scrollbar-thumb]:rounded-[2px]"
        >
          {exposure.map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between items-center text-secondary-muted mb-[3px]">
                <div className="flex items-center gap-[6px]">
                  <div
                    className="w-[7px] h-[7px] rounded-full shrink-0"
                    style={{ background: cat.color }}
                  />
                  <span>{cat.name}</span>
                </div>
                <span>
                  {formatAmount(cat.amount)} · {cat.pct}%
                </span>
              </div>
              <div className="h-[3px] rounded-r1 bg-[rgba(255,255,255,0.06)]">
                <div
                  className="h-[3px] rounded-r1"
                  style={{ background: cat.color, width: `${cat.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Only shown when content overflows */}
      {!isEmpty && isScrollable && (
        <div className="text-support pt-[5px] border-t border-[rgba(255,255,255,0.05)] mt-[3px] text-center">
          ↑ scroll for more categories
        </div>
      )}
    </div>
  );
}
