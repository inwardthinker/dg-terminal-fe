export type ApiPoint = {
  date: string
  balanceValue: number
  dailyChange: number
}

export type ApiRange = {
  startIndex: number
  endIndex: number
  pointsCount: number
  insufficientHistory: boolean
  startValue?: number
  endValue?: number
  changePct?: number
}

export type EquityCurveApiResponse = {
  userId: number
  asOfDate: string
  points: ApiPoint[]
  ranges: {
    '7d': ApiRange
    '30d': ApiRange
    '90d': ApiRange
    all: ApiRange
  }
}

export const EMPTY_EQUITY_CURVE_RESPONSE: EquityCurveApiResponse = {
  userId: 0,
  asOfDate: '',
  points: [],
  ranges: {
    '7d': { startIndex: 0, endIndex: -1, pointsCount: 0, insufficientHistory: true, changePct: 0 },
    '30d': { startIndex: 0, endIndex: -1, pointsCount: 0, insufficientHistory: true, changePct: 0 },
    '90d': { startIndex: 0, endIndex: -1, pointsCount: 0, insufficientHistory: true, changePct: 0 },
    all: { startIndex: 0, endIndex: -1, pointsCount: 0, insufficientHistory: true, changePct: 0 },
  },
}

export type Range = {
  startIndex: number
  endIndex: number
  changePct?: number
}

export type HistoryPoint = {
  date: string
  balanceValue: number
}
