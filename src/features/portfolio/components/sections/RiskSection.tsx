import { SummaryPanelContainer } from '@/features/open-positions'
import { RiskMetricsPanel } from '@/features/portfolio/components/panels/RiskMetricsPanel'
import type { PortfolioData } from '@/features/portfolio/types'

type RiskSectionProps = {
  portfolio: PortfolioData | null
  loading: boolean
  venueUnavailable?: boolean
}

export function RiskSection({ portfolio, loading, venueUnavailable = false }: RiskSectionProps) {
  const hasNoOpenPositions = !loading && portfolio?.kpis.openCount === 0

  return (
    <div className="grid min-w-0 gap-sp4 lg:grid-cols-[1fr_1.85fr]">
      <RiskMetricsPanel />
      <SummaryPanelContainer
        limit={3}
        forceEmptyState={hasNoOpenPositions}
        venueUnavailableOverride={venueUnavailable}
      />
    </div>
  )
}
