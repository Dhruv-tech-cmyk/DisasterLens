"use client";

import { Activity, Globe, Wifi, LayoutDashboard, ShieldAlert, Download } from "lucide-react";

interface HeaderProps {
  systemOnline: boolean;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  activeTab: "spatial" | "triage";
  onTabChange: (tab: "spatial" | "triage") => void;
}

export default function Header({
  systemOnline,
  selectedRegion,
  onRegionChange,
  activeTab,
  onTabChange,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-[500] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1
              className="text-base font-bold tracking-wider text-slate-100 uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              DisasterLens
            </h1>
            <p className="text-[10px] font-mono text-slate-400">SPATIAL INTELLIGENCE PLATFORM</p>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <nav className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onTabChange("spatial")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "spatial"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Spatial Analytics</span>
          </button>
          <button
            onClick={() => onTabChange("triage")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "triage"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Incident Triage</span>
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile App Download Button */}
        <a
          href="https://github.com/Dhruv-tech-cmyk/DisasterLens/releases/download/v1.0.0/app-release.apk"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          download="app-release.apk"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download App</span>
        </a>

        {/* Region Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="bg-transparent text-xs font-mono text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="GLOBAL" className="bg-slate-900 text-slate-200">GLOBAL</option>
            <option value="ASIA-PAC" className="bg-slate-900 text-slate-200">ASIA-PAC</option>
            <option value="AMERICAS" className="bg-slate-900 text-slate-200">AMERICAS</option>
            <option value="EUROPE" className="bg-slate-900 text-slate-200">EUROPE</option>
            <option value="AFRICA" className="bg-slate-900 text-slate-200">AFRICA</option>
          </select>
        </div>

        {/* System Online Status Badge */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
          <Wifi className={`w-3.5 h-3.5 ${systemOnline ? "text-emerald-400" : "text-amber-400"}`} />
          <span className="text-xs font-mono font-semibold text-slate-200">
            {systemOnline ? "API Online" : "API Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
