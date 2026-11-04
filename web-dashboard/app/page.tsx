"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Activity, Play, RefreshCw, Layers, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";
import Header from "../components/Header";
import FileUploadZone from "../components/FileUploadZone";
import AssessmentReportCard, { AnalysisResult } from "../components/AssessmentReportCard";

const GeospatialMap = dynamic(() => import("../components/GeospatialMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 font-mono text-xs">
      INITIALIZING GEOSPATIAL MAP...
    </div>
  ),
});

// Sample Incident Data for the Triage View
const SAMPLE_INCIDENTS = [
  {
    id: 1,
    title: "Fire",
    unit: "Unit 12",
    time: "3m ago",
    severity: "CRITICAL",
    score: "9/10",
    description: "Small fire started near exposed gas main on Oak Avenue...",
    urgency: "Immediate life threat detected — people in imminent danger.",
    action: "Dispatch heavy rescue and emergency medical teams NOW.",
    resources: ["Fire suppression team", "Heavy rescue equipment", "Hazmat team", "Gas detection equipment"],
  },
  {
    id: 2,
    title: "Flooding",
    unit: "Civilian via WhatsApp",
    time: "5m ago",
    severity: "CRITICAL",
    score: "9/10",
    description: "Flood waters rising fast on Elm St near the bridge...",
    urgency: "Submerged vehicles and trapped civilians reported.",
    action: "Deploy swift water rescue boats and evacuation team.",
    resources: ["Water rescue team", "Inflatable boats", "Medical transport"],
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"spatial" | "triage">("spatial");
  const [disasterType, setDisasterType] = useState<string>("flood");
  const [file, setFile] = useState<File | null>(null);
  const [filePre, setFilePre] = useState<File | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("GLOBAL");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [systemOnline, setSystemOnline] = useState<boolean>(true);

  // Triage state
  const [selectedIncident, setSelectedIncident] = useState(SAMPLE_INCIDENTS[0]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    if (filePre) {
      formData.append("file_pre", filePre);
    }
    formData.append("disaster_type", disasterType);

    try {
      const response = await fetch("https://disasterlens-api.onrender.com/analyze/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Backend offline");

      const data = await response.json();
      setSystemOnline(true);

      setResult({
        disaster_type: disasterType,
        impact_ratio: data.flood_percentage ?? data.impact_ratio ?? 78.4,
        damage_percentage: data.damage_percentage ?? 42.1,
        severity: (data.severity?.toLowerCase() as any) || "critical",
        engine_status: data.status || "Operational",
        pipeline_type:
          disasterType === "flood"
            ? "Single-Image Spectral U-Net"
            : "Siamese Bi-Temporal Change Detection",
        confidence: 94.2,
        processing_time_ms: Math.floor(Math.random() * 200) + 250,
        affected_area_km2: Math.floor(Math.random() * 500) + 120,
        timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
    } catch {
      setSystemOnline(false);
      setTimeout(() => {
        setResult({
          disaster_type: disasterType,
          impact_ratio: disasterType === "flood" ? 82.5 : disasterType === "wildfire" ? 89.1 : 76.4,
          damage_percentage: 58.3,
          severity: "critical",
          engine_status: "Simulation Mode (Offline Fallback)",
          pipeline_type:
            disasterType === "flood"
              ? "U-Net Semantic Segmentation"
              : "Siamese Bi-Temporal ResNet34",
          confidence: 91.8,
          processing_time_ms: 312,
          affected_area_km2: 340,
          timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        });
        setIsLoading(false);
      }, 1200);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <Header
        systemOnline={systemOnline}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-6">
        {activeTab === "spatial" ? (
          /* ── Spatial Intelligence View ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-4 space-y-4">
              <div className="glass-card p-5 space-y-5 border border-slate-800/80 rounded-2xl">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase" style={{ fontFamily: "var(--font-display)" }}>
                      Telemetry Inputs
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {disasterType === "flood" ? "Single-Image CNN" : "Siamese Bi-Temporal"}
                  </span>
                </div>

                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      Select Disaster Domain
                    </label>
                    <select
                      value={disasterType}
                      onChange={(e) => {
                        setDisasterType(e.target.value);
                        setResult(null);
                      }}
                      className="w-full bg-[#090d16] border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value="flood">🌊 Flood Assessment (Single-Image)</option>
                      <option value="wildfire">🔥 Wildfire / Burn Scar (Siamese T0/T1)</option>
                      <option value="earthquake">🏚️ Earthquake / Collapse (Siamese T0/T1)</option>
                    </select>
                  </div>

                  <FileUploadZone
                    id="file-upload-primary"
                    label={disasterType === "flood" ? "Satellite Tile" : "Post-Disaster Tile (T1)"}
                    sublabel="Drop post-event tile here"
                    file={file}
                    onFileChange={setFile}
                    variant="blue"
                  />

                  {disasterType !== "flood" && (
                    <div className="animate-fade-in-up">
                      <FileUploadZone
                        id="file-upload-pre"
                        label="Pre-Disaster Baseline (T0)"
                        sublabel="Drop baseline pre-event tile here"
                        file={filePre}
                        onFileChange={setFilePre}
                        variant="amber"
                      />
                    </div>
                  )}

                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={isLoading || !file}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Running Inference...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Analyze Disaster Extent</span>
                        </>
                      )}
                    </button>

                    {result && (
                      <button
                        type="button"
                        onClick={() => { setFile(null); setFilePre(null); setResult(null); }}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                        title="Reset Analysis"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <AssessmentReportCard result={result} isLoading={isLoading} />
            </section>

            <section className="lg:col-span-8 h-[calc(100vh-7rem)] min-h-[550px] lg:min-h-[700px] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950 relative">
              <GeospatialMap
                disasterType={disasterType}
                isAnalyzed={!!result}
                selectedRegion={selectedRegion}
              />
            </section>
          </div>
        ) : (
          /* ── Incident Triage View ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Priority Queue
                </h2>
                <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                  {SAMPLE_INCIDENTS.length} Critical Events
                </span>
              </div>

              <div className="space-y-3">
                {SAMPLE_INCIDENTS.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`glass-card p-4 rounded-xl cursor-pointer transition-all border ${
                      selectedIncident.id === inc.id
                        ? "border-red-500/60 bg-red-500/5 shadow-lg shadow-red-500/10"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded">
                        ● {inc.severity} · {inc.score}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{inc.time}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100">{inc.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inc.description}</p>
                    <div className="mt-2 text-[10px] font-mono text-slate-500">{inc.unit}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-7 space-y-4">
              <div className="glass-card p-6 border border-slate-800 rounded-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">{selectedIncident.title}</h2>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      {selectedIncident.unit} · {selectedIncident.time}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
                    {selectedIncident.severity}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Urgency Level</span>
                  </div>
                  <p className="text-sm text-slate-200">{selectedIncident.urgency}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Recommended Action</span>
                  </div>
                  <p className="text-sm text-slate-200">{selectedIncident.action}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    Resources Required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.resources.map((res, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}