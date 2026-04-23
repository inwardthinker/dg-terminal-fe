import { InfoTooltip } from '@/components/ui/InfoTooltip'
import type { RiskMetric, RiskMetricValueType } from '@/features/portfolio/types'
import clsx from 'clsx'

function valueColorClass(type: RiskMetricValueType): string {
  switch (type) {
    case 'positive':
      return 'text-pos'
    case 'negative':
      return 'text-neg'
    case 'gold':
      return 'text-g-3 cursor-pointer'
    default:
      return 'text-t-1'
  }
}

type RiskMetricsPanelProps = {
  metrics: RiskMetric[]
  loading?: boolean
}

function Skeleton() {
  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5 flex flex-col">
      <div className="h-[14px] w-2/5 bg-bg-2 rounded-r2 animate-pulse mb-sp4" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center py-[5px] border-b border-[rgba(255,255,255,0.06)] last:border-0"
        >
          <div className="h-[11px] w-1/2 bg-bg-2 rounded-r1 animate-pulse" />
          <div className="h-[11px] w-[40px] bg-bg-2 rounded-r1 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function RiskMetricsPanel({ metrics, loading }: RiskMetricsPanelProps) {
  const isEmpty = metrics.length === 0
  if (loading) return <Skeleton />

  return (
    <div
      className={clsx(
        'border border-line-c rounded-r7 p-sp5 flex flex-col h-full',
        isEmpty ? 'bg-bg-1/35' : 'bg-bg-1',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-sp4">
        <span className={clsx(isEmpty ? 'text-t-3' : 'text-primary')}>Risk metrics</span>
      </div>

      {/* Metric rows — flex-1 so they fill remaining height evenly */}
      {isEmpty ? (
        <div className="flex-1 grid place-items-center text-support">No history yet</div>
      ) : (
        <div className="flex flex-col flex-1 divide-y divide-[rgba(255,255,255,0.06)]">
          {metrics.map((metric) => (
            <div
              key={metric.key}
              className="flex flex-1 justify-between items-center py-sp2 text-secondary"
            >
              <div className="text-t-3 flex items-center gap-sp2">
                <span>{metric.label}</span>
                <InfoTooltip text={metric.tooltip} />
              </div>
              <span className={`font-semibold ${valueColorClass(metric.valueType)}`}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
