'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

type BaseModalProps = {
    children: ReactNode
    onClose: () => void
    title?: string
    showClose?: boolean

    variant?: 'drawer' | 'modal' // 👈 NEW
}

export function BaseModal({
    children,
    onClose,
    title,
    showClose = true,
    variant = 'modal',
}: BaseModalProps) {
    const sheetRef = useRef<HTMLDivElement>(null)
    const lastFocusedElementRef = useRef<HTMLElement | null>(null)

    const startY = useRef(0)
    const currentY = useRef(0)
    const startTime = useRef(0)

    // 🔒 Scroll lock (iOS safe)
    useEffect(() => {
        const scrollY = window.scrollY
        lastFocusedElementRef.current = document.activeElement as HTMLElement | null

        document.documentElement.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = '100%'

        return () => {
            document.documentElement.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            window.scrollTo(0, scrollY)
            lastFocusedElementRef.current?.focus()
        }
    }, [])

    useEffect(() => {
        const panel = sheetRef.current
        if (!panel) return

        panel.focus()

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return

            const focusableElements = panel.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )

            if (focusableElements.length === 0) {
                event.preventDefault()
                panel.focus()
                return
            }

            const first = focusableElements[0]
            const last = focusableElements[focusableElements.length - 1]
            const active = document.activeElement

            if (event.shiftKey && active === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && active === last) {
                event.preventDefault()
                first.focus()
            }
        }

        panel.addEventListener('keydown', handleKeyDown)
        return () => panel.removeEventListener('keydown', handleKeyDown)
    }, [])

    // ESC close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    // ───── Swipe (mobile) ─────
    const handleTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY
        startTime.current = Date.now()
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        currentY.current = e.touches[0].clientY
        const diff = currentY.current - startY.current

        if (diff > 0 && sheetRef.current) {
            sheetRef.current.style.transform = `translateY(${diff}px)`
        }
    }

    const handleTouchEnd = () => {
        if (!sheetRef.current) return

        const diff = currentY.current - startY.current
        const time = Date.now() - startTime.current
        const velocity = (diff / time) * 1000
        const height = sheetRef.current.offsetHeight

        const shouldClose =
            diff > height * 0.3 || velocity > 400

        if (shouldClose) {
            sheetRef.current.style.transform = `translateY(100%)`
            sheetRef.current.style.transition = 'transform 0.2s ease-out'
            setTimeout(onClose, 200)
        } else {
            sheetRef.current.style.transform = `translateY(0)`
            sheetRef.current.style.transition = 'transform 0.2s ease-out'
        }
    }

    return (
        <div
            onClick={onClose}
            onTouchMove={(e) => e.preventDefault()}
            className={`
        fixed inset-0 z-50
        bg-black/75

        /* Mobile */
        flex items-end

        /* Desktop */
        md:items-center
        ${variant === 'drawer' ? 'md:justify-end' : 'md:justify-center'}
      `}
        >
            {/* ───── Panel ───── */}
            <div
                ref={sheetRef}
                onClick={(e) => e.stopPropagation()}
                role='dialog'
                aria-modal='true'
                tabIndex={-1}
                className={`
          w-full bg-bg-0 shadow-xl border max-md:border-b-0 border-line-c

          /* Mobile: bottom sheet */
          rounded-t-2xl max-h-[85vh] overflow-y-auto
          animate-slide-up

          /* Desktop: DRAWER */
          ${variant === 'drawer'
                        ? `
                md:h-full md:w-[420px]
                md:rounded-none
                md:animate-slide-in-right
              `
                        : ''
                    }

          /* Desktop: MODAL */
          ${variant === 'modal'
                        ? `
                md:max-w-lg md:w-full
                md:rounded-xl
                md:animate-fade-in
              `
                        : ''
                    }

          will-change-transform transform-gpu
          transition-transform duration-200 ease-out
        `}
            >
                {/* Mobile handle */}
                <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="flex justify-center py-3 md:hidden"
                >
                    <div className="h-1.5 w-12 bg-t-3/30 rounded-full" />
                </div>

                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-center justify-between p-4 border-b">
                        {title && <h2 className="text-lg font-medium">{title}</h2>}
                        {showClose && (
                            <button
                                type='button'
                                onClick={onClose}
                                aria-label='Close modal'
                                className='inline-flex h-11 w-11 items-center justify-center rounded-full'
                            >
                                <X size={9} aria-hidden='true' />
                            </button>
                        )}
                    </div>
                )}

                <div className="p-4">{children}</div>
            </div>
        </div>
    )
}