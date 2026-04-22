"use client";

import { usePortfolio } from "@/features/portfolio/components/hooks/usePortfolio";
import { AuthButton } from "@/components/auth/AuthButton";
import Image from "next/image";

const fmtCurrency = (n: number) => `$${n.toLocaleString("en-US")}`;
const fmtSigned = (n: number) =>
  `${n >= 0 ? "+" : ""}$${Math.abs(n).toLocaleString("en-US")}`;
const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

type TopBarProps = {
  userInitials?: string;
};

export function TopBar({ userInitials = "DC" }: TopBarProps) {
  const { portfolio, loading } = usePortfolio();
  const kpis = portfolio?.kpis;
  const balance = !loading ? kpis?.balance : undefined;
  const todayPnl = !loading ? kpis?.todayPnl : undefined;
  const openCount = !loading ? kpis?.openCount : undefined;
  const portfolioPct = !loading ? kpis?.portfolioPct : undefined;

  return (
    <header className="w-full shrink-0 border-b border-line-c bg-bg-0">
      <div className="mx-auto flex h-[52px] w-full max-w-[1400px] items-center gap-sp4 px-sp5 sm:px-sp7 md:h-16">
        {/* ── Left: brand + quick stats ── */}
        <div className="flex items-center gap-sp5 md:gap-sp7 shrink-0">
          {/* Brand */}
          <div className="flex items-center leading-none text-[17px] font-extrabold tracking-[0.04em]" role="img" aria-label="DG Predict logo">
            <Image src="/images/logo.webp" alt="DG Predict logo" width={100} height={100} />
          </div>

          {/* Quick stats */}
          <div className="hidden lg:flex gap-[18px]">
            <div className="flex flex-col">
              <span className="text-label">Balance</span>
              <span className="text-secondary leading-[1.2]">
                {balance !== undefined ? fmtCurrency(balance) : "--"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-label">Today P&amp;L</span>
              <span
                className={`text-secondary leading-[1.2] ${todayPnl !== undefined && todayPnl < 0 ? "text-neg" : "text-pos"
                  }`}
              >
                {todayPnl !== undefined ? fmtSigned(todayPnl) : "--"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-label">Open</span>
              <span className="text-secondary leading-[1.2]">
                {openCount !== undefined ? openCount : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Centre: search (hidden below md — mobile uses FAB + sheet) ── */}
        <div className="hidden flex-1 justify-center px-sp4 md:flex md:px-[20px]">
          <div className="bg-bg-2 border border-[rgba(255,255,255,0.1)] rounded-r5 py-[6px] px-[10px] flex items-center gap-[7px] w-full max-w-[300px] cursor-text">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
            >
              <circle cx="4.8" cy="4.8" r="3.3" stroke="#555" strokeWidth="1.4" />
              <line
                x1="7.4" y1="7.4" x2="10.5" y2="10.5"
                stroke="#555" strokeWidth="1.5" strokeLinecap="round"
              />
            </svg>
            <span className="text-support text-[#555] flex-1 select-none">
              Search markets, events…
            </span>
            <span className="text-[9px] text-[#555] border border-[rgba(255,255,255,0.1)] rounded-r1 px-[5px] py-px whitespace-nowrap font-mono select-none">
              ⌘K
            </span>
          </div>
        </div>

        {/* ── Right: actions ── */}
        <div className="flex items-center gap-sp3 sm:gap-sp4 shrink-0 ml-auto">
          {/* Deposit */}
          <button className="min-h-8 px-[11px] py-[6px] bg-[rgba(205,189,112,0.15)] border border-line-g rounded-r4 text-button text-g-3 whitespace-nowrap cursor-pointer hover:bg-[rgba(205,189,112,0.22)] transition-colors">
            <span className="hidden xs:inline">+ </span>Deposit
          </button>

          {/* Portfolio pill */}
          <div className="hidden sm:flex px-[11px] py-[5px] border border-line-g rounded-r9 text-[10.5px] items-center gap-[6px]">
            <span className="text-label">Portfolio</span>
            <span
              className={`text-secondary ${portfolioPct !== undefined && portfolioPct < 0 ? "text-neg" : "text-pos"
                }`}
            >
              {portfolioPct !== undefined ? fmtPct(portfolioPct) : "--"}
            </span>
          </div>

          {/* Avatar */}
          <div className="w-[30px] h-[30px] rounded-full bg-[rgba(205,189,112,0.2)] border border-line-g flex items-center justify-center text-[11px] font-bold text-g-3 select-none">
            {userInitials}
          </div>
        </div>

        <AuthButton />
      </div>
    </header>
  );
}
