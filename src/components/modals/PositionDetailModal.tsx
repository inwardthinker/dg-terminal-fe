'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'

import { BaseModal } from './BaseModal'
import { Button } from '@/components/ui/Button'
import { CategoryPill } from '@/features/open-positions/components/CategoryPill'
import { cn } from '@/lib/utils/cn'
import { getChartPoints } from '@/features/equity-curve/utils'
import { useModal } from '@/lib/modals/hooks/useModal'
import type { ModalParams } from '@/lib/modals/types'
import type { Position } from '@/features/open-positions/types'
import type { CategoryPresentation } from '@/features/open-positions/utils/categoryExposure'

// ---------------------------------------------------------------------------
// Helpers (file-local, no separate components needed)
// ---------------------------------------------------------------------------
const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

function priceCents(v: number) {
  return `${Math.round(v * 100)}¢`
}

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

/** Compact 7-day area chart — reuses getChartPoints from equity-curve utils. */
function MiniChart({ currentPrice, entryPrice }: { currentPrice: number; entryPrice: number }) {
  const H = 64
  const W = 300
  const data = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const trend = entryPrice + (currentPrice - entryPrice) * (i / 6)
        const noise = (seededRand(Math.floor(entryPrice * 1000) + i) - 0.5) * 0.06
        return { date: `Day ${i + 1}`, value: Math.max(0.01, Math.min(0.99, trend + noise)) }
      }),
    [currentPrice, entryPrice],
  )
  const computed = useMemo(() => getChartPoints(data, W, H), [data])
  if (!computed) return null

  const color = currentPrice >= entryPrice ? 'var(--pos)' : 'var(--neg)'
  const gid = `mc-${Math.floor(entryPrice * 10000)}`

  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`${computed.d} L ${W} ${H} L 0 ${H} Z`} fill={`url(#${gid})`} />
      <path d={computed.d} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Props = ModalParams & {
  position?: Position
  categoryPresentation?: Record<Position['category'], CategoryPresentation>
  onConfirmClose?: (positions: Position[]) => void
}

// ---------------------------------------------------------------------------
// Modal — content only; BaseModal owns animation, drag-dismiss, ESC, scroll lock
// ---------------------------------------------------------------------------
export function PositionDetailModal({ position, categoryPresentation, onConfirmClose }: Props) {
  const { closeModal, openModal } = useModal()
  const router = useRouter()

  if (!position) return null

  const catStyle = categoryPresentation?.[position.category] ?? {
    label: position.category,
    colorClass: 'bg-t-3',
  }
  const priceChange = position.currentPrice - position.entryPrice
  const isUp = priceChange >= 0
  const pnlText = `${position.pnl >= 0 ? '+' : ''}${currencyFmt.format(position.pnl)}`
  const costBasis = position.deployedValue ?? position.size

  function handleClosePosition() {
    // Replace this drawer with the M1 close modal (no stack — simpler UX).
    openModal('close', { position, onConfirmClose })
  }

  function handleBuyMore(side: 'YES' | 'NO') {
    closeModal()
    router.push(`/terminal?market=${encodeURIComponent(position!.id)}&side=${side}`)
  }

  function handleOpenInTerminal() {
    closeModal()
    router.push(`/terminal?market=${encodeURIComponent(position!.id)}`)
  }

  return (
    <BaseModal
      variant="drawer"
      onClose={closeModal}
      showClose={false}
      contentClassName="p-0 h-full flex flex-col"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-line-c px-4 pt-4 pb-3">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryPill label={catStyle.label} colorClass={catStyle.colorClass} />
              <span className="text-t-3 text-[10px] font-semibold uppercase tracking-[0.06em]">
                Polymarket
              </span>
            </div>
            <p className="text-t-1 font-bold text-[14px] leading-snug">{position.market}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-support text-t-3 text-[11px]">Expires: —</span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
                  position.side === 'YES'
                    ? 'border-pos/55 bg-pos/14 text-pos'
                    : 'border-neg/55 bg-neg/14 text-neg',
                )}
              >
                {position.side}
              </span>
            </div>
          </div>

          <button
            onClick={closeModal}
            aria-label="Close position detail"
            className="shrink-0 rounded-r3 p-1 text-t-3 transition-colors hover:bg-bg-3 hover:text-t-1"
          >
            <span className="text-[20px] leading-none">×</span>
          </button>
        </div>
      </div>

      {/* ── Scrollable body (price + chart + stats fill remaining height) ── */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* ── Price section ──────────────────────────────────────────────── */}
        <div className="px-4 pt-3 pb-2 space-y-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-support text-t-3 text-[11px] mb-0.5">Current price</div>
              <div className="flex items-center gap-1.5">
                <span
                  key={`cp-${position.currentPrice}`}
                  className="text-t-1 font-bold text-[22px] tabular-nums live-value-flash inline-block"
                >
                  {priceCents(position.currentPrice)}
                </span>
                {isUp ? (
                  <TrendingUp className="h-4 w-4 text-pos" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-neg" />
                )}
                <span className={cn('text-[11px] font-semibold', isUp ? 'text-pos' : 'text-neg')}>
                  {isUp ? '+' : ''}
                  {(priceChange * 100).toFixed(1)}¢
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-support text-t-3 text-[11px] mb-0.5">Fair value</div>
              <div className="text-t-2 font-semibold text-[14px]">—</div>
              <div className="text-t-4 text-[9px] font-semibold uppercase tracking-[0.05em]">
                DGPredict model
              </div>
            </div>
          </div>

          <div className="h-16 w-full overflow-hidden rounded-r3 bg-bg-2/40">
            <MiniChart currentPrice={position.currentPrice} entryPrice={position.entryPrice} />
          </div>
          <div className="flex justify-between text-t-4 text-[10px]">
            <span>7d ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* ── Stats grid 2×2 ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2 px-4 py-2">
          {(
            [
              { label: 'Entry Price', value: priceCents(position.entryPrice) },
              { label: 'Shares', value: position.no_of_shares.toLocaleString() },
              { label: 'Cost Basis', value: currencyFmt.format(costBasis) },
              {
                label: 'Unrealized P&L',
                value: pnlText,
                cls: position.pnl >= 0 ? 'text-pos' : 'text-neg',
                live: true,
              },
            ] as { label: string; value: string; cls?: string; live?: boolean }[]
          ).map(({ label, value, cls, live }) => (
            <div key={label} className="flex flex-col gap-1 rounded-r4 bg-bg-2 px-3 py-2.5">
              <span className="text-support text-t-3">{label}</span>
              <span
                key={live ? value : label}
                className={cn(
                  'text-primary text-t-1',
                  live && 'live-value-flash inline-block',
                  cls,
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* ── /scrollable body ──────────────────────────────────────────── */}

      {/* ── Actions (pinned to bottom) ───────────────────────────────── */}
      <div className="shrink-0 space-y-2 border-t border-line-c px-4 pb-5 pt-3">
        <div className="grid grid-cols-3 gap-2">
          <Button variant="destructive" size="sm" className="w-full" onClick={handleClosePosition}>
            Close
          </Button>
          <button
            onClick={() => handleBuyMore('YES')}
            className="inline-flex h-8 w-full items-center justify-center rounded-[2px] border border-pos/35 bg-transparent px-3 text-[11px] font-semibold text-pos transition-colors hover:bg-pos/10"
          >
            Buy YES
          </button>
          <button
            onClick={() => handleBuyMore('NO')}
            className="inline-flex h-8 w-full items-center justify-center rounded-[2px] border border-neg/35 bg-transparent px-3 text-[11px] font-semibold text-neg transition-colors hover:bg-neg/10"
          >
            Buy NO
          </button>
        </div>

        <button
          onClick={handleOpenInTerminal}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-r4 border border-g-3/40 px-3 text-[11px] font-bold uppercase tracking-[0.05em] text-g-3 transition-colors hover:bg-g-3/10"
        >
          Open in terminal
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </BaseModal>
  )
}
