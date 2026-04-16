export const SUMMARY_GRID_COLUMNS =
  "grid-cols-[minmax(0,1.2fr)_100px_40px_72px_68px_60px]";

export const SUMMARY_GRID_COLUMNS_MOBILE =
  "max-sm:grid-cols-[minmax(0,1fr)_72px_42px_72px_54px]";

/** Fixed row height for `PositionRowTable` and TanStack `estimateSize` (must stay in sync). */
export const POSITION_TABLE_ROW_HEIGHT_PX = 48;

/** When row count exceeds this, `PositionsTable` uses TanStack Virtual for the body. */
export const VIRTUALIZATION_THRESHOLD = 100;

/** Extra rows rendered above/below the viewport (higher = smoother fast scroll, more work). */
export const VIRTUAL_ROW_OVERSCAN = 8;
