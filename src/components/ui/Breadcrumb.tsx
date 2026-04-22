"use client"

import Link from "next/link"
import clsx from "clsx"
import { ChevronRight } from "lucide-react"

type BreadcrumbItem = {
    label: string
    href?: string
}

type BreadcrumbProps = {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumb({
    items,
    className,
}: BreadcrumbProps) {
    return (
        <div className="relative left-1/2 -ml-[50vw] w-screen max-w-[100vw] overflow-x-hidden border-y border-line-c bg-bg-0">
          <div className="mx-auto flex w-full max-w-[1400px] min-w-0 items-center justify-between px-sp5 py-[5px] sm:px-sp7">
            <nav aria-label="Breadcrumb" className={className}>
                <ol className="flex items-center gap-1 text-secondary text-t-3!">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1

                        return (
                            <li key={index} className="flex items-center gap-1">
                                {item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className="hover:text-t-2 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={clsx(
                                            isLast && "text-t-1 font-semibold"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                )}

                                {!isLast && (
                                    <span className="px-1 text-t-3 select-none">
                                        <ChevronRight size={16} />
                                    </span>
                                )}
                            </li>
                        )
                    })}
                </ol>
            </nav>
            <div className="text-secondary text-t-3/20! border border-line-c rounded-r2 px-sp3 py-sp1 max-sm:hidden">cmdP to close</div>
          </div>
        </div>
    )
}