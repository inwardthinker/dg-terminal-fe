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
                className="peer inline-flex h-8 w-8 items-center justify-center rounded-full opacity-80 transition hover:opacity-100 focus-visible:opacity-100"
            >
                <span
                    aria-hidden="true"
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-line-c text-[10px] text-t-3 italic"
                >
                    i
                </span>
            </button>

            <div
                role="tooltip"
                className="normal-case text-left pointer-events-none absolute top-6 left-0 z-10 max-w-[240px] min-w-[164px] bg-bg-1 border border-line-c rounded-r4 p-sp3 text-support text-t-2 shadow-lg opacity-0 transition-opacity group-hover:opacity-100 peer-focus-visible:opacity-100"
            >
                {text}
            </div>
        </div>
    );
}