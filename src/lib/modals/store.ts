import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ModalEntry } from './types'

// ─── Store shape ──────────────────────────────────────────────────────────────
type ModalStore = {
  // index 0 = base modal, index 1+ = nested (stacked) modals
  stack: ModalEntry[]
  transientParamsByType: Partial<Record<ModalEntry['type'], ModalEntry['params']>>

  // Only called by the sync hook — never call directly from UI
  setStack: (stack: ModalEntry[]) => void
  setTransientParams: (type: ModalEntry['type'], params: ModalEntry['params']) => void
  clearTransientParams: (type: ModalEntry['type']) => void

  // Derived helpers (read-only, computed from stack)
  readonly activeModal: ModalEntry | null
  readonly isOpen: boolean
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useModalStore = create<ModalStore>()(
  devtools(
    (set, get) => ({
      stack: [],
      transientParamsByType: {},

      setStack: (stack) => set({ stack }, false, 'modal/setStack'),
      setTransientParams: (type, params) =>
        set(
          (state) => ({
            transientParamsByType: {
              ...state.transientParamsByType,
              [type]: params,
            },
          }),
          false,
          'modal/setTransientParams',
        ),
      clearTransientParams: (type) =>
        set(
          (state) => {
            const next = { ...state.transientParamsByType }
            delete next[type]
            return { transientParamsByType: next }
          },
          false,
          'modal/clearTransientParams',
        ),

      get activeModal() {
        const { stack } = get()
        return stack.length > 0 ? stack[stack.length - 1] : null
      },

      get isOpen() {
        return get().stack.length > 0
      },
    }),
    { name: 'ModalStore' },
  ),
)
