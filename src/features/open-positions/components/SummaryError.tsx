import { DotSeparator } from '@/components/ui/DotSeparator'
import React from 'react'

type SummaryErrorProps = {
    message?: string | null
}

export function SummaryError({ message }: SummaryErrorProps) {
    return (
        <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-6">
            <section className="rounded-r7 border border-line-c bg-bg-1 p-4">
                <div className="mb-3 flex items-center text-primary">
                    <h2 className="">Open Positions </h2>
                    <DotSeparator size={8} color="bg-neg" className="animate-pulse" />
                </div>
                <div className="rounded-r4 px-4 py-6 text-center text-support">
                    <p>{message ?? "Unavailable — retry to reload"}</p>
                    <button
                        type="button"
                        className="mt-3 rounded-r3 border border-line-c px-3 py-1 text-action"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </section>
        </main>
    )
}