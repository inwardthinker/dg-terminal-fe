// Portfolio feature types — all shapes designed to match future API contracts.
// Data fetching is centralised in hooks.ts / service.ts; components stay pure.

export type PortfolioKpis = {
  /** Total account balance in USD */
  balance: number;
  /** 24-hour balance change in USD (signed) */
  change24h: number;
  /** Total cost basis of open positions */
  openExposure: number;
  /** Percentage of balance currently deployed */
  deployedPct: number;
  /** Unrealised P&L at current mid prices (signed) */
  unrealizedPnl: number;
  /** Unrealised P&L as a percentage of cost basis (signed) */
  unrealizedPct: number;
  /** Settled P&L from trades closed in the last 30 days (signed) */
  realized30d: number;
  /** Number of trades closed in the last 30 days */
  trades30d: number;
  /** Maker rebates and referral bonuses earned in the last 30 days */
  rewardsEarned: number;
  /** Rewards as a percentage of realised P&L */
  rewardsPct: number;
  /** Number of currently open positions */
  openCount: number;
  /** Today's P&L in USD (signed) */
  todayPnl: number;
  /** Portfolio return percentage (signed) */
  portfolioPct: number;
};

export type ExposureCategory = {
  /** Category display name */
  name: string;
  /** Total absolute size of positions in this category (USD) */
  amount: number;
  /** Percentage of total open exposure */
  pct: number;
  /** Hex colour assigned to this category */
  color: string;
};

export type RiskMetricValueType = "positive" | "negative" | "neutral" | "gold";

export type RiskMetric = {
  /** Unique identifier for this metric */
  key: string;
  /** Display label */
  label: string;
  /** Formatted display value */
  value: string;
  /** Controls the colour of the displayed value */
  valueType: RiskMetricValueType;
  /** Tooltip explanation text */
  tooltip: string;
};

export type TradeResult = "WON" | "LOST" | "PUSHED";
export type TradeSide = "YES" | "NO";
export type TradeHistoryPeriod = "7d" | "30d" | "90d" | "All";

export type TradeHistoryEntry = {
  id: string;
  /** Display date string, e.g. "Apr 7" */
  date: string;
  /** ISO 8601 date string for filtering, e.g. "2026-04-07" */
  isoDate: string;
  market: string;
  side: TradeSide;
  /** Entry price (0–1 probability) */
  entry: number;
  /** Exit price (0–1 probability, 0 if lost, 1 if won outright) */
  exit: number;
  /** Position size in USD */
  size: number;
  result: TradeResult;
  /** Realised P&L in USD (signed) */
  pnl: number;
};

export type PortfolioData = {
  kpis: PortfolioKpis;
  exposure: ExposureCategory[];
  riskMetrics: RiskMetric[];
  tradeHistory: TradeHistoryEntry[];
  /** Total trades available across all pages */
  tradeHistoryTotal: number;
};

export type UsePortfolioResult = {
  portfolio: PortfolioData | null;
  loading: boolean;
  error: string | null;
};

export type PortfolioKpiSubscribedEvent = {
  stream: "portfolio_kpis";
  wallet: string;
  interval_ms: number;
};

export type PortfolioKpiUpdate = {
  balance: number;
  open_exposure: number;
  pc_exposure: number;
  unrealized_pnl: number;
  un_pnl_pc: number;
  realized_30d: number;
  num_trades: number;
  rewards_earned: number;
  reward_pc: number;
};

export type PortfolioKpiUpdateEvent = {
  wallet: string;
  ts: string;
  kpis: PortfolioKpiUpdate;
};
