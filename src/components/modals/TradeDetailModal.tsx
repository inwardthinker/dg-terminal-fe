'use client'

import { BaseModal } from '@/components/modals/BaseModal'
import { useModal } from '@/lib/modals/hooks/useModal'
import type { ModalParams } from '@/lib/modals/types'
import type { TradeHistoryEntry } from '@/features/portfolio/types'
import { ExternalLink } from 'lucide-react'

type Props = ModalParams & {
  trade?: TradeHistoryEntry
}

// Outcome badge classes — spec values
const BADGE: Record<TradeHistoryEntry['result'], string> = {
  WON: 'bg-[rgba(76,175,125,0.18)]  border border-[rgba(76,175,125,0.3)]  text-pos',
  LOST: 'bg-[rgba(224,92,92,0.18)]   border border-[rgba(224,92,92,0.3)]   text-neg',
  UNRESOLVED: 'bg-[rgba(154,148,136,0.15)] border border-[rgba(154,148,136,0.3)] text-t-3',
}

// P&L hero text colour
const PNL_COLOR: Record<TradeHistoryEntry['result'], string> = {
  WON: 'text-pos',
  LOST: 'text-neg',
  UNRESOLVED: 'text-t-2',
}

const fmtUsd = (n: number, decimals = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(n))

export function TradeDetailModal({ trade }: Props) {
  const { closeModal } = useModal()

  if (!trade) return null

  const isManual = trade.closeType === 'manual'
  const closeVerb = isManual ? 'Exited' : 'Settled'
  const venue = trade.venue ?? 'Polymarket'
  const feePaid = trade.feePaid ?? 0
  const rewardsEarned = trade.rewardsEarned ?? 0

  // Subtitle: "Settled Apr 17, 2026 · Polymarket"
  const year = trade.isoDate.slice(0, 4)
  const displayDate = trade.settlementDate ?? trade.date
  const subtitle = `${closeVerb} ${displayDate}, ${year} · ${venue}`

  // P&L hero
  const pnlSign = trade.pnl > 0 ? '+' : trade.pnl < 0 ? '−' : ''
  const pnlColor = PNL_COLOR[trade.result]
  const returnPct = trade.size > 0 ? (trade.pnl / trade.size) * 100 : 0
  const returnSign = returnPct > 0 ? '+' : returnPct < 0 ? '−' : ''


  return (
    <BaseModal variant="modal" onClose={closeModal} showClose={false}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 mb-[14px]">
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-t-1 leading-snug">{trade.market}</div>
          <div className="text-[10.5px] text-t-3 mt-[3px]">{subtitle}</div>
        </div>
        <div className="flex items-center gap-[10px] shrink-0">
          <span
            className={`rounded-[5px] px-[9px] py-[3px] text-[10px] font-bold ${BADGE[trade.result]}`}
            aria-label={`Outcome: ${trade.result}`}
          >
            {trade.result}
          </span>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close modal"
            className="text-[16px] text-t-3 leading-none cursor-pointer hover:text-t-2 transition-colors px-[2px]"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Realized P&L hero ── */}
      <div className="bg-bg-2 rounded-[8px] px-[14px] py-[14px] text-center mb-[14px]">
        <div className="text-[9px] text-t-3 uppercase tracking-[.08em] mb-[4px]">
          Realized P&amp;L
        </div>
        <div className={`text-[28px] font-extrabold leading-none tracking-[-0.5px] ${pnlColor}`}>
          {pnlSign}
          {fmtUsd(trade.pnl)}
        </div>
        <div className={`text-[10px] mt-[2px] ${pnlColor}`}>
          {returnSign}
          {Math.abs(returnPct).toFixed(1)}% return
        </div>
      </div>

      {/* ── Data rows ── */}
      <div>
        <DataRow label="Side">
          <span className={`font-bold ${trade.side === 'YES' ? 'text-pos' : 'text-neg'}`}>
            {trade.side}
          </span>
        </DataRow>
        <DataRow label="Entry price">
          <span>{trade.entry.toFixed(2)}</span>
        </DataRow>
        <DataRow label="Exit price">
          <span>{trade.exit.toFixed(2)}</span>
        </DataRow>
        <DataRow label="Size (cost basis)">
          <span>{fmtUsd(trade.size)}</span>
        </DataRow>
        <DataRow label="Venue">
          <span className="font-bold">{venue}</span>
        </DataRow>
        <DataRow label="Fee paid">
          <span>{fmtUsd(feePaid, 2)}</span>
        </DataRow>
        <DataRow label="Rewards earned" last>
          <span className={`font-semibold ${rewardsEarned > 0 ? 'text-g-3' : 'text-t-1'}`}>
            {rewardsEarned > 0 ? fmtUsd(rewardsEarned, 2) : '$0'}
          </span>
        </DataRow>
      </div>

      {/* ── View market (live only) ── */}
      {trade.isMarketLive && (
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 rounded-[7px] border border-[rgba(255,255,255,0.1)] py-[9px] text-[11.5px] text-t-2 cursor-pointer hover:border-g-3/40 hover:text-g-3 transition-colors mt-[8px]"
        >
          View market
          <ExternalLink size={11} aria-hidden="true" />
        </button>
      )}

      {/* ── Close button ── */}
      <button
        type="button"
        onClick={closeModal}
        className="w-full rounded-[7px] border border-[rgba(255,255,255,0.1)] py-[9px] text-[11.5px] text-t-2 cursor-pointer hover:border-line-c hover:text-t-1 transition-colors mt-[12px]"
      >
        Close
      </button>
    </BaseModal>
  )
}

function DataRow({
  label,
  children,
  last = false,
}: {
  label: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between text-[11.5px] py-[6px] ${
        last ? '' : 'border-b border-[rgba(255,255,255,0.06)]'
      }`}
    >
      <span className="text-t-3">{label}</span>
      <span className="text-t-1 font-semibold">{children}</span>
    </div>
  )
}
