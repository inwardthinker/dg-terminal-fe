export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
  },
  portfolio: {
    summary: '/api/portfolio/summary',
    polymarketTrades: '/api/trades-results',
  },
  users: {},
  payments: {},
} as const
