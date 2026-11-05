"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface GeospatialMapProps {
  disasterType: string;
  isAnalyzed: boolean;
  selectedRegion?: string;
}

// Coordinate preset dictionary for interactive region focusing
const REGION_COORDINATES: Record<string, { center: [number, number]; zoom: number }> = {
  GLOBAL: { center: [20, 0], zoom: 2 },
  "ASIA-PAC": { center: [23.8103, 90.4125], zoom: 6 },
  AMERICAS: { center: [37.7749, -122.4194], zoom: 4 },
  EUROPE: { center: [48.8566, 2.3522], zoom: 4 },
  AFRICA: { center: [1.2921, 36.8219], zoom: 4 },
};

// Internal map observer to trigger smooth pan animations & fix tile size clipping
function MapViewController({ selectedRegion }: { selectedRegion?: string }) {
  const map = useMap();

  useEffect(() => {
    // Recalculate tile sizes immediately to prevent partial gray rendering box
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const regionKey = selectedRegion && REGION_COORDINATES[selectedRegion] ? selectedRegion : "GLOBAL";
    const target = REGION_COORDINATES[regionKey];

    map.flyTo(target.center, target.zoom, {
      duration: 1.5,
    });

    return () => clearTimeout(timer);
  }, [selectedRegion, map]);

  return null;
}

export default function GeospatialMap({ disasterType, isAnalyzed, selectedRegion = "GLOBAL" }: GeospatialMapProps) {
  const initialRegion = REGION_COORDINATES[selectedRegion] || REGION_COORDINATES["GLOBAL"];

  return (
    <div className="w-full h-full relative bg-[#020617] rounded-2xl overflow-hidden">
      <MapContainer
        center={initialRegion.center}
        zoom={initialRegion.zoom}
        zoomControl={false}
        className="w-full h-full z-0"
        style={{ height: "100%", width: "100%", background: "#020617" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewController selectedRegion={selectedRegion} />
      </MapContainer>

      {/* Geospatial Overlay Telemetry Badge */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-100">REGION: {selectedRegion}</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          VIEW: {disasterType.toUpperCase()} {isAnalyzed ? "| ANALYSIS COMPLETE" : "| AWAITING TILE"}
        </div>
        <div className="text-[10px] text-slate-500 mt-1">Basemap preview · uploaded tiles are not georeferenced</div>
      </div>
    </div>
  );
}
