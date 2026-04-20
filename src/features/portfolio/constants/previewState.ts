export type PortfolioPreviewState =
  | "live"
  | "newUserNoTrades"
  | "hasHistoryNoOpenPositions"
  | "venueApiUnavailable";

export const PORTFOLIO_PREVIEW_STATE: PortfolioPreviewState = "venueApiUnavailable";

export const isVenueApiUnavailablePreview =
  PORTFOLIO_PREVIEW_STATE === "venueApiUnavailable";
