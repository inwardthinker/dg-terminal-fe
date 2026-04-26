'use client'

import { ArrowRight, Check, Lock, Terminal, X } from 'lucide-react'
import { useState } from 'react'

import { BaseModal } from '@/components/modals/BaseModal'
import { useModal } from '@/lib/modals/hooks/useModal'
import { TAXONOMY } from '@/lib/constants/taxonomy'
import { LoaderHeader } from '../../../ui/loaders/TerminalLoader/components/header/LoaderHeader'
import Steps from '../components/Steps'
import { Button } from '@/components/ui/Button'
import { SPORTS_ICON_MAP } from '@/lib/constants/iconMap'

const BG_COLOR = 'bg-bg-3/25'
const SPORT_CATEGORIES = TAXONOMY.categories

export function Calibrate() {
  const { closeModal } = useModal()
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null)
  const [selectedMarketsBySport, setSelectedMarketsBySport] = useState<Record<string, string[]>>({})
  const selectedMarkets = selectedSportId ? (selectedMarketsBySport[selectedSportId] ?? []) : []
  const selectedCategory = SPORT_CATEGORIES.find((category) => category.id === selectedSportId)
  const SelectedSportIcon = selectedSportId
    ? SPORTS_ICON_MAP[selectedSportId as keyof typeof SPORTS_ICON_MAP]
    : null
  const availableMarkets =
    selectedCategory?.subcategories.map((subcategory) => subcategory.name) ?? []
  const allSelectedMarkets = Object.entries(selectedMarketsBySport).flatMap(([sport, markets]) =>
    markets.map((market) => ({ sport, market })),
  )
  const totalSelectedCount = allSelectedMarkets.length

  const toggleMarketSelection = (market: string) => {
    if (!selectedSportId) return

    setSelectedMarketsBySport((prevBySport) => {
      const currentSelections = prevBySport[selectedSportId] ?? []
      const totalSelections = Object.values(prevBySport).reduce(
        (acc, markets) => acc + markets.length,
        0,
      )
      if (currentSelections.includes(market)) {
        return {
          ...prevBySport,
          [selectedSportId]: currentSelections.filter((item) => item !== market),
        }
      }
      if (totalSelections >= 5) {
        return prevBySport
      }
      return {
        ...prevBySport,
        [selectedSportId]: [...currentSelections, market],
      }
    })
  }

  const removeMarketSelection = (sport: string, market: string) => {
    setSelectedMarketsBySport((prevBySport) => ({
      ...prevBySport,
      [sport]: (prevBySport[sport] ?? []).filter((item) => item !== market),
    }))
  }

  return (
    <BaseModal
      onClose={closeModal}
      variant="modal"
      showClose={false}
      className="w-full sm:max-w-[718px]! rounded-none!"
    >
      <div className="-m-4 overflow-hidden border border-line-c bg-bg-3/5">
        <div className="pointer-events-none h-[0.5px] w-full bg-linear-to-r from-transparent via-g-3/85 to-transparent" />

        {/* Header bar */}
        <LoaderHeader title="Dgpredict" subtitle="auth" rightSubtitle="v5" />

        {/* Body */}
        <div className="px-6 pb-6 pt-4 bg-bg-3/10">
          <Steps step={3} />

          <div className="mb-3 space-y-2">
            <div className="grid grid-cols-3 items-start justify-between gap-2">
              <div className="flex flex-col gap-1 col-span-2">
                <h2 className="text-[19px] font-extrabold text-t-1 uppercase tracking-tighter font-ibm-plex">
                  Calibrate Signal Engine
                </h2>
                <p className="text-[12px] tracking-tight text-t-3 font-jetbrains">
                  Select up to 5 markets. Your feed and edge scanner will be tuned accordingly.
                </p>
              </div>

              <input
                placeholder="search markets"
                className="col-span-1h-10 w-full border border-line-c bg-bg-3/20 px-4 py-1 text-[13px] text-t-2 outline-none placeholder:text-t-3/70 focus:border-g-3/60 font-jetbrains"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-7">
              {allSelectedMarkets.map(({ sport, market }) => (
                <button
                  key={`${sport}-${market}`}
                  type="button"
                  onClick={() => removeMarketSelection(sport, market)}
                  className="border border-g-3/50 bg-g-3/5 px-2.5 py-1 text-[11px] font-jetbrains tracking-tightest text-g-3 rounded flex items-center gap-1 hover:bg-g-3/20 tracking-wide"
                >
                  {market} <X size={8} className="text-g-3/70" />
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[175px_1fr] items-start justify-between gap-2 h-[300px] border border-line-c divide-x divide-line-c">
            <div className="h-full overflow-y-auto">
              {SPORT_CATEGORIES.map((sport) => {
                const isActive = selectedSportId === sport.id
                const SportIcon = SPORTS_ICON_MAP[sport.id as keyof typeof SPORTS_ICON_MAP]
                return (
                  <button
                    key={sport.id}
                    type="button"
                    onClick={() => setSelectedSportId(sport.id)}
                    className={`w-full text-left font-jetbrains p-3 flex gap-3 items-center cursor-pointer border-l transition-colors text-xs uppercase tracking-wide ${
                      isActive
                        ? 'border-l-g-3 bg-bg-3/20 text-t-1'
                        : 'border-l-transparent text-t-3 hover:bg-bg-3/20'
                    }`}
                  >
                    {SportIcon ? (
                      <SportIcon className={`w-4 h-4 ${isActive ? 'text-g-3!' : 'text-t-3/70!'}`} />
                    ) : null}
                    <span className={`${isActive ? 'text-g-3!' : 'text-t-3/70!'}`}>
                      {sport.name}
                    </span>

                    {(selectedMarketsBySport[sport.id]?.length ?? 0) > 0 ? (
                      <span className="ml-auto text-g-3">
                        {selectedMarketsBySport[sport.id]?.length}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
            <div className="h-full p-3 space-y-2">
              {selectedSportId ? (
                <>
                  <div className="flex items-center gap-2 font-ibm-plex text-t-1 text-[15px] font-bold tracking-tight">
                    {SelectedSportIcon && <SelectedSportIcon className={`w-4 h-4`} />}
                    {selectedCategory?.name ?? selectedSportId}
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-jetbrains text-xs">
                    {availableMarkets.map((market) => {
                      const isActive = selectedMarkets.includes(market)
                      const isSelectionLimitReached = totalSelectedCount >= 5
                      const isMuted = isSelectionLimitReached && !isActive
                      return (
                        <button
                          key={market}
                          type="button"
                          disabled={isMuted}
                          onClick={() => toggleMarketSelection(market)}
                          className={`relative p-2 h-12 flex items-center justify-center border transition-colors text-xs ${
                            isActive
                              ? 'border-g-3/80 bg-g-3 text-black font-bold'
                              : isMuted
                                ? 'border-line-c/40 bg-bg-3/10 text-t-3/35 cursor-not-allowed'
                                : 'border-line-c bg-bg-3/20 text-t-2 hover:bg-bg-3/30'
                          }`}
                        >
                          {market}
                          {isActive && (
                            <Check
                              size={12}
                              className="absolute right-1 top-1 bg-black/30 rounded-full p-0.5"
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <Terminal size={24} className="text-t-3/70" />
                    <p className="text-t-2/50 text-center font-jetbrains uppercase text-xs tracking-wide">
                      Select a stream
                    </p>
                    <p className="text-t-3/50 text-center font-jetbrains text-xs tracking-wide">
                      markets appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={`px-5 py-3 ${BG_COLOR} flex flex-col gap-2`}>
            <div className="flex items-center justify-between">
              {totalSelectedCount === 0 ? (
                <p className="text-[12px] tracking-tight text-t-3 font-jetbrains uppercase">
                  Select At least 1 market to continue
                </p>
              ) : totalSelectedCount === 5 ? (
                <p className="text-[12px] tracking-tight text-pos font-jetbrains uppercase flex items-center gap-1">
                  CAP REACHED — DESELECT TO SWAP <Check size={12} />
                </p>
              ) : (
                <p className="text-[12px] tracking-tight text-pos font-jetbrains flex items-center gap-1 uppercase">
                  Ready <Check size={12} />
                </p>
              )}
              <p
                className={`text-[12px] font-bold tracking-widest text-g-3 font-jetbrains ${totalSelectedCount === 5 ? 'text-pos' : 'text-g-3'}`}
              >
                {totalSelectedCount}/5
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              disabled={totalSelectedCount === 0}
              className="w-full font-jetbrains uppercase"
            >
              Lock in Calibration <ArrowRight size={12} />
            </Button>
          </div>
        </div>

        {/* Footer bar */}
        <div
          className={`flex items-center justify-between border-t border-line-c/70 px-3.5 py-1.5 text-[10px] tracking-[0.16em] text-t-3/80 font-jetbrains ${BG_COLOR}`}
        >
          <span>TERMS & PRIVACY</span>
          <span className="flex items-center gap-1">
            <Lock size={10} className="text-t-3/70" />
            PRIVY
          </span>
        </div>
      </div>
    </BaseModal>
  )
}
