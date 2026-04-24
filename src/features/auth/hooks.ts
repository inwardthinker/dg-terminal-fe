import { useState } from 'react'
import { login as loginService } from '@/features/auth/service'
import type { LoginRequest } from '@/features/auth/types'
import { useAuthStore } from '@/store/authStore'
import { getErrorMessage } from '@/lib/utils/error'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setUser = useAuthStore((state) => state.setUser)

  const login = async (payload: LoginRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginService(payload)
      setUser(response.user)
      return response
    } catch (err) {
      setError(getErrorMessage(err))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
    error,
  }
}
