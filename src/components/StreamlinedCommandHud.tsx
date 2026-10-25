import React, { useState } from 'react';
import {
  AlertTriangle,
  Scale,
  Clock,
  Activity,
  FileCheck,
  Shield,
  Zap,
  Volume2,
  ChevronRight,
  Copy,
  ExternalLink,
  Flame,
  CheckCircle2,
  Layers,
  ArrowRight,
  Gavel
} from 'lucide-react';
import { AppViewportTab } from '../data/hbncDemoScript';
import { playCyberChime } from '../utils/audioEngine';

interface StreamlinedCommandHudProps {
  activeTab: AppViewportTab | 'void-deals';
  onSwitchTab: (tab: AppViewportTab | 'void-deals') => void;
  onCopySummary: () => void;
  onTestVoice: () => void;
  isStreamlinedMode: boolean;
  onToggleStreamlinedMode: () => void;
  onOpenFileViewer: (filename: string) => void;
}

export const StreamlinedCommandHud: React.FC<StreamlinedCommandHudProps> = ({
  activeTab,
  onSwitchTab,
  onCopySummary,
  onTestVoice,
  isStreamlinedMode,
  onToggleStreamlinedMode,
  onOpenFileViewer,
}) => {
  const [copiedAction, setCopiedAction] = useState(false);

  const handleCopy = () => {
    playCyberChime(1.15);
    onCopySummary();
    setCopiedAction(true);
    setTimeout(() => setCopiedAction(false), 2500);
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-cyan-500/30 backdrop-blur-md shadow-2xl relative z-20">
      {/* Top Telemetry Strip */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Status Indicator & Live Gauges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-300">
              FORENSIC COMMAND HUD // HBNC CASE 3
            </span>
            <span className="hidden sm:inline text-slate-600">&middot;</span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Knabb v. Huntington Beach (8:26-cv-00348-JWH-ADS)
            </span>
          </div>

          {/* Interactive Mode & Audio Test Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleStreamlinedMode}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isStreamlinedMode
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-300'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
              title="Toggle between Streamlined Visual Mode and Detailed Court Record"
            >
              <Zap className={`w-3.5 h-3.5 ${isStreamlinedMode ? 'text-amber-300 fill-current' : ''}`} />
              <span>{isStreamlinedMode ? '⚡ STREAMLINED HUD: ACTIVE' : '📜 FULL DOSSIER MODE'}</span>
            </button>

            <button
              onClick={() => {
                playCyberChime(1.1);
                onTestVoice();
              }}
              className="px-2.5 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Test Studio Voice Narration (Gemini Neural / Charon)"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Studio Voice: Charon</span>

            </button>
          </div>
        </div>

        {/* 5 Live Telemetry Cards with Dynamic Visual Meters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-3 text-xs font-mono">
          {/* Meter 1: Hexavalent Chromium */}
          <div
            onClick={() => onOpenFileViewer('navigation_center_003.jpg')}
            className="bg-slate-950/80 hover:bg-slate-950 border border-red-500/50 hover:border-red-400 p-2.5 rounded-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-400" />
                <span>Cr(VI) Peak</span>
              </span>
              <span className="text-[10px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded font-bold">49× DTSC</span>
            </div>
            <div className="text-lg font-black text-white group-hover:text-red-300">
              980 <span className="text-[10px] font-normal text-slate-400">µg/kg</span>
            </div>
            {/* Visual meter bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-gradient-to-r from-amber-500 to-red-500 h-full w-[98%]" />
            </div>
          </div>

          {/* Meter 2: Void Ab Initio Public Land Deals */}
          <div
            onClick={() => onSwitchTab('void-deals')}
            className="bg-slate-950/80 hover:bg-slate-950 border border-purple-500/50 hover:border-purple-400 p-2.5 rounded-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Gavel className="w-3 h-3 text-purple-400" />
                <span>Void Land Deals</span>
              </span>
              <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded font-bold">100% Strict</span>
            </div>
            <div className="text-lg font-black text-white group-hover:text-purple-300">
              $326.1M <span className="text-[10px] font-normal text-slate-400">Total</span>
            </div>
            {/* Visual meter bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full w-[100%]" />
            </div>
          </div>

          {/* Meter 3: Statutory Clock */}
          <div
            onClick={() => onSwitchTab('ailaws')}
            className="bg-slate-950/80 hover:bg-slate-950 border border-amber-500/50 hover:border-amber-400 p-2.5 rounded-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Statutory Clock</span>
              </span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded font-bold">Gov § 911.2</span>
            </div>
            <div className="text-lg font-black text-white group-hover:text-amber-300">
              72 Hours <span className="text-[10px] font-normal text-slate-400">Notice</span>
            </div>
            {/* Visual meter bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-full w-[85%]" />
            </div>
          </div>

          {/* Meter 4: Hospitalized Cluster */}
          <div
            onClick={() => {
              onSwitchTab('master');
              setTimeout(() => {
                document.getElementById('people-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 200);
            }}
            className="bg-slate-950/80 hover:bg-slate-950 border border-blue-500/50 hover:border-blue-400 p-2.5 rounded-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-blue-400" />
                <span>ICU Cluster</span>
              </span>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded font-bold">Scripps EHR</span>
            </div>
            <div className="text-lg font-black text-white group-hover:text-blue-300">
              6 Residents <span className="text-[10px] font-normal text-slate-400">62d ICU</span>
            </div>
            {/* Visual meter bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full w-[75%]" />
            </div>
          </div>

          {/* Meter 5: Relator Outreaches */}
          <div
            onClick={() => onSwitchTab('outreach')}
            className="bg-slate-950/80 hover:bg-slate-950 border border-emerald-500/50 hover:border-emerald-400 p-2.5 rounded-lg transition-all cursor-pointer group col-span-2 md:col-span-1"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-emerald-400" />
                <span>Dispatches</span>
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-bold">184 Logged</span>
            </div>
            <div className="text-lg font-black text-white group-hover:text-emerald-300">
              31 Repos <span className="text-[10px] font-normal text-slate-400">15.3k items</span>
            </div>
            {/* Visual meter bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[90%]" />
            </div>
          </div>
        </div>

        {/* Quick-Launch Command Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          {/* Quick-Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedAction ? '✓ Copied Relator Memo!' : 'Copy 60s Intake Memo'}</span>
            </button>

            <button
              onClick={() => onSwitchTab('ailaws')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeTab === 'ailaws'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>/ailaws Legal Matrix</span>
            </button>

            <button
              onClick={() => onSwitchTab('void-deals')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeTab === 'void-deals'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Compare 2 Void Deals</span>
            </button>

            <button
              onClick={() => onSwitchTab('screener')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeTab === 'screener'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Upload Record (.zip / any)</span>
            </button>
          </div>

          {/* Direct File Trigger */}
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span className="hidden md:inline">Smoking Guns:</span>
            <button
              onClick={() => onOpenFileViewer('navigation_center_003.jpg')}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              County Condition
            </button>
            <span>&middot;</span>
            <button
              onClick={() => onOpenFileViewer('HB_Shelter_Nov2023_photo_01.jpg')}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Bed Cap Breach
            </button>
            <span>&middot;</span>
            <button
              onClick={() => onOpenFileViewer('scripps_ehr_page_985.png')}
              className="text-rose-400 hover:underline cursor-pointer"
            >
              ICU Lockout EHR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
