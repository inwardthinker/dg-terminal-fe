import { describe, expect, it, vi } from 'vitest'

const { apiFetchMock } = vi.hoisted(() => ({
  apiFetchMock: vi.fn(),
}))

vi.mock('@/lib/api/client', () => ({
  apiFetch: apiFetchMock,
}))

import { fetchOpenPositionsSummary } from './service'

describe('fetchOpenPositionsSummary', () => {
  it('calls the new endpoint with wallet query param', async () => {
    apiFetchMock.mockResolvedValueOnce({
      open_positions: 4,
      total_exposure: 1200,
      largest_position: 500,
      unrealized_pnl: 90,
    })

    await fetchOpenPositionsSummary('0xABCD1234')

    expect(apiFetchMock).toHaveBeenCalledWith(
      '/api/portfolio/open-positions-summary?wallet=0xABCD1234',
    )
  })
})
