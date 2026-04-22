"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
  "inline-flex min-h-8 min-w-8 items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/90",
        destructive:
          "bg-neg/10 hover:bg-neg/20 " +
          "text-neg font-semibold " +
          "border border-neg/40 hover:border-neg/60 " +
          "transition-all duration-200",
        subtle: "text-g-3 hover:text-[#e6c97a] " +
          "bg-transparent border-none shadow-none " +
          "p-0 h-auto hover:bg-transparent " +
          "focus-visible:ring-0 focus-visible:outline-none " +
          "transition-colors duration-200",

        accent:
          "text-g-3 font-semibold " +
          "border border-[rgba(205,189,112,0.35)] " +
          "bg-[rgba(205,189,112,0.12)] " +
          "hover:bg-[rgba(205,189,112,0.18)] " +
          "transition-colors duration-200",

        // ✅ NEW: Withdraw button
        muted:
          "text-t-3 text-secondary text-t-3! " +
          "border border-line-c " +
          "bg-transparent " +
          "hover:text-t-2 " +
          "hover:border-[rgba(255,255,255,0.18)] " +
          "transition-all duration-200",

        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border border-gray-300 hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-8 px-2 text-[10px]",
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 text-sm",
      },
      loading: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, loading }), className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }