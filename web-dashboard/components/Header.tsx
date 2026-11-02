"use client";

import { Activity, Globe, Wifi } from "lucide-react";

interface HeaderProps {
  systemOnline: boolean;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export default function Header({ systemOnline, selectedRegion, onRegionChange }: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-[500] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wider text-slate-100 uppercase" style={{ fontFamily: "var(--font-display)" }}>
            DisasterLens <span className="text-blue-500 text-xs font-mono font-normal">v4.2.1</span>
          </h1>
          <p className="text-[10px] font-mono text-slate-400">SPATIAL INTELLIGENCE PLATFORM</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
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
            {systemOnline ? "System Online" : "Simulation Mode"}
          </span>
        </div>
      </div>
    </header>
  );
}