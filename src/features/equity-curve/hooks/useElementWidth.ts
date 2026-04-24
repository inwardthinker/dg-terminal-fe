import { useEffect, useState, RefObject } from 'react'

export function useElementWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width)

      setWidth((prev) => (prev === nextWidth ? prev : nextWidth))
    })

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref])

  return width
}
