"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Activity,
  Cpu,
  Clock,
  BarChart3,
} from "lucide-react";
import MetricProgressBar from "./MetricProgressBar";

export interface AnalysisResult {
  disaster_type: string;
  impact_ratio: number;
  damage_percentage: number;
  severity: "critical" | "high" | "moderate" | "low";
  engine_status: string;
  pipeline_type: string;
  confidence: number;
  processing_time_ms: number;
  affected_area_km2?: number;
  timestamp: string;
}

interface AssessmentReportCardProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const DISASTER_META: Record<
  string,
  { label: string; icon: string; color: string; borderColor: string }
> = {
  flood: {
    label: "Flood Assessment",
    icon: "🌊",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
  },
  wildfire: {
    label: "Wildfire / Burn Scar",
    icon: "🔥",
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
  },
  earthquake: {
    label: "Earthquake / Structural Collapse",
    icon: "🏚️",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
  },
};

const SEVERITY_CONFIG = {
  critical: {
    label: "CRITICAL",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/40",
    icon: ShieldAlert,
    glow: "0 0 16px rgba(239,68,68,0.5), 0 0 32px rgba(239,68,68,0.2)",
    progressColor: "red" as const,
  },
  high: {
    label: "HIGH",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    icon: AlertTriangle,
    glow: "0 0 12px rgba(249,115,22,0.4)",
    progressColor: "amber" as const,
  },
  moderate: {
    label: "MODERATE",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/40",
    icon: AlertTriangle,
    glow: "0 0 12px rgba(245,158,11,0.4)",
    progressColor: "amber" as const,
  },
  low: {
    label: "LOW",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/40",
    icon: CheckCircle2,
    glow: "0 0 12px rgba(34,197,94,0.4)",
    progressColor: "green" as const,
  },
};

function SkeletonBlock({ w = "w-full", h = "h-4" }: { w?: string; h?: string }) {
  return (
    <div
      className={`${w} ${h} rounded bg-slate-800/80`}
      style={{
        background:
          "linear-gradient(90deg, rgba(30,41,59,0.8) 25%, rgba(51,65,85,0.5) 50%, rgba(30,41,59,0.8) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s linear infinite",
      }}
    />
  );
}

function MetricCard({
  title,
  children,
  icon: Icon,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={`glass-card p-4 space-y-3 border-glow-hover animate-fade-in-up ${className}`}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function AssessmentReportCard({
  result,
  isLoading,
}: AssessmentReportCardProps) {
  const [tick, setTick] = useState(0);

  // Flicker counter for "live" effect
  useEffect(() => {
    if (!result) return;
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, [result]);

  if (!result && !isLoading) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center gap-4 min-h-[220px]">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center"
            style={{ boxShadow: "0 0 20px rgba(59,130,246,0.1)" }}
          >
            <BarChart3 className="w-7 h-7 text-slate-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center bg-[#030712]">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          </div>
        </div>
        <div className="text-center space-y-1.5">
          <p className="text-slate-400 font-semibold text-sm">
            Assessment Report
          </p>
          <p className="text-slate-600 text-xs leading-relaxed max-w-[220px]">
            Upload satellite imagery and trigger analysis to view real-time
            disaster metrics.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono">
          <Info className="w-3 h-3" />
          <span>Awaiting input telemetry</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-card p-5 space-y-4 min-h-[220px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-blue-500/30 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500/50 border-t-blue-400 rounded-full animate-spin" />
          </div>
          <div className="space-y-1.5 flex-1">
            <SkeletonBlock w="w-3/4" h="h-4" />
            <SkeletonBlock w="w-1/2" h="h-3" />
          </div>
        </div>
        <div className="space-y-3">
          <SkeletonBlock h="h-8" />
          <SkeletonBlock h="h-6" w="w-4/5" />
          <SkeletonBlock h="h-4" w="w-3/5" />
        </div>
        <div className="flex gap-3">
          <SkeletonBlock h="h-16" />
          <SkeletonBlock h="h-16" />
        </div>
        <p className="text-xs text-blue-400/60 font-mono text-center animate-pulse">
          Running AI Inference...
        </p>
      </div>
    );
  }

  const meta = DISASTER_META[result!.disaster_type] || DISASTER_META.flood;
  const severity = SEVERITY_CONFIG[result!.severity];
  const SeverityIcon = severity.icon;
  void tick; // suppress unused warning

  return (
    <div className="space-y-3 animate-fade-in-up">
      {/* ── Header: Disaster Type Badge ── */}
      <div
        className={`glass-card p-4 border ${meta.borderColor} flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <p className={`font-bold text-sm ${meta.color} tracking-wide`}
              style={{ fontFamily: "var(--font-display)" }}>
              {meta.label}
            </p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {result!.timestamp}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${severity.color} ${severity.bg} ${severity.border}`}
          style={{ boxShadow: severity.glow }}
        >
          <SeverityIcon className="w-3.5 h-3.5" />
          {severity.label}
        </div>
      </div>

      {/* ── Primary Metrics ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Impact Ratio */}
        <MetricCard title="Impact Ratio" icon={Activity} className="">
          <div>
            <div className="flex items-end gap-1.5 mb-2">
              <span
                className="text-3xl font-bold text-blue-300 metric-num text-glow-blue leading-none"
              >
                {result!.impact_ratio.toFixed(1)}
              </span>
              <span className="text-blue-400/70 text-base font-mono mb-0.5">%</span>
            </div>
            <MetricProgressBar
              value={result!.impact_ratio}
              color="blue"
              height="md"
            />
          </div>
        </MetricCard>

        {/* Damage Assessment */}
        <MetricCard title="Damage Assessment" icon={Zap} className="">
          <div>
            <div className="flex items-end gap-1.5 mb-2">
              <span
                className={`text-3xl font-bold metric-num leading-none ${severity.color}`}
                style={{ textShadow: severity.glow }}
              >
                {result!.damage_percentage.toFixed(1)}
              </span>
              <span
                className={`text-base font-mono mb-0.5 ${severity.color} opacity-70`}
              >
                %
              </span>
            </div>
            <MetricProgressBar
              value={result!.damage_percentage}
              color={severity.progressColor}
              height="md"
            />
          </div>
        </MetricCard>
      </div>

      {/* ── Secondary Metrics ── */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard title="Confidence" icon={Cpu} className="">
          <div className="text-center">
            <div
              className="text-xl font-bold text-cyan-300 metric-num text-glow-cyan"
            >
              {result!.confidence.toFixed(0)}%
            </div>
            <MetricProgressBar
              value={result!.confidence}
              color="cyan"
              height="sm"
            />
          </div>
        </MetricCard>

        <MetricCard title="Area (km²)" icon={BarChart3} className="">
          <div className="text-center">
            <div className="text-xl font-bold text-amber-300 metric-num text-glow-amber">
              {result!.affected_area_km2?.toFixed(0) ?? "—"}
            </div>
            <div className="text-xs text-slate-600 mt-1">est. affected</div>
          </div>
        </MetricCard>

        <MetricCard title="Latency" icon={Clock} className="">
          <div className="text-center">
            <div className="text-xl font-bold text-green-300 metric-num">
              {result!.processing_time_ms}
            </div>
            <div className="text-xs text-slate-600 mt-1">ms</div>
          </div>
        </MetricCard>
      </div>

      {/* ── Engine Status Footer ── */}
      <div className="glass-card px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"
            style={{ boxShadow: "0 0 8px rgba(34,197,94,0.9)" }}
          />
          <span className="text-xs text-slate-400 font-mono truncate">
            Engine:{" "}
            <span className="text-green-400">
              {result!.engine_status}
            </span>{" "}
            ({result!.pipeline_type})
          </span>
        </div>
        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
      </div>
    </div>
  );
}
