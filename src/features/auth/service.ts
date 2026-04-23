import { apiFetch } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { LoginRequest, LoginResponse } from '@/features/auth/types'

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(API_ENDPOINTS.auth.login, {
    method: 'POST',
    body: payload,
  })
}
