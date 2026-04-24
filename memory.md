# Portfolio Page — Implementation Memory

> Assumptions and decisions made while implementing the `/portfolio` page.
> Consult this when extending or maintaining portfolio-related code.

---

## Key Implementation Decisions

### 1. Data layer separation

- Each panel that is self-contained and pre-existed (`EquityCurvePanel`, `SummaryPanelContainer`) keeps its own hook (`useEquityCurve`, `usePositions`). No data is passed down from the page to these.
- New portfolio-specific data (KPIs, exposure, risk metrics, trade history) is fetched by a single `usePortfolio()` hook in `src/features/portfolio/hooks.ts` and passed as props to dumb child components. This mirrors the existing `usePositions` + `SummaryPanelContainer` pattern.

### 2. Mock data strategy

- `usePortfolio()` uses a 500 ms `setTimeout` to simulate a network round-trip — identical to `usePositions` and `useEquityCurve`.
- Swap the block for `await fetchPortfolio()` once the backend `/portfolio/summary` endpoint is live.
- `service.ts` is stubbed but API-ready; all field names in `PortfolioData` match the expected API contract from the design spec.

### 3. Component reuse

Reused existing components without modification:

- `EquityCurvePanel` — already had period selector, chart, loading state
- `SummaryPanelContainer` — already handled loading/error/positions display
- `InfoTooltip` — used inside `KpiTile` and `RiskMetricsPanel`

### 4. "use client" placement

- `page.tsx` is "use client" (uses `usePortfolio` hook directly).
- `TradeHistoryPanel` is "use client" (has internal period-tab state).
- All other portfolio components are server-compatible (pure props).
- This matches existing patterns: `login/page.tsx` is "use client"; shared panels like `SummaryPanelContainer` are separately marked.

### 5. Styling approach

- No new CSS classes added — all styling uses Tailwind v4 tokens (`bg-bg-1`, `text-t-3`, `rounded-r7`, etc.) and arbitrary values for one-off sizes that don't exist in the token scale (e.g. `text-[8.5px]`, `gap-[18px]`).
- Inline `style` props used only for dynamic values that cannot be expressed as static Tailwind classes (category dot colours, bar widths from data).
- Grid column templates for the trade history table (`grid-cols-[58px_1fr_34px_58px_48px_48px_60px_54px]`) match the reference HTML exactly.

### 6. KpiTile `valueClass` prop

The KPI reference spec colours certain values differently (positive = green, gold = brand gold, neutral = white). `KpiTile` accepts an optional `valueClass` string so the page can pass `"text-pos"`, `"text-neg"`, or `"text-g-3"`. When `undefined`, the value renders in `text-t-1` (white).

### 7. Loading states

- `KpiTile` does not have a skeleton — shows `"--"` during loading (simpler, matches the spec's empty-state pattern).
- `ExposureCategoryPanel`, `RiskMetricsPanel`, `TradeHistoryPanel` render dedicated `<Skeleton />` sub-components using `animate-pulse` blocks.
- `EquityCurvePanel` and `SummaryPanelContainer` manage their own loading states internally.

---

## Reusable Utilities / Hooks / Components for Future Features

| Name                    | Location                                                  | Notes                                                   |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `KpiTile`               | `features/portfolio/components/KpiTile.tsx`               | Generic — reuse wherever a metric tile is needed        |
| `ExposureCategoryPanel` | `features/portfolio/components/ExposureCategoryPanel.tsx` | Accepts any `ExposureCategory[]`; colour is data-driven |
| `RiskMetricsPanel`      | `features/portfolio/components/RiskMetricsPanel.tsx`      | Accepts any `RiskMetric[]`; value colour is data-driven |
| `PortfolioTopBar`       | `features/portfolio/components/PortfolioTopBar.tsx`       | Extend for other pages once a shared layout is added    |
| `InfoTooltip`           | `components/ui/InfoTooltip.tsx`                           | Already shared — use everywhere tooltip needed          |

---

## Patterns to Follow for Future Features

1. **New feature folder** → `src/features/<name>/` with `types.ts`, `hooks.ts`, `service.ts`
2. **Mock hook** → `useState` + `useEffect` + `setTimeout(500)` → set state → clear on unmount
3. **API-ready service** → `apiFetch<T>(API_ENDPOINTS.<name>.<method>)`; add endpoint to `src/lib/api/endpoints.ts`
4. **"use client" in hook file, not in pure component files**
5. **Skeleton components** → inline sub-component per file, `animate-pulse` blocks, mirrors real layout structure
6. **Colour-driven data** → pass hex strings in data; never hardcode colours in component logic
7. **Grid layouts** → prefer Tailwind arbitrary values `grid-cols-[...]` over custom CSS; they compile cleanly with Tailwind v4

---

## Assumptions Made

- The portfolio page is accessed at `/portfolio` (inside the `(dashboard)` route group).
- No shared layout shell (sidebar, persistent nav) exists yet — the `PortfolioTopBar` is rendered inside the page itself. When a shared layout is added, move `PortfolioTopBar` to `src/app/(dashboard)/layout.tsx`.
- Trade history pagination is UI-only for now (clicking Next/Prev has no effect); wire to `usePortfolio` once the API supports cursor-based pagination.
- The search box in `PortfolioTopBar` is decorative (no handler); connect to a search feature when built.
- `userInitials` defaults to `"DC"` (from the design spec mock); replace with data from `useAuthStore` once the auth flow is complete.
