import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
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
  Mic,
  Sparkles
} from 'lucide-react';
import { CINEMATIC_DEMO_SCENES, CinematicSceneConfig, AppViewportTab } from '../data/hbncDemoScript';
import {
  StudioVoicePersona,
  STUDIO_PERSONAS,
  normalizeTextForSpeech,
  prepareTextForStudioAudio,
  playCyberChime,
  getBestVoiceForPersona,
  fetchGeminiNeuralAudio,
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
  onOpenFileViewer?: (filename: string) => void;
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
  onOpenFileViewer,
}) => {
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<StudioVoicePersona>('Charon');
  const [showControlsDrawer, setShowControlsDrawer] = useState<boolean>(false);
  const [demoMenuHidden, setDemoMenuHidden] = useState<boolean>(false);
  const [showClosedCaptions, setShowClosedCaptions] = useState<boolean>(true);
  const [internalFontScale, setInternalFontScale] = useState<number>(externalFontScale);
  const [isCurrentlySpeaking, setIsCurrentlySpeaking] = useState<boolean>(false);
  const [activeSpeechSnippet, setActiveSpeechSnippet] = useState<string>('');
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);

  const fontScale = externalFontScale !== undefined ? externalFontScale : internalFontScale;
  const scaleFactor = fontScale / 100;

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
  const controlsFadeTimerRef = useRef<number | null>(null);

  const scene: CinematicSceneConfig =
    CINEMATIC_DEMO_SCENES[currentSceneIndex] || CINEMATIC_DEMO_SCENES[0];

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
    setActiveSpeechSnippet('');
    if (onVoiceStateChange) {
      onVoiceStateChange(false);
    }
  };

  // Browser SpeechSynthesis Fallback with measured deep cadence
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
          setActiveSpeechSnippet('Narration complete · Holding act');
          postSpeechHoldTimerRef.current = window.setTimeout(() => {
            if (sessionId !== narrationSessionIdRef.current) return;
            if (onVoiceStateChange) onVoiceStateChange(false);
          }, 3500);
          return;
        }

        const chunk = sentences[idx];
        idx += 1;
        setActiveSpeechSnippet(chunk);
        const utterance = new SpeechSynthesisUtterance(chunk);
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = Math.min(1.15, Math.max(0.85, playbackSpeed * personaProfile.rateMultiplier));
        utterance.pitch = personaProfile.pitch;

        utterance.onend = () => {
          if (sessionId !== narrationSessionIdRef.current) return;
          window.setTimeout(speakNext, 120);
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

  // High-Quality Studio Voice Narration: Gemini Neural TTS First, Fallback Second
  const playStudioNarration = async (rawText: string, sessionId: number) => {
    if (sessionId !== narrationSessionIdRef.current) return;

    const spokenText = normalizeTextForSpeech(rawText);
    setIsCurrentlySpeaking(true);
    setActiveSpeechSnippet(spokenText.slice(0, 80) + '...');
    if (onVoiceStateChange) onVoiceStateChange(true);
    playCyberChime(0.85);

    // 1. Attempt Gemini Studio Neural Audio Generation (Real 24kHz broadcast WAV via backend API)
    try {
      const audioUrl = await fetchGeminiNeuralAudio(spokenText, selectedVoice);
      if (audioUrl && sessionId === narrationSessionIdRef.current) {
        const audio = new Audio(audioUrl);
        currentAudioElementRef.current = audio;
        audio.playbackRate = playbackSpeed;

        audio.onended = () => {
          if (sessionId !== narrationSessionIdRef.current) return;
          setIsCurrentlySpeaking(false);
          setActiveSpeechSnippet('Studio Narration complete · Holding act');
          postSpeechHoldTimerRef.current = window.setTimeout(() => {
            if (sessionId !== narrationSessionIdRef.current) return;
            if (onVoiceStateChange) onVoiceStateChange(false);
          }, 3000);
        };

        audio.onerror = () => {
          if (sessionId !== narrationSessionIdRef.current) return;
          setIsCurrentlySpeaking(false);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('Gemini Neural Audio playback error:', err);
    }

    // Do NOT play robotic browser speech; hold gracefully
    setIsCurrentlySpeaking(false);
  };

  const handleTestVoice = (persona: StudioVoicePersona) => {
    setSelectedVoice(persona);
    stopCurrentAudio();
    const sessionId = narrationSessionIdRef.current;
    const testIntro = `This is ${STUDIO_PERSONAS[persona].label}. All nine evidentiary acts, Hexavalent Chromium levels at 49 times screening standards, and the two void ab initio public land deals are loaded and ready for judicial review.`;
    playStudioNarration(testIntro, sessionId);
  };

  // Prefetch all acts audio into memory cache on mount / voice change
  useEffect(() => {
    CINEMATIC_DEMO_SCENES.forEach((sc) => {
      const txt = prepareTextForStudioAudio(sc.actNumber, sc.title, sc.narrative);
      fetchGeminiNeuralAudio(txt, selectedVoice).catch(() => {});
    });
  }, [selectedVoice]);

  useEffect(() => {
    stopCurrentAudio();
    if (!isActive || !voiceEnabled) return;

    const sessionId = narrationSessionIdRef.current;
    const narrationText = prepareTextForStudioAudio(scene.actNumber, scene.title, scene.narrative);
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

  const demoBoxBaseFontPx = Math.max(7.5, Math.round(12 * scaleFactor * 10) / 10);
  const defaultCcLeft = 20;
  const defaultCcTop = 125;

  return (
    <>
      {/* Subtle Widescreen Vignette & Floating Draggable Closed Captions (CC) Box */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        <div className="w-full h-full shadow-[inset_0_0_80px_rgba(2,6,23,0.8)]" />

        {/* Floating & Movable Closed Captions (CC) Box */}
        {showClosedCaptions && (
          <div
            ref={ccBoxRef}
            onMouseDown={handleCcMouseDown}
            title="Drag anywhere on this Closed Captions box to move and float it around the screen"
            style={{
              width: `min(94vw, ${Math.round(440 * scaleFactor)}px)`,
              left: ccPosition ? `${ccPosition.x}px` : `${defaultCcLeft}px`,
              top: ccPosition ? `${ccPosition.y}px` : `${defaultCcTop}px`,
              padding: `${Math.max(6, Math.round(10 * scaleFactor))}px ${Math.max(8, Math.round(14 * scaleFactor))}px`,
              borderRadius: `${Math.max(8, Math.round(12 * scaleFactor))}px`,
            }}
            className={`pointer-events-auto fixed z-40 bg-slate-950/90 hover:bg-slate-950/95 border ${
              isDraggingCc ? 'border-cyan-400 ring-2 ring-cyan-500/30 cursor-grabbing' : 'border-slate-800 hover:border-slate-700 cursor-grab'
            } shadow-2xl backdrop-blur-md text-slate-100 select-none transition-[width,padding] duration-200`}
          >
            <p
              style={{
                fontSize: `${Math.max(9, Math.round(13 * scaleFactor * 10) / 10)}px`,
                lineHeight: 1.55,
              }}
              className="text-slate-100 font-serif leading-relaxed"
            >
              {scene.narrative}
            </p>

            {/* Live Exhibit Link During Demo */}
            {scene.evidenceModalTarget && (
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenFileViewer) {
                      onOpenFileViewer(scene.evidenceModalTarget!);
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-red-950/90 hover:bg-red-900 border border-red-500/60 text-red-200 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  title={`Open exhibit: ${scene.evidenceModalTarget}`}
                >
                  <FolderOpen className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="truncate max-w-[220px]">Exhibit: {scene.evidenceModalTarget}</span>
                  <span className="text-amber-300 ml-1">&rarr;</span>
                </button>
                <span className="text-[10px] text-slate-500 font-mono">Act {scene.actNumber}/09</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Exit Fullscreen Button in Cinema Mode */}
      {isFullScreenCinema && (
        <button
          onClick={onToggleFullScreenCinema}
          className="fixed top-3 right-3 z-50 px-3.5 py-1.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-mono backdrop-blur-md shadow-2xl flex items-center gap-1.5 transition-all cursor-pointer ring-1 ring-white/10"
          title="Exit Fullscreen (or press Esc)"
        >
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Exit Fullscreen (Esc)</span>
        </button>
      )}

      {/* Bottom Demo Controls - Completely omitted in Fullscreen mode per user directive */}
      {!isFullScreenCinema && (
        demoMenuHidden ? (
          <div
            style={{ fontSize: `${demoBoxBaseFontPx}px` }}
            className="fixed bottom-2.5 right-3 z-40 flex items-center gap-[0.45em]"
          >
            <button
              onClick={() => setDemoMenuHidden(false)}
              className="px-[0.95em] py-[0.5em] rounded-full bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/50 text-cyan-200 text-[0.92em] font-mono font-bold flex items-center gap-[0.45em] shadow-2xl backdrop-blur-md cursor-pointer transition-all"
              title="Show Demo Controls Menu"
            >
              <Eye className="w-[1.15em] h-[1.15em] text-cyan-400 shrink-0" />
              <span>Show Demo Menu (Act {scene.actNumber}/09)</span>
            </button>
          </div>
        ) : (
          /* Bottom Demo Box (Mini-Player & Fullsize Controls Drawer) */
          <div
            style={{
              fontSize: `${demoBoxBaseFontPx}px`,
              width: showControlsDrawer ? `min(96vw, ${Math.round(896 * scaleFactor)}px)` : 'auto',
              maxWidth: '96vw',
            }}
            className="fixed bottom-2.5 left-1/2 -translate-x-1/2 z-40 transition-all duration-200"
          >
            <div
              style={{ borderRadius: `${Math.max(10, Math.round(16 * scaleFactor))}px` }}
              className="bg-slate-950/90 hover:bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-slate-100 overflow-hidden transition-all duration-200"
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

              {/* Single-Row Mini-Player Bar */}
              <div className="px-[0.95em] py-[0.5em] flex flex-wrap items-center justify-between gap-[0.65em]">
                {/* Act Badge & Short Title */}
                <div className="flex items-center gap-[0.55em] min-w-0">
                  <span className="px-[0.5em] py-[0.18em] rounded bg-red-950/90 border border-red-500/40 text-red-300 text-[0.84em] font-mono font-bold shrink-0">
                    ACT {scene.actNumber}/09
                  </span>
                  <span
                    style={{ maxWidth: `min(58vw, ${Math.round(250 * scaleFactor)}px)` }}
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

                  {/* Live Equalizer + Test Tintin Voice */}
                  {voiceEnabled && (
                    <div className="hidden sm:flex items-center gap-[0.35em] bg-slate-900 border border-slate-800 px-[0.55em] py-[0.25em] rounded-lg">
                      {/* Animated Equalizer */}
                      <div className="flex items-end gap-[2px] h-[1em] px-[0.1em]" title={isCurrentlySpeaking ? "Voice is actively speaking" : "Speech idle"}>
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
                        title="Click to test articulate voice narration right now"
                      >
                        🔊 Test
                      </button>
                    </div>
                  )}
                </div>

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

                {/* Fullscreen Button */}
                <button
                  onClick={onToggleFullScreenCinema}
                  className="px-[0.65em] py-[0.35em] rounded-lg border bg-cyan-950 hover:bg-cyan-900 border-cyan-400 text-cyan-200 text-[0.9em] font-mono font-bold flex items-center gap-[0.35em] cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-[1.1em] h-[1.1em] text-cyan-300 shrink-0" />
                  <span>Fullscreen</span>
                </button>

                {/* Toggle Mini / Fullsize */}
                <button
                  onClick={() => setShowControlsDrawer(!showControlsDrawer)}
                  className={`px-[0.65em] py-[0.35em] rounded-lg border text-[0.9em] font-mono flex items-center gap-[0.35em] cursor-pointer ${
                    showControlsDrawer
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                  title="Toggle Fullsize Controls"
                >
                  <Sliders className="w-[1.1em] h-[1.1em] text-cyan-400 shrink-0" />
                  <span className="hidden md:inline">{showControlsDrawer ? 'Mini' : 'Fullsize'}</span>
                </button>

                {/* Hide Menu */}
                <button
                  onClick={() => setDemoMenuHidden(true)}
                  className="px-[0.65em] py-[0.35em] rounded-lg border bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-200 text-[0.9em] font-mono flex items-center gap-[0.35em] cursor-pointer"
                  title="Hide Demo Menu"
                >
                  <EyeOff className="w-[1.1em] h-[1.1em] text-amber-300 shrink-0" />
                  <span className="hidden sm:inline">Hide Menu</span>
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
                      Act Steps:
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

                {/* 8-Act Scrubber Strip */}
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
                          className={`px-[0.5em] py-[0.2em] rounded text-[0.84em] font-mono font-bold transition-all cursor-pointer shrink-0 ${
                            isCurrent
                              ? 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300'
                              : isPast
                              ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {s.actNumber}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-[0.4em] shrink-0 text-[0.84em] font-mono text-slate-400">
                    <FolderGit2 className="w-[1em] h-[1em] text-cyan-400 shrink-0" />
                    <span className="truncate select-all">{scene.evidencePath}</span>
                  </div>
                </div>

                {/* Controls Row: Viewport Tabs & Preferences */}
                <div className="flex flex-wrap items-center justify-between gap-[0.5em] pt-[0.35em] border-t border-slate-900">
                  <div className="flex flex-wrap items-center gap-[0.35em]">
                    {(
                      [
                        { id: 'master', label: 'Master Record', icon: ShieldAlert },
                        { id: 'ailaws', label: '/ailaws Matrix', icon: Scale },
                        { id: 'screener', label: 'Victim Screener', icon: UserCheck },
                        { id: 'outreach', label: 'Outreach Telemetry', icon: BarChart3 },
                        { id: 'osint', label: 'OSINT Library', icon: Database },
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
                        { val: 0.5, label: '0.5x' },
                        { val: 0.75, label: '0.75x' },
                        { val: 1, label: '1x' },
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
                        <span className="text-[0.8em] font-mono text-slate-400 hidden lg:inline">Voice Persona:</span>
                        <div className="flex items-center gap-[0.25em]">
                          {(['Charon', 'Fenrir', 'Kore', 'Zephyr'] as const).map((p) => {
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
                                title={`Switch voice to ${STUDIO_PERSONAS[p].label}`}
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
      ))}
    </>
  );
};
