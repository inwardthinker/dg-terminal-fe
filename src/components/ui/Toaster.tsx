"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toast } from "@/components/ui/Toast";
import { useToastStore } from "@/store/useToastStore";

export function Toaster() {
  const [mounted, setMounted] = useState(false);
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <section
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-3 top-3 z-120 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-[380px]"
    >
      <div className="pointer-events-auto flex w-full flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </section>,
    document.body,
  );
}
