'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { LoaderHeader } from './components/header/LoaderHeader'

interface Step {
  text: string
  duration: number
}

const DEFAULT_STEPS: Step[] = [
  { text: 'Initializing secure gateway...', duration: 500 },
  { text: 'Loading auth providers...', duration: 600 },
  { text: 'Ready.', duration: 300 },
]

const SEGMENTS = 28

const INITIAL_STREAM = [
  '2D7C 4FF6',
  '84CD 5945',
  'A59C 160D',
  'CCA7 1697',
  'A7C8 C9E5',
  '56D5 33FA',
  '88E2 50C4',
  '88EF E1CD',
]

function randomHex(): string {
  const h = () =>
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, '0')
  return `${h()} ${h()}`
}

interface LogEntry {
  id: number
  text: string
  done: boolean
  isLast: boolean
}

interface TerminalLoaderProps {
  onComplete?: () => void
  steps?: Step[]
  title?: string
  subtitle?: string
  rightSubtitle?: string
}

export default function TerminalLoader({
  onComplete,
  steps = DEFAULT_STEPS,
  title = 'DGPREDICT',
  subtitle = 'AUTH GATEWAY',
  rightSubtitle = 'PROCESSING',
}: TerminalLoaderProps) {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [progress, setProgress] = useState(0)
  const [latency, setLatency] = useState('--')
  const [packets, setPackets] = useState(0)
  const [streamLines, setStreamLines] = useState<string[]>(INITIAL_STREAM)

  const progressRef = useRef(0)
  const packetRef = useRef(0)
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const telIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pctIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setProgressSmooth = useCallback((targetPct: number, stepDuration: number) => {
    if (pctIntervalRef.current) clearInterval(pctIntervalRef.current)
    const diff = targetPct - progressRef.current
    if (diff <= 0) return
    const intervalMs = Math.max(20, stepDuration / diff)
    pctIntervalRef.current = setInterval(() => {
      if (progressRef.current < targetPct) {
        progressRef.current += 1
        setProgress(progressRef.current)
      } else if (pctIntervalRef.current) {
        clearInterval(pctIntervalRef.current)
      }
    }, intervalMs)
  }, [])

  const runStep = useCallback(
    (index: number) => {
      if (index >= steps.length) {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
        if (telIntervalRef.current) clearInterval(telIntervalRef.current)
        progressRef.current = 100
        setProgress(100)
        if (onComplete) {
          completeTimeoutRef.current = setTimeout(onComplete, 250)
        }
        return
      }

      const step = steps[index]
      const isLast = index === steps.length - 1
      const entryId = index

      setLogEntries((prev) => [...prev, { id: entryId, text: step.text, done: false, isLast }])

      const targetPct = Math.round(((index + 1) / steps.length) * 100)
      setProgressSmooth(targetPct, step.duration)

      setTimeout(() => {
        setLogEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, done: true } : e)))
        runStep(index + 1)
      }, step.duration)
    },
    [onComplete, setProgressSmooth, steps],
  )

  useEffect(() => {
    streamIntervalRef.current = setInterval(() => {
      setStreamLines((prev) => [...prev.slice(1), randomHex()])
    }, 180)

    telIntervalRef.current = setInterval(() => {
      setLatency((Math.random() * 8 + 15).toFixed(1) + 'ms')
      packetRef.current += Math.floor(Math.random() * 80 + 20)
      setPackets(packetRef.current)
    }, 400)

    const startTimer = setTimeout(() => runStep(0), 600)

    return () => {
      clearTimeout(startTimer)
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
      if (telIntervalRef.current) clearInterval(telIntervalRef.current)
      if (pctIntervalRef.current) clearInterval(pctIntervalRef.current)
      if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current)
    }
  }, [runStep])

  const filledSegments = Math.floor((progress / 100) * SEGMENTS)

  return (
    <div className="m-0 w-full overflow-hidden border border-[#2a2a22] bg-[#0d0d0a] font-jetbrains">
      <LoaderHeader title={title} subtitle={subtitle} rightSubtitle={rightSubtitle} />

      <div className="flex h-[280px]">
        <div className="flex-1 overflow-hidden px-4 py-[18px]">
          {logEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-[10px] text-[13px] leading-[1.8] text-t-1"
            >
              <span className="shrink-0 text-[13px] text-pos">&gt;</span>
              <span className={`flex-1 ${entry.isLast ? 'text-pos' : 'text-white'}`}>
                {entry.text}
                {!entry.done && !entry.isLast && (
                  <span className="ml-0.5 inline-block h-[14px] w-[9px] animate-pulse align-middle bg-pos" />
                )}
              </span>
              {!entry.isLast && entry.done && (
                <span className="ml-auto shrink-0 border border-pos px-[7px] py-px text-[10px] tracking-widest text-pos">
                  [OK]
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="w-[180px] shrink-0 border-l border-[#2a2a22] px-[14px] py-[14px] text-[10px] tracking-widest text-[#666655] bg-black divide-y divide-line-c">
          <div className="pb-2">
            <div className="mb-2 text-[10px] tracking-widest text-t-3/75">TELEMETRY</div>
            <div className="mb-1 flex justify-between">
              <span className="text-t-3/75">LATENCY</span>
              <span className="font-bold text-[#c8c07a]">{latency}</span>
            </div>
            <div className="mb-1 flex justify-between">
              <span className="text-t-3/75">PACKETS</span>
              <span className="font-bold text-[#c8c07a]">{packets.toLocaleString()}</span>
            </div>
            <div className="mb-1 flex justify-between">
              <span className="text-t-3/75">NODE</span>
              <span className="font-bold text-[#7aad6e]">ONLINE</span>
            </div>
          </div>

          <div className="pt-2 mb-4">
            <div className="mb-2 text-[9px] tracking-[0.2em] text-t-3/75">STREAM</div>
            {streamLines.map((line, i) => (
              <div
                key={i}
                className={`text-[10px] leading-[1.6] tracking-[0.05em] transition-colors ${
                  i === streamLines.length - 1 ? 'text-t-3' : 'text-t-3/50'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[10px] border-t border-[#2a2a22] px-[14px] py-[10px]">
        <div className="flex h-3 flex-1 gap-[3px] border border-[#2a2a22] bg-[#1a1a14] px-[3px] py-[2px]">
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-colors ${
                i < filledSegments ? 'bg-[#c8c07a]' : 'bg-[#2a2a1a]'
              }`}
            />
          ))}
        </div>
        <div className="min-w-9 text-right text-xs text-[#c8c07a]">{progress}%</div>
      </div>
    </div>
  )
}
