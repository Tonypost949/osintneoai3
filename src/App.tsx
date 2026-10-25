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
import { CinematicDemoOverlay } from './components/CinematicDemoOverlay';
import { FileViewerModal } from './components/FileViewerModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { StreamlinedCommandHud } from './components/StreamlinedCommandHud';
import { CINEMATIC_DEMO_SCENES, AppViewportTab } from './data/hbncDemoScript';
import { playCyberChime, normalizeTextForSpeech, getBestVoiceForPersona, fetchGeminiNeuralAudio } from './utils/audioEngine';
import { Scale, ShieldAlert, UserCheck, BarChart3, Database, FolderOpen, Gavel } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppViewportTab | 'void-deals'>('master');
  const [selectedFileForModal, setSelectedFileForModal] = useState<string | null>(null);
  const [selectedFileDataForModal, setSelectedFileDataForModal] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isStreamlinedMode, setIsStreamlinedMode] = useState(true);

  // Cinematic Demo State matching reference app
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
    const totalMs = (scene?.durationMs || 46000) / demoPlaybackSpeed;
    const minRequiredMs = Math.max(30000, totalMs * 0.85);
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
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        setIsFullScreenCinema(true);
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (document.fullscreenElement && document.exitFullscreen) {
        setIsFullScreenCinema(false);
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      setIsFullScreenCinema((prev) => !prev);
    }
  };

  const handleCopySummary = () => {
    const summary = [
      'URGENT INTAKE / CASE EVALUATION REQUEST — HBNC CASE 3',
      'Parties: Elizabeth Tina Petruccio (DOB 07/29/1964, disabled aerospace worker) & Anthony Michael DiMarcello III (DOB 05/04/1983, caregiver)',
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
    const testText = "This is Charon from Gemini Studio Voice. All seven evidentiary acts, Hexavalent Chromium levels at 49 times screening standards, and the two void ab initio public land deals are loaded and ready for judicial review.";

    try {
      const audioUrl = await fetchGeminiNeuralAudio(testText, 'Charon');
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
      const voice = getBestVoiceForPersona('Charon', voices);
      const text = normalizeTextForSpeech(testText);
      const utt = new SpeechSynthesisUtterance(text);
      if (voice) utt.voice = voice;
      utt.pitch = 0.90;
      utt.rate = 0.92;
      window.speechSynthesis.speak(utt);
    }
  };


  const handleOpenFileViewer = (filename: string, fileData?: string) => {
    setSelectedFileForModal(filename);
    setSelectedFileDataForModal(fileData || null);
  };

  const handleRoleSelection = (role: 'counsel' | 'agency' | 'physician' | 'public') => {
    if (role === 'counsel') {
      setActiveTab('ailaws');
    } else if (role === 'agency') {
      setActiveTab('master');
      document.getElementById('site-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (role === 'physician') {
      setActiveTab('master');
      document.getElementById('people-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('screener');
    }
  };

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
            alert(`Selected ${e.target.files.length} files from folder. View them in the Evidence Locker tab!`);
            setActiveTab('locker');
          }
        }}
      />

      {/* Sticky Header with Navigation Tabs */}
      <Header
        activeTab={activeTab === 'void-deals' ? 'master' : activeTab}
        setActiveTab={(t) => setActiveTab(t)}
        onOpenFolderScanner={() => folderInputRef.current?.click()}
        onCopySummary={handleCopySummary}
        onToggleDemoAudio={() => setIsCinematicDemoActive(!isCinematicDemoActive)}
        isDemoAudioPlaying={isCinematicDemoActive && isDemoPlaying}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
      />

      {/* Interactive Streamlined Command HUD */}
      <StreamlinedCommandHud
        activeTab={activeTab}
        onSwitchTab={(t) => setActiveTab(t)}
        onCopySummary={handleCopySummary}
        onTestVoice={handleTestStudioVoice}
        isStreamlinedMode={isStreamlinedMode}
        onToggleStreamlinedMode={() => setIsStreamlinedMode(!isStreamlinedMode)}
        onOpenFileViewer={handleOpenFileViewer}
      />

      {/* Sub-bar with Void Ab Initio Deals Tab button */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="text-slate-500 hidden sm:inline">QUICK CORES:</span>
          <button
            onClick={() => setActiveTab('void-deals')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold transition-all whitespace-nowrap ${
              activeTab === 'void-deals'
                ? 'bg-purple-900 text-purple-200 border border-purple-500'
                : 'text-purple-400 hover:text-purple-300 hover:bg-slate-800'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>Form 700 &amp; 2 Void Ab Initio Deals ($320M vs $6.09M)</span>
          </button>

          <a
            href="/ailaws.html"
            target="_blank"
            className="text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Open Standalone /ailaws.html</span>
          </a>
        </div>

        <div className="text-[11px] text-slate-400 hidden md:block">
          Case Contact: <a href="mailto:amd949609@gmail.com" className="text-emerald-400 hover:underline">amd949609@gmail.com</a>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-32">
        {activeTab === 'master' && (
          <div className="max-w-6xl mx-auto px-4 py-6">
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
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-xs text-slate-500 p-6 text-center font-mono">
        <p className="mb-1 text-slate-400">
          <b>HBNC Case 3 &middot; OSINT Neo AI Command Center &middot; /ailaws Matrix &middot; Outreach Dashboard</b>
        </p>
        <p>
          Prepared by Anthony Michael DiMarcello III and Elizabeth Tina Petruccio &middot; Party-Prepared Evidentiary Archive &middot; amd949609@gmail.com
        </p>
      </footer>

      {/* Cinematic Demo Overlay (matching reference app) */}
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
        activeAppTab={activeTab === 'void-deals' ? 'master' : activeTab}
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
