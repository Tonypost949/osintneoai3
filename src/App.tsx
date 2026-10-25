import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { CallToActionHero } from './components/CallToActionHero';
import { MasterRecordView } from './components/MasterRecordView';
import { AilawsMatrixView } from './components/AilawsMatrixView';
import { VictimScreenerView } from './components/VictimScreenerView';
import { VoidAbInitioDealsView } from './components/VoidAbInitioDealsView';
import { OutreachDashboardView } from './components/OutreachDashboardView';
import { OsintLibraryView } from './components/OsintLibraryView';
import { EvidenceLockerView } from './components/EvidenceLockerView';
import { MaltegoGraphView } from './components/MaltegoGraphView';
import { EvidenceLawHybridView } from './components/EvidenceLawHybridView';
import { CinematicDemoOverlay } from './components/CinematicDemoOverlay';
import { FileViewerModal } from './components/FileViewerModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { StreamlinedCommandHud } from './components/StreamlinedCommandHud';
import { LeftSideCommandMenu } from './components/LeftSideCommandMenu';
import { IntegrationsHubView } from './components/IntegrationsHubView';
import { CINEMATIC_DEMO_SCENES, AppViewportTab } from './data/hbncDemoScript';
import {
  StudioVoicePersona,
  playCyberChime,
  normalizeTextForSpeech,
  getBestVoiceForPersona,
  fetchGeminiNeuralAudio,
} from './utils/audioEngine';
import { Gavel, Layers, Network, Menu, Zap, Lock, Upload } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppViewportTab>('evidence-law-hybrid');
  const [selectedFileForModal, setSelectedFileForModal] = useState<string | null>(null);
  const [selectedFileDataForModal, setSelectedFileDataForModal] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isStreamlinedMode, setIsStreamlinedMode] = useState(true);

  // Left Side Command Menu & AI Model State
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState<boolean>(false);
  const [dockDisplayMode, setDockDisplayMode] = useState<'autohide' | 'always' | 'hidden'>('always');
  const [selectedAiModel, setSelectedAiModel] = useState<string>('gemini-4-argon');
  const [selectedVoice, setSelectedVoice] = useState<StudioVoicePersona>('Charon');

  // 10-Act Cinematic Demo State with Live Primary Evidence Stage
  const [isCinematicDemoActive, setIsCinematicDemoActive] = useState<boolean>(true);
  const [currentDemoSceneIdx, setCurrentDemoSceneIdx] = useState<number>(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(true);
  const [demoPlaybackSpeed, setDemoPlaybackSpeed] = useState<number>(1);
  const [demoSceneProgress, setDemoSceneProgress] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isFullScreenCinema, setIsFullScreenCinema] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(100);

  const isVoiceSpeakingRef = useRef<boolean>(true);
  const sceneStartTimestampRef = useRef<number>(Date.now());
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  // Sync browser fullscreenchange events (e.g. if user presses Escape) with `isFullScreenCinema`
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreenCinema(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // When demo scene changes, switch active viewport tab smoothly
  useEffect(() => {
    if (!isCinematicDemoActive) return;
    const scene = CINEMATIC_DEMO_SCENES[currentDemoSceneIdx];
    if (!scene) return;

    if (scene.targetAppTab && scene.targetAppTab !== activeTab) {
      setActiveTab(scene.targetAppTab);
    }

    if (scene.targetElementId) {
      setTimeout(() => {
        const el = document.getElementById(scene.targetElementId!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    }

    sceneStartTimestampRef.current = Date.now();
    isVoiceSpeakingRef.current = true;
    setDemoSceneProgress(0);
  }, [currentDemoSceneIdx, isCinematicDemoActive]);

  // Demo scene timer with deliberate hold so voice narration never gets cut off
  useEffect(() => {
    if (!isCinematicDemoActive || !isDemoPlaying) return;
    const scene = CINEMATIC_DEMO_SCENES[currentDemoSceneIdx];
    const totalMs = (scene?.durationMs || 95000) / demoPlaybackSpeed;
    const minRequiredMs = Math.max(45000, totalMs * 0.85);
    const tickMs = 200;
    const increment = (tickMs / totalMs) * 100;

    const interval = window.setInterval(() => {
      const elapsedMs = Date.now() - sceneStartTimestampRef.current;
      setDemoSceneProgress((prev) => {
        const nextVal = prev + increment;
        if (isVoiceSpeakingRef.current || elapsedMs < minRequiredMs) {
          return Math.min(88, nextVal);
        }
        if (nextVal >= 99.5) {
          sceneStartTimestampRef.current = Date.now();
          isVoiceSpeakingRef.current = true;
          setCurrentDemoSceneIdx((idx) => {
            const nextIdx = idx + 1;
            if (nextIdx >= CINEMATIC_DEMO_SCENES.length) {
              if (isLooping) {
                return 0;
              } else {
                setIsDemoPlaying(false);
                return idx;
              }
            }
            return nextIdx;
          });
          return 0;
        }
        return nextVal;
      });
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [isCinematicDemoActive, isDemoPlaying, currentDemoSceneIdx, demoPlaybackSpeed, isLooping]);

  const handleToggleFullScreen = () => {
    try {
      if (!isFullScreenCinema) {
        setIsFullScreenCinema(true);
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        setIsFullScreenCinema(false);
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch {
      setIsFullScreenCinema((prev) => !prev);
    }
  };

  const handleCopySummary = () => {
    const summary = [
      'URGENT INTAKE / CASE EVALUATION REQUEST — HBNC CASE 3 (OSINT NEO AI & LEGAL MATRIX)',
      'Parties: Elizabeth Tina Petruccio (DOB 07/29/1964, 62-year-old disabled mother & shelter resident) & Anthony Michael DiMarcello III (DOB 05/04/1983, son, caregiver & federal relator)',
      'Contact: amd949609@gmail.com',
      'Site: Huntington Beach Navigation Center, 17631 Cameron Lane, Huntington Beach, CA 92648 (Operator: Mercy House Living Centers)',
      'Related Federal Action: Knabb v. City of Huntington Beach et al., No. 8:26-cv-00348-JWH-ADS (C.D. Cal.), SAVC ECF 115 / Opp. MTD ECF 130',
      '',
      'CORE EVIDENCE & FORM 700 VOID AB INITIO DEALS:',
      '1. CONTAMINATION & 1-YR CAP WARRANTY: Soil Cr(VI) up to 980 ug/kg (49x DTSC residential screening level). County approved shelter use ONLY so long as an asphalt cover was maintained (navigation_center_003.jpg). City contract Laserfiche #5406552 warranted the 2-inch cap for only 1 year with non-HAZWOPER labor.',
      '2. CAP BREACH (11/07/2023): Corroded bolts breached cap beneath resident beds with raw sub-slab soil on sleeping floor (GPS 33.706389, -117.988611).',
      '3. ICU EXPULSION: Ms. Petruccio admitted 01/12/2024 to Scripps Mercy with empyema (103,752 WBC), sepsis, respiratory failure, intubation, and discitis-osteomyelitis (62 days institutionalized; weight fell 160 lb to 116 lb). Shelter exited her while in ICU under 7-day rule and barred her for 30 days (EHR p. 985).',
      '4. FORM 700 VOID AB INITIO PARALLEL: Mitsuru Yamada trustee ownership on easement UPX1978058 with 0 Form 700 filings paralleling Mayor Harry Sidhu Angel Stadium guilty plea in USA v. Sidhu (8:23-cr-00114-JWH). Thomson v. Call (38 Cal.3d 633) mandates 100% strict disgorgement.',
      '',
      'IMMEDIATE RELIEF SOUGHT: (1) Independent OEM & CIH causation review, (2) Written cap warranty determination, (3) ADA/FHA accommodation enforcement, (4) Legal representation, (5) Housing placement.'
    ].join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      alert('Copied 60-Second Executive Call-to-Action Summary to clipboard! You can paste it into any email or intake form.');
    });
  };

  const handleTestStudioVoice = async () => {
    playCyberChime(0.85);
    const testText =
      'OSINT Neo AI, Live Investigation and Legal Matrix. 17631 Cameron Lane soil tested at 980 micrograms per kilogram of Hexavalent Chromium, 49 times the state residential screening limit. Elizabeth Petruccio and relator Anthony DiMarcello’s primary hospital and contract records are loaded on screen.';

    try {
      const audioUrl = await fetchGeminiNeuralAudio(testText, selectedVoice);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
        return;
      }
    } catch {
      // fallback
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      const voice = getBestVoiceForPersona(selectedVoice, voices);
      const text = normalizeTextForSpeech(testText);
      const utt = new SpeechSynthesisUtterance(text);
      if (voice) utt.voice = voice;
      utt.pitch = 0.92;
      utt.rate = 0.95;
      window.speechSynthesis.speak(utt);
    }
  };

  const handleOpenFileViewer = (filename: string, fileData?: string) => {
    setSelectedFileForModal(filename);
    setSelectedFileDataForModal(fileData || null);
  };

  const handleRoleSelection = (role: 'counsel' | 'agency' | 'physician' | 'public') => {
    if (role === 'counsel') {
      setActiveTab('evidence-law-hybrid');
    } else if (role === 'agency') {
      setActiveTab('maltego');
    } else if (role === 'physician') {
      setActiveTab('master');
      document.getElementById('people-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('screener');
    }
  };

  // Hide top navigation bars and side menu button during Fullscreen Demo Mode so only the data & evidence stage are presented
  const hideTopBarsInFullscreenDemo = isCinematicDemoActive && isFullScreenCinema;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-text relative">
      {/* Hidden file input for webkitdirectory / all file upload */}
      <input
        type="file"
        ref={folderInputRef}
        {...({ webkitdirectory: '', directory: '' } as any)}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            alert(`Live-incorporated ${e.target.files.length} files into the system! Opening the Evidence Locker tab.`);
            setActiveTab('locker');
          }
        }}
      />

      {/* Left Side Command Menu Trigger Button (Hidden during Fullscreen Demo Mode) */}
      {!hideTopBarsInFullscreenDemo && (
        <button
          onClick={() => setIsLeftMenuOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-slate-950/95 hover:bg-slate-900 border-y border-r border-cyan-500/60 text-cyan-300 hover:text-white px-2 py-3.5 rounded-r-xl shadow-2xl backdrop-blur-xl flex flex-col items-center gap-2 transition-all cursor-pointer group ring-1 ring-cyan-500/30"
          title="Open Command Menu (Argon 4, All Tools & Views)"
        >
          <Menu className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-mono font-bold tracking-widest text-cyan-300">
            MENU // ARGON 4
          </span>
        </button>
      )}

      {/* Top Menus: Hidden automatically during Fullscreen Demo Mode */}
      {!hideTopBarsInFullscreenDemo && dockDisplayMode !== 'hidden' && (
        <>
          <Header
            activeTab={activeTab}
            setActiveTab={(t) => setActiveTab(t)}
            onOpenFolderScanner={() => folderInputRef.current?.click()}
            onCopySummary={handleCopySummary}
            onToggleDemoAudio={() => setIsCinematicDemoActive(!isCinematicDemoActive)}
            isDemoAudioPlaying={isCinematicDemoActive && isDemoPlaying}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
          />

          <StreamlinedCommandHud
            activeTab={activeTab}
            onSwitchTab={(t) => setActiveTab(t)}
            onCopySummary={handleCopySummary}
            onTestVoice={handleTestStudioVoice}
            isStreamlinedMode={isStreamlinedMode}
            onToggleStreamlinedMode={() => setIsStreamlinedMode(!isStreamlinedMode)}
            onOpenFileViewer={handleOpenFileViewer}
          />

          {/* Forensic Workspaces & Read-Only / Live Upload Architecture Sub-Bar */}
          <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-slate-500 hidden sm:inline">FORENSIC TOOLS:</span>
              <button
                onClick={() => setActiveTab('evidence-law-hybrid')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'evidence-law-hybrid'
                    ? 'bg-cyan-900 text-cyan-200 border border-cyan-400'
                    : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Evidence-Law Hybrid Viewer</span>
              </button>

              <button
                onClick={() => setActiveTab('maltego')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'maltego'
                    ? 'bg-emerald-900 text-emerald-200 border border-emerald-400'
                    : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Interactive Canvas Maltego Graph</span>
              </button>

              <button
                onClick={() => setActiveTab('void-deals')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'void-deals'
                    ? 'bg-purple-900 text-purple-200 border border-purple-500'
                    : 'text-purple-400 hover:text-purple-300 hover:bg-slate-800'
                }`}
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Form 700 &amp; 2 Void Deals ($320M vs $6.09M)</span>
              </button>

              <button
                onClick={() => setActiveTab('integrations')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'integrations'
                    ? 'bg-indigo-900 text-indigo-200 border border-indigo-400'
                    : 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>3D Subsurface Plume &amp; GIS Hub</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="hidden lg:inline-flex items-center gap-1 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-2 py-0.5 rounded font-bold">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>READ-ONLY / COMMENT-ONLY MASTER</span>
              </span>
              <button
                onClick={() => setActiveTab('locker')}
                className="inline-flex items-center gap-1 bg-amber-950/90 hover:bg-amber-900 border border-amber-500/60 text-amber-300 px-2 py-0.5 rounded font-bold cursor-pointer"
                title="Upload any file, folder, or .ZIP archive to incorporate live into the system"
              >
                <Upload className="w-3 h-3 text-amber-400" />
                <span>Live Upload Any File / .ZIP</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 ${hideTopBarsInFullscreenDemo ? 'pb-4 pt-2' : 'pb-28'}`}>
        {activeTab === 'evidence-law-hybrid' && (
          <EvidenceLawHybridView
            onOpenFileInViewer={handleOpenFileViewer}
            onSwitchToMaltego={() => setActiveTab('maltego')}
            onSwitchToAilaws={() => setActiveTab('ailaws')}
          />
        )}

        {activeTab === 'maltego' && (
          <MaltegoGraphView onOpenFileInViewer={handleOpenFileViewer} />
        )}

        {activeTab === 'master' && (
          <div id="master-record-root" className="max-w-6xl mx-auto px-4 py-6">
            <CallToActionHero
              onSelectRole={handleRoleSelection}
              onOpenActionEmail={() => setActiveTab('screener')}
              onJumpToSection={(id) => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <MasterRecordView
              onOpenFileInViewer={handleOpenFileViewer}
              isStreamlinedMode={isStreamlinedMode}
            />
          </div>
        )}

        {activeTab === 'ailaws' && (
          <AilawsMatrixView onOpenFileInViewer={handleOpenFileViewer} />
        )}

        {activeTab === 'screener' && (
          <VictimScreenerView />
        )}

        {activeTab === 'void-deals' && (
          <VoidAbInitioDealsView />
        )}

        {activeTab === 'outreach' && (
          <OutreachDashboardView />
        )}

        {activeTab === 'osint' && (
          <OsintLibraryView />
        )}

        {activeTab === 'locker' && (
          <EvidenceLockerView onOpenFileInViewer={handleOpenFileViewer} />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsHubView
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
            onOpenFileViewer={handleOpenFileViewer}
          />
        )}
      </main>

      {/* Footer: Hidden automatically during Fullscreen Demo Mode */}
      {!hideTopBarsInFullscreenDemo && (
        <footer className="bg-slate-950 border-t border-slate-800 text-xs text-slate-500 p-6 text-center font-mono">
          <p className="mb-1 text-slate-300">
            <b>https://osintneoai.me &middot; Main Portal for OSINT Neo AI, Live Investigation &amp; Legal Matrix &middot; Read-Only Master + Live .ZIP Incorporation</b>
          </p>
          <p className="mb-1 text-slate-400">
             Prepared by Relator Anthony Michael DiMarcello III and Elizabeth Tina Petruccio &middot; GAO #COMP-26-004512 &middot; FBI #20IC002 &middot; amd949609@gmail.com
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-[11px] text-cyan-400">
            <a href="https://osintneoai.me" className="hover:underline">https://osintneoai.me (Main Site)</a>
            <span>&middot;</span>
            <a href="/architecture.html" className="hover:underline">/architecture.html (Web3 &amp; Sepolia Architecture)</a>
            <span>&middot;</span>
            <a href="/chat/" className="hover:underline">/chat/ (Investigator Workspace)</a>
            <span>&middot;</span>
            <a href="/HBNC_Case_Report.html" className="hover:underline">/HBNC_Case_Report.html (Static Court Report)</a>
            <span>&middot;</span>
            <a href="/ailaws.html" className="hover:underline">/ailaws.html (Standalone Legal Matrix)</a>
          </div>
        </footer>
      )}

      {/* Left Side Command Menu Drawer */}
      <LeftSideCommandMenu
        isOpen={isLeftMenuOpen}
        onClose={() => setIsLeftMenuOpen(false)}
        activeTab={activeTab}
        onSwitchTab={(t) => setActiveTab(t)}
        isDemoActive={isCinematicDemoActive}
        onToggleDemoActive={() => setIsCinematicDemoActive(!isCinematicDemoActive)}
        isDemoPlaying={isDemoPlaying}
        onTogglePlayDemo={() => setIsDemoPlaying(!isDemoPlaying)}
        currentDemoSceneIdx={currentDemoSceneIdx}
        onSelectDemoScene={(idx) => {
          setCurrentDemoSceneIdx(idx);
          setDemoSceneProgress(0);
        }}
        selectedVoice={selectedVoice}
        onChangeVoice={setSelectedVoice}
        onTestVoice={handleTestStudioVoice}
        dockMode={dockDisplayMode}
        onChangeDockMode={setDockDisplayMode}
        isFullScreenCinema={isFullScreenCinema}
        onToggleFullScreen={handleToggleFullScreen}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        selectedAiModel={selectedAiModel}
        onChangeAiModel={setSelectedAiModel}
        onCopySummary={handleCopySummary}
      />

      {/* 10-Act Cinematic Demo Overlay with Synchronized Live Evidence Stage */}
      <CinematicDemoOverlay
        isActive={isCinematicDemoActive}
        onExitDemo={() => setIsCinematicDemoActive(false)}
        currentSceneIndex={currentDemoSceneIdx}
        onSelectScene={(idx) => {
          setCurrentDemoSceneIdx(idx);
          setDemoSceneProgress(0);
        }}
        isPlaying={isDemoPlaying}
        onTogglePlay={() => setIsDemoPlaying(!isDemoPlaying)}
        playbackSpeed={demoPlaybackSpeed}
        onChangeSpeed={setDemoPlaybackSpeed}
        sceneProgress={demoSceneProgress}
        activeAppTab={activeTab}
        onSwitchAppTab={(tab) => setActiveTab(tab)}
        isFullScreenCinema={isFullScreenCinema}
        onToggleFullScreenCinema={handleToggleFullScreen}
        isLooping={isLooping}
        onToggleLooping={() => setIsLooping(!isLooping)}
        onVoiceStateChange={(speaking) => {
          isVoiceSpeakingRef.current = speaking;
        }}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        onOpenFileInViewer={handleOpenFileViewer}
      />

      {/* Modals */}
      <FileViewerModal
        filename={selectedFileForModal}
        fileData={selectedFileDataForModal}
        onClose={() => {
          setSelectedFileForModal(null);
          setSelectedFileDataForModal(null);
        }}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
