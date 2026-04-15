import type { ExposureCategory } from "../types";

type ExposureCategoryPanelProps = {
  exposure: ExposureCategory[];
  loading?: boolean;
};

const formatAmount = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function Skeleton() {
  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 px-[14px] py-[12px] flex flex-col gap-sp3">
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
}: ExposureCategoryPanelProps) {
  if (loading) return <Skeleton />;

  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 px-[14px] py-[12px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-sp4">
        <span className="text-panel">Exposure by category</span>
      </div>

      {/* Scrollable category list */}
      <div className="max-h-[148px] overflow-y-auto pr-[4px] flex flex-col gap-[7px] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:bg-[rgba(255,255,255,0.1)] [&::-webkit-scrollbar-thumb]:rounded-[2px]">
        {exposure.map((cat) => (
          <div key={cat.name}>
            {/* Category label row */}
            <div className="flex justify-between items-center text-[9.5px] text-t-2 mb-[3px]">
              <div className="flex items-center gap-[6px]">
                <div
                  className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                  style={{ background: cat.color }}
                />
                <span>{cat.name}</span>
              </div>
              <span>
                {formatAmount(cat.amount)} · {cat.pct}%
              </span>
            </div>

            {/* Bar */}
            <div className="h-[3px] rounded-r1 bg-[rgba(255,255,255,0.06)]">
              <div
                className="h-[3px] rounded-r1"
                style={{ background: cat.color, width: `${cat.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overflow hint */}
      <div className="text-[8.5px] text-t-3 pt-[5px] border-t border-[rgba(255,255,255,0.05)] mt-[3px] text-center">
        ↑ scroll for more categories
      </div>
    </div>
  );
}
