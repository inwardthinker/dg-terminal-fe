"use client"

import { BaseModal } from "@/components/modals/BaseModal"
import { useModal } from "@/lib/modals/hooks/useModal"
import type { ModalParams } from "@/lib/modals/types"
import type { TradeHistoryEntry } from "@/features/portfolio/types"
import { X, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react"

type Props = ModalParams & {
  trade?: TradeHistoryEntry
}

const RESULT_CONFIG: Record<
  TradeHistoryEntry["result"],
  { badgeClass: string; heroClass: string; renderIcon: () => React.ReactNode }
> = {
  WON: {
    badgeClass: "bg-pos/15 border-pos/30 text-pos",
    heroClass: "bg-pos/10 border-pos/20",
    renderIcon: () => <TrendingUp size={16} />,
  },
  LOST: {
    badgeClass: "bg-neg/15 border-neg/30 text-neg",
    heroClass: "bg-neg/10 border-neg/20",
    renderIcon: () => <TrendingDown size={16} />,
  },
  PUSHED: {
    badgeClass: "bg-t-3/15 border-t-3/30 text-t-3",
    heroClass: "bg-bg-2 border-line-c",
    renderIcon: () => <Minus size={16} />,
  },
}

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const fmt = (n: number) =>
  USD_FORMATTER.format(Math.abs(n))

export function TradeDetailModal({ trade }: Props) {
  const { closeModal } = useModal()

  if (!trade) return null

  const safeEntry = trade.entry > 0 ? trade.entry : 1
  const shares = Math.round(trade.size / safeEntry)
  const exitMultiplier = trade.side === "NO" ? 1 - trade.exit : trade.exit
  const proceeds = Math.round(shares * exitMultiplier)
  const rewardsEarned = trade.rewardsEarned ?? 0
  const settlementDate = trade.settlementDate ?? trade.date
  const isManual = trade.closeType === "manual"
  const closeKind = isManual ? "Exit" : "Settlement"

  const pnlPositive = trade.pnl >= 0
  const pnlColor = trade.result === "PUSHED" ? "text-t-2" : pnlPositive ? "text-pos" : "text-neg"
  const { badgeClass, heroClass, renderIcon } = RESULT_CONFIG[trade.result]
  const icon = renderIcon()

  return (
    <BaseModal variant="modal" onClose={closeModal} showClose={false}>

      {/* ── Top row: badges + close ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-r3 border px-[10px] py-[3px] text-button font-bold ${badgeClass}`}
            aria-label={`Outcome: ${trade.result}`}
          >
            {trade.result}
          </span>
          <span
            className={`rounded-r3 border px-[9px] py-[3px] text-button font-semibold ${
              trade.side === "YES"
                ? "border-pos/25 bg-pos/8 text-pos"
                : "border-neg/25 bg-neg/8 text-neg"
            }`}
          >
            {trade.side}
          </span>
        </div>
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close modal"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-t-3 hover:bg-bg-2 hover:text-t-1 transition-colors"
        >
          <X size={13} aria-hidden="true" />
        </button>
      </div>

      {/* ── Market title ── */}
      <h2 className="text-primary font-semibold leading-snug mb-5">
        {trade.market}
      </h2>

      {/* ── Entry / Exit two-col cards ── */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-r4 bg-bg-2 border border-line-c/50 px-3 py-3">
          <p className="text-support text-t-3 mb-1.5 uppercase tracking-wide">Entry</p>
          <p className="text-secondary font-semibold">{trade.date}</p>
          <p className="text-support text-t-3 mt-0.5">
            <span className="text-t-2 font-semibold">{trade.entry.toFixed(2)}</span>
            {" "}per share
          </p>
        </div>
        <div className="rounded-r4 bg-bg-2 border border-line-c/50 px-3 py-3">
          <p className="text-support text-t-3 mb-1.5 uppercase tracking-wide">{closeKind}</p>
          <p className="text-secondary font-semibold">{settlementDate}</p>
          <p className="text-support text-t-3 mt-0.5">
            <span className="text-t-2 font-semibold">{trade.exit.toFixed(2)}</span>
            {" "}per share
          </p>
        </div>
      </div>

      {/* ── P&L hero ── */}
      <div className={`rounded-r5 border px-4 py-4 mb-4 flex items-center justify-between ${heroClass}`}>
        <div>
          <p className="text-support text-t-3 mb-0.5">Realized P&amp;L</p>
          <p className={`text-[26px] font-bold leading-none ${pnlColor}`}>
            {trade.pnl > 0 ? "+" : trade.pnl < 0 ? "−" : ""}
            {fmt(trade.pnl)}
          </p>
        </div>
        <div className={`opacity-60 ${pnlColor}`}>{icon}</div>
      </div>

      {/* ── Compact metrics strip ── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Metric label="Shares" value={shares.toLocaleString()} />
        <Metric label="Cost basis" value={fmt(trade.size)} />
        <Metric label="Proceeds" value={fmt(proceeds)} />
      </div>

      {/* ── Rewards ── */}
      {rewardsEarned > 0 ? (
        <div className="flex items-center justify-between rounded-r4 border border-g-3/20 bg-g-3/8 px-4 py-2.5 mb-4">
          <span className="text-secondary text-t-3">Rewards earned</span>
          <span className="text-secondary font-semibold text-g-3">+{fmt(rewardsEarned)}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between px-1 py-2 mb-2">
          <span className="text-support text-t-3">Rewards earned</span>
          <span className="text-support text-t-3">$0</span>
        </div>
      )}

      {/* ── View market ── */}
      {trade.isMarketLive && (
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-r5 border border-line-c/60 py-2.5 text-secondary hover:border-g-3/40 hover:text-g-3 transition-colors"
        >
          View market
          <ExternalLink size={12} aria-hidden="true" />
        </button>
      )}

      <p className="mt-3 hidden max-md:block text-center text-support text-t-3/40">
        Drag down to close
      </p>
    </BaseModal>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-r4 bg-bg-2 border border-line-c/50 px-3 py-2.5 text-center">
      <p className="text-support text-t-3 mb-1">{label}</p>
      <p className="text-secondary font-semibold text-t-1">{value}</p>
    </div>
  )
}
