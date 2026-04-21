"use client";

import { useEffect, useId, useRef, useState } from "react";

type InfoTooltipProps = {
    text: string;
};

export function InfoTooltip({ text }: InfoTooltipProps) {
    const [open, setOpen] = useState(false);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const id = useId();

    const show = () => setOpen(true);
    const hide = () => setOpen(false);

    const handleMouseEnter = () => {
        hoverTimer.current = setTimeout(show, 200);
    };

    const handleMouseLeave = () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        hide();
    };

    const handleFocus = () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        show();
    };

    const handleBlur = () => hide();

    // Click/tap toggles; Enter and Space fire onClick natively on <button>
    const handleClick = () => setOpen((v) => !v);

    useEffect(() => () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
    }, []);

    return (
        <div className="relative flex items-center">
            <button
                type="button"
                aria-label="More information"
                aria-describedby={id}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onClick={handleClick}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full opacity-80 transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-line-g"
            >
                <span
                    aria-hidden="true"
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-line-c text-[10px] text-t-3 italic"
                >
                    i
                </span>
            </button>

            <div
                id={id}
                role="tooltip"
                className={`pointer-events-none absolute top-6 left-0 z-10 max-w-[240px] min-w-[164px] bg-bg-1 border border-line-c rounded-r4 p-sp3 text-support text-t-2 shadow-lg normal-case text-left transition-opacity duration-150 ${
                    open ? "opacity-100" : "opacity-0"
                }`}
            >
                {text}
            </div>
        </div>
    );
}
