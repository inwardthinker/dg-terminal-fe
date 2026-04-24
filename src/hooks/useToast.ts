'use client'

import { useToastStore, type ShowToastInput } from '@/store/useToastStore'

type UseToastReturn = {
  showToast: (input: ShowToastInput) => string
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

export const useToast = (): UseToastReturn => {
  const showToast = useToastStore((state) => state.showToast)
  const removeToast = useToastStore((state) => state.removeToast)
  const clearAllToasts = useToastStore((state) => state.clearAllToasts)

  return {
    showToast,
    removeToast,
    clearAllToasts,
  }
}
