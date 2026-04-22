export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "",
} as const;
