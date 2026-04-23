import { RiskMetricValueType } from '../types'

export function valueColorClass(type: RiskMetricValueType): string {
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
