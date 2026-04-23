export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  apiToken: process.env.NEXT_PUBLIC_API_TOKEN ?? '',
} as const
