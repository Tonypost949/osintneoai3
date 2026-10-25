import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Eye,
  EyeOff,
  Repeat,
  Sliders,
  Captions,
  CheckCircle2,
  Scale,
  FolderGit2,
  UserCheck,
  ShieldAlert,
  BarChart3,
  Database,
  FolderOpen,
  Gavel,
  Network,
  Layers,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import {
  CINEMATIC_DEMO_SCENES,
  CinematicSceneConfig,
  AppViewportTab,
  PrimaryExhibitAsset,
} from '../data/hbncDemoScript';
import {
  StudioVoicePersona,
  STUDIO_PERSONAS,
  normalizeTextForSpeech,
  playCyberChime,
  getBestVoiceForPersona,
  fetchGeminiNeuralAudio,
  preloadGeminiNeuralAudio,
} from '../utils/audioEngine';

interface CinematicDemoOverlayProps {
  isActive: boolean;
  onExitDemo: () => void;
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  sceneProgress: number; // 0 to 100
  activeAppTab: AppViewportTab;
  onSwitchAppTab: (tab: AppViewportTab) => void;
  isFullScreenCinema: boolean;
  onToggleFullScreenCinema: () => void;
  isLooping: boolean;
  onToggleLooping: () => void;
  onVoiceStateChange?: (isSpeaking: boolean) => void;
  fontScale?: number;
  onChangeFontScale?: (scale: number) => void;
  onOpenFileInViewer?: (filename: string, fileData?: string) => void;
}

export const CinematicDemoOverlay: React.FC<CinematicDemoOverlayProps> = ({
  isActive,
  onExitDemo,
  currentSceneIndex,
  onSelectScene,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  sceneProgress,
  activeAppTab,
  onSwitchAppTab,
  isFullScreenCinema,
  onToggleFullScreenCinema,
  isLooping,
  onToggleLooping,
  onVoiceStateChange,
  fontScale: externalFontScale = 100,
  onChangeFontScale,
  onOpenFileInViewer,
}) => {
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<StudioVoicePersona>('Charon');
  const [showControlsDrawer, setShowControlsDrawer] = useState<boolean>(false);
  const [demoMenuHidden, setDemoMenuHidden] = useState<boolean>(false);
  const [showClosedCaptions, setShowClosedCaptions] = useState<boolean>(true);
  const [showLiveEvidenceStage, setShowLiveEvidenceStage] = useState<boolean>(true);
  const [manualExhibitIdx, setManualExhibitIdx] = useState<number | null>(null);
  const [internalFontScale, setInternalFontScale] = useState<number>(externalFontScale);
  const [isCurrentlySpeaking, setIsCurrentlySpeaking] = useState<boolean>(false);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);

  const fontScale = externalFontScale !== undefined ? externalFontScale : internalFontScale;
  const scaleFactor = fontScale / 100;
  const totalActs = CINEMATIC_DEMO_SCENES.length; // 10 Acts

  // Automatically hide the bottom demo menu whenever Fullscreen Demo Mode is entered
  useEffect(() => {
    if (isFullScreenCinema) {
      setDemoMenuHidden(true);
      setShowControlsDrawer(false);
    } else {
      setDemoMenuHidden(false);
    }
  }, [isFullScreenCinema]);

  const updateFontScale = (nextScale: number) => {
    const clamped = Math.max(60, Math.min(200, nextScale));
    setInternalFontScale(clamped);
    if (onChangeFontScale) {
      onChangeFontScale(clamped);
    }
  };

  // Movable / Floating Closed Captions (CC) Box State
  const [ccPosition, setCcPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingCc, setIsDraggingCc] = useState<boolean>(false);
  const ccDragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });
  const ccBoxRef = useRef<HTMLDivElement | null>(null);

  const narrationSessionIdRef = useRef<number>(0);
  const postSpeechHoldTimerRef = useRef<number | null>(null);
  const speechKeepAliveIntervalRef = useRef<number | null>(null);

  const scene: CinematicSceneConfig =
    CINEMATIC_DEMO_SCENES[currentSceneIndex] || CINEMATIC_DEMO_SCENES[0];

  // Reset manual exhibit override when Act changes
  useEffect(() => {
    setManualExhibitIdx(null);
  }, [currentSceneIndex]);

  // Draggable CC Box handlers
  useEffect(() => {
    if (!isDraggingCc) return;
    const handleMouseMove = (e: MouseEvent) => {
      const boxW = ccBoxRef.current?.offsetWidth || Math.round(430 * scaleFactor);
      const boxH = ccBoxRef.current?.offsetHeight || Math.round(110 * scaleFactor);
      const nextX = Math.max(8, Math.min(window.innerWidth - boxW - 8, e.clientX - ccDragOffsetRef.current.offsetX));
      const nextY = Math.max(8, Math.min(window.innerHeight - boxH - 8, e.clientY - ccDragOffsetRef.current.offsetY));
      setCcPosition({ x: nextX, y: nextY });
    };
    const handleMouseUp = () => {
      setIsDraggingCc(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCc, scaleFactor]);

  const handleCcMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    ccDragOffsetRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    if (!ccPosition) {
      setCcPosition({ x: rect.left, y: rect.top });
    }
    setIsDraggingCc(true);
  };

  // Safe voice narration teardown
  const stopCurrentAudio = () => {
    narrationSessionIdRef.current += 1;
    if (currentAudioElementRef.current) {
      try {
        currentAudioElementRef.current.pause();
        currentAudioElementRef.current.currentTime = 0;
      } catch {}
      currentAudioElementRef.current = null;
    }
    if (postSpeechHoldTimerRef.current) {
      window.clearTimeout(postSpeechHoldTimerRef.current);
      postSpeechHoldTimerRef.current = null;
    }
    if (speechKeepAliveIntervalRef.current) {
      window.clearInterval(speechKeepAliveIntervalRef.current);
      speechKeepAliveIntervalRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsCurrentlySpeaking(false);
    if (onVoiceStateChange) {
      onVoiceStateChange(false);
    }
  };

  // Browser SpeechSynthesis Fallback with natural neural voice selection
  const playBrowserSpeechFallback = (spokenText: string, sessionId: number) => {
    if (sessionId !== narrationSessionIdRef.current) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      const personaProfile = STUDIO_PERSONAS[selectedVoice] || STUDIO_PERSONAS.Charon;
      const preferredVoice = getBestVoiceForPersona(selectedVoice, voices);

      const sentences =
        spokenText
          .match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g)
          ?.map((s) => s.trim())
          .filter(Boolean) || [spokenText];

      let idx = 0;
      const speakNext = () => {
        if (sessionId !== narrationSessionIdRef.current) return;
        if (idx >= sentences.length) {
          setIsCurrentlySpeaking(false);
          postSpeechHoldTimerRef.current = window.setTimeout(() => {
            if (sessionId !== narrationSessionIdRef.current) return;
            if (onVoiceStateChange) onVoiceStateChange(false);
          }, 2500);
          return;
        }

        const chunk = sentences[idx];
        idx += 1;
        const utterance = new SpeechSynthesisUtterance(chunk);
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = Math.min(1.12, Math.max(0.88, playbackSpeed * personaProfile.rateMultiplier));
        utterance.pitch = personaProfile.pitch;

        utterance.onend = () => {
          if (sessionId !== narrationSessionIdRef.current) return;
          window.setTimeout(speakNext, 100);
        };

        utterance.onerror = (e) => {
          if (sessionId !== narrationSessionIdRef.current) return;
          if (e.error === 'canceled' || e.error === 'interrupted') return;
          speakNext();
        };

        window.speechSynthesis.speak(utterance);
      };

      speakNext();
    } catch {
      setIsCurrentlySpeaking(false);
    }
  };

  // Split a long Act narrative into natural 2-to-3 sentence paragraphs (~360 chars each) so Gemini 3.8 Flash TTS starts speaking within ~1 second and plays the full multi-paragraph Act seamlessly without timeout or truncation
  const splitNarrativeIntoSpeechChunks = (text: string): string[] => {
    const sentences =
      text
        .match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g)
        ?.map((s) => s.trim())
        .filter(Boolean) || [text];

    const chunks: string[] = [];
    let currentChunk = '';
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length + 1 > 390 && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    return chunks.length > 0 ? chunks : [text];
  };

  // High-Definition Studio Voice Narration: Pure Data Narration Only (Never Speaks Voice Descriptions)
  const playStudioNarration = async (rawText: string, sessionId: number) => {
    if (sessionId !== narrationSessionIdRef.current) return;

    const spokenText = normalizeTextForSpeech(rawText);
    const speechChunks = splitNarrativeIntoSpeechChunks(spokenText);

    setIsCurrentlySpeaking(true);
    if (onVoiceStateChange) onVoiceStateChange(true);
    playCyberChime(0.85);

    // Preload next act's first neural audio chunk in background
    const nextIdx = (currentSceneIndex + 1) % CINEMATIC_DEMO_SCENES.length;
    const nextScene = CINEMATIC_DEMO_SCENES[nextIdx];
    if (nextScene) {
      const nextNormalized = normalizeTextForSpeech(`${nextScene.title}. ${nextScene.narrative}`);
      const nextChunks = splitNarrativeIntoSpeechChunks(nextNormalized);
      if (nextChunks[0]) {
        preloadGeminiNeuralAudio(nextChunks[0], selectedVoice);
      }
    }

    // 1. Attempt Gemini 3.8 Flash Neural Studio Audio (24kHz broadcast WAV via backend 5-key pool) across all chunks sequentially
    try {
      for (let i = 0; i < speechChunks.length; i++) {
        if (sessionId !== narrationSessionIdRef.current) return;

        // Pre-fetch chunk i+1 while chunk i is being fetched/played
        if (i + 1 < speechChunks.length) {
          preloadGeminiNeuralAudio(speechChunks[i + 1], selectedVoice);
        }

        const audioUrl = await fetchGeminiNeuralAudio(speechChunks[i], selectedVoice);
        if (!audioUrl || sessionId !== narrationSessionIdRef.current) {
          // If neural chunk fails, play remaining chunks via calibrated browser fallback
          const remainingText = speechChunks.slice(i).join(' ');
          playBrowserSpeechFallback(remainingText, sessionId);
          return;
        }

        await new Promise<void>((resolve, reject) => {
          if (sessionId !== narrationSessionIdRef.current) {
            resolve();
            return;
          }
          const audio = new Audio(audioUrl);
          currentAudioElementRef.current = audio;
          audio.playbackRate = playbackSpeed;

          audio.onended = () => resolve();
          audio.onerror = (err) => reject(err);
          audio.play().catch(reject);
        });
      }

      if (sessionId === narrationSessionIdRef.current) {
        setIsCurrentlySpeaking(false);
        postSpeechHoldTimerRef.current = window.setTimeout(() => {
          if (sessionId !== narrationSessionIdRef.current) return;
          if (onVoiceStateChange) onVoiceStateChange(false);
        }, 2200);
      }
      return;
    } catch (err) {
      console.warn('Gemini Neural Audio playback error, falling back:', err);
    }

    // 2. Fallback to calibrated browser SpeechSynthesis
    if (sessionId === narrationSessionIdRef.current) {
      playBrowserSpeechFallback(spokenText, sessionId);
    }
  };

  const handleTestVoice = (persona: StudioVoicePersona) => {
    setSelectedVoice(persona);
    stopCurrentAudio();
    const sessionId = narrationSessionIdRef.current;
    const testIntro = `17631 Cameron Lane soil tested at 980 micrograms per kilogram of Hexavalent Chromium, 49 times the state residential limit. Elizabeth Petruccio and Anthony DiMarcello's primary hospital and contract exhibits are active on screen.`;
    playStudioNarration(testIntro, sessionId);
  };

  useEffect(() => {
    stopCurrentAudio();
    if (!isActive || !voiceEnabled) return;

    const sessionId = narrationSessionIdRef.current;
    // Speak ONLY the Act Title and Direct Data Narrative (no redundant "Act 06. Act 6:" or voice descriptions)
    const narrationText = `${scene.title}. ${scene.narrative}`;
    playStudioNarration(narrationText, sessionId);

    return () => {
      stopCurrentAudio();
    };
  }, [currentSceneIndex, isActive, voiceEnabled, selectedVoice, playbackSpeed]);

  if (!isActive) return null;

  const handlePrev = () => {
    const prevIdx =
      (currentSceneIndex - 1 + CINEMATIC_DEMO_SCENES.length) % CINEMATIC_DEMO_SCENES.length;
    onSelectScene(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentSceneIndex + 1) % CINEMATIC_DEMO_SCENES.length;
    onSelectScene(nextIdx);
  };

  const buttonSequence = scene.buttonSequence || [];
  const activeButtonIdx =
    buttonSequence.length > 0
      ? Math.min(buttonSequence.length - 1, Math.floor((sceneProgress / 100) * buttonSequence.length))
      : 0;

  // Determine which primary exhibit in the current Act is actively spotlighted
  const primaryExhibits: PrimaryExhibitAsset[] = scene.primaryExhibits || [];
  const autoExhibitIdx =
    primaryExhibits.length > 0
      ? Math.min(
          primaryExhibits.length - 1,
          Math.floor((sceneProgress / 100) * primaryExhibits.length)
        )
      : 0;
  const activeExhibitIdx =
    manualExhibitIdx !== null && manualExhibitIdx < primaryExhibits.length
      ? manualExhibitIdx
      : autoExhibitIdx;
  const currentExhibit: PrimaryExhibitAsset | undefined = primaryExhibits[activeExhibitIdx];

  const demoBoxBaseFontPx = Math.max(7.5, Math.round(12 * scaleFactor * 10) / 10);
  const defaultCcLeft = 18;
  const defaultCcTop = isFullScreenCinema ? 18 : 122;
  const stageTopPx = isFullScreenCinema ? '18px' : '122px';

  // Hide bottom demo menu when either `demoMenuHidden` OR `isFullScreenCinema` is active (unless user explicitly opened it)
  const isBottomMenuHidden = demoMenuHidden;

  return (
    <>
      {/* Subtle Widescreen Vignette, Floating CC Box & Live Synchronized Primary Evidence Stage */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        <div className="w-full h-full shadow-[inset_0_0_80px_rgba(2,6,23,0.75)]" />

        {/* LEFT: Floating & Movable Closed Captions (CC) Box */}
        {showClosedCaptions && (
          <div
            ref={ccBoxRef}
            onMouseDown={handleCcMouseDown}
            title="Drag anywhere on this Closed Captions box to move and float it around the screen"
            style={{
              width: `min(92vw, ${Math.round(420 * scaleFactor)}px)`,
              left: ccPosition ? `${ccPosition.x}px` : `${defaultCcLeft}px`,
              top: ccPosition ? `${ccPosition.y}px` : `${defaultCcTop}px`,
              padding: `${Math.max(6, Math.round(10 * scaleFactor))}px ${Math.max(8, Math.round(14 * scaleFactor))}px`,
              borderRadius: `${Math.max(8, Math.round(12 * scaleFactor))}px`,
            }}
            className={`pointer-events-auto fixed z-40 bg-slate-950/92 hover:bg-slate-950/96 border ${
              isDraggingCc
                ? 'border-cyan-400 ring-2 ring-cyan-500/30 cursor-grabbing'
                : 'border-slate-800 hover:border-slate-700 cursor-grab'
            } shadow-2xl backdrop-blur-md text-slate-100 select-none transition-[width,padding,top] duration-200`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                DATA CAPTIONS // ACT {scene.actNumber} OF {totalActs} &middot; {scene.subtitle}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">Drag to Move</span>
            </div>
            <p
              style={{
                fontSize: `${Math.max(8, Math.round(12.2 * scaleFactor * 10) / 10)}px`,
                lineHeight: 1.48,
              }}
              className="text-slate-100 font-serif leading-relaxed"
            >
              {scene.narrative}
            </p>
          </div>
        )}

        {/* RIGHT: Synchronized Primary Evidence Stage (Displays Actual Exhibits, Metrics & Controlling Statutes for Each Act) */}
        {showLiveEvidenceStage && currentExhibit && (
          <div
            style={{
              width: `min(92vw, ${Math.round(430 * scaleFactor)}px)`,
              top: stageTopPx,
              right: '18px',
            }}
            className="pointer-events-auto fixed z-40 bg-slate-950/95 border-2 border-cyan-500/70 rounded-xl shadow-2xl backdrop-blur-md text-slate-100 overflow-hidden transition-all duration-300"
          >
            {/* Stage Header */}
            <div className="px-3.5 py-2 bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
                <span className="text-[10px] font-mono font-extrabold text-cyan-300 uppercase tracking-wider truncate">
                  PRIMARY EVIDENCE // ACT {scene.actNumber} OF {totalActs}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {primaryExhibits.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => setManualExhibitIdx(idx)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer ${
                      idx === activeExhibitIdx
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={ex.label}
                  >
                    #{idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setShowLiveEvidenceStage(false)}
                  className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer ml-1"
                  title="Minimize Live Exhibit Stage"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Key Data Metrics Bar for Current Act */}
            {scene.metrics && scene.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 px-3 pt-2.5 pb-1 bg-slate-950/90 border-b border-slate-900">
                {scene.metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="bg-slate-900/90 border border-slate-800 rounded px-2 py-1"
                  >
                    <div className="text-[8.5px] font-mono uppercase text-slate-400 truncate">
                      {m.label}
                    </div>
                    <div className="text-[10.5px] font-mono font-extrabold text-cyan-300 truncate">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Primary Exhibit Visual Preview */}
            <div className="p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {currentExhibit.label}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/90 text-red-300 border border-red-700/60 font-bold shrink-0">
                  {currentExhibit.dateOrCitation}
                </span>
              </div>

              {currentExhibit.type === 'image' ? (
                <div
                  onClick={() =>
                    onOpenFileInViewer &&
                    onOpenFileInViewer(currentExhibit.filename, currentExhibit.url)
                  }
                  className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 mb-2 cursor-pointer group"
                >
                  <img
                    src={currentExhibit.url}
                    alt={currentExhibit.label}
                    className="w-full h-44 object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-950/90 border border-cyan-500/60 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>Click to Inspect Full Record</span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() =>
                    onOpenFileInViewer &&
                    onOpenFileInViewer(currentExhibit.filename, currentExhibit.url)
                  }
                  className="p-3 rounded-lg border border-cyan-800/60 bg-slate-900/90 mb-2 cursor-pointer hover:border-cyan-400 transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 mb-1">
                    <span className="flex items-center gap-1 font-bold">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      {currentExhibit.filename}
                    </span>
                    <span className="underline">Open Full Document &rarr;</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono line-clamp-3">
                    {currentExhibit.caption}
                  </p>
                </div>
              )}

              {/* Caption & Verbatim Quote */}
              <p className="text-[11px] text-slate-300 leading-snug mb-1.5">
                {currentExhibit.caption}
              </p>
              {currentExhibit.keyQuote && (
                <div className="p-2 rounded bg-slate-900/95 border-l-2 border-amber-400 text-[10.5px] font-serif italic text-amber-200 mb-2">
                  {currentExhibit.keyQuote}
                </div>
              )}

              {/* Controlling Statutes Strip for Current Act */}
              {scene.controllingStatutes && scene.controllingStatutes.length > 0 && (
                <div className="pt-1.5 border-t border-slate-800/90">
                  <div className="text-[9.5px] font-mono uppercase text-slate-400 font-bold mb-1">
                    CONTROLLING STATUTES (ACT {scene.actNumber}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {scene.controllingStatutes.map((st, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 py-0.5 rounded bg-slate-900 border border-amber-500/40 text-amber-300 text-[9.5px] font-mono"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* When Fullscreen Cinema OR Demo Menu Hidden is active: minimal subtle hover pill in bottom-right corner */}
      {isBottomMenuHidden ? (
        <div
          style={{ fontSize: `${demoBoxBaseFontPx}px` }}
          className="fixed bottom-2 right-2 z-40 flex items-center gap-1.5 opacity-25 hover:opacity-100 transition-opacity duration-200"
        >
          {isFullScreenCinema && (
            <button
              onClick={onToggleFullScreenCinema}
              className="px-2.5 py-1 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-amber-500/50 text-amber-200 text-[11px] font-mono font-bold flex items-center gap-1 shadow-xl backdrop-blur-md cursor-pointer"
              title="Exit Fullscreen Cinema (Restores Top & Demo Menus)"
            >
              <Minimize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Exit Fullscreen</span>
            </button>
          )}
          <button
            onClick={() => setDemoMenuHidden(false)}
            className="px-2.5 py-1 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/50 text-cyan-200 text-[11px] font-mono font-bold flex items-center gap-1 shadow-xl backdrop-blur-md cursor-pointer"
            title="Show Demo Controls Menu"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Controls (Act {scene.actNumber}/{totalActs})</span>
          </button>
        </div>
      ) : (
        /* Bottom Demo Box (Mini-Player & Fullsize Controls Drawer) */
        <div
          style={{
            fontSize: `${demoBoxBaseFontPx}px`,
            width: showControlsDrawer ? `min(96vw, ${Math.round(940 * scaleFactor)}px)` : 'auto',
            maxWidth: '96vw',
          }}
          className="fixed bottom-2.5 left-1/2 -translate-x-1/2 z-40 transition-all duration-200"
        >
          <div
            style={{ borderRadius: `${Math.max(10, Math.round(16 * scaleFactor))}px` }}
            className="bg-slate-950/92 hover:bg-slate-950/96 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-slate-100 overflow-hidden transition-all duration-200"
          >
            {/* Progress Hairline */}
            <div
              style={{ height: `${Math.max(3, Math.round(4 * scaleFactor))}px` }}
              className="w-full bg-slate-900 relative overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-cyan-500 transition-all duration-200"
                style={{ width: `${sceneProgress}%` }}
              />
            </div>

            {/* 10-Act Scrubber Strip + Instant Viewport Switcher */}
            <div className="px-[0.9em] py-[0.35em] bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-[0.5em] overflow-x-auto">
              <div className="flex items-center gap-[0.25em] overflow-x-auto">
                <span className="text-[0.78em] font-mono text-slate-400 uppercase font-bold mr-[0.2em] shrink-0">
                  Acts:
                </span>
                {CINEMATIC_DEMO_SCENES.map((s, idx) => {
                  const isCurrent = idx === currentSceneIndex;
                  const isPast = idx < currentSceneIndex;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectScene(idx)}
                      title={`Act ${s.actNumber}: ${s.title}`}
                      className={`px-[0.5em] py-[0.15em] rounded text-[0.8em] font-mono font-bold transition-all cursor-pointer shrink-0 ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300 shadow'
                          : isPast
                          ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {s.actNumber}
                    </button>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center gap-[0.35em] shrink-0 text-[0.78em] font-mono">
                <span className="px-[0.5em] py-[0.15em] rounded bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold">
                  🔒 Read-Only Master &middot; Live .ZIP Upload Active
                </span>
              </div>
            </div>

            {/* Single-Row Mini-Player Bar */}
            <div className="px-[0.95em] py-[0.5em] flex flex-wrap items-center justify-between gap-[0.65em]">
              {/* Act Badge & Short Title */}
              <div className="flex items-center gap-[0.55em] min-w-0">
                <span className="px-[0.5em] py-[0.18em] rounded bg-red-950/90 border border-red-500/40 text-red-300 text-[0.84em] font-mono font-bold shrink-0">
                  ACT {scene.actNumber}/{totalActs}
                </span>
                <span
                  style={{ maxWidth: `min(52vw, ${Math.round(240 * scaleFactor)}px)` }}
                  className="text-[1em] font-bold text-white truncate"
                >
                  {scene.title}
                </span>
              </div>

              {/* Mini-Player Transport & Controls */}
              <div className="flex flex-wrap items-center gap-[0.45em] shrink-0">
                <button
                  onClick={handlePrev}
                  className="p-[0.45em] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                  title="Previous Act"
                >
                  <SkipBack className="w-[1.1em] h-[1.1em]" />
                </button>

                <button
                  onClick={onTogglePlay}
                  className={`px-[0.75em] py-[0.45em] rounded-lg font-bold text-[0.95em] flex items-center gap-[0.35em] transition-all cursor-pointer ${
                    isPlaying ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                  title={isPlaying ? 'Pause Presentation' : 'Resume Presentation'}
                >
                  {isPlaying ? (
                    <Pause className="w-[1.1em] h-[1.1em] fill-current" />
                  ) : (
                    <Play className="w-[1.1em] h-[1.1em] fill-current" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-[0.45em] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                  title="Next Act"
                >
                  <SkipForward className="w-[1.1em] h-[1.1em]" />
                </button>

                {/* Voice Mute / Unmute Button & Equalizer */}
                <div className="flex items-center gap-[0.3em]">
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`px-[0.65em] py-[0.35em] rounded-lg border text-[0.9em] font-mono font-bold flex items-center gap-[0.35em] transition-all cursor-pointer ${
                      voiceEnabled
                        ? 'bg-emerald-950/90 hover:bg-emerald-900 border-emerald-500/70 text-emerald-200'
                        : 'bg-rose-950/90 hover:bg-rose-900 border-rose-500/70 text-rose-200'
                    }`}
                    title={voiceEnabled ? 'Mute Narrator Voice' : 'Unmute Narrator Voice'}
                  >
                    {voiceEnabled ? (
                      <Volume2 className="w-[1.1em] h-[1.1em] text-emerald-300 shrink-0" />
                    ) : (
                      <VolumeX className="w-[1.1em] h-[1.1em] text-rose-300 shrink-0" />
                    )}
                    <span>{voiceEnabled ? 'Voice ON' : 'Muted'}</span>
                  </button>

                  {/* Live Equalizer + Studio Neural Voice Selector */}
                  {voiceEnabled && (
                    <div className="hidden sm:flex items-center gap-[0.35em] bg-slate-900 border border-slate-800 px-[0.55em] py-[0.25em] rounded-lg">
                      <div className="flex items-end gap-[2px] h-[1em] px-[0.1em]" title={isCurrentlySpeaking ? 'Studio Neural Voice speaking' : 'Speech idle'}>
                        <span className={`w-[2px] rounded-full bg-cyan-400 transition-all ${isCurrentlySpeaking ? 'animate-bounce h-[0.9em]' : 'h-[0.25em] opacity-40'}`} style={{ animationDuration: '0.6s' }} />
                        <span className={`w-[2px] rounded-full bg-cyan-300 transition-all ${isCurrentlySpeaking ? 'animate-bounce h-[0.6em]' : 'h-[0.4em] opacity-40'}`} style={{ animationDuration: '0.45s' }} />
                        <span className={`w-[2px] rounded-full bg-amber-400 transition-all ${isCurrentlySpeaking ? 'animate-bounce h-[1em]' : 'h-[0.2em] opacity-40'}`} style={{ animationDuration: '0.7s' }} />
                        <span className={`w-[2px] rounded-full bg-red-400 transition-all ${isCurrentlySpeaking ? 'animate-bounce h-[0.8em]' : 'h-[0.3em] opacity-40'}`} style={{ animationDuration: '0.5s' }} />
                        <span className={`w-[2px] rounded-full bg-emerald-400 transition-all ${isCurrentlySpeaking ? 'animate-bounce h-[0.7em]' : 'h-[0.2em] opacity-40'}`} style={{ animationDuration: '0.65s' }} />
                      </div>

                      <span className="text-[0.85em] font-mono font-bold text-amber-300 shrink-0">
                        {STUDIO_PERSONAS[selectedVoice]?.label.split(' ')[0] || 'Charon'}
                      </span>

                      <button
                        onClick={() => handleTestVoice(selectedVoice)}
                        className="px-[0.45em] py-[0.15em] rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-[0.8em] font-mono text-cyan-200 hover:text-white cursor-pointer transition-all shrink-0"
                        title="Test Gemini 3.8 Flash Studio Neural Voice"
                      >
                        🔊 Test
                      </button>
                    </div>
                  )}
                </div>

                {/* Live Evidence Stage Toggle */}
                <button
                  onClick={() => setShowLiveEvidenceStage(!showLiveEvidenceStage)}
                  className={`px-[0.65em] py-[0.35em] rounded-lg border text-[0.9em] font-mono font-bold flex items-center gap-[0.35em] transition-all cursor-pointer ${
                    showLiveEvidenceStage
                      ? 'bg-cyan-950/90 hover:bg-cyan-900 border-cyan-400/70 text-cyan-200'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Toggle Synchronized Primary Evidence Stage"
                >
                  <ImageIcon className="w-[1.1em] h-[1.1em] shrink-0" />
                  <span>{showLiveEvidenceStage ? 'Exhibits ON' : 'Exhibits OFF'}</span>
                </button>

                {/* Closed Captions Toggle */}
                <button
                  onClick={() => setShowClosedCaptions(!showClosedCaptions)}
                  className={`px-[0.65em] py-[0.35em] rounded-lg border text-[0.9em] font-mono font-bold flex items-center gap-[0.35em] transition-all cursor-pointer ${
                    showClosedCaptions
                      ? 'bg-amber-950/90 hover:bg-amber-900 border-amber-400/70 text-amber-200'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title={showClosedCaptions ? 'Hide Floating CC Box' : 'Show Floating CC Box'}
                >
                  <Captions className="w-[1.1em] h-[1.1em] shrink-0" />
                  <span>{showClosedCaptions ? 'CC ON' : 'CC OFF'}</span>
                </button>

                {/* Font Size A- / % / A+ */}
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden text-[0.9em] font-mono">
                  <button
                    onClick={() => updateFontScale(fontScale - 15)}
                    className="px-[0.55em] py-[0.35em] hover:bg-slate-800 text-slate-200 hover:text-cyan-300 font-extrabold cursor-pointer border-r border-slate-800"
                    title="Smaller Text"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => updateFontScale(100)}
                    className="px-[0.45em] py-[0.35em] hover:bg-slate-800 text-cyan-300 font-bold cursor-pointer border-r border-slate-800"
                    title="Reset Font Size"
                  >
                    {fontScale}%
                  </button>
                  <button
                    onClick={() => updateFontScale(fontScale + 15)}
                    className="px-[0.55em] py-[0.35em] hover:bg-slate-800 text-slate-200 hover:text-cyan-300 font-extrabold cursor-pointer"
                    title="Bigger Text"
                  >
                    A+
                  </button>
                </div>

                {/* Fullscreen Button (Hides Top Menu & Demo Menu Automatically) */}
                <button
                  onClick={onToggleFullScreenCinema}
                  className="px-[0.65em] py-[0.35em] rounded-lg border bg-cyan-950 hover:bg-cyan-900 border-cyan-400 text-cyan-200 text-[0.9em] font-mono font-bold flex items-center gap-[0.35em] cursor-pointer"
                  title="Fullscreen Presentation (Hides Top Menu & Demo Menu)"
                >
                  <Maximize2 className="w-[1.1em] h-[1.1em] text-cyan-300 shrink-0" />
                  <span className="hidden md:inline">{isFullScreenCinema ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>

                {/* Toggle Mini / Fullsize */}
                <button
                  onClick={() => setShowControlsDrawer(!showControlsDrawer)}
                  className={`px-[0.65em] py-[0.35em] rounded-lg border text-[0.9em] font-mono flex items-center gap-[0.35em] cursor-pointer ${
                    showControlsDrawer
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                  title="Toggle Fullsize Director Controls"
                >
                  <Sliders className="w-[1.1em] h-[1.1em] text-cyan-400 shrink-0" />
                  <span className="hidden md:inline">{showControlsDrawer ? 'Mini' : 'Director'}</span>
                </button>

                {/* Hide Menu */}
                <button
                  onClick={() => setDemoMenuHidden(true)}
                  className="px-[0.65em] py-[0.35em] rounded-lg border bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-200 text-[0.9em] font-mono flex items-center gap-[0.35em] cursor-pointer"
                  title="Hide Demo Menu"
                >
                  <EyeOff className="w-[1.1em] h-[1.1em] text-amber-300 shrink-0" />
                  <span className="hidden sm:inline">Hide</span>
                </button>

                <button
                  onClick={onExitDemo}
                  className="p-[0.45em] rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/50 cursor-pointer"
                  title="Exit Demo"
                >
                  <X className="w-[1.1em] h-[1.1em]" />
                </button>
              </div>
            </div>

            {/* Expanded Fullsize Director Controls Drawer */}
            {showControlsDrawer && (
              <div className="px-[1em] py-[0.75em] bg-slate-950 border-t border-slate-800 space-y-[0.65em]">
                {/* Active Button Sequence Strip */}
                {buttonSequence.length > 0 && (
                  <div className="flex flex-wrap items-center gap-[0.4em]">
                    <span className="text-[0.84em] font-mono uppercase text-amber-400 font-bold mr-[0.25em]">
                      Act Data Points:
                    </span>
                    {buttonSequence.map((btnLabel, idx) => {
                      const isCurrentBtn = idx === activeButtonIdx;
                      const isDoneBtn = idx < activeButtonIdx;
                      return (
                        <span
                          key={idx}
                          className={`px-[0.55em] py-[0.2em] rounded text-[0.84em] font-mono flex items-center gap-[0.3em] ${
                            isCurrentBtn
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : isDoneBtn
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {isDoneBtn && <CheckCircle2 className="w-[0.95em] h-[0.95em] text-emerald-400 shrink-0" />}
                          <span>{btnLabel}</span>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* 10-Act Scrubber Strip */}
                <div className="flex items-center justify-between gap-[0.6em] overflow-x-auto py-[0.15em]">
                  <div className="flex items-center gap-[0.3em] overflow-x-auto">
                    {CINEMATIC_DEMO_SCENES.map((s, idx) => {
                      const isCurrent = idx === currentSceneIndex;
                      const isPast = idx < currentSceneIndex;
                      return (
                        <button
                          key={s.id}
                          onClick={() => onSelectScene(idx)}
                          title={`Act ${s.actNumber}: ${s.title}`}
                          className={`px-[0.55em] py-[0.2em] rounded text-[0.84em] font-mono font-bold transition-all cursor-pointer shrink-0 ${
                            isCurrent
                              ? 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300'
                              : isPast
                              ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Act {s.actNumber}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-[0.4em] shrink-0 text-[0.84em] font-mono text-slate-400">
                    <FolderGit2 className="w-[1em] h-[1em] text-cyan-400 shrink-0" />
                    <span className="truncate select-all">{scene.evidencePath}</span>
                  </div>
                </div>

                {/* Controls Row: Viewport Tabs & Studio Voice Personas */}
                <div className="flex flex-wrap items-center justify-between gap-[0.5em] pt-[0.35em] border-t border-slate-900">
                  <div className="flex flex-wrap items-center gap-[0.35em]">
                    {(
                      [
                        { id: 'evidence-law-hybrid', label: 'Evidence-Law Hybrid', icon: Layers },
                        { id: 'maltego', label: 'Maltego Graph', icon: Network },
                        { id: 'master', label: 'Master Record', icon: ShieldAlert },
                        { id: 'ailaws', label: '/ailaws Matrix', icon: Scale },
                        { id: 'void-deals', label: '2 Void Deals', icon: Gavel },
                        { id: 'screener', label: 'Victim Screener', icon: UserCheck },
                        { id: 'outreach', label: 'Outreach (184)', icon: BarChart3 },
                        { id: 'osint', label: 'OSINT (31)', icon: Database },
                        { id: 'locker', label: 'Evidence Locker', icon: FolderOpen },
                      ] as const
                    ).map((vp) => {
                      const Icon = vp.icon;
                      const isCurr = activeAppTab === vp.id;
                      return (
                        <button
                          key={vp.id}
                          onClick={() => onSwitchAppTab(vp.id)}
                          className={`px-[0.55em] py-[0.25em] rounded text-[0.84em] font-medium flex items-center gap-[0.3em] cursor-pointer ${
                            isCurr ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Icon className="w-[1em] h-[1em] shrink-0" />
                          <span>{vp.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-[0.4em]">
                    <button
                      onClick={onToggleLooping}
                      className={`px-[0.55em] py-[0.2em] rounded border text-[0.84em] font-mono flex items-center gap-[0.3em] cursor-pointer ${
                        isLooping ? 'bg-cyan-950 border-cyan-500/60 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Repeat className="w-[1em] h-[1em] shrink-0" />
                      <span>{isLooping ? 'Loop ON' : 'Loop OFF'}</span>
                    </button>

                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-[0.15em] text-[0.84em] font-mono">
                      {[
                        { val: 0.75, label: '0.75x' },
                        { val: 1, label: '1x' },
                        { val: 1.15, label: '1.15x' },
                      ].map((spd) => (
                        <button
                          key={spd.val}
                          onClick={() => onChangeSpeed(spd.val)}
                          className={`px-[0.45em] py-[0.15em] rounded cursor-pointer ${
                            playbackSpeed === spd.val ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {spd.label}
                        </button>
                      ))}
                    </div>

                    {voiceEnabled && (
                      <div className="flex items-center gap-[0.35em]">
                        <span className="text-[0.8em] font-mono text-slate-400 hidden lg:inline">Voice:</span>
                        <div className="flex items-center gap-[0.25em]">
                          {(['Charon', 'Fenrir', 'Kore', 'Aoede', 'Zephyr'] as const).map((p) => {
                            const isP = selectedVoice === p;
                            return (
                              <button
                                key={p}
                                onClick={() => handleTestVoice(p)}
                                className={`px-[0.45em] py-[0.15em] rounded text-[0.8em] font-mono cursor-pointer transition-all ${
                                  isP
                                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                }`}
                                title={`Switch Studio Voice to ${STUDIO_PERSONAS[p].label}`}
                              >
                                {p}
                              </button>
                            );
                          })}
                        </div>
                        <select
                          value={selectedVoice}
                          onChange={(e) => handleTestVoice(e.target.value as StudioVoicePersona)}
                          className="bg-slate-900 text-emerald-300 text-[0.84em] font-mono px-[0.45em] py-[0.2em] rounded border border-slate-700 outline-none cursor-pointer"
                        >
                          {Object.values(STUDIO_PERSONAS).map((v) => (
                            <option key={v.id} value={v.id} className="bg-slate-950 text-slate-100">
                              {v.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
