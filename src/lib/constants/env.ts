export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  apiToken: process.env.NEXT_PUBLIC_API_TOKEN ?? '',
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '',
  polygonRpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL ?? '',
} as const
