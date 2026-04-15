"use client";

import { SummaryPanel } from "@/features/open-positions/components/SummaryPanel";
import { SummarySkeleton } from "@/features/open-positions/components/SummarySkeleton";
import { SummaryError } from "@/features/open-positions/components/SummaryError";
import { usePositions } from "@/features/open-positions/hooks/usePositions";
import type { Position } from "@/features/open-positions/types";

type Props = {
    limit?: number;
};

export function SummaryPanelContainer({ limit = 3 }: Props) {
    const { positions, totalCount, loading, error } = usePositions({ limit });

    function handleOpen(position: Position) {
        console.info("M5 open trigger", position.id);
    }

    function handleClose(position: Position) {
        console.info("M1 close trigger", position.id);
    }

    if (loading) return <SummarySkeleton />;
    if (error) return <SummaryError />;

    return (
        <SummaryPanel
            positions={positions}
            totalCount={totalCount}
            onOpenPosition={handleOpen}
            onClosePosition={handleClose}
        />
    );
}