'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useModalStore } from '@/lib/modals/store'
import type { ModalEntry, ModalType } from '@/lib/modals/types'

// ─── Valid modal types (runtime guard) ───────────────────────────────────────
const VALID_MODAL_TYPES = new Set<ModalType>(['close', 'login', 'identity'])

function isValidModalType(value: string | null): value is ModalType {
    return value !== null && VALID_MODAL_TYPES.has(value as ModalType)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// IMPORTANT: This hook uses useSearchParams(), which suspends in Next.js
// App Router. The component that renders this hook MUST be wrapped in
// <Suspense> or it will throw during SSR.
//
// URL schema:
//   ?modal=position&id=123            → single modal
//   ?modal=position&id=123&over=confirm → stacked modal (confirm on top)
export function useModalSync() {
    const searchParams = useSearchParams()
    const setStack = useModalStore((s) => s.setStack)
    const transientParamsByType = useModalStore((s) => s.transientParamsByType)

    useEffect(() => {
        const modalParam = searchParams.get('modal')
        const overParam = searchParams.get('over')
        const id = searchParams.get('id') ?? undefined

        const stack: ModalEntry[] = []

        if (isValidModalType(modalParam)) {
            stack.push({
                type: modalParam,
                params: { ...transientParamsByType[modalParam], id },
            })
        }

        if (isValidModalType(overParam)) {
            // 'over' sits on top of the base modal
            stack.push({
                type: overParam,
                params: { ...transientParamsByType[overParam], id },
            })
        }

        setStack(stack)
    }, [searchParams, setStack, transientParamsByType])
}