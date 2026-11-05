import { Activity, AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";

export interface AnalysisResult {
  disaster_type: string;
  impact_ratio: number;
  damage_percentage: number;
  severity: "critical" | "high" | "moderate" | "low";
  engine_status: string;
  timestamp: string;
}

interface AssessmentReportCardProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const DISASTER_META: Record<string, { label: string; icon: string; color: string }> = {
  flood: { label: "Flood assessment", icon: "🌊", color: "text-blue-300" },
  wildfire: { label: "Wildfire assessment", icon: "🔥", color: "text-orange-300" },
  earthquake: { label: "Earthquake assessment", icon: "🏚️", color: "text-amber-300" },
};

const SEVERITY_META: Record<AnalysisResult["severity"], { label: string; style: string }> = {
  critical: { label: "Critical", style: "text-red-300 bg-red-500/10 border-red-500/30" },
  high: { label: "High", style: "text-orange-300 bg-orange-500/10 border-orange-500/30" },
  moderate: { label: "Moderate", style: "text-amber-300 bg-amber-500/10 border-amber-500/30" },
  low: { label: "Low", style: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" },
};

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card p-4 space-y-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-blue-200">{value.toFixed(2)}</span>
        <span className="text-sm text-slate-500">%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

export default function AssessmentReportCard({ result, isLoading }: AssessmentReportCardProps) {
  if (isLoading) {
    return (
      <div aria-live="polite" className="glass-card p-6 min-h-[180px] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-blue-500/40 border-t-blue-300 rounded-full animate-spin" />
        <p className="text-sm text-blue-200">Sending imagery to the assessment API…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card p-6 min-h-[180px] flex flex-col items-center justify-center gap-3 text-center">
        <Activity className="w-8 h-8 text-slate-600" />
        <p className="text-sm font-semibold text-slate-300">Assessment report</p>
        <p className="text-xs text-slate-500 max-w-xs">Upload satellite imagery and run an assessment to see the model response here.</p>
        <div className="flex items-center gap-1.5 text-xs text-slate-600"><Info className="w-3 h-3" />Waiting for imagery</div>
      </div>
    );
  }

  const meta = DISASTER_META[result.disaster_type.toLowerCase()] ?? DISASTER_META.flood;
  const severity = SEVERITY_META[result.severity] ?? SEVERITY_META.low;
  const SeverityIcon = result.severity === "critical" ? ShieldAlert : result.severity === "low" ? CheckCircle2 : AlertTriangle;

  return (
    <section aria-label="Assessment results" className="space-y-3 animate-fade-in-up">
      <div className="glass-card p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{meta.icon}</span>
          <div>
            <p className={`font-bold text-sm ${meta.color}`}>{meta.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{result.timestamp}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${severity.style}`}>
          <SeverityIcon className="w-3.5 h-3.5" />{severity.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Impact estimate" value={result.impact_ratio} />
        <Metric label="Damage estimate" value={result.damage_percentage} />
      </div>

      <div className="glass-card px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="truncate">{result.engine_status}</span>
      </div>
      <p className="px-1 text-[11px] leading-relaxed text-slate-600">Percentages are image-based estimates from the model. The API does not currently provide confidence, processing time, or geographic area.</p>
    </section>
  );
}
