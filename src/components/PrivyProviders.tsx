'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { env } from '@/lib/constants/env'

type PrivyProvidersProps = Readonly<{
  children: React.ReactNode
}>

export function PrivyProviders({ children }: PrivyProvidersProps) {
  if (!env.privyAppId) {
    return children
  }
  return (
    <PrivyProvider
      appId={env.privyAppId}
      config={{
        appearance: {
          logo: `/images/logo.webp`,
          accentColor: '#F5D469',
          theme: '#1F1F1F',
          landingHeader: 'AUTHENTICATE',
          loginMessage: 'Your terminal for prediction markets.',
          showWalletLoginFirst: false,
          walletChainType: 'ethereum-only',
          walletList: ['metamask', 'wallet_connect', 'coinbase_wallet', 'detected_wallets'],
        },
        externalWallets: {
          // coinbaseWallet: {
          //   connectionOptions: "eoaOnly",
          // },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
