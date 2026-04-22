"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { BaseModal } from "@/components/modals/BaseModal";
import { cn } from "@/lib/utils/cn";

export function MobileSearchFab() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/login")) {
    return null;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = String(fd.get("q") ?? "").trim();
    setOpen(false);
    if (q) {
      router.push(`/terminal?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        className={cn(
          "fixed z-[45] flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full md:hidden",
          "border border-line-g bg-[rgba(205,189,112,0.18)] text-g-3 shadow-lg",
          "transition-colors hover:bg-[rgba(205,189,112,0.26)] active:bg-[rgba(205,189,112,0.32)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-g-3/60",
        )}
        style={{
          bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
          right: "calc(16px + env(safe-area-inset-right, 0px))",
        }}
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
      </button>

      {open && (
        <BaseModal
          onClose={() => setOpen(false)}
          variant="modal"
          title="Search"
          showClose
        >
          <form onSubmit={onSubmit} className="flex flex-col gap-sp4">
            <label className="text-label text-t-3" htmlFor="mobile-search-q">
              Markets &amp; events
            </label>
            <input
              id="mobile-search-q"
              name="q"
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Search…"
              autoFocus
              className={cn(
                "w-full rounded-r5 border border-line-c bg-bg-2 px-sp4 py-sp3 text-secondary text-t-1",
                "placeholder:text-t3 focus:border-line-g focus:outline-none focus:ring-1 focus:ring-line-g",
              )}
            />
            <button
              type="submit"
              className="rounded-r5 bg-[rgba(205,189,112,0.15)] border border-line-g py-sp3 text-button text-g-3 hover:bg-[rgba(205,189,112,0.22)]"
            >
              Search
            </button>
          </form>
        </BaseModal>
      )}
    </>
  );
}
