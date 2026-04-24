import { EquityCurvePanel } from '@/features/equity-curve/components/EquityCurvePanel'
import { ExposureCategoryPanel } from '@/features/portfolio/components/panels/ExposureCategoryPanel'
import type { PortfolioData } from '@/features/portfolio/types'

type ExposureSectionProps = {
  portfolio: PortfolioData | null
  loading: boolean
}

export function ExposureSection({ portfolio, loading }: ExposureSectionProps) {
  const exposure = portfolio?.exposure ?? []

  return (
    <div className="grid min-w-0 gap-sp4 lg:grid-cols-[1.4fr_1fr]">
      <EquityCurvePanel />
      <ExposureCategoryPanel exposure={exposure} loading={loading} />
    </div>
  )
}
