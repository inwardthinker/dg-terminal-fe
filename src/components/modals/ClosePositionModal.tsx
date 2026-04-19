"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { BaseModal } from "@/components/modals/BaseModal"
import { Button } from "@/components/ui/Button"
import { useModal } from "@/lib/modals/hooks/useModal"
import type { ModalParams } from "@/lib/modals/types"
import type { Position } from "@/features/open-positions/types"
import { DotSeparator } from "../ui/DotSeparator"
import { useToast } from "@/hooks/useToast"

type Props = ModalParams & {
    onClose?: () => void
    position?: Position
    selectedPositions?: Position[]
    onConfirmClose?: (closedPositions: Position[]) => void
}

const TOTAL_SHARES = 8620
const PRICE = 0.64
const AVG = 0.58

export function ClosePositionModal({ onClose, position, selectedPositions, onConfirmClose }: Props) {
    const { closeModal } = useModal()
    const { showToast } = useToast()
    const [mode, setMode] = useState<"full" | "partial">("full")
    const [percent, setPercent] = useState(50)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const handleClose = onClose ?? closeModal

    useEffect(() => {
        return () => {
            if (submitTimerRef.current) clearTimeout(submitTimerRef.current)
        }
    }, [])

    function handleConfirmClose() {
        if (isSubmitting) return
        setIsSubmitting(true)
        submitTimerRef.current = setTimeout(() => {
            setIsSubmitting(false)
            const closedPositions =
                isBulkClose
                    ? positionsToClose
                    : position
                        ? [position]
                        : []

            if (closedPositions.length > 0) {
                onConfirmClose?.(closedPositions)
            }

            showToast({
                title: "Success!",
                description:
                    closedPositions.length > 1
                        ? `${closedPositions.length} positions closed`
                        : "Position closed",
                type: "success",
            })

            handleClose()
        }, 1200)
    }

    const effectivePercent = mode === "full" ? 100 : percent
    const shares = Math.round((effectivePercent / 100) * TOTAL_SHARES)

    const currentPrice = position?.currentPrice ?? PRICE
    const displaySide = position?.side ?? "YES"
    const marketName = position?.market ?? "RM wins 1st leg · Polymarket"

    const proceeds = shares * currentPrice
    const pnl = proceeds - shares * AVG
    const isBulkClose = (selectedPositions?.length ?? 0) > 1
    const positionsToClose = selectedPositions ?? []
    const totalClosing = positionsToClose.reduce((sum, item) => sum + item.size, 0)
    const estimatedProceeds = positionsToClose.reduce(
        (sum, item) => sum + item.size * item.currentPrice,
        0
    )
    const netPnl = positionsToClose.reduce((sum, item) => sum + item.pnl, 0)
    const netPnlPct = totalClosing > 0 ? (netPnl / totalClosing) * 100 : 0
    const losingPositions = positionsToClose.filter((item) => item.pnl < 0)
    const losingCount = losingPositions.length
    const totalLossAmount = losingPositions.reduce(
        (sum, item) => sum + Math.abs(item.pnl),
        0
    )

    if (isBulkClose) {
        return (
            <BaseModal variant='modal' onClose={handleClose} showClose={false}>
                <h2 className='text-primary font-semibold text-[42px]'>
                    Close {positionsToClose.length} positions
                </h2>
                <p className='mt-1 text-secondary text-t-3!'>
                    All orders placed as market sells. Review carefully.
                </p>

                <div className='mt-4 overflow-hidden rounded-lg border border-line-c/70'>
                    <div className='grid grid-cols-[minmax(0,1fr)_36px_48px_54px] border-b border-line-c/80 px-4 py-2 text-support uppercase tracking-wide'>
                        <span>Market</span>
                        <span>Side</span>
                        <span className='text-right'>Size</span>
                        <span className='text-right'>P&amp;L</span>
                    </div>

                    {positionsToClose.map((item) => (
                        <div
                            key={item.id}
                            className={`grid grid-cols-[minmax(0,1fr)_36px_48px_54px] border-b border-line-c/60 px-4 py-3 text-secondary last:border-b-0 ${item.pnl < 0 ? "bg-g-3/10" : ""}`}
                        >
                            <div className='pr-2'>
                                <span className='block truncate'>{item.market}</span>
                                {item.pnl < 0 && (
                                    <span className='mt-0.5 block text-g-3!'>
                                        ⚠ Closing at a loss
                                    </span>
                                )}
                            </div>
                            <span className={item.side === "YES" ? "text-pos" : "text-neg"}>
                                {item.side}
                            </span>
                            <span className='text-right'>${Math.round(item.size).toLocaleString()}</span>
                            <span className={`text-right ${item.pnl >= 0 ? "text-pos" : "text-neg"}`}>
                                {item.pnl >= 0 ? "+" : "-"}$
                                {Math.abs(Math.round(item.pnl)).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>

                <div className='mt-4 rounded-lg bg-g-3/10 px-2 py-2'>
                    <SummaryLine label='Total closing' value={`$${Math.round(totalClosing).toLocaleString()}`} />
                    <SummaryLine
                        label='Estimated proceeds'
                        value={`$${Math.round(estimatedProceeds).toLocaleString()}`}
                    />
                    <SummaryLine
                        label='Net P&L'
                        value={`${netPnl >= 0 ? "+" : "-"}$${Math.abs(Math.round(netPnl)).toLocaleString()} (${netPnlPct >= 0 ? "+" : ""}${netPnlPct.toFixed(1)}%)`}
                        valueClassName={netPnl >= 0 ? "text-pos" : "text-neg"}
                    />
                </div>

                {losingCount > 0 && (
                    <div className='mt-4 rounded-lg border border-g-3/35 bg-g-3/10 px-4 py-3 text-secondary text-g-3!'>
                        ⚠ {losingCount} {losingCount === 1 ? "position is" : "positions are"} closing at a loss
                        {` (-$${Math.round(totalLossAmount).toLocaleString()} total). Confirm to proceed.`}
                    </div>
                )}

                <div className='mt-4 grid grid-cols-2 gap-3'>
                    <Button
                        type='button'
                        variant='destructive'
                        className='w-full text-secondary text-neg!'
                        size='md'
                        loading={isSubmitting}
                        onClick={handleConfirmClose}
                    >
                        Confirm close all {positionsToClose.length}
                    </Button>
                    <Button
                        type='button'
                        onClick={handleClose}
                        className='w-full'
                        size='md'
                        variant='muted'
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </div>
            </BaseModal>
        )
    }

    return (
        <BaseModal variant='modal' onClose={handleClose} showClose={false}>
            <div className='mb-4 flex items-start justify-between gap-3'>
                <div>
                    <h2 className='text-primary font-semibold'>Close position</h2>
                    <p className='text-secondary text-t-3!'>
                        {marketName}
                    </p>
                </div>

                <span
                    className={`rounded-xl px-4 py-1 text-secondary ${displaySide === "NO"
                        ? "border border-neg/30 bg-neg/10 text-neg!"
                        : "border border-pos/30 bg-pos/10 text-pos!"
                        }`}
                >
                    {displaySide}
                </span>
            </div>

            <div className='mb-5 flex overflow-hidden rounded-lg border border-g-3/10'>
                {["full", "partial"].map((m) => (
                    <Button
                        key={m}
                        type='button'
                        onClick={() => setMode(m as "full" | "partial")}
                        className={`
              flex-1 rounded-none py-2.5 text-secondary font-semibold transition-colors hover:bg-g-3/20 hover:text-g-3! 
              ${mode === m
                                ? "bg-g-3/10 text-g-3"
                                : "bg-transparent text-[14px] text-t-3/70!"
                            }
            `}
                    >
                        {m === "full" ? "Full close" : "Partial close"}
                    </Button>
                ))}
            </div>

            {mode === "partial" && (
                <>
                    <div className='mt-3 flex items-center justify-between'>
                        <span className='text-secondary text-t-3!'>Close how much?</span>
                        <div className='flex items-center text-secondary font-semibold! text-g-3!'>
                            <span>{percent}%</span>
                            <DotSeparator size={4} color='bg-g-3' />
                            <span>{shares.toLocaleString()} shares</span>
                        </div>
                    </div>

                    <input
                        type='range'
                        min={0}
                        max={100}
                        value={percent}
                        onChange={(e) => setPercent(Number(e.target.value))}
                        className='close-position-slider w-full accent-g-3!'
                        aria-label='Close percentage'
                        aria-valuetext={`${percent}% (${shares.toLocaleString()} shares)`}
                        style={
                            {
                                "--slider-progress": `${percent}%`,
                            } as CSSProperties
                        }
                    />

                    {/* Presets */}
                    <div className='mt-3 flex gap-2'>
                        {[25, 50, 75, 100].map((p) => (
                            <Button
                                key={p}
                                type='button'
                                onClick={() => setPercent(p)}
                                className={`
                                    h-auto rounded-md px-3 py-1 text-xs border
                                    ${percent === p
                                        ? "border-g-3 text-g-3"
                                        : "border-g-3/20 text-secondary text-t-3!"
                                    }
                                `}
                            >
                                {p}%
                            </Button>
                        ))}
                    </div>

                    <div className='mt-3 grid grid-cols-3 gap-2 text-center'>
                        <div className='text-secondary text-t-3! bg-g-3/10 rounded-md px-3 py-2'>
                            <span className='uppercase text-support font-semibold!'>
                                Closing
                            </span>
                            <div className='text-primary font-semibold!'>$2,500</div>
                        </div>
                        <div className='text-secondary text-t-3! bg-g-3/10 rounded-md px-3 py-2'>
                            <span className='uppercase text-support font-semibold!'>
                                Proceeds
                            </span>
                            <div className='text-primary font-semibold! text-pos!'>
                                $2,758
                            </div>
                        </div>
                        <div className='text-secondary text-t-3! bg-g-3/10 rounded-md px-3 py-2'>
                            <span className='uppercase text-support font-semibold!'>P&L</span>
                            <div className='text-primary font-semibold! text-pos!'>+$258</div>
                        </div>
                    </div>

                    <div className='mt-3 flex items-center justify-between'>
                        <div className='text-secondary text-t-3!'>
                            Remaining after close
                        </div>
                        <div className='flex items-center text-secondary font-semibold! text-t-1!'>
                            <span>$2,500</span>
                            <DotSeparator size={4} color='bg-g-3' />
                            <span>4,3100 shares</span>
                        </div>
                    </div>
                </>
            )}

            {mode === "full" && (
                <>
                    <div className='mt-4 overflow-hidden rounded-lg'>
                        <InfoRow label='Current price' value={`${currentPrice.toFixed(2)} ↑`} />
                        <InfoRow
                            label='P&L if closed now'
                            value={`+$${pnl.toFixed(0)}`}
                            valueClassName='text-emerald-400'
                        />
                        <InfoRow
                            label='Size to close'
                            value={`${shares.toLocaleString()} shares`}
                        />
                        <InfoRow
                            label='You will receive'
                            value={`$${proceeds.toFixed(0)}`}
                            hideDivider
                        />
                    </div>

                    <div className='h-9 flex items-center mt-4 rounded-md border border-line-g bg-g-3/10 px-4 py-3 text-secondary text-g-3!'>
                        <span className='mr-2'>⚡</span>
                        Current price updates live while modal is open
                    </div>
                </>
            )}

            <div className='mt-2 space-y-2'>
                <Button
                    type='button'
                    variant='destructive'
                    className='w-full text-secondary text-neg!'
                    size='md'
                    loading={isSubmitting}
                    onClick={handleConfirmClose}
                >
                    Confirm close, receive ${proceeds.toFixed(0)}
                </Button>

                <Button
                    type='button'
                    onClick={handleClose}
                    className='w-full'
                    size='md'
                    variant='muted'
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>

                <p className='hidden max-md:block text-center text-support text-zinc-500'>
                    Drag down or tap Cancel to close sheet
                </p>
            </div>
        </BaseModal>
    )
}

function InfoRow({
    label,
    value,
    valueClassName,
    hideDivider = false,
}: {
    label: string
    value: string
    valueClassName?: string
    hideDivider?: boolean
}) {
    return (
        <div
            className={`flex items-center justify-between text-secondary py-2 ${hideDivider ? "" : "border-b border-g-3/10"}`}
        >
            <span className='text-t-3!'>{label}</span>
            <span className={`text-zinc-100 ${valueClassName ?? ""}`}>{value}</span>
        </div>
    )
}

function SummaryLine({
    label,
    value,
    valueClassName,
}: {
    label: string
    value: string
    valueClassName?: string
}) {
    return (
        <div className='flex items-center justify-between py-1 text-secondary'>
            <span className='text-t-3!'>{label}</span>
            <span className={`font-semibold ${valueClassName ?? ""}`}>{value}</span>
        </div>
    )
}
