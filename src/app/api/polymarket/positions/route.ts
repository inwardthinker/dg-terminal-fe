import { NextRequest, NextResponse } from 'next/server'

const POLYMARKET_DATA_API_BASE_URL =
  process.env.NEXT_PUBLIC_POLYMARKET_DATA_API_BASE_URL ?? 'https://data-api.polymarket.com'

const UPSTREAM_TIMEOUT_MS = 8_000

export const dynamic = 'force-dynamic'

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

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const upstream = await fetch(
      `${POLYMARKET_DATA_API_BASE_URL}/positions?${upstreamParams.toString()}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      },
    )

    if (!upstream.ok) {
      const fallbackBody = await upstream.text().catch(() => '')
      return NextResponse.json(
        {
          message: `Polymarket positions request failed with status ${upstream.status}`,
          upstream: fallbackBody.slice(0, 500),
        },
        { status: upstream.status },
      )
    }

    const payload = await upstream.json()
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=3, stale-while-revalidate=10',
      },
    })
  } catch (err) {
    const isAbort = err instanceof Error && err.name === 'AbortError'
    return NextResponse.json(
      {
        message: isAbort
          ? 'Polymarket positions request timed out'
          : 'Polymarket positions request failed',
      },
      { status: isAbort ? 504 : 502 },
    )
  } finally {
    clearTimeout(timeout)
  }
}
