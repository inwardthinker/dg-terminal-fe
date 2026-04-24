// src/features/equity-curve/EquityCurvePanel.tsx
'use client'

import { useMemo, useRef, useState } from 'react'

import { EquityCurveChart } from '@/features/equity-curve/components/EquityCurveChart'
import { InfoTooltip } from '@/components/ui/InfoTooltip'
import { calculateChange, getCurrentData, getDateLabels, type Period } from '../utils'
import { useEquityCurve } from '@/features/equity-curve/hooks/useEquityCurve'
import { DotSeparator } from '@/components/ui/DotSeparator'
import { useElementWidth } from '../hooks/useElementWidth'
import { PERIOD_TO_RANGE_KEY } from '../utils/contants'

const periods = ['7d', '30d', '90d', 'All'] as const
const chartSkeleton = <div className="w-full h-full bg-bg-2 rounded-r4 animate-pulse" />

export function EquityCurvePanel() {
  const [period, setPeriod] = useState<Period>('30d')
  const { data: history, loading } = useEquityCurve()

  const currentRange = useMemo(() => {
    if (!history) return null
    return history.ranges[PERIOD_TO_RANGE_KEY[period]]
  }, [history, period])

  const currentData = useMemo(() => {
    if (!history || !currentRange) return []
    return getCurrentData(history.points, currentRange)
  }, [history, currentRange])

  const xAxisLabels = useMemo(() => getDateLabels(currentData, period), [currentData, period])

  const change = useMemo(() => {
    if (!currentRange) return 0
    return calculateChange(currentData, currentRange.changePct)
  }, [currentData, currentRange])

  const changeMeta = useMemo(() => {
    const isPositive = change >= 0
    return {
      isPositive,
      className: isPositive ? 'text-pos!' : 'text-neg!',
      sign: isPositive ? '+' : '',
    }
  }, [change])

  const containerRef = useRef<HTMLDivElement>(null)
  const width = useElementWidth(containerRef)

  const showChart = !loading && currentRange && width > 0

  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5 flex flex-col gap-sp4">
      {/* Header */}
      <div className="flex flex-col gap-sp3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          <span className="text-primary leading-none">Equity curve</span>
          <DotSeparator size={4} />
          <span className={`leading-none text-secondary ${changeMeta.className}`}>
            {changeMeta.sign}
            {change.toFixed(1)}%
          </span>

          <InfoTooltip text="Your total balance over time, using daily closing snapshots. Reflects deposits, withdrawals, and settled P&L." />
        </div>

        <div className="flex gap-sp2" role="group" aria-label="Equity curve period selector">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={`px-sp3 py-sp2 rounded-r2 text-button ${
                period === p ? 'bg-line-g text-g3' : 'text-t-2'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div>
        <div ref={containerRef} className="h-[180px]">
          {showChart ? (
            <EquityCurveChart
              data={currentData}
              width={width}
              color={changeMeta.isPositive ? 'pos' : 'neg'}
            />
          ) : (
            chartSkeleton
          )}
        </div>

        <div className="flex justify-between mt-sp2 text-support text-t-3">
          <span>{xAxisLabels[0]}</span>
          <span>{xAxisLabels[1]}</span>
          <span>{xAxisLabels[2]}</span>
        </div>
      </div>
    </div>
  )
}
