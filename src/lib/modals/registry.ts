import type { ComponentType } from 'react'
import type { ModalType, ModalParams } from './types'

// ─── Import modal components ──────────────────────────────────────────────────
// Each modal receives the URL params as props.
import { ClosePositionModal } from '@/components/modals/ClosePositionModal'

// ─── Registry ─────────────────────────────────────────────────────────────────
// TypeScript enforces that every ModalType key has a matching component.
// Adding a new modal type without registering it here is a compile error.
export const MODAL_REGISTRY: Record<ModalType, ComponentType<ModalParams>> = {

    close: ClosePositionModal,
}

// ─── Helper ───────────────────────────────────────────────────────────────────
export function getModalComponent(type: ModalType): ComponentType<ModalParams> {
    return MODAL_REGISTRY[type]
}