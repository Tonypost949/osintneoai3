import React from 'react';
import { ShieldAlert, Volume2, FolderOpen, Copy, Printer, FileText, BarChart3, Database, UserCheck, Bot, Scale } from 'lucide-react';

interface HeaderProps {
  activeTab: 'master' | 'ailaws' | 'screener' | 'void-deals' | 'outreach' | 'osint' | 'locker';
  setActiveTab: (tab: 'master' | 'ailaws' | 'screener' | 'void-deals' | 'outreach' | 'osint' | 'locker') => void;
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
          <span className="font-extrabold uppercase tracking-wider text-slate-200">
            HBNC CASE 3 &amp; OSINT NEO AI
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-red-400 font-semibold hidden md:inline">
            Active Federal Matter: <i>Knabb v. City of Huntington Beach</i> (8:26-cv-00348-JWH-ADS)
          </span>
          <span className="bg-red-950/80 text-red-300 border border-red-800/60 px-2 py-0.5 rounded text-[11px] font-mono">
            49× Cr(VI) Contamination
          </span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleDemoAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded font-medium text-xs transition-all ${
              isDemoAudioPlaying
                ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
            }`}
            title="Listen to Guided Audio Orientation with synchronized visual walkthrough"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isDemoAudioPlaying ? 'Playing Audio Demo' : 'Audio Orientation'}</span>
          </button>

          <button
            onClick={onOpenFolderScanner}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-blue-600/90 hover:bg-blue-600 text-white font-medium text-xs border border-blue-400/40 transition-all"
            title="Scan & auto-connect your local HBNC_Case_3 folder and subfolders"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan Local</span> Folder
          </button>

          <button
            onClick={onCopySummary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-all"
            title="Copy 60-second executive case summary for attorneys and agencies"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy 60s Briefing</span>
          </button>

          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs border border-indigo-400/50 transition-all"
            title="Open Gemini AI Dossier & Legal Query Assistant"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Dossier</span> Assistant
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-all"
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
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 ${
            activeTab === 'master'
              ? 'bg-slate-900 text-red-400 border-red-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>Master Record &amp; Call to Action</span>
        </button>

        <button
          onClick={() => setActiveTab('ailaws')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 ${
            activeTab === 'ailaws'
              ? 'bg-slate-900 text-blue-400 border-blue-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>/ailaws Legal Matrix &amp; Demands</span>
        </button>

        <button
          onClick={() => setActiveTab('screener')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 ${
            activeTab === 'screener'
              ? 'bg-slate-900 text-emerald-400 border-emerald-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Victim Screener &amp; Upload</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono">ZIP Allowed</span>
        </button>

        <button
          onClick={() => setActiveTab('void-deals')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 ${
            activeTab === 'void-deals'
              ? 'bg-slate-900 text-amber-300 border-amber-400'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Form 700 &amp; 2 Void Deals</span>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono">$320M vs $6.09M</span>
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 ${
            activeTab === 'outreach'
              ? 'bg-slate-900 text-purple-400 border-purple-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span>Outreach &amp; Dispatch Dashboard</span>
          <span className="text-[10px] text-slate-500">184 Rec</span>
        </button>

        <button
          onClick={() => setActiveTab('osint')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 ${
            activeTab === 'osint'
              ? 'bg-slate-900 text-amber-400 border-amber-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <Database className="w-4 h-4 text-amber-400" />
          <span>OSINT Research Library</span>
          <span className="text-[10px] text-slate-500">31 Repos</span>
        </button>

        <button
          onClick={() => setActiveTab('locker')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t font-semibold text-xs transition-all whitespace-nowrap border-b-2 ${
            activeTab === 'locker'
              ? 'bg-slate-900 text-cyan-400 border-cyan-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-cyan-400" />
          <span>Evidence Locker Hub</span>
        </button>
      </div>
    </header>
  );
};
