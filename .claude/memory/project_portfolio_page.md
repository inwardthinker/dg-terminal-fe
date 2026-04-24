---
name: Portfolio page implementation
description: Portfolio page built at /portfolio — layout, components, data strategy, and API-readiness notes
type: project
---

Portfolio page implemented at `src/app/(dashboard)/portfolio/page.tsx` following DGPredict canonical screen spec v1.4 (S1 — Loaded State).

**Why:** Step in building out the (dashboard) route group; establishes patterns for feature pages.

**How to apply:** All future dashboard pages should follow the same data-layer → hook → component → page composition used here. See `memory.md` in the project root for detailed decisions.

Key files:

- `src/features/portfolio/` — types, service, hooks, components
- `src/app/(dashboard)/portfolio/page.tsx` — assembles everything
- `CLAUDE.md` (project root) — updated with portfolio section

Reused without changes: `EquityCurvePanel`, `SummaryPanelContainer`, `InfoTooltip`.
