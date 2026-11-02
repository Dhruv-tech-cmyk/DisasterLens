"use client";

import { useEffect, useState } from "react";

interface MetricProgressBarProps {
  value: number;
  maxValue?: number;
  color?: "blue" | "amber" | "red" | "cyan" | "green";
  animated?: boolean;
  height?: "sm" | "md" | "lg";
}

const colorMap = {
  blue: {
    fill: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
    tip: "#3b82f6",
    shadow: "rgba(59,130,246,0.7)",
    glow: "rgba(59,130,246,0.3)",
  },
  amber: {
    fill: "linear-gradient(90deg, #b45309, #f59e0b)",
    tip: "#f59e0b",
    shadow: "rgba(245,158,11,0.7)",
    glow: "rgba(245,158,11,0.3)",
  },
  red: {
    fill: "linear-gradient(90deg, #991b1b, #ef4444)",
    tip: "#ef4444",
    shadow: "rgba(239,68,68,0.7)",
    glow: "rgba(239,68,68,0.3)",
  },
  cyan: {
    fill: "linear-gradient(90deg, #0e7490, #06b6d4)",
    tip: "#06b6d4",
    shadow: "rgba(6,182,212,0.7)",
    glow: "rgba(6,182,212,0.3)",
  },
  green: {
    fill: "linear-gradient(90deg, #166534, #22c55e)",
    tip: "#22c55e",
    shadow: "rgba(34,197,94,0.7)",
    glow: "rgba(34,197,94,0.3)",
  },
};

const heightMap = {
  sm: "4px",
  md: "6px",
  lg: "8px",
};

export default function MetricProgressBar({
  value,
  maxValue = 100,
  color = "blue",
  animated = true,
  height = "md",
}: MetricProgressBarProps) {
  const [displayWidth, setDisplayWidth] = useState(0);
  const pct = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const c = colorMap[color];
  const h = heightMap[height];

  useEffect(() => {
    // Animate in after mount
    const timer = setTimeout(() => setDisplayWidth(pct), 80);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div
      className="w-full rounded-full overflow-hidden relative"
      style={{
        height: h,
        background: "rgba(15,30,60,0.9)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
      }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
    >
      {/* Track segments */}
      {[25, 50, 75].map((seg) => (
        <div
          key={seg}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${seg}%`,
            background: "rgba(255,255,255,0.06)",
          }}
        />
      ))}

      {/* Fill */}
      <div
        className="h-full rounded-full relative"
        style={{
          width: animated ? `${displayWidth}%` : `${pct}%`,
          background: c.fill,
          transition: animated ? "width 1.4s cubic-bezier(0.22,1,0.36,1)" : "none",
          boxShadow: `0 0 6px ${c.glow}, 0 0 12px ${c.glow}`,
        }}
      >
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.5s linear infinite",
          }}
        />

        {/* Tip glow */}
        {displayWidth > 3 && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: parseInt(h) + 6 + "px",
              height: parseInt(h) + 6 + "px",
              background: c.tip,
              boxShadow: `0 0 8px ${c.shadow}, 0 0 16px ${c.glow}`,
              transform: "translateY(-50%) translateX(50%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
