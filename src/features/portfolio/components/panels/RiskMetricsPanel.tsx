import { InfoTooltip } from '@/components/ui/InfoTooltip'
import { useRiskMetrics } from '../hooks/useRiskMetrics'
import { valueColorClass } from '@/features/portfolio/utils/valueColorClass'

export function RiskMetricsPanel() {
  // TODO(dg-risk): Temporary separate fetch.
  // Acceptance requires risk metrics to recompute from portfolio/positions refresh events
  // with no standalone /api/risk call. After positions-risk integration lands, remove
  // useRiskMetrics and pass computed riskMetrics from usePortfolio -> RiskSection.
  const { data, isLoading } = useRiskMetrics(1878) // TODO: replace with actual user id

  if (isLoading) return <RiskMetricsPanelSkeleton />
  const isEmpty = data?.length === 0

  if (isEmpty) return <RiskMetricsEmptyState />

  return (
    <div className="border border-line-c rounded-r7 p-sp5 flex flex-col h-full bg-bg-1">
      <div className="flex items-center justify-between mb-sp4">
        <span className="text-primary">Risk metrics</span>
      </div>

      <div className="flex flex-col flex-1 divide-y divide-line-c">
        {data?.map((metric) => (
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
    </div>
  )
}

function RiskMetricsEmptyState() {
  return <div className="flex-1 grid place-items-center text-support">No risk metrics yet</div>
}
function RiskMetricsPanelSkeleton() {
  const labelWidths = ['w-[96px]', 'w-[58px]', 'w-[104px]', 'w-[72px]', 'w-[110px]', 'w-[118px]']
  const valueWidths = ['w-[34px]', 'w-[50px]', 'w-[38px]', 'w-[42px]', 'w-[18px]', 'w-[14px]']

  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5 flex flex-col h-full">
      <div className="h-[28px] flex items-center mb-sp2">
        <div className="h-[14px] w-[92px] bg-bg-2 rounded-r2 animate-pulse" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-1 justify-between items-center py-sp2 border-b border-line-c last:border-0"
        >
          <div className="flex items-center gap-sp2">
            <div className={`h-[11px] ${labelWidths[i]} bg-bg-2 rounded-r1 animate-pulse`} />
            <div className="h-[14px] w-[14px] rounded-full border border-line-c/50 bg-bg-0/40 animate-pulse" />
          </div>
          <div className={`h-[11px] ${valueWidths[i]} bg-bg-2 rounded-r1 animate-pulse`} />
        </div>
      ))}
    </div>
  )
}
