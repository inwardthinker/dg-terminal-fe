'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex min-h-8 min-w-8 items-center justify-center rounded-[2px] font-jetbrains text-[11px] font-medium tracking-[0.02em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        // 🔥 PRIMARY (Continue)
        primary:
          'bg-g-3 text-black font-semibold border border-g-4 ' +
          'hover:bg-g-4 hover:opacity-[0.88] active:bg-g-4 active:opacity-75',

        // 🟡 SECONDARY (Check Availability)
        secondary:
          'border border-[var(--glowb)] ' +
          'text-g-3 font-semibold ' +
          'bg-transparent ' +
          'hover:bg-[var(--glow)] ' +
          'hover:border-g-4 ' +
          'active:bg-[var(--glow)] ' +
          'active:border-g-4',

        // ⚪ TERTIARY (Skip for now)
        tertiary:
          'bg-transparent border-none shadow-none ' +
          'text-[#9ca3af] ' +
          'hover:text-t-3 ' +
          'p-0 h-auto',

        // 🟨 TAB ACTIVE (Overview)
        'tab-active':
          'bg-[var(--glow)] ' + 'border border-[var(--glowb)] ' + 'text-g-3 font-semibold',

        // ⚫ TAB DEFAULT (Markets)
        'tab-default':
          'bg-transparent ' +
          'border border-transparent ' +
          'text-[#9ca3af] ' +
          'hover:text-white ' +
          'hover:border-[rgba(255,255,255,0.12)]',

        // 🚫 DISABLED (explicit styling if needed)
        disabled: 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed',

        // ❌ DESTRUCTIVE (Delete)
        destructive:
          'bg-transparent ' +
          'text-red-500 font-semibold ' +
          'border border-red-500/40 ' +
          'hover:bg-[var(--negg)] hover:border-[var(--negg)]',
      },

      size: {
        xs: 'h-8 px-2 text-[10px]',
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 text-sm',
      },

      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
      loading: false,
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
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
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
