'use client'

import { Suspense } from 'react'
import { useModalStore } from '@/lib/modals/store'
import { getModalComponent } from '@/lib/modals/registry'
import { useModalSync } from '@/lib/modals/hooks/useModalSync'

// ─── Inner component (uses useSearchParams via useModalSync) ──────────────────
// Must be a separate component so the <Suspense> boundary above it works.
function ModalSyncBoundary() {
    useModalSync()
    return null
}

// ─── Stack renderer ───────────────────────────────────────────────────────────
function ModalStack() {
    const stack = useModalStore((s) => s.stack)

    if (stack.length === 0) return null

    return (
        <>
            {stack.map((entry, index) => {
                const ModalComponent = getModalComponent(entry.type)
                return (
                    <ModalComponent
                        key={`${entry.type}-${index}`}
                        {...entry.params}
                    />
                )
            })}
        </>
    )
}

// ─── Public export ────────────────────────────────────────────────────────────
// Drop this once in your root layout. It handles sync + rendering for the
// entire app. No other modal wiring is needed.
//
// Usage in layout.tsx:
//   import { ModalRenderer } from '@/components/modals/ModalRenderer'
//   ...
//   <ModalRenderer />
export function ModalRenderer() {
    return (
        <>
            {/* Suspense required: useSearchParams() suspends in Next.js App Router */}
            <Suspense fallback={null}>
                <ModalSyncBoundary />
            </Suspense>

            <ModalStack />
        </>
    )
}