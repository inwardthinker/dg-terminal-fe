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
        <div className="bg-bg-0 border-y border-line-c w-screen relative left-1/2 -ml-[50vw]">
          <div className="mx-auto w-full max-w-[1400px] flex justify-between px-sp5 sm:px-sp7 py-[5px] items-center">
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