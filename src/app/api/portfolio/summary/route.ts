import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/constants/env";

export async function GET(request: NextRequest) {
  if (!env.apiBaseUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_BASE_URL is not configured." },
      { status: 500 }
    );
  }

  const walletAddress = request.nextUrl.searchParams.get("walletAddress") ?? "";
  const baseUrl = env.apiBaseUrl.replace(/\/+$/, "");
  const upstreamUrl = `${baseUrl}/portfolio/summary?${new URLSearchParams({ walletAddress }).toString()}`;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    });

    const contentType = upstreamResponse.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await upstreamResponse.json()
      : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          message: `Portfolio summary upstream failed with status ${upstreamResponse.status}`,
          details: payload,
        },
        { status: upstreamResponse.status }
      );
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { message: "Unable to reach portfolio summary upstream." },
      { status: 502 }
    );
  }
}
