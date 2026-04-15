import { InfoTooltip } from "@/components/ui/InfoTooltip"
import type { ReactNode } from "react"
import clsx from "clsx"
import { DotSeparator } from "@/components/ui/DotSeparator"

type Variant = "default" | "positive" | "negative" | "accent"

export type KpiCardProps = {
  label: string
  value: string
  meta?: string

  valueVariant?: Variant
  valueClass?: string

  sub?: string
  subVariant?: Variant

  tooltip?: string
  dimmed?: boolean
  footer?: ReactNode
}

const valueClassMap = {
  default: "text-t-1",
  positive: "text-pos",
  negative: "text-neg",
  accent: "text-g-3",
}

const subClassMap = {
  default: "text-t-3",
  positive: "text-pos",
  negative: "text-neg",
  accent: "text-g-3",
}

export function KpiCard({
  label,
  value,
  meta,
  valueVariant = "default",
  sub,
  subVariant = "default",
  tooltip,
  dimmed,
  footer,
}: KpiCardProps) {
  return (
    <div
      className={clsx(
        "relative rounded-r7 px-sp5 py-sp4 flex flex-col gap-[2px]",
        "bg-linear-to-b transition-transform from-[#1a1914] to-[#14130f]",
        "border border-[rgba(255,255,255,0.04)]",
        dimmed && "opacity-[0.35]"
      )}
    >
      {/* Label */}
      <div className="flex items-center gap-sp2 text-[9px] tracking-[0.08em] uppercase text-t-3">
        <span>{label}</span>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>

      {/* Value */}
      <div className="flex items-center gap-1">
        <span className={clsx("text-primary font-bold", valueClassMap[valueVariant])}>
          {value}
        </span>

        {meta && (
          <div className="flex items-center gap-1">
            <DotSeparator size={4} />
            <span className="text-primary">
              {meta}
            </span>
          </div>
        )}
      </div>

      {/* Sub */}
      {sub && (
        <div className={clsx("text-[11px] mt-[2px]", subClassMap[subVariant])}>
          {sub}
        </div>
      )}

      {/* Footer */}
      {footer && <div className="mt-[8px]">{footer}</div>}
    </div>
  )
}