import type { ApiRiskResponse, RiskMetric } from '@/features/portfolio/types'

function formatNumber(value?: number, decimals = 2) {
  if (value === null || value === undefined) return '--'
  return value.toFixed(decimals)
}

function formatPercent(value?: number) {
  if (value === null || value === undefined) return '--'
  return `${value.toFixed(1)}%`
}

function formatDollar(value?: number) {
  if (value === null || value === undefined) return '--'
  return `$${Math.round(value).toLocaleString()}`
}

export function transformRiskData(apiData: ApiRiskResponse): RiskMetric[] {
  if (!apiData) return []

  return [
    {
      key: 'sharpe',
      label: 'Sharpe (90d)',
      value: formatNumber(apiData.sharpe90d),
      valueType: (apiData.sharpe90d ?? 0) > 1 ? 'positive' : 'negative',
      tooltip: 'Mean daily return divided by standard deviation, annualized.',
    },
    {
      key: 'sortino',
      label: 'Sortino',
      value: formatNumber(apiData.sortino90d),
      valueType: (apiData.sortino90d ?? 0) > 1 ? 'positive' : 'negative',
      tooltip: 'Like Sharpe, but only penalizes downside volatility.',
    },
    {
      key: 'maxDrawdown',
      label: 'Max drawdown',
      value: formatPercent(apiData.maxDrawdown90dPct),
      valueType: 'negative',
      tooltip: 'The largest peak-to-trough drop in portfolio value.',
    },
    {
      key: 'var',
      label: 'VaR (95%)',
      value: formatDollar(apiData.var95Dollar),
      valueType: 'neutral',
      tooltip: 'Maximum expected 1-day loss at 95% confidence.',
    },
    {
      key: 'largestPosition',
      label: 'Largest position',
      value: formatPercent(apiData.largestPositionPct ?? undefined),
      valueType: 'neutral',
      tooltip: 'Biggest open bet as % of total balance.',
    },
    {
      key: 'correlationCluster',
      label: 'Correlation cluster',
      value:
        apiData.correlationClusterCount != null ? `${apiData.correlationClusterCount} watch` : '--',
      valueType: 'gold',
      tooltip: 'Positions sharing same theme/event.',
    },
  ]
}
