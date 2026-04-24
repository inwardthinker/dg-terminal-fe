import { env } from '@/lib/constants/env'

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  /** Override the base URL. Pass "" to use a relative path (e.g. Next.js proxy routes). */
  baseUrl?: string
}

export class ApiError extends Error {
  public readonly status: number
  public readonly details: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, baseUrl, ...rest } = options
  const useRelativePath = baseUrl === ''
  const resolvedBaseUrl = useRelativePath ? '' : (baseUrl ?? env.apiBaseUrl)

  if (!useRelativePath && !resolvedBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured.')
  }

  const requestHeaders = new Headers(headers)
  if (body && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${resolvedBaseUrl}${path}`, {
    ...rest,
    credentials: 'include',
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      isJson && typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message?: string }).message ?? 'Request failed.')
        : `Request failed with status ${response.status}`

    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}
