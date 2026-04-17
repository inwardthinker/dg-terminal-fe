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
        "relative rounded-r6 px-sp5 py-sp4 flex flex-col justify-between",
        "bg-linear-to-b transition-transform from-[#1a1914] to-[#14130f]",
        "border border-[rgba(255,255,255,0.04)]",
        dimmed && "opacity-[0.35]"
      )}
    >
      {/* Top: label + value + sub */}
      <div className="flex flex-col gap-[2px]">
        <div className="flex items-center gap-sp2 text-badge-muted">
          <span>{label}</span>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>

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

        {sub && (
          <div className={clsx("text-support", subClassMap[subVariant])}>
            {sub}
          </div>
        )}
      </div>

      {/* Footer — pinned to bottom */}
      {footer && <div className="mt-sp3">{footer}</div>}
    </div>
  )
}