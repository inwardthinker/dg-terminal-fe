import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OpenPositionsSummaryKpis } from "./OpenPositionsSummaryKpis";

describe("OpenPositionsSummaryKpis", () => {
  it("renders summary values in KPI cards", () => {
    render(
      <OpenPositionsSummaryKpis
        summary={{
          openPositions: 12,
          totalExposure: 31640,
          largestPosition: 5000,
          unrealizedPnl: 1872,
        }}
        loading={false}
        error={null}
      />
    );

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("$31,640")).toBeInTheDocument();
    expect(screen.getByText("+$1,872")).toBeInTheDocument();
    expect(screen.getByText("$5,000")).toBeInTheDocument();
  });

  it("renders empty placeholders while loading", () => {
    render(<OpenPositionsSummaryKpis summary={null} loading error={null} />);

    expect(screen.getAllByText("--")).toHaveLength(4);
  });
});
