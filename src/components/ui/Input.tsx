'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

type InputState = 'default' | 'success' | 'error'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  success?: string
  state?: InputState

  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      success,
      state = 'default',
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isError = state === 'error' || !!error
    const isSuccess = state === 'success' || !!success

    return (
      <div className="flex flex-col gap-1.5">
        {/* LABEL */}
        {label && <label className="text-label">{label}</label>}

        {/* INPUT WRAPPER */}
        <div
          className={cn(
            'flex items-center rounded-[2px] px-[12px] py-[10px] gap-2 transition-all duration-150',
            'bg-bg-2 border',
            'focus-within:border-g-3/40',

            // STATES
            isError && 'border-neg',
            isSuccess && 'border-pos/40',
            !isError && !isSuccess && 'border-line-c',

            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
        >
          {/* LEFT ICON */}
          {leftIcon && <span className="flex items-center text-t-3">{leftIcon}</span>}

          {/* INPUT */}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-transparent outline-none',
              'text-body placeholder:text-t-4',
              'font-jetbrains',
            )}
            {...props}
          />

          {/* RIGHT ICON */}
          {rightIcon && <span className="flex items-center text-t-3">{rightIcon}</span>}
        </div>

        {/* HINT / STATUS */}
        {!error && !success && hint && <span className="text-subtitle">{hint}</span>}

        {success && <span className="text-[12px] text-pos font-jetbrains">✓ {success}</span>}

        {error && <span className="text-[12px] text-neg font-jetbrains">✕ {error}</span>}
      </div>
    )
  },
)

Input.displayName = 'Input'
