// src/components/ui/InfoTooltip.tsx
"use client";

type InfoTooltipProps = {
    text: string;
};

export function InfoTooltip({ text }: InfoTooltipProps) {
    return (
        <div className="group relative flex items-center">
            <button
                type="button"
                aria-label="More information"
                className="w-4 h-4 rounded-full border border-line-c text-t-3 text-[10px] flex items-center justify-center opacity-80 transition hover:opacity-100 focus:opacity-100"
            >
                i
            </button>

            <div
                role="tooltip"
                className="pointer-events-none absolute top-6 left-0 z-10 w-[240px] bg-bg-1 border border-line-c rounded-r4 p-sp3 text-support text-t-2 shadow-lg opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
                {text}
            </div>
        </div>
    );
}