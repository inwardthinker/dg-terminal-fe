import { DotSeparator } from '@/components/ui/DotSeparator'

type LoaderHeaderProps = {
  title: string
  subtitle: string
  rightSubtitle: string
}

export function LoaderHeader({ title, subtitle, rightSubtitle }: LoaderHeaderProps) {
  return (
    <>
      <div className="pointer-events-none h-[0.5px] w-full bg-linear-to-r from-transparent via-g-3/85 to-transparent" />
      <div className="flex items-center justify-between border-b border-[#2a2a22] bg-[#161610] px-[14px] py-[10px]">
        <div className="flex items-center gap-[10px]">
          <div className="flex gap-[6px]">
            <span className="h-3 w-3 rounded-full bg-[#c0392b]" />
            <span className="h-3 w-3 rounded-full bg-[#7a7a60]" />
            <span className="h-3 w-3 rounded-full bg-[#3a3a2a]" />
          </div>
          <div className="flex items-center uppercase">
            <span className="font-jetbrains ml-2 flex items-center gap-0.5 uppercase text-[10px] tracking-[0.16em] text-t-3/80">
              {title}
            </span>
            <DotSeparator size={1} className="bg-t-3/50" />
            <span className="font-jetbrains ml-2 flex items-center gap-0.5 uppercase text-[10px] tracking-[0.16em] text-t-3/80">
              {subtitle}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-[6px] inline-block h-2 w-2 animate-pulse rounded-full bg-pos" />
          <span className="text-[10px] tracking-widest text-t-2">{rightSubtitle}</span>
        </div>
      </div>
    </>
  )
}
