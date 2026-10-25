import React, { useState } from 'react';
import { MapPin, Layers, Satellite, ShieldAlert, Crosshair, ZoomIn, ZoomOut, Compass, ExternalLink, AlertTriangle } from 'lucide-react';

interface GisSatelliteMapViewProps {
  onOpenFileViewer?: (filename: string) => void;
}

export const GisSatelliteMapView: React.FC<GisSatelliteMapViewProps> = ({ onOpenFileViewer }) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'plume' | 'boreholes' | 'warranty'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedPin, setSelectedPin] = useState<string | null>('B-3');

  // Key GPS coordinates for 17631 Cameron Lane and surroundings
  const siteCoordinates = {
    lat: 33.706389,
    lng: -117.988611,
    siteAddress: '17631 Cameron Lane, Huntington Beach, CA 92648',
    apn: '110-381-01',
    easementNumber: 'UPX1978058',
  };

  const sampleBoreholes = [
    {
      id: 'B-1',
      x: 38,
      y: 42,
      label: 'B-1 (North Perimeter)',
      crViPpm: '340 µg/kg',
      depth: '0–5 ft',
      status: 'Exceeds Residential Screening (17×)',
    },
    {
      id: 'B-2',
      x: 56,
      y: 35,
      label: 'B-2 (Northeast Boundary)',
      crViPpm: '480 µg/kg',
      depth: '0–5 ft',
      status: 'Exceeds Residential Screening (24×)',
    },
    {
      id: 'B-3',
      x: 50,
      y: 52,
      label: 'B-3 (Bed Anchor Breach - Primary Epicenter)',
      crViPpm: '980 µg/kg',
      depth: '0–2 ft (Sub-Slab)',
      status: 'CRITICAL: 49× DTSC Threshold (Breached Cap under beds)',
      isBreach: true,
    },
    {
      id: 'B-4',
      x: 64,
      y: 58,
      label: 'B-4 (East Courtyard)',
      crViPpm: '620 µg/kg',
      depth: '0–5 ft',
      status: 'Exceeds Residential Screening (31×)',
    },
    {
      id: 'B-5',
      x: 44,
      y: 68,
      label: 'B-5 (Southwest Drainage Vector)',
      crViPpm: '790 µg/kg',
      depth: '5–10 ft',
      status: 'Groundwater Migration Pathway (39.5×)',
    },
    {
      id: 'B-6',
      x: 30,
      y: 58,
      label: 'B-6 (West Perimeter Fence)',
      crViPpm: '290 µg/kg',
      depth: '0–5 ft',
      status: 'Exceeds Screening (14.5×)',
    },
  ];

  const currentBorehole = sampleBoreholes.find((b) => b.id === selectedPin) || sampleBoreholes[2];

  return (
    <div className="bg-slate-900 border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl flex flex-col my-4">
      {/* Top Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                GIS Forensic Satellite Map &middot; 17631 Cameron Lane
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono font-bold">
                GPS: {siteCoordinates.lat}, {siteCoordinates.lng}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Huntington Beach Navigation Center &middot; DTSC GeoTracker T10000018579 &middot; APN {siteCoordinates.apn}
            </p>
          </div>
        </div>

        {/* Layer Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
              activeLayer === 'all'
                ? 'bg-cyan-900 text-cyan-200 border border-cyan-500'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All GIS Overlays
          </button>
          <button
            onClick={() => setActiveLayer('plume')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
              activeLayer === 'plume'
                ? 'bg-rose-900 text-rose-200 border border-rose-500'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            49× Cr(VI) Plume
          </button>
          <button
            onClick={() => setActiveLayer('boreholes')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
              activeLayer === 'boreholes'
                ? 'bg-amber-900 text-amber-200 border border-amber-500'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Soil Boreholes (B1–B6)
          </button>
          <button
            onClick={() => setActiveLayer('warranty')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
              activeLayer === 'warranty'
                ? 'bg-purple-900 text-purple-200 border border-purple-500'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1-Yr Cap Boundary
          </button>
        </div>
      </div>

      {/* Main Interactive Map Surface */}
      <div className="relative w-full h-112 bg-slate-950 overflow-hidden select-none">
        {/* Synthetic High-Resolution Satellite Texture & Grid Base */}
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: '50% 50%' }}
        >
          {/* Base Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Satellite Property Boundary Polygon */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="plumeGradient" cx="50%" cy="52%" r="35%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.75" />
                <stop offset="45%" stopColor="#e11d48" stopOpacity="0.45" />
                <stop offset="85%" stopColor="#be123c" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#881337" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="groundwaterFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Property Parcel Outline (17631 Cameron Lane) */}
            <polygon
              points="25,25 75,22 78,78 22,75"
              fill="#0f172a"
              fillOpacity="0.55"
              stroke="#38bdf8"
              strokeWidth="0.4"
              strokeDasharray="1,1"
            />

            {/* 1-Year Asphalt Cap Boundary (Laserfiche #5406552) */}
            {(activeLayer === 'all' || activeLayer === 'warranty') && (
              <polygon
                points="32,30 68,28 70,72 28,70"
                fill="#1e293b"
                fillOpacity="0.4"
                stroke="#f59e0b"
                strokeWidth="0.6"
              />
            )}

            {/* 49× Cr(VI) Plume Cloud (980 µg/kg Vadose Dispersion) */}
            {(activeLayer === 'all' || activeLayer === 'plume') && (
              <ellipse
                cx="50"
                cy="52"
                rx="24"
                ry="18"
                fill="url(#plumeGradient)"
                stroke="#f43f5e"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />
            )}

            {/* Groundwater Migration Vector Southwest towards residential wetlands */}
            {(activeLayer === 'all' || activeLayer === 'plume') && (
              <path
                d="M 50,52 Q 42,65 30,82"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="0.8"
                markerEnd="url(#arrow)"
                strokeDasharray="1.5,1"
              />
            )}
          </svg>

          {/* Interactive Borehole Pins */}
          {(activeLayer === 'all' || activeLayer === 'boreholes') &&
            sampleBoreholes.map((borehole) => (
              <button
                key={borehole.id}
                onClick={() => setSelectedPin(borehole.id)}
                style={{ left: `${borehole.x}%`, top: `${borehole.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full flex items-center justify-center transition-all cursor-pointer group ${
                  selectedPin === borehole.id
                    ? 'ring-4 ring-cyan-400 bg-cyan-950 scale-125 z-20'
                    : borehole.isBreach
                    ? 'bg-rose-950 ring-2 ring-rose-500 scale-110 z-10'
                    : 'bg-slate-900 ring-1 ring-slate-600 hover:scale-110'
                }`}
                title={`${borehole.label}: ${borehole.crViPpm}`}
              >
                <MapPin
                  className={`w-4 h-4 ${
                    borehole.isBreach
                      ? 'text-rose-400 animate-bounce'
                      : selectedPin === borehole.id
                      ? 'text-cyan-400'
                      : 'text-amber-400'
                  }`}
                />
              </button>
            ))}
        </div>

        {/* Map Legend Overlay (Top Left) */}
        <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 rounded-lg p-3 text-xs backdrop-blur-md shadow-xl max-w-xs pointer-events-auto space-y-1.5 font-mono">
          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>GIS MAP LEGEND</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
            <span>Site Perimeter (APN 110-381-01)</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 text-[11px]">
            <span className="w-3 h-0.5 bg-amber-400 inline-block" />
            <span>1-Yr Asphalt Cap (Laserfiche #5406552)</span>
          </div>
          <div className="flex items-center gap-2 text-rose-300 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block animate-pulse" />
            <span>49× Cr(VI) Plume (980 µg/kg)</span>
          </div>
          <div className="flex items-center gap-2 text-sky-300 text-[11px]">
            <span className="w-3 h-0.5 bg-sky-400 inline-block" />
            <span>Groundwater Flow Gradient (SW)</span>
          </div>
        </div>

        {/* Selected Borehole Inspector Card (Top Right) */}
        <div className="absolute top-3 right-3 bg-slate-950/95 border border-cyan-500/50 rounded-lg p-3 text-xs backdrop-blur-md shadow-2xl max-w-sm pointer-events-auto font-mono space-y-1.5">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
            <span className="text-cyan-300 font-bold flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5" />
              <span>{currentBorehole.label}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
              Depth: {currentBorehole.depth}
            </span>
          </div>

          <div className="text-sm font-extrabold text-rose-400">
            Cr(VI) Concentration: {currentBorehole.crViPpm}
          </div>

          <div className="text-[11px] text-slate-300 font-sans leading-tight">
            {currentBorehole.status}
          </div>

          {currentBorehole.isBreach && (
            <div className="bg-rose-950/80 border border-rose-500/60 rounded p-2 text-[10px] text-rose-200 font-sans mt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 inline mr-1" />
              <b>Anchor Bolt Penetration Point:</b> Corroded anchor bolts breached the 2-inch cap into raw sub-slab soil directly under resident beds.
            </div>
          )}
        </div>

        {/* Zoom & View Controls (Bottom Right) */}
        <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-800 rounded-lg p-1.5 flex items-center gap-1.5 backdrop-blur-md shadow-xl pointer-events-auto">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-slate-400 px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 transition-all cursor-pointer"
          >
            Fit
          </button>
        </div>

        {/* External GIS Verification Links (Bottom Left) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-auto">
          <a
            href="https://geotracker.waterboards.ca.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-300 hover:text-cyan-300 backdrop-blur-md flex items-center gap-1 hover:border-cyan-500/50 transition-all"
          >
            <span>DTSC GeoTracker T10000018579</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${siteCoordinates.lat},${siteCoordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-300 hover:text-cyan-300 backdrop-blur-md flex items-center gap-1 hover:border-cyan-500/50 transition-all"
          >
            <span>Google Maps Satellite View</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
