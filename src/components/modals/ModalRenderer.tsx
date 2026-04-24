'use client'

import { Suspense } from 'react'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useModalStore } from '@/lib/modals/store'
import { getModalComponent } from '@/lib/modals/registry'
import { useModal } from '@/lib/modals/hooks/useModal'
import { useModalSync } from '@/lib/modals/hooks/useModalSync'

const AUTH_MODAL_OPEN_STORAGE_KEY = 'auth_modal_open'

// ─── Inner component (uses useSearchParams via useModalSync) ──────────────────
// Must be a separate component so the <Suspense> boundary above it works.
function ModalSyncBoundary() {
  useModalSync()
  const { openModal } = useModal()
  const searchParams = useSearchParams()

  useEffect(() => {
    const shouldRestore = sessionStorage.getItem(AUTH_MODAL_OPEN_STORAGE_KEY)
    const isAnyModalOpen = Boolean(searchParams.get('modal'))

    if (shouldRestore && !isAnyModalOpen) {
      openModal('login')
    }

    if (shouldRestore) {
      sessionStorage.removeItem(AUTH_MODAL_OPEN_STORAGE_KEY)
    }
  }, [openModal, searchParams])

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
        return <ModalComponent key={`${entry.type}-${index}`} {...entry.params} />
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
