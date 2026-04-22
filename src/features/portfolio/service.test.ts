import { describe, expect, it, vi } from "vitest";

import { fetchOpenPositionsSummary } from "./service";

const { apiFetchMock } = vi.hoisted(() => ({
  apiFetchMock: vi.fn(),
}));

vi.mock("@/lib/api/client", () => ({
  apiFetch: apiFetchMock,
}));

describe("fetchOpenPositionsSummary", () => {
  it("calls the open positions summary endpoint and maps response", async () => {
    apiFetchMock.mockResolvedValueOnce({
      open_positions: 5,
      total_exposure: 12345,
      largest_position: 2200,
      unrealized_pnl: -340,
    });

    const result = await fetchOpenPositionsSummary(
      "0x1111111111111111111111111111111111111111"
    );

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/portfolio/open-positions-summary?wallet=0x1111111111111111111111111111111111111111"
    );
    expect(result).toEqual({
      openPositions: 5,
      totalExposure: 12345,
      largestPosition: 2200,
      unrealizedPnl: -340,
    });
  });
});
