import { BaseModal } from '@/components/modals/BaseModal'
import { useModal } from '@/lib/modals/hooks/useModal'
import { X } from 'lucide-react'

export const PositionDetailsModal = () => {
    const { closeModal } = useModal()

    return (
        <BaseModal variant='drawer' onClose={closeModal} showClose={false}>
            <div className='space-y-4'>
                <header className='flex items-start justify-between gap-3'>
                    <div>
                        <p className='text-support uppercase tracking-wide'>Sports · Polymarket</p>
                        <h2 className='mt-1 text-primary font-semibold text-xl'>RM wins 1st leg</h2>
                        <p className='mt-1 text-support'>UCL final · Resolves Apr 20, 2026</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <span className='rounded-md border border-pos/30 bg-pos/15 px-3 py-1 text-pos font-semibold'>
                            YES
                        </span>
                        <button
                            type='button'
                            onClick={closeModal}
                            aria-label='Close position details'
                            className='inline-flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-bg-2'
                        >
                            <X size={16} aria-hidden='true' />
                        </button>
                    </div>
                </header>

                <section className='rounded-lg bg-bg-1/70 p-3'>
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <p className='text-support'>Current price</p>
                            <p className='mt-1 text-primary text-3xl font-semibold'>
                                0.64 <span className='text-pos text-sm'>+0.06 (24h)</span>
                            </p>
                        </div>
                        <div className='text-right'>
                            <p className='text-support'>Fair value</p>
                            <p className='mt-1 text-primary text-2xl font-semibold'>0.64</p>
                            <p className='text-support'>model</p>
                        </div>
                    </div>
                </section>

                <section>
                    <p className='text-support uppercase tracking-wide'>Price movement · 7D</p>
                    <div className='mt-2 h-16 rounded-lg border border-line-c/70 bg-bg-2/40 p-2'>
                        <svg viewBox='0 0 240 40' className='h-full w-full' aria-hidden='true'>
                            <path
                                d='M0 30 C30 30, 70 28, 95 25 C120 22, 150 21, 175 19 C198 17, 220 16, 240 15'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                className='text-pos'
                            />
                        </svg>
                    </div>
                </section>

                <section>
                    <p className='text-support uppercase tracking-wide'>Your position</p>
                    <div className='mt-2 grid grid-cols-2 gap-2'>
                        <StatCard label='Avg entry price' value='0.58' />
                        <StatCard label='Shares held' value='8,620' />
                        <StatCard label='Cost basis' value='$5,000' />
                        <StatCard
                            label='Unrealized P&L'
                            value='+$420 +8.4%'
                            subLabel='pnl_amount / pnl_percent'
                            valueClassName='text-pos'
                        />
                    </div>
                </section>

                <section className='grid grid-cols-2 gap-2'>
                    <ActionButton label='Buy more YES' className='border-pos/40 bg-pos/10 text-pos' />
                    <ActionButton label='Buy more NO' className='border-neg/40 bg-neg/10 text-neg' />
                </section>

                <section className='grid grid-cols-2 gap-2'>
                    <ActionButton
                        label='Close position'
                        className='border-neg/40 bg-neg/10 text-neg'
                    />
                    <ActionButton label='Open in terminal ↗' className='border-line-c text-primary' />
                </section>
            </div>
        </BaseModal>
    )
}

function StatCard({
    label,
    value,
    subLabel,
    valueClassName,
}: {
    label: string
    value: string
    subLabel?: string
    valueClassName?: string
}) {
    return (
        <div className='rounded-lg border border-line-c/70 bg-bg-1 px-3 py-2'>
            <p className='text-support'>{label}</p>
            <p className={`mt-1 text-primary text-xl font-semibold ${valueClassName ?? ''}`}>{value}</p>
            {subLabel && <p className='text-support'>{subLabel}</p>}
        </div>
    )
}

function ActionButton({ label, className }: { label: string; className: string }) {
    return (
        <button
            type='button'
            className={`h-10 rounded-lg border px-3 text-sm font-semibold transition-colors hover:bg-bg-2 ${className}`}
        >
            {label}
        </button>
    )
}