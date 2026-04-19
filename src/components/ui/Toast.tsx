"use client";

import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import type { Toast as ToastTypeFromStore, ToastType } from "@/store/useToastStore";

type ToastProps = {
  toast: ToastTypeFromStore;
  onRemove: (id: string) => void;
};

const EXIT_MS = 220;

const toastToneStyles: Record<ToastType, string> = {
  success: "border-emerald-500/35 bg-emerald-500/10 text-emerald-50",
  error: "border-red-500/35 bg-red-500/10 text-red-50",
  warning: "border-amber-400/45 bg-amber-400/10 text-amber-50",
  info: "border-sky-500/35 bg-sky-500/10 text-sky-50",
};

const progressToneStyles: Record<ToastType, string> = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  warning: "bg-amber-300",
  info: "bg-sky-400",
};

const iconByType: Record<ToastType, ReactElement> = {
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.53-9.97a.75.75 0 10-1.06-1.06L9 10.44 7.53 8.97a.75.75 0 10-1.06 1.06l2 2a.75.75 0 001.06 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M18 10A8 8 0 112 10a8 8 0 0116 0zM8.22 7.16a.75.75 0 10-1.06 1.06L8.94 10l-1.78 1.78a.75.75 0 101.06 1.06L10 11.06l1.78 1.78a.75.75 0 101.06-1.06L11.06 10l1.78-1.78a.75.75 0 10-1.06-1.06L10 8.94 8.22 7.16z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l5.58 9.92c.75 1.334-.213 2.981-1.742 2.981H4.42c-1.53 0-2.492-1.647-1.742-2.98l5.58-9.921zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-7a.75.75 0 00-.75.75v4a.75.75 0 001.5 0v-4A.75.75 0 0010 6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M18 10A8 8 0 112 10a8 8 0 0116 0zM9.25 8a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0V8zM10 6a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export function Toast({ toast, onRemove }: ToastProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [remainingMs, setRemainingMs] = useState(toast.duration);

  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (isExiting || isPaused) {
      return;
    }

    const tick = window.setInterval(() => {
      const now = Date.now();
      const previousTick = lastTickRef.current ?? now;
      const delta = now - previousTick;
      lastTickRef.current = now;

      setRemainingMs((prev) => Math.max(0, prev - delta));
    }, 50);

    return () => {
      window.clearInterval(tick);
      lastTickRef.current = null;
    };
  }, [isExiting, isPaused]);

  useEffect(() => {
    if (remainingMs > 0 || isExiting) {
      return;
    }

    setIsExiting(true);
    const timeout = window.setTimeout(() => {
      onRemove(toast.id);
    }, EXIT_MS);

    return () => window.clearTimeout(timeout);
  }, [isExiting, onRemove, remainingMs, toast.id]);

  const progressPercent = useMemo(
    () => Math.max(0, Math.min(100, (remainingMs / toast.duration) * 100)),
    [remainingMs, toast.duration],
  );

  const announceRole = toast.type === "error" ? "alert" : "status";

  return (
    <article
      role={announceRole}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={[
        "group relative w-full overflow-hidden rounded-r8 border shadow-lg backdrop-blur-sm",
        "transition-all duration-200 ease-out",
        toastToneStyles[toast.type],
        isExiting ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100",
      ].join(" ")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-start gap-3 p-4 pr-3">
        <span className="mt-0.5 shrink-0 opacity-95">{iconByType[toast.type]}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-sm/5 text-t-2">{toast.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-t-2 transition hover:border-white/25 hover:bg-white/10 hover:text-t-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="Dismiss notification"
          onClick={() => {
            if (isExiting) return;
            setIsExiting(true);
            window.setTimeout(() => onRemove(toast.id), EXIT_MS);
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 11-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="h-1 w-full bg-white/10">
        <div
          className={["h-full transition-[width] duration-75 ease-linear", progressToneStyles[toast.type]].join(
            " ",
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </article>
  );
}
