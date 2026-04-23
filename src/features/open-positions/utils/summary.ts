import type { ApiKpis } from '../types'

type SummaryInput = {
  size: number
  pnl: number
  deployedValue?: number
  positionValue?: number
}

export function computeSummaryKpis(positions: SummaryInput[]): ApiKpis {
  let totalExposure = 0
  let unrealizedPnl = 0
  let largestPositionValue = 0

  for (const position of positions) {
    const deployed = position.deployedValue ?? position.size
    const value = position.positionValue ?? position.size

    totalExposure += deployed
    unrealizedPnl += position.pnl
    if (value > largestPositionValue) {
      largestPositionValue = value
    }
  }

  const largestPositionPct = totalExposure > 0 ? (largestPositionValue / totalExposure) * 100 : 0

  return {
    totalOpen: positions.length,
    totalExposure,
    unrealizedPnl,
    largestPositionValue,
    largestPositionPct,
  }
}
