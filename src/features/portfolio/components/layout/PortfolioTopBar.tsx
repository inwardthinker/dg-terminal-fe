import type { PortfolioKpis } from "../../types";

type PortfolioTopBarProps = {
  kpis?: PortfolioKpis;
  loading?: boolean;
  userInitials?: string;
};

const fmtCurrency = (n: number) =>
  `$${n.toLocaleString("en-US")}`;

const fmtSigned = (n: number) =>
  `${n >= 0 ? "+" : ""}$${Math.abs(n).toLocaleString("en-US")}`;

const fmtPct = (n: number) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export function PortfolioTopBar({
  kpis,
  loading,
  userInitials = "DC",
}: PortfolioTopBarProps) {
  const balance = !loading ? kpis?.balance : undefined;
  const todayPnl = !loading ? kpis?.todayPnl : undefined;
  const openCount = !loading ? kpis?.openCount : undefined;
  const portfolioPct = !loading ? kpis?.portfolioPct : undefined;

  return (
    <header className="bg-bg-1 border-b border-line-c h-12 flex items-center px-sp7 flex-shrink-0">
      {/* ── Left: brand + quick stats ── */}
      <div className="flex items-center gap-sp7 flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center leading-none" role="img" aria-label="DG Predict logo">
          <span className="text-[15px] font-[800] text-t-1 tracking-[0.04em]">DG</span>
          <span className="text-[15px] font-[800] text-g-3 tracking-[0.04em]">PREDICT</span>
        </div>

        {/* Quick stats */}
        <div className="flex gap-[18px]">
          <div className="flex flex-col">
            <span className="text-[8px] text-t-3 tracking-[0.08em] uppercase">Balance</span>
            <span className="text-[11.5px] font-[600] text-t-1 leading-[1.2]">
              {balance !== undefined ? fmtCurrency(balance) : "--"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] text-t-3 tracking-[0.08em] uppercase">Today P&amp;L</span>
            <span
              className={`text-[11.5px] font-[600] leading-[1.2] ${todayPnl !== undefined && todayPnl < 0 ? "text-neg" : "text-pos"
                }`}
            >
              {todayPnl !== undefined ? fmtSigned(todayPnl) : "--"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] text-t-3 tracking-[0.08em] uppercase">Open</span>
            <span className="text-[11.5px] font-[600] text-t-1 leading-[1.2]">
              {openCount !== undefined ? openCount : "--"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Centre: search ── */}
      <div className="flex-1 flex justify-center px-[20px]">
        <div className="bg-bg-2 border border-[rgba(255,255,255,0.1)] rounded-r5 py-[5px] px-[10px] flex items-center gap-[7px] w-full max-w-[260px] cursor-text">
          {/* Search icon */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="flex-shrink-0"
            aria-hidden="true"
          >
            <circle cx="4.8" cy="4.8" r="3.3" stroke="#555" strokeWidth="1.4" />
            <line
              x1="7.4" y1="7.4" x2="10.5" y2="10.5"
              stroke="#555" strokeWidth="1.5" strokeLinecap="round"
            />
          </svg>
          <span className="text-[10.5px] text-[#555] flex-1 select-none">
            Search markets, events…
          </span>
          <span className="text-[8px] text-[#555] border border-[rgba(255,255,255,0.1)] rounded-r1 px-[5px] py-[1px] whitespace-nowrap font-mono select-none">
            ⌘K
          </span>
        </div>
      </div>

      {/* ── Right: actions ── */}
      <div className="flex items-center gap-sp4 flex-shrink-0">
        {/* Deposit */}
        <button className="min-h-8 px-[11px] py-[5px] bg-[rgba(205,189,112,0.15)] border border-line-g rounded-r4 text-[9.5px] font-[700] text-g-3 whitespace-nowrap cursor-pointer hover:bg-[rgba(205,189,112,0.22)] transition-colors">
          + Deposit
        </button>

        {/* Portfolio pill */}
        <div className="px-[11px] py-[4px] border border-line-g rounded-r9 text-[10.5px] flex items-center gap-[6px]">
          <span className="text-[9px] text-t-3">Portfolio</span>
          <span
            className={`font-[700] text-[11px] ${portfolioPct !== undefined && portfolioPct < 0 ? "text-neg" : "text-pos"
              }`}
          >
            {portfolioPct !== undefined ? fmtPct(portfolioPct) : "--"}
          </span>
        </div>

        {/* Avatar */}
        <div className="w-[26px] h-[26px] rounded-full bg-[rgba(205,189,112,0.2)] border border-line-g flex items-center justify-center text-[9px] font-[700] text-g-3 select-none">
          {userInitials}
        </div>
      </div>
    </header>
  );
}
