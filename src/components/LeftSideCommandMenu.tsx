import React, { useState } from 'react';
import {
  X,
  Menu,
  Sparkles,
  KeyRound,
  ShieldAlert,
  Gavel,
  Scale,
  UserCheck,
  BarChart3,
  Database,
  FolderOpen,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Captions,
  Layers,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Cpu,
  Bot,
  Network,
} from 'lucide-react';
import { AppViewportTab, CINEMATIC_DEMO_SCENES } from '../data/hbncDemoScript';
import { StudioVoicePersona, STUDIO_PERSONAS, playCyberChime } from '../utils/audioEngine';

interface LeftSideCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppViewportTab | 'void-deals';
  onSwitchTab: (tab: AppViewportTab | 'void-deals') => void;
  // Demo Controls
  isDemoActive: boolean;
  onToggleDemoActive: () => void;
  isDemoPlaying: boolean;
  onTogglePlayDemo: () => void;
  currentDemoSceneIdx: number;
  onSelectDemoScene: (idx: number) => void;
  // Voice
  selectedVoice: StudioVoicePersona;
  onChangeVoice: (voice: StudioVoicePersona) => void;
  onTestVoice: () => void;
  // Docks & Display
  dockMode: 'autohide' | 'always' | 'hidden';
  onChangeDockMode: (mode: 'autohide' | 'always' | 'hidden') => void;
  isFullScreenCinema: boolean;
  onToggleFullScreen: () => void;
  // AI Modal
  onOpenAiModal: () => void;
  selectedAiModel: string;
  onChangeAiModel: (model: string) => void;
  // Actions
  onCopySummary: () => void;
}

export const LeftSideCommandMenu: React.FC<LeftSideCommandMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSwitchTab,
  isDemoActive,
  onToggleDemoActive,
  isDemoPlaying,
  onTogglePlayDemo,
  currentDemoSceneIdx,
  onSelectDemoScene,
  selectedVoice,
  onChangeVoice,
  onTestVoice,
  dockMode,
  onChangeDockMode,
  isFullScreenCinema,
  onToggleFullScreen,
  onOpenAiModal,
  selectedAiModel,
  onChangeAiModel,
  onCopySummary,
}) => {
  const [autoHideOnLeave, setAutoHideOnLeave] = useState<boolean>(true);

  const tabs = [
    { id: 'evidence-law-hybrid', label: 'Evidence-Law Hybrid Viewer', icon: Layers, badge: 'Split Exhibit/Law' },
    { id: 'maltego', label: 'Canvas Maltego Entity Graph', icon: Network, badge: '15 Nodes / 18 Links' },
    { id: 'master', label: 'Master Record & Timeline', icon: ShieldAlert, badge: '49× Cr(VI)' },
    { id: 'void-deals', label: 'Form 700 & 2 Void Deals', icon: Gavel, badge: '$326M Disgorgement' },
    { id: 'ailaws', label: '/ailaws Statutory Proof Matrix', icon: Scale, badge: 'ADA & RCRA' },
    { id: 'screener', label: 'Victim Screener & Uploads', icon: UserCheck, badge: 'HBNC Victim #' },
    { id: 'integrations', label: '3D Plume, GIS & Studio Secrets', icon: Zap, badge: '6 Cores Live' },
    { id: 'outreach', label: 'Outreach Telemetry', icon: BarChart3, badge: 'GAO & FBI Dockets' },
    { id: 'osint', label: 'OSINT Research Library', icon: Database, badge: '15,320 Files / 31 Repos' },
    { id: 'locker', label: 'Evidence Locker (Read-Only + ZIP)', icon: FolderOpen, badge: '44 Exhibits' },
  ] as const;

  const currentScene = CINEMATIC_DEMO_SCENES[currentDemoSceneIdx] || CINEMATIC_DEMO_SCENES[0];

  return (
    <>
      {/* Dim Backdrop when open (click to dismiss without disturbing dashboard) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        />
      )}

      {/* Slide-Over Drawer Container */}
      <aside
        onMouseLeave={() => {
          if (autoHideOnLeave && isOpen) {
            onClose();
          }
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 w-84 sm:w-96 bg-slate-950/95 border-r border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with Title and Close Button */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                COMMAND MENU // OSINT NEO
              </h2>
              <p className="text-[10px] text-cyan-300 font-mono">
                Left Side Controller &middot; Fullscreen Ready
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Command Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs font-sans">
          {/* SECTION 1: API KEYS & ARGON 4 AI MODEL ENGINE */}
          <div className="bg-slate-900/90 border border-indigo-500/50 rounded-xl p-3.5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI MODEL &amp; PROFILE KEYS</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-mono font-bold">
                KEYS INJECTED ✓
              </span>
            </div>

            {/* Active Model Indicator */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 mb-2.5">
              <div className="text-[11px] text-slate-400 mb-1">Active AI Investigation Model:</div>
              <div className="text-sm font-bold font-mono text-cyan-300 flex items-center justify-between">
                <span>{selectedAiModel === 'gemini-4-argon' ? '⚡ Gemini 4 Argon' : selectedAiModel}</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/60 px-1.5 py-0.5 rounded font-mono">
                  ACTIVE
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Connected via user profile secrets proxy (/api/gemini).
              </div>
            </div>

            {/* Model Switcher Options */}
            <div className="space-y-1 mb-3">
              <span className="text-[10px] text-slate-400 font-mono">Switch Model:</span>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                {[
                  { id: 'gemini-4-argon', label: 'Argon 4 (Premier)' },
                  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
                  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
                  { id: 'gemini-3.8-flash', label: '3.8 Flash' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      playCyberChime(1.2);
                      onChangeAiModel(m.id);
                    }}
                    className={`px-2 py-1.5 rounded text-left transition-all cursor-pointer ${
                      selectedAiModel === m.id
                        ? 'bg-indigo-600 text-white font-bold shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch AI Assistant Modal */}
            <button
              onClick={() => {
                onClose();
                onOpenAiModal();
              }}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Launch Gemini AI Legal Assistant</span>
            </button>
          </div>

          {/* SECTION 2: VIEWPORT NAVIGATION */}
          <div>
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>APPLICATION MODULES</span>
              <span className="text-[10px] text-slate-500">7 Core Views</span>
            </div>

            <div className="space-y-1.5 font-mono">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isCurr = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playCyberChime(1.05);
                      onSwitchTab(tab.id);
                      onClose();
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCurr
                        ? 'bg-cyan-950/90 border-cyan-400 text-white ring-1 ring-cyan-400/50 shadow-md'
                        : 'bg-slate-900/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isCurr ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="font-semibold text-xs">{tab.label}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: DOCKS & DASHBOARD OVERLAY CONTROLS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>DOCKS &amp; DASHBOARD VIEW</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">No Clutter</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Configure how the top command dock and navigation bars appear on your screen:
            </p>

            <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px] mb-3">
              {[
                { id: 'autohide', label: 'Auto-Hide (Hover)' },
                { id: 'always', label: 'Always Visible' },
                { id: 'hidden', label: 'Hidden (Max Room)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onChangeDockMode(m.id as any)}
                  className={`px-2 py-2 rounded text-center transition-all cursor-pointer ${
                    dockMode === m.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoHideOnLeave}
                  onChange={(e) => setAutoHideOnLeave(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Auto-hide this menu on mouse leave</span>
              </label>
            </div>
          </div>

          {/* SECTION 4: CINEMATIC DEMO & AUDIO DIRECTOR */}
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-3.5">
            <div className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>CINEMATIC TOUR &amp; STUDIO VOICES</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Act {currentScene.actNumber}/{CINEMATIC_DEMO_SCENES.length}</span>
            </div>

            {/* Act Selector */}
            <div className="mb-3">
              <div className="text-[10px] text-slate-400 font-mono mb-1">Jump to Act:</div>
              <div className="grid grid-cols-5 gap-1 font-mono text-[11px]">
                {CINEMATIC_DEMO_SCENES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      playCyberChime(1.0 + idx * 0.05);
                      onSelectDemoScene(idx);
                    }}
                    className={`py-1 rounded text-center transition-all cursor-pointer ${
                      currentDemoSceneIdx === idx
                        ? 'bg-cyan-500 text-slate-950 font-bold ring-1 ring-cyan-300'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                    title={s.title}
                  >
                    {s.actNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Studio Voice Persona — Permanently Locked to Deep Documentary Voice */}
            <div className="mb-3 bg-slate-950 border border-emerald-500/40 rounded-lg p-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-300">Studio Narrator Voice:</span>
                <span className="text-emerald-300 font-bold">🔒 Deep Voice Locked (24kHz WAV)</span>
              </div>
            </div>

            {/* Demo Play/Pause & Fullscreen Cinema */}
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              <button
                onClick={onTogglePlayDemo}
                className={`py-1.5 px-2.5 rounded font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isDemoPlaying
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {isDemoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isDemoPlaying ? 'Pause Demo' : 'Play Demo'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onToggleFullScreen();
                }}
                className="py-1.5 px-2.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{isFullScreenCinema ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
            </div>
          </div>

          {/* Quick Legal Actions */}
          <div className="space-y-1.5 font-mono text-[11px]">
            <button
              onClick={onCopySummary}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>📋 Copy 60-Sec Executive Summary</span>
            </button>
            <a
              href="/ailaws.html"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-300 font-bold flex items-center justify-center gap-2 transition-all text-center block"
            >
              <span>Open Standalone /ailaws.html &rarr;</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
          HBNC Case 3 &middot; Knabb v. City of HB &middot; amd949609@gmail.com
        </div>
      </aside>
    </>
  );
};
