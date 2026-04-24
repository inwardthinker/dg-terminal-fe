import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/utils/proxy'

const TERMINAL_API_BASE_URL = 'http://62.171.166.240:8000'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const userId = searchParams.get('userId')

  return proxyRequest({
    path: `${TERMINAL_API_BASE_URL}/v1/risk-metrics?userId=${userId}`,
    secret: process.env.TOTP_SECRET!,
  })
}
