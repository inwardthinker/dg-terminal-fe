import { NextRequest, NextResponse } from 'next/server'

const POLYMARKET_DATA_API_BASE_URL =
  process.env.NEXT_PUBLIC_POLYMARKET_DATA_API_BASE_URL ?? 'https://data-api.polymarket.com'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const user = params.get('user')?.trim().toLowerCase()

  if (!user) {
    return NextResponse.json({ message: 'Missing required query param: user' }, { status: 400 })
  }

  const upstreamParams = new URLSearchParams({
    user,
    limit: params.get('limit') ?? '500',
    offset: params.get('offset') ?? '0',
    sizeThreshold: params.get('sizeThreshold') ?? '0',
    sortBy: params.get('sortBy') ?? 'CASHPNL',
    sortDirection: params.get('sortDirection') ?? 'DESC',
  })

  const response = await fetch(`${POLYMARKET_DATA_API_BASE_URL}/positions?${upstreamParams.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    return NextResponse.json(
      { message: `Polymarket positions request failed with status ${response.status}` },
      { status: response.status },
    )
  }

  const payload = await response.json()
  return NextResponse.json(payload)
}
