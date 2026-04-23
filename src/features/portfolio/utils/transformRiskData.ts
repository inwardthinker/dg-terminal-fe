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

function sharpeValueType(value?: number): RiskMetric['valueType'] {
  if (value === null || value === undefined) return 'negative'
  if (value > 1.5) return 'positive'
  if (value >= 0.5) return 'warning'
  return 'negative'
}

function sortinoValueType(value?: number): RiskMetric['valueType'] {
  if (value === null || value === undefined) return 'negative'
  if (value > 2) return 'positive'
  if (value >= 1) return 'warning'
  return 'negative'
}

function largestPositionValueType(value?: number | null): RiskMetric['valueType'] {
  if (value === null || value === undefined) return 'muted'
  if (value < 10) return 'positive'
  if (value <= 15) return 'warning'
  return 'negative'
}

function correlationClusterValueType(value?: number | null): RiskMetric['valueType'] {
  if (value === null || value === undefined || value === 0) return 'muted'
  if (value <= 3) return 'warning'
  return 'negative'
}

export function transformRiskData(apiData: ApiRiskResponse): RiskMetric[] {
  if (!apiData) return []

  return [
    {
      key: 'sharpe',
      label: 'Sharpe (90d)',
      value: formatNumber(apiData.sharpe90d),
      valueType: sharpeValueType(apiData.sharpe90d),
      tooltip: 'Mean daily return divided by standard deviation, annualized.',
    },
    {
      key: 'sortino',
      label: 'Sortino',
      value: formatNumber(apiData.sortino90d),
      valueType: sortinoValueType(apiData.sortino90d),
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
      valueType: largestPositionValueType(apiData.largestPositionPct),
      tooltip: 'Biggest open bet as % of total balance.',
    },
    {
      key: 'correlationCluster',
      label: 'Correlation cluster',
      value:
        apiData.correlationClusterCount === null || apiData.correlationClusterCount === undefined
          ? '--'
          : `${apiData.correlationClusterCount} watch`,
      valueType: correlationClusterValueType(apiData.correlationClusterCount),
      tooltip: 'Positions sharing same theme/event.',
    },
  ]
}
