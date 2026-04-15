import { InfoTooltip } from "@/components/ui/InfoTooltip";
import type { ReactNode } from "react";

type KpiTileProps = {
  label: string;
  value: string;
  /** Tailwind class applied to the value, e.g. "text-pos", "text-neg", "text-g-3" */
  valueClass?: string;
  sub?: string;
  subPositive?: boolean;
  subNegative?: boolean;
  /** Tooltip text shown on (i) hover */
  tooltip?: string;
  /** Reduces opacity for zero/unavailable states */
  dimmed?: boolean;
  /** Rendered below the sub-label — used for Deposit/Withdraw buttons */
  footer?: ReactNode;
};

export function KpiTile({
  label,
  value,
  valueClass,
  sub,
  subPositive,
  subNegative,
  tooltip,
  dimmed,
  footer,
}: KpiTileProps) {
  const subClass = subPositive
    ? "text-pos"
    : subNegative
      ? "text-neg"
      : "text-t-3";

  return (
    <div
      className={`bg-bg-2 rounded-r6 px-[11px] py-[10px] flex flex-col transition-opacity ${
        dimmed ? "opacity-35" : ""
      }`}
    >
      {/* Label row */}
      <div className="flex items-center gap-sp2 text-[8.5px] text-t-3 uppercase tracking-[0.08em] mb-[3px]">
        <span>{label}</span>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>

      {/* Value */}
      <div
        className={`text-[15px] font-[700] leading-[1.2] ${
          valueClass ?? "text-t-1"
        }`}
      >
        {value}
      </div>

      {/* Sub-label */}
      {sub && (
        <div className={`text-[9.5px] mt-[2px] ${subClass}`}>{sub}</div>
      )}

      {/* Optional footer (e.g. action buttons) */}
      {footer && <div className="mt-[7px]">{footer}</div>}
    </div>
  );
}
