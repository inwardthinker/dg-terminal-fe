export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  apiToken: process.env.NEXT_PUBLIC_API_TOKEN ?? '',
  polygonRpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL ?? '',
} as const
