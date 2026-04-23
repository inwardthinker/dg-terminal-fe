import clsx from 'clsx'

type DotSeparatorProps = {
  size?: number
  color?: string
  className?: string
}

export function DotSeparator({ size = 4, color = 'bg-white', className }: DotSeparatorProps) {
  return (
    <div
      className={clsx('mx-2 rounded-full', color, className)}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}
