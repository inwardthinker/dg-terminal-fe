import { ethers } from 'ethers'
import { env } from '@/lib/constants/env'

const USDC_E_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
]

export async function getUsdceBalance(address: string): Promise<number> {
  if (!env.polygonRpcUrl) {
    throw new Error('Missing NEXT_PUBLIC_POLYGON_RPC_URL')
  }

  const provider = new ethers.JsonRpcProvider(env.polygonRpcUrl)
  const contract = new ethers.Contract(USDC_E_ADDRESS, ERC20_ABI, provider)

  const [balance, decimals] = await Promise.all([
    contract.balanceOf(address) as Promise<bigint>,
    contract.decimals() as Promise<number>,
  ])

  return Number(ethers.formatUnits(balance, decimals))
}
