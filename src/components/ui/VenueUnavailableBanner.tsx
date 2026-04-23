import { RotateCw, TriangleAlert } from 'lucide-react'

type VenueUnavailableBannerProps = {
  message?: string
  onRetry?: () => void
}

export function VenueUnavailableBanner({
  message = 'Live pricing is temporarily unavailable. Last-known values are shown where possible.',
  onRetry,
}: VenueUnavailableBannerProps) {
  return (
    <div className="rounded-r6 border border-neg/60 bg-[rgba(224,92,92,0.14)] px-4 py-3 text-t-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-neg" />
          <p className="text-xs leading-5 text-support text-neg!">
            <span className="sm:hidden">Venue API unavailable. Prices stale.</span>
            <span className="hidden sm:inline">{message}</span>
          </p>
        </div>
        <button
          type="button"
          className="px-3 py-1 text-xs text-neg transition-colors hover:bg-[rgba(224,92,92,0.16)] flex items-center gap-2 underline-offset-2 underline"
          onClick={onRetry ?? (() => window.location.reload())}
        >
          Retry <RotateCw className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
