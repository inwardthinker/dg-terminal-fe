type CategoryPillProps = {
  label: string;
  colorClass: string;
};

function getPillTone(colorClass: string) {
  const toneByColor: Record<
    string,
    { borderClass: string; textClass: string; backgroundClass: string }
  > = {
    "bg-blue": {
      borderClass: "border-blue/55",
      textClass: "text-blue",
      backgroundClass: "bg-blue/14",
    },
    "bg-pos": {
      borderClass: "border-pos/55",
      textClass: "text-pos",
      backgroundClass: "bg-pos/14",
    },
    "bg-neg": {
      borderClass: "border-neg/55",
      textClass: "text-neg",
      backgroundClass: "bg-neg/14",
    },
    "bg-warn": {
      borderClass: "border-warn/55",
      textClass: "text-warn",
      backgroundClass: "bg-warn/14",
    },
    "bg-pur": {
      borderClass: "border-pur/55",
      textClass: "text-pur",
      backgroundClass: "bg-pur/14",
    },
    "bg-cyan": {
      borderClass: "border-cyan/55",
      textClass: "text-cyan",
      backgroundClass: "bg-cyan/14",
    },
    "bg-orange": {
      borderClass: "border-orange/55",
      textClass: "text-orange",
      backgroundClass: "bg-orange/14",
    },
    "bg-t-3": {
      borderClass: "border-t-3/60",
      textClass: "text-t-3",
      backgroundClass: "bg-t-3/14",
    },
  };

  return (
    toneByColor[colorClass] ?? {
      borderClass: "border-t-3/60",
      textClass: "text-t-3",
      backgroundClass: "bg-t-3/14",
    }
  );
}

export function CategoryPill({ label, colorClass }: CategoryPillProps) {
  const tone = getPillTone(colorClass);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.02em] ${tone.borderClass} ${tone.textClass} ${tone.backgroundClass}`}
    >
      {label}
    </span>
  );
}
