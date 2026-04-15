export type Position = {
  id: string;
  market: string;
  category: "Sports" | "Politics" | "Crypto" | "Macro" | "Other";
  side: "YES" | "NO";
  entryPrice: number;
  currentPrice: number;
  size: number;
  pnl: number;
  pnlPct: number;
};

export type UsePositionsParams = {
  limit?: number
  sortBy?: "pnl" | "recent"
}

export type UsePositionsResult = {
  positions: Position[]
  totalCount: number
  loading: boolean
  error: string | null
}
