import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

const { usePortfolioMock } = vi.hoisted(() => ({
  usePortfolioMock: vi.fn(),
}));

vi.mock("@/features/portfolio/hooks", () => ({
  usePortfolio: usePortfolioMock,
}));

vi.mock("@/features/equity-curve/components/EquityCurvePanel", () => ({
  EquityCurvePanel: () => createElement("div", null, "equity-panel"),
}));

vi.mock("@/features/open-positions", () => ({
  SummaryPanelContainer: () => createElement("div", null, "summary-panel"),
}));

vi.mock("@/features/portfolio/components/ExposureCategoryPanel", () => ({
  ExposureCategoryPanel: () => createElement("div", null, "exposure-panel"),
}));

vi.mock("@/features/portfolio/components/RiskMetricsPanel", () => ({
  RiskMetricsPanel: () => createElement("div", null, "risk-panel"),
}));

vi.mock("@/features/portfolio/components/TradeHistoryPanel", () => ({
  TradeHistoryPanel: () => createElement("div", null, "history-panel"),
}));

vi.mock("@/components/ui/Breadcrumb", () => ({
  Breadcrumb: () => createElement("div", null, "breadcrumb"),
}));

vi.mock("@/components/ui/Button", () => ({
  Button: ({ children }: { children: ReactNode }) => (
    createElement("button", { type: "button" }, children)
  ),
}));

import PortfolioPage from "./page";

describe("PortfolioPage KPI summary", () => {
  it("renders portfolio KPI values", () => {
    usePortfolioMock.mockReturnValue({
      portfolio: {
        kpis: {
          balance: 12000,
          change24h: 250,
          openExposure: 3000,
          deployedPct: 25,
          unrealizedPnl: 200,
          unrealizedPct: 6.7,
          realized30d: 800,
          trades30d: 10,
          rewardsEarned: 50,
          rewardsPct: 1.2,
        },
        exposure: [],
        riskMetrics: [],
        tradeHistory: [],
        tradeHistoryTotal: 0,
      },
      loading: false,
      error: null,
    });

    render(createElement(PortfolioPage));

    expect(screen.getByText("Open Exposure")).toBeInTheDocument();
    expect(screen.getByText("$3,000")).toBeInTheDocument();
    expect(screen.getByText("+25.0%")).toBeInTheDocument();
    expect(screen.getByText("Unrealized P&L")).toBeInTheDocument();
    expect(screen.getByText("+$200")).toBeInTheDocument();
    expect(screen.getByText("Realized 30D")).toBeInTheDocument();
    expect(screen.getByText("10 trades")).toBeInTheDocument();
  });

  it("renders placeholder values while loading", () => {
    usePortfolioMock.mockReturnValue({
      portfolio: null,
      loading: true,
      error: null,
    });

    render(createElement(PortfolioPage));

    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getAllByText("--").length).toBeGreaterThan(0);
  });
});
