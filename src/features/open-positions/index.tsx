"use client";

import { SummaryPanel } from "@/features/open-positions/components/SummaryPanel";
import { SummarySkeleton } from "@/features/open-positions/components/SummarySkeleton";
import { SummaryError } from "@/features/open-positions/components/SummaryError";
import { usePositions } from "@/features/open-positions/hooks/usePositions";
import type { Position } from "@/features/open-positions/types";

type Props = {
    limit?: number;
    forceEmptyState?: boolean;
    venueUnavailableOverride?: boolean;
};

export function SummaryPanelContainer({
    limit = 3,
    forceEmptyState = false,
    venueUnavailableOverride = false,
}: Props) {
    const { positions, totalCount, loading, error } = usePositions(
        forceEmptyState ? { limit: 0, userAddress: "" } : { limit }
    );
    const venueUnavailable = venueUnavailableOverride || Boolean(error);

    function handleOpen(position: Position) {
        console.info("M5 open trigger", position.id);
    }

    function handleClose(position: Position) {
        console.info("M1 close trigger", position.id);
    }

    if (!forceEmptyState && loading) return <SummarySkeleton />;
    if (!forceEmptyState && error && positions.length === 0) return <SummaryError message={error} />;

    return (
        <SummaryPanel
            positions={forceEmptyState ? [] : positions}
            totalCount={forceEmptyState ? 0 : totalCount}
            onOpenPosition={handleOpen}
            onClosePosition={handleClose}
            venueUnavailable={venueUnavailable}
        />
    );
}