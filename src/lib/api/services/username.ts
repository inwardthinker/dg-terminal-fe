import { apiFetch } from '@/lib/api/client'

type UsernameAvailabilityResponse = {
  available?: boolean
  isAvailable?: boolean
  message?: string
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const query = new URLSearchParams({ username }).toString()
  const response = await apiFetch<UsernameAvailabilityResponse>(
    `/users/username-availability?${query}`,
    {
      method: 'GET',
    },
  )

  if (typeof response.available === 'boolean') {
    return response.available
  }

  if (typeof response.isAvailable === 'boolean') {
    return response.isAvailable
  }

  return false
}
