import { RiskMetricValueType } from '../types'

export function valueColorClass(type: RiskMetricValueType): string {
  switch (type) {
    case 'positive':
      return 'text-pos'
    case 'warning':
      return 'text-g-3 cursor-pointer'
    case 'negative':
      return 'text-neg'
    case 'neutral':
      return 'text-t-1'
    case 'muted':
      return 'text-t-3'
    default:
      return 'text-t-1'
  }
}
