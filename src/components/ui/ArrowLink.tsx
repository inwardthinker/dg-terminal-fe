import Link from "next/link"
import { ArrowDownIcon } from "lucide-react"
import clsx from "clsx"

type Direction = "up" | "down" | "left" | "right"

const directionClassMap: Record<Direction, string> = {
    up: "rotate-180",
    down: "rotate-0",
    left: "-rotate-90",
    right: "rotate-90",
}

type ArrowLinkProps = {
    href: string
    label: string
    direction?: Direction
    className?: string
}

export function ArrowLink({
    href,
    label,
    direction = "down",
    className,
}: ArrowLinkProps) {
    return (
        <Link
            href={href}
            className={clsx(
                "inline-flex items-center gap-1 text-g-3!",
                className
            )}
        >
            <span>{label}</span>
            <ArrowDownIcon
                size={16}
                className={directionClassMap[direction]}
            />
        </Link>
    )
}