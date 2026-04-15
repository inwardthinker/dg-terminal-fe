# DG Terminal Frontend — Claude Context

## Project Overview

- **Name:** dg-terminal-fe
- **Type:** Production Next.js frontend (boilerplate stage)
- **Repo:** https://github.com/inwardthinker/dg-terminal-fe.git
- **Branch:** main

---

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | Next.js 15.3.1 (App Router) |
| UI | React 19.1.0 |
| Styling | Tailwind CSS 4.2.2 (v4 @theme syntax) |
| State | Zustand 5.0.4 |
| Language | TypeScript 5.8.3 (strict mode) |
| Linting | ESLint 9.25.1 + eslint-config-next |
| CSS pipeline | PostCSS + @tailwindcss/postcss |

**Scripts:** `dev` / `build` / `start` / `lint` (standard Next.js)

---

## Directory Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — Inter font, metadata
│   ├── page.tsx                # Home / design-system demo (/)
│   ├── (auth)/login/page.tsx   # Login page (/login)
│   └── (dashboard)/
│       ├── dashboard/page.tsx  # Dashboard (/dashboard)
│       └── settings/page.tsx   # Settings (/settings)
│
├── components/
│   ├── ui/                     # Legacy UI components (inline styles)
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── Button.tsx              # Newer Button (Tailwind classes, preferred)
│   └── shared/
│       └── FormError.tsx       # Conditional error message display
│
├── features/                   # Vertical-slice feature folders
│   ├── auth/
│   │   ├── types.ts            # LoginRequest, LoginResponse, AuthUser
│   │   ├── hooks.ts            # useLogin() — manages state + calls service
│   │   └── service.ts          # login() — calls /auth/login endpoint
│   ├── users/                  # Scaffolded, not yet implemented
│   └── payments/               # Scaffolded, not yet implemented
│
├── hooks/
│   └── useMounted.ts           # SSR-safe mounted flag
│
├── lib/
│   ├── api/
│   │   ├── client.ts           # apiFetch<T>() + ApiError class
│   │   └── endpoints.ts        # API_ENDPOINTS (only /auth/login set)
│   ├── constants/
│   │   └── env.ts              # env.apiBaseUrl from NEXT_PUBLIC_API_BASE_URL
│   └── utils/
│       └── error.ts            # getErrorMessage() — extracts error strings
│
├── store/
│   └── authStore.ts            # Zustand: { user, setUser }
│
└── styles/
    └── globals.css             # Design system tokens + Tailwind @theme
```

---

## Design System

All tokens live in `src/styles/globals.css` as CSS custom properties mapped into Tailwind v4 via `@theme`.

### Colors (dark theme only — no light mode)

| Variable | Value | Usage |
|---|---|---|
| `--bg0` | #080808 | Page root background |
| `--bg1` | #121212 | Panels |
| `--bg2` | #1c1b16 | Cards |
| `--bg3` | #41403a | Disabled states |
| `--t1` | #f5f2e8 | Primary text |
| `--t2` | #c9c3b4 | Secondary text |
| `--t3` | #9a9488 | Muted / placeholder |
| `--g3` | #cdbd70 | Brand gold / accents |
| `--linec` | subtle white | Default dividers |
| `--lineg` | gold | Highlighted dividers |
| `--pos` | #4caf7d | Positive / success |
| `--neg` | #e05c5c | Negative / error |
| `--warn` | #cdbd70 | Warning |
| `--blue` | #4a90d9 | Info |
| `--pur` | #b496dc | Category — purple |
| `--cyan` | #3ec6c6 | Category — cyan |
| `--orange` | #f97316 | Category — orange |

**Tailwind usage:** `bg-bg-0`, `text-t-1`, `border-line-c`, etc.

### Spacing Scale (px-based)

`--sp-1` 2px · `--sp-2` 4px · `--sp-3` 6px · `--sp-4` 8px · `--sp-5` 10px · `--sp-6` 12px · `--sp-7` 16px · `--sp-8x` 24px (horizontal) · `--sp-8y` 20px (vertical)

### Border Radius

`--radius-1` 3px → `--radius-9` 20px (progressive) · `--radius-full` 9999px

### Typography — utility classes

| Class | Size | Weight | Notes |
|---|---|---|---|
| `.text-title` | 18px | 700 | -0.3px tracking |
| `.text-panel` | 11.5px | 600 | |
| `.text-label` | 10px | 700 | 0.08em tracking, uppercase |
| `.text-primary` | 15px | 700 | |
| `.text-secondary` | 12px | 600 | |
| `.text-support` | 10px | 400 | |
| `.text-action` | 10.5px | 600 | Gold color |
| `.text-badge` | 10px | 700 | 0.04em tracking |
| `.text-mono` | 11px | 400 | Monospace |
| `.text-button` | 11px | 700 | |

---

## API Layer

**`apiFetch<T>(path, options?)`** in `src/lib/api/client.ts`
- Prepends `env.apiBaseUrl`
- Sets `credentials: "include"` (cookie auth)
- Auto-sets `Content-Type: application/json` when body present
- Parses JSON or text depending on Content-Type header
- Throws `ApiError` (extends Error) with `status` and optional `details` on non-2xx

**Environment variable required:**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

**Endpoints** (`src/lib/api/endpoints.ts`):
- `API_ENDPOINTS.auth.login` → `/auth/login`
- Users and Payments endpoint objects are empty stubs

---

## State Management (Zustand)

`src/store/authStore.ts`
```ts
{ user: AuthUser | null, setUser: (user: AuthUser | null) => void }
```
- No persistence middleware
- No devtools configured yet

---

## Auth Feature

- **useLogin()** (`features/auth/hooks.ts`) — local loading + error state, calls `login()` service, updates Zustand store on success
- **Login page** (`app/(auth)/login/page.tsx`) — currently uses hardcoded inline styles (not using design system tokens yet)

---

## Known Issues / TODOs

1. **Component duplication:** Two Button components exist — `src/components/ui/Button.tsx` (inline styles, old) and `src/components/Button.tsx` (Tailwind, new preferred). Old one should be removed or replaced.
2. **Login page not using design tokens:** Uses hardcoded color values instead of CSS variables or Tailwind tokens.
3. **Users & Payments features are stubs:** `hooks.ts` and `service.ts` are empty placeholders.
4. **No auth middleware:** No route protection via Next.js middleware yet.
5. **No Zustand persistence:** Auth state is lost on page refresh.
6. **API_ENDPOINTS users/payments:** Empty objects — endpoints not mapped yet.

---

## TypeScript Config

- Path alias: `@/*` → `src/*` (use `@/components/...` etc.)
- Strict mode: on
- Target: ES2017
- Module resolution: `bundler`

---

## Conventions

- Feature code lives in `src/features/<name>/` with `types.ts`, `hooks.ts`, `service.ts`
- Shared/global hooks in `src/hooks/`
- Utility functions in `src/lib/utils/`
- API calls only inside `service.ts` files — never directly in components
- Components use Tailwind classes (not inline styles) going forward
- New pages use App Router conventions (route groups in parentheses)

---

## Portfolio Feature (`src/features/portfolio/`)

Added April 2026. Implements the `/portfolio` page based on the DGPredict canonical screen spec v1.4.

### Files

| File | Purpose |
|---|---|
| `types.ts` | `PortfolioKpis`, `ExposureCategory`, `RiskMetric`, `TradeHistoryEntry`, `PortfolioData`, `UsePortfolioResult` |
| `service.ts` | `fetchPortfolio()` — calls `/portfolio/summary` via `apiFetch` |
| `hooks.ts` | `usePortfolio()` — returns mock data now; replace `setTimeout` block with `fetchPortfolio()` for live data |
| `components/KpiTile.tsx` | Reusable KPI tile: label, value (with optional colour class), sub-label, tooltip, footer slot |
| `components/ExposureCategoryPanel.tsx` | Scrollable exposure-by-category list with colour-coded dot + bar chart |
| `components/RiskMetricsPanel.tsx` | 6-row risk metrics panel with inline tooltips |
| `components/TradeHistoryPanel.tsx` | Trade history table with period tabs, 8-column grid, pagination |
| `components/PortfolioTopBar.tsx` | App-wide top bar: brand, quick stats, search, deposit button, portfolio pill, avatar |

### Page layout (`src/app/(dashboard)/portfolio/page.tsx`)

```
PortfolioTopBar            — fixed-height header (48px)
Breadcrumb                 — 32px bar
main
  grid-cols-5              — KPI tiles (Balance, Open Exposure, Unrealized P&L, Realized 30D, Rewards)
  grid-cols-[1.4fr_1fr]   — EquityCurvePanel | ExposureCategoryPanel
  grid-cols-[1fr_1.85fr]  — RiskMetricsPanel | SummaryPanelContainer (open-positions)
  TradeHistoryPanel        — full-width trade history
```

### API-readiness

`usePortfolio()` mocks data with a 500 ms delay (matching existing hook patterns). To connect to a real API, replace the `setTimeout` block in `hooks.ts` with:

```ts
const data = await fetchPortfolio();
setPortfolio(data);
```

The `PORTFOLIO_ENDPOINTS.summary` path and the `PortfolioData` type mirror the expected backend contract.

### Reused components (do not recreate)

- `EquityCurvePanel` — self-contained, manages own data via `useEquityCurve`
- `SummaryPanelContainer` — self-contained, manages own data via `usePositions`
- `InfoTooltip` — shared UI component used in KpiTile and RiskMetricsPanel
