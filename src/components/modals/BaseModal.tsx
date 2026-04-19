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

    const startY = useRef(0)
    const currentY = useRef(0)
    const startTime = useRef(0)

    // 🔒 Scroll lock (iOS safe)
    useEffect(() => {
        const scrollY = window.scrollY

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
        }
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
                            <button onClick={onClose}>
                                <X size={18} />
                            </button>
                        )}
                    </div>
                )}

                <div className="p-4">{children}</div>
            </div>
        </div>
    )
}