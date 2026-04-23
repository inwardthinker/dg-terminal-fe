// src/features/equity-curve/utils.ts

export type Point = {
  date: string
  value: number
}

export type Period = '7d' | '30d' | '90d' | 'All'

const CHART_VERTICAL_PADDING = 16

const X_AXIS_LABELS_BY_PERIOD: Record<Period, [string, string, string]> = {
  '7d': ['Day 1', 'Day 4', 'Day 7'],
  '30d': ['Day 1', 'Day 15', 'Day 30'],
  '90d': ['Day 1', 'Day 45', 'Day 90'],
  All: ['Start', 'Mid', 'End'],
}

const LENGTH_BY_PERIOD: Record<Period, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  All: 120,
}

export function getChartPoints(data: Point[], width: number, height: number) {
  if (!data || data.length < 3) return null

  let min = data[0].value
  let max = data[0].value

  for (let i = 1; i < data.length; i++) {
    const v = data[i].value
    if (v < min) min = v
    if (v > max) max = v
  }

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width
    const y =
      max === min
        ? height / 2
        : height - ((d.value - min) / (max - min)) * (height - CHART_VERTICAL_PADDING)
    return { x, y }
  })

  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return { points, d, min, max }
}

export function getXAxisLabels(period: Period) {
  return X_AXIS_LABELS_BY_PERIOD[period]
}

export function getLength(period: Period) {
  return LENGTH_BY_PERIOD[period]
}
