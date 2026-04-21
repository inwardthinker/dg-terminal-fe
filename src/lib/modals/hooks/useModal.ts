'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { ModalType, ModalParams } from '@/lib/modals/types'
import { useModalStore } from '@/lib/modals/store'

const CLEARABLE_MODAL_TYPES: ModalType[] = ['close', 'positionDetails']

function isClearableModalType(value: string | null): value is ModalType {
    return value !== null && CLEARABLE_MODAL_TYPES.includes(value as ModalType)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Use this hook anywhere you need to open or close a modal.
// Never manipulate the Zustand store directly — always go through the router.
//
// Usage:
//   const { openModal, closeModal, closeAll } = useModal()
//   openModal('position', { id: '123' })
//   openModal('confirm', { id: '123' }, { stack: true })  // nested on top
export function useModal() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const setTransientParams = useModalStore((s) => s.setTransientParams)
    const clearTransientParams = useModalStore((s) => s.clearTransientParams)

    // ── Open a modal ────────────────────────────────────────────────────────────
    const openModal = useCallback(
        (
            type: ModalType,
            params: ModalParams = {},
            options: { stack?: boolean } = {}
        ) => {
            const next = new URLSearchParams(searchParams.toString())
            setTransientParams(type, params)

            if (options.stack) {
                // Nested: keep existing ?modal, add ?over
                next.set('over', type)
            } else {
                // Base modal: replace everything
                next.delete('over')
                next.set('modal', type)
            }

            // Spread params into query string
            Object.entries(params).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    (typeof value === 'string' ||
                        typeof value === 'number' ||
                        typeof value === 'boolean')
                ) {
                    next.set(key, String(value))
                }
            })

            // push → adds a history entry (back button works)
            router.push(`${pathname}?${next.toString()}`)
        },
        [router, pathname, searchParams, setTransientParams]
    )

    // ── Close top modal only (pop stack) ────────────────────────────────────────
    const closeModal = useCallback(() => {
        const next = new URLSearchParams(searchParams.toString())

        if (next.has('over')) {
            // Pop the stacked modal, keep the base
            const overType = next.get('over')
            if (isClearableModalType(overType)) clearTransientParams(overType)
            next.delete('over')
            router.replace(`${pathname}?${next.toString()}`)
        } else {
            // No stack — close everything, go back to base path
            const modalType = next.get('modal')
            if (isClearableModalType(modalType)) clearTransientParams(modalType)
            router.replace(pathname)
        }
    }, [router, pathname, searchParams, clearTransientParams])

    // ── Close all modals ────────────────────────────────────────────────────────
    const closeAll = useCallback(() => {
        const modalType = searchParams.get('modal')
        const overType = searchParams.get('over')
        if (isClearableModalType(modalType)) clearTransientParams(modalType)
        if (isClearableModalType(overType)) clearTransientParams(overType)
        router.replace(pathname)
    }, [router, pathname, searchParams, clearTransientParams])

    // ── Prefetch a modal (call on hover for instant open) ───────────────────────
    const prefetchModal = useCallback(
        (type: ModalType, params: ModalParams = {}) => {
            const next = new URLSearchParams()
            next.set('modal', type)
            Object.entries(params).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    (typeof value === 'string' ||
                        typeof value === 'number' ||
                        typeof value === 'boolean')
                ) {
                    next.set(key, String(value))
                }
            })
            router.prefetch(`${pathname}?${next.toString()}`)
        },
        [router, pathname]
    )

    return { openModal, closeModal, closeAll, prefetchModal }
}