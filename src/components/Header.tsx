import React from 'react';
import {
  ShieldAlert,
  Volume2,
  FolderOpen,
  Copy,
  Printer,
  FileText,
  BarChart3,
  Database,
  UserCheck,
  Bot,
  Scale,
  Network,
  Layers,
  Zap,
  Lock,
  Coins,
} from 'lucide-react';
import { AppViewportTab } from '../data/hbncDemoScript';

interface HeaderProps {
  activeTab: AppViewportTab;
  setActiveTab: (tab: AppViewportTab) => void;
  onOpenFolderScanner: () => void;
  onCopySummary: () => void;
  onToggleDemoAudio: () => void;
  isDemoAudioPlaying: boolean;
  onOpenAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenFolderScanner,
  onCopySummary,
  onToggleDemoAudio,
  isDemoAudioPlaying,
  onOpenAiAssistant,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b-2 border-red-600 text-white shadow-xl">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <span className="font-extrabold uppercase tracking-wider text-cyan-300 font-mono">
            OSINTNEOAI.ME
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="font-extrabold uppercase tracking-wider text-slate-200">
            OSINT NEO AI &middot; LIVE INVESTIGATION &amp; LEGAL MATRIX
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-red-400 font-semibold hidden md:inline">
            <i>Knabb v. City of Huntington Beach</i> (8:26-cv-00348-JWH-ADS)
          </span>
          <span className="bg-red-950/80 text-red-300 border border-red-800/60 px-2 py-0.5 rounded text-[11px] font-mono">
            49× Cr(VI) &middot; 617 RICO Nodes
          </span>
          <button
            onClick={() => setActiveTab('crypto-transparency')}
            className="bg-amber-950/90 hover:bg-amber-900 text-amber-300 border border-amber-500/60 px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
            title="Open Transparency Token (TFT / OSINT / PAT) & Ethereum Sepolia 40/30/30 Escrow"
          >
            <Coins className="w-3 h-3 text-amber-400" />
            <span>⛓️ TFT / OSINT / PAT &middot; Sepolia 40/30/30</span>
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleDemoAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded font-medium text-xs transition-all cursor-pointer ${
              isDemoAudioPlaying
                ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
            }`}
            title="Listen to 10-Act Guided Studio Audio Orientation with Live Evidence Showcase"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isDemoAudioPlaying ? '10-Act Studio Demo ON' : '10-Act Audio Demo'}</span>
          </button>

          <button
            onClick={onOpenFolderScanner}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-blue-600/90 hover:bg-blue-600 text-white font-medium text-xs border border-blue-400/40 transition-all cursor-pointer"
            title="Scan & auto-connect your local HBNC_Case_3 folder and subfolders"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan Local</span> Folder
          </button>

          <button
            onClick={onCopySummary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-all cursor-pointer"
            title="Copy 60-second executive case summary for attorneys and agencies"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy 60s Briefing</span>
          </button>

          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs border border-indigo-400/50 transition-all cursor-pointer"
            title="Open Gemini 4 Argon Dossier & Legal Query Assistant (5 Profile Keys Loaded)"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gemini 4 Argon</span> AI
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-all cursor-pointer"
            title="Print or Save Formal PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-thin">
        <button
          onClick={() => setActiveTab('master')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'master'
              ? 'bg-slate-900 text-red-400 border-red-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>Master Record</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence-law-hybrid')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'evidence-law-hybrid'
              ? 'bg-slate-900 text-cyan-300 border-cyan-400'
              : 'text-slate-300 hover:text-white border-transparent hover:bg-slate-900/40'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Evidence-Law Hybrid Viewer</span>
          <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
            LIVE EXHIBITS
          </span>
        </button>

        <button
          onClick={() => setActiveTab('maltego')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'maltego'
              ? 'bg-slate-900 text-emerald-300 border-emerald-400'
              : 'text-slate-300 hover:text-white border-transparent hover:bg-slate-900/40'
          }`}
        >
          <Network className="w-4 h-4 text-emerald-400" />
          <span>Canvas Maltego Graph</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
            HTML5 CANVAS
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ailaws')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'ailaws'
              ? 'bg-slate-900 text-blue-400 border-blue-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>/ailaws Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('void-deals')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'void-deals'
              ? 'bg-slate-900 text-amber-300 border-amber-400'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Form 700 &amp; 2 Void Deals</span>
        </button>

        <button
          onClick={() => setActiveTab('crypto-transparency')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'crypto-transparency'
              ? 'bg-amber-950/90 text-amber-300 border-amber-400 font-bold'
              : 'text-amber-300 hover:text-white border-transparent hover:bg-amber-950/40'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Transparency Token &amp; Crypto</span>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
            TFT &middot; OSINT &middot; PAT
          </span>
        </button>

        <button
          onClick={() => setActiveTab('screener')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'screener'
              ? 'bg-slate-900 text-emerald-400 border-emerald-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Victim Screener</span>
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'outreach'
              ? 'bg-slate-900 text-purple-400 border-purple-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span>Outreach (184)</span>
        </button>

        <button
          onClick={() => setActiveTab('osint')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'osint'
              ? 'bg-slate-900 text-amber-400 border-amber-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <Database className="w-4 h-4 text-amber-400" />
          <span>OSINT (31 Repos)</span>
        </button>

        <button
          onClick={() => setActiveTab('locker')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'locker'
              ? 'bg-slate-900 text-cyan-400 border-cyan-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-cyan-400" />
          <span>Evidence Locker (44)</span>
          <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.2 rounded font-mono flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" /> Read-Only + .ZIP
          </span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 px-3 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'integrations'
              ? 'bg-indigo-950 text-indigo-300 border-indigo-400 font-bold'
              : 'text-indigo-400 hover:text-indigo-200 border-transparent hover:bg-indigo-950/40'
          }`}
        >
          <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>3D Plume, GIS &amp; Secrets</span>
        </button>
      </div>
    </header>
  );
};
