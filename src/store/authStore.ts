import { create } from 'zustand'
import type { AuthUser } from '@/features/auth/types'

type AuthState = {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
