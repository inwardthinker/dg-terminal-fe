"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type {
  Position,
  PositionsConnectionState,
  UsePositionsParams,
  UsePositionsResult,
} from "../types";
import {
  connectPositionsPriceSocket,
  parseSocketError,
  resolvePositionsPriceSocketUserAddress,
  type PositionPriceEvent,
} from "../socket";

const mockPositions: Position[] = [
  {
    id: "pos-1",
    no_of_shares: 420,
    market: "Will BTC close above $80k this quarter?",
    category: "Crypto",
    side: "YES",
    entryPrice: 0.54,
    currentPrice: 0.68,
    size: 420,
    pnl: 58.8,
    pnlPct: 25.93,
  },
  {
    id: "pos-2",
    no_of_shares: 360,
    market: "US CPI prints below 3.0% by June",
    category: "Macro",
    side: "YES",
    entryPrice: 0.48,
    currentPrice: 0.59,
    size: 360,
    pnl: 39.6,
    pnlPct: 22.92,
  },
  {
    id: "pos-3",
    no_of_shares: 300,
    market: "Premier League winner: Arsenal",
    category: "Sports",
    side: "NO",
    entryPrice: 0.61,
    currentPrice: 0.52,
    size: 300,
    pnl: 27,
    pnlPct: 14.75,
  },
  {
    id: "pos-4",
    no_of_shares: 280,
    market: "ETH ETF approval before year-end",
    category: "Crypto",
    side: "YES",
    entryPrice: 0.44,
    currentPrice: 0.5,
    size: 280,
    pnl: 16.8,
    pnlPct: 13.64,
  },
  {
    id: "pos-5",
    no_of_shares: 200,
    market: "US election winner: Democratic nominee",
    category: "Politics",
    side: "YES",
    entryPrice: 0.49,
    currentPrice: 0.53,
    size: 200,
    pnl: 8,
    pnlPct: 8.16,
  },
  {
    id: "pos-6",
    no_of_shares: 250,
    market: "Fed cuts rates 2+ times this year",
    category: "Macro",
    side: "NO",
    entryPrice: 0.57,
    currentPrice: 0.56,
    size: 250,
    pnl: -2.5,
    pnlPct: -1.75,
  },
  {
    id: "pos-7",
    no_of_shares: 300,
    market: "Lakers reach conference finals",
    category: "Sports",
    side: "YES",
    entryPrice: 0.41,
    currentPrice: 0.38,
    size: 300,
    pnl: -9,
    pnlPct: -7.32,
  },
  {
    id: "pos-8",
    no_of_shares: 260,
    market: "SOL closes above $250 by September",
    category: "Crypto",
    side: "NO",
    entryPrice: 0.35,
    currentPrice: 0.3,
    size: 260,
    pnl: -13,
    pnlPct: -14.29,
  },
  {
    id: "pos-9",
    no_of_shares: 190,
    market: "NATO expands membership this year",
    category: "Politics",
    side: "YES",
    entryPrice: 0.39,
    currentPrice: 0.42,
    size: 190,
    pnl: 5.7,
    pnlPct: 7.69,
  },
  {
    id: "pos-10",
    no_of_shares: 340,
    market: "S&P 500 closes above 6200 by Q4",
    category: "Macro",
    side: "YES",
    entryPrice: 0.46,
    currentPrice: 0.51,
    size: 340,
    pnl: 17,
    pnlPct: 10.87,
  },
  {
    id: "pos-11",
    no_of_shares: 210,
    market: "Oscar winner: Best Picture contender A",
    category: "Other",
    side: "NO",
    entryPrice: 0.62,
    currentPrice: 0.57,
    size: 210,
    pnl: 10.5,
    pnlPct: 8.06,
  },
  {
    id: "pos-12",
    no_of_shares: 260,
    market: "India GDP growth above 7% this FY",
    category: "Macro",
    side: "YES",
    entryPrice: 0.52,
    currentPrice: 0.6,
    size: 260,
    pnl: 20.8,
    pnlPct: 15.38,
  },
];
const POSITION_STALE_MS = 6 * 60 * 1000;
const LIVE_UPDATE_THROTTLE_MS = 500;
const DISCONNECTED_DOT_DELAY_MS = 10_000;
const INITIAL_LIVE_DATA_GRACE_MS = 2500;

function applyPriceEvent(position: Position, event: PositionPriceEvent): Position {
  return {
    ...position,
    market: event.title ?? position.market,
    side: event.outcome ?? position.side,
    no_of_shares: asNumber(event.no_of_shares, position.no_of_shares),
    entryPrice: asNumber(event.avg_price, position.entryPrice),
    currentPrice: asNumber(event.current_price, position.currentPrice),
    size: asNumber(event.position_value, position.size),
    pnl: asNumber(event.pnl_amount, position.pnl),
    pnlPct: asNumber(event.pnl_percent, position.pnlPct),
    priceStale: event.stale,
  };
}

function hasPositionChanged(previous: Position, next: Position): boolean {
  return (
    previous.market !== next.market ||
    previous.side !== next.side ||
    previous.no_of_shares !== next.no_of_shares ||
    previous.entryPrice !== next.entryPrice ||
    previous.currentPrice !== next.currentPrice ||
    previous.size !== next.size ||
    previous.pnl !== next.pnl ||
    previous.pnlPct !== next.pnlPct ||
    previous.priceStale !== next.priceStale
  );
}

function buildPositionFromPriceEvent(event: PositionPriceEvent): Position {
  const side = event.outcome ?? "UNKNOWN";
  return {
    id: event.position_id,
    market: event.title ?? "Untitled market",
    category: "Other",
    side,
    no_of_shares: asNumber(event.no_of_shares, 0),
    entryPrice: asNumber(event.avg_price, 0),
    currentPrice: asNumber(event.current_price, 0),
    size: asNumber(event.position_value, 0),
    pnl: asNumber(event.pnl_amount, 0),
    pnlPct: asNumber(event.pnl_percent, 0),
    priceStale: event.stale,
  };
}

function normalizePositionId(positionId: string): string {
  return positionId.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function asOptionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asOptionalBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function pickFirst<T>(
  source: Record<string, unknown>,
  keys: string[],
  parser: (value: unknown) => T | null
): T | null {
  for (const key of keys) {
    const parsed = parser(source[key]);
    if (parsed !== null) {
      return parsed;
    }
  }
  return null;
}

function normalizeIncomingPriceEvent(payload: unknown): PositionPriceEvent | null {
  if (!isRecord(payload)) {
    return null;
  }

  const positionId = pickFirst(payload, ["position_id", "positionId", "id"], asOptionalString);
  if (!positionId) {
    return null;
  }

  return {
    position_id: positionId,
    outcome: pickFirst(payload, ["outcome", "side"], asOptionalString),
    title: pickFirst(payload, ["title", "market", "market_title"], asOptionalString),
    no_of_shares: pickFirst(payload, ["no_of_shares", "noOfShares", "shares", "quantity"], asOptionalNumber),
    avg_price: pickFirst(payload, ["avg_price", "avgPrice", "entry_price", "entryPrice"], asOptionalNumber),
    current_price: pickFirst(payload, ["current_price", "currentPrice", "mark_price", "markPrice"], asOptionalNumber),
    position_value: pickFirst(payload, ["position_value", "positionValue", "size", "notional"], asOptionalNumber),
    pnl_amount: pickFirst(payload, ["pnl_amount", "pnlAmount", "pnl"], asOptionalNumber),
    pnl_percent: pickFirst(payload, ["pnl_percent", "pnlPercent", "pnl_pct", "pnlPct"], asOptionalNumber),
    stale: pickFirst(payload, ["stale", "is_stale", "isStale"], asOptionalBoolean) ?? false,
  };
}

function coercePriceEvents(payload: unknown): PositionPriceEvent[] {
  if (Array.isArray(payload)) {
    return payload
      .map((entry) => normalizeIncomingPriceEvent(entry))
      .filter((event): event is PositionPriceEvent => event !== null);
  }

  const normalizedEvent = normalizeIncomingPriceEvent(payload);
  if (normalizedEvent) {
    return [normalizedEvent];
  }

  if (isRecord(payload)) {
    return coercePriceEvents(
      payload.data ??
      payload.position ??
      payload.positions ??
      payload.position_price ??
      payload.position_prices ??
      payload.snapshot
    );
  }

  return [];
}

function asNumber(value: number | null, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function usePositions({
  limit,
  sortBy = "pnl",
  userAddress,
  realtimeOnly = false,
}: UsePositionsParams = {}): UsePositionsResult {
  const resolvedAddress = resolvePositionsPriceSocketUserAddress(userAddress);
  const isLiveSocketMode = Boolean(resolvedAddress) || realtimeOnly;
  const lastSeenByPositionIdRef = useRef<Record<string, number>>({});
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionState, setConnectionState] = useState<PositionsConnectionState>(
    isLiveSocketMode ? "reconnecting" : "connected"
  );
  const [positionsState, setPositionsState] = useState<Position[]>(
    isLiveSocketMode ? [] : mockPositions
  )

  useEffect(() => {
    setPositionsState(isLiveSocketMode ? [] : mockPositions);
    lastSeenByPositionIdRef.current = {};
    setError(null);
    setLoading(isLiveSocketMode);
    setConnectionState(isLiveSocketMode ? "reconnecting" : "connected");

    if (isLiveSocketMode) {
      if (realtimeOnly && !resolvedAddress) {
        setPositionsState(
          mockPositions.map((position) => ({ ...position, priceStale: true }))
        );
        setLoading(false);
        setError("Venue API unavailable");
      }
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLoading(false)
      setError(null)
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [isLiveSocketMode, realtimeOnly, resolvedAddress])

  useEffect(() => {
    if (!resolvedAddress) {
      return;
    }

    const socket = connectPositionsPriceSocket(resolvedAddress);
    let didLogConnectError = false;
    let pendingEvents: PositionPriceEvent[] = [];
    let flushTimerId: number | null = null;
    let disconnectedTimerId: number | null = null;
    let initialDataGraceTimerId: number | null = null;
    let hasReceivedFirstLivePayload = false;

    const flushBufferedEvents = () => {
      flushTimerId = null;
      const events = pendingEvents;
      if (events.length === 0) {
        return;
      }

      pendingEvents = [];
      const tick = Date.now();
      setPositionsState((previous) => {
        let next = previous;
        const indexById = new Map<string, number>();
        previous.forEach((position, index) => {
          indexById.set(position.id, index);
        });

        for (const event of events) {
          const positionId = normalizePositionId(event.position_id);
          if (!positionId) {
            continue;
          }

          lastSeenByPositionIdRef.current[positionId] = tick;
          const existingIndex = indexById.get(positionId) ?? -1;
          if (existingIndex === -1) {
            if (next === previous) {
              next = [...previous];
            }
            next.push({ ...buildPositionFromPriceEvent(event), id: positionId, liveTick: tick });
            indexById.set(positionId, next.length - 1);
            continue;
          }

          const currentPosition = next[existingIndex];
          const updatedPosition = applyPriceEvent(currentPosition, event);
          if (!hasPositionChanged(currentPosition, updatedPosition)) {
            continue;
          }

          if (next === previous) {
            next = [...previous];
          }
          next[existingIndex] = { ...updatedPosition, liveTick: tick };
        }

        return next;
      });
      hasReceivedFirstLivePayload = true;
      if (initialDataGraceTimerId !== null) {
        window.clearTimeout(initialDataGraceTimerId);
        initialDataGraceTimerId = null;
      }
      setLoading(false);
      setError(null);
    };

    const scheduleFlush = () => {
      if (flushTimerId !== null) {
        return;
      }
      flushTimerId = window.setTimeout(flushBufferedEvents, LIVE_UPDATE_THROTTLE_MS);
    };

    const clearDisconnectedTimer = () => {
      if (disconnectedTimerId !== null) {
        window.clearTimeout(disconnectedTimerId);
        disconnectedTimerId = null;
      }
    };

    const markDisconnectedWithDelay = () => {
      clearDisconnectedTimer();
      disconnectedTimerId = window.setTimeout(() => {
        setConnectionState("disconnected");
      }, DISCONNECTED_DOT_DELAY_MS);
    };

    const emitSubscribe = () => {
      socket.emit("subscribe_positions", { userAddress: resolvedAddress });
      socket.emit("subscribe", { user: resolvedAddress });
    };

    socket.on("connect", () => {
      // Clear stale rows from prior disconnected sessions before fresh snapshot events arrive.
      setPositionsState([]);
      lastSeenByPositionIdRef.current = {};
      setError(null);
      hasReceivedFirstLivePayload = false;
      if (initialDataGraceTimerId !== null) {
        window.clearTimeout(initialDataGraceTimerId);
      }
      setLoading(true);
      initialDataGraceTimerId = window.setTimeout(() => {
        if (!hasReceivedFirstLivePayload) {
          setLoading(false);
        }
      }, INITIAL_LIVE_DATA_GRACE_MS);
      setConnectionState("connected");
      clearDisconnectedTimer();
      didLogConnectError = false;
      emitSubscribe();
      console.info("[positions-socket] connected", { socketId: socket.id, user: resolvedAddress });
    });

    socket.on("subscribed", (payload: { user: string }) => {
      console.info("[positions-socket] subscribed", payload);
    });

    const handlePositionPayload = (payload: unknown) => {
      const events = coercePriceEvents(payload);
      if (events.length === 0) {
        return;
      }

      console.info("[positions-socket] position-update", payload);
      pendingEvents.push(...events);
      scheduleFlush();
    };

    const liveEventNames = [
      "position_price",
      "position_prices",
      "positionPrice",
      "positions_snapshot",
      "positions",
      "snapshot",
    ];
    liveEventNames.forEach((eventName) => socket.on(eventName, handlePositionPayload));

    socket.on("error", (payload: unknown) => {
      console.error("[positions-socket] error-event", payload);
      setError(parseSocketError(payload));
    });

    socket.on("connect_error", (errorPayload) => {
      if (!didLogConnectError) {
        console.error("[positions-socket] connect_error", errorPayload);
        didLogConnectError = true;
      }
      setError(errorPayload.message || "Failed to connect to live positions socket");
      setConnectionState("reconnecting");
      markDisconnectedWithDelay();
    });

    socket.on("disconnect", () => {
      setConnectionState("reconnecting");
      markDisconnectedWithDelay();
    });

    socket.io.on("reconnect_attempt", () => {
      setConnectionState("reconnecting");
    });

    socket.io.on("reconnect", () => {
      setConnectionState("connected");
      clearDisconnectedTimer();
      emitSubscribe();
    });

    return () => {
      liveEventNames.forEach((eventName) => socket.off(eventName, handlePositionPayload));
      flushBufferedEvents();
      if (flushTimerId !== null) {
        window.clearTimeout(flushTimerId);
      }
      if (initialDataGraceTimerId !== null) {
        window.clearTimeout(initialDataGraceTimerId);
      }
      clearDisconnectedTimer();
      socket.disconnect();
    };
  }, [resolvedAddress]);

  useEffect(() => {
    if (!isLiveSocketMode) {
      return;
    }

    const pruneIntervalId = window.setInterval(() => {
      const now = Date.now();
      setPositionsState((previous) =>
        previous.filter((position) => {
          if (position.priceStale) {
            // Stale means price feed is unavailable, not that position is closed.
            return true;
          }
          const lastSeen = lastSeenByPositionIdRef.current[position.id];
          return typeof lastSeen === "number" && now - lastSeen <= POSITION_STALE_MS;
        })
      );
    }, 30_000);

    return () => window.clearInterval(pruneIntervalId);
  }, [isLiveSocketMode]);

  const totalCount = positionsState.length

  const positions = useMemo(() => {
    let data = [...positionsState]

    if (sortBy === "pnl") {
      data.sort((a, b) => b.pnl - a.pnl)
    }

    if (limit) {
      data = data.slice(0, limit)
    }

    return data
  }, [limit, sortBy, positionsState])

  return { positions, totalCount, loading, error, connectionState }
}