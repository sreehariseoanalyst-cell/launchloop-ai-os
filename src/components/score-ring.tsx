import { cn } from "@/lib/utils";

export function ScoreRing({
  value,
  label,
  sublabel,
  size = 168,
  className,
}: {
  value: number;
  label: string;
  sublabel?: string;
  size?: number;
  className?: string;
}) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="100%" stopColor="var(--brand-glow)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={10}
          className="stroke-muted"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={10}
          strokeLinecap="round"
          stroke={`url(#ring-${label.replace(/\s/g, "")})`}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl font-semibold tracking-tight">{value}</span>
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {sublabel ? (
          <span className="mt-1 text-[11px] text-muted-foreground">{sublabel}</span>
        ) : null}
      </div>
    </div>
  );
}