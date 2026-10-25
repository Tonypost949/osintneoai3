// High-Definition Studio Neural AI Audio Engine — Permanently Locked to Deep 'Charon' Voice
// Powered by Gemini 3.8 Flash Lite TTS (24kHz WAV) & Unified Multi-Account Key Pool

export type StudioVoicePersona = 'Charon' | 'Fenrir' | 'Kore' | 'Zephyr' | 'Aoede' | 'Puck';

export const LOCKED_STUDIO_VOICE: StudioVoicePersona = 'Charon';

export interface PersonaProfile {
  id: StudioVoicePersona;
  label: string;
  badge: string;
  desc: string;
  rateMultiplier: number;
  pitch: number;
  preferredVoices: string[];
}

const CHARON_DEEP_PROFILE: PersonaProfile = {
  id: 'Charon',
  label: 'Charon (Locked Deep Documentary Voice)',
  badge: '🔒 Locked Deep Voice',
  desc: 'Deep, authoritative investigative documentary narrator with measured studio gravitas and crystal-clear articulation',
  rateMultiplier: 0.95,
  pitch: 0.90,
  preferredVoices: [
    'Google UK English Male',
    'Microsoft Guy Online',
    'Microsoft Christopher Online',
    'Microsoft Eric Online',
    'Guy',
    'Daniel',
    'David',
    'Male',
    'Natural',
    'Neural',
    'en-GB',
    'en-US',
  ],
};

// All persona lookups resolve to the locked deep Charon profile so the voice can never drift or be changed
export const STUDIO_PERSONAS: Record<StudioVoicePersona, PersonaProfile> = {
  Charon: CHARON_DEEP_PROFILE,
  Fenrir: CHARON_DEEP_PROFILE,
  Kore: CHARON_DEEP_PROFILE,
  Aoede: CHARON_DEEP_PROFILE,
  Zephyr: CHARON_DEEP_PROFILE,
  Puck: CHARON_DEEP_PROFILE,
};

// Memory cache for synthesized Gemini Studio 24kHz audio WAVs
const ttsAudioCache = new Map<string, string>();

// Calls the backend /api/tts endpoint — always locked to 'Charon' deep voice
export async function fetchGeminiNeuralAudio(
  text: string,
  _voice: StudioVoicePersona = LOCKED_STUDIO_VOICE
): Promise<string | null> {
  const normalized = normalizeTextForSpeech(text);
  const cacheKey = `Charon:::deep_locked_v1:::${normalized}`;
  if (ttsAudioCache.has(cacheKey)) {
    return ttsAudioCache.get(cacheKey)!;
  }

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: normalized,
        voice: LOCKED_STUDIO_VOICE,
        voiceName: LOCKED_STUDIO_VOICE,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        ttsAudioCache.set(cacheKey, audioUrl);
        return audioUrl;
      }
    }
    return null;
  } catch (err) {
    console.warn('Gemini Studio Neural TTS fetch failed, using calibrated deep speech fallback:', err);
    return null;
  }
}

// Pre-warms the next act's neural audio in background so transitions are zero-latency
export function preloadGeminiNeuralAudio(
  text: string,
  _voice: StudioVoicePersona = LOCKED_STUDIO_VOICE
): void {
  fetchGeminiNeuralAudio(text, LOCKED_STUDIO_VOICE).catch(() => {});
}

// Normalizes legal, toxicological, number-padding, and case terms for human-quality articulation
export function normalizeTextForSpeech(rawText: string): string {
  if (!rawText) return '';

  return rawText
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Strip leading zeros on standalone 2-digit numbers (01 -> 1, 06 -> 6, Photo 06 -> Photo 6, Act 06 -> Act 6) so TTS NEVER says "Oh 6"
    .replace(/\b0([1-9])\b/g, '$1')
    // Strip leading zeros on 3-digit exhibit numbers like 001 -> 1, 002 -> 2, 003 -> 3
    .replace(/\b00([1-9])\b/g, '$1')
    .replace(/\b0([1-9][0-9])\b/g, '$1')
    // Chemical and toxicological terms
    .replace(/Cr\(VI\)/gi, 'Hexavalent Chromium')
    .replace(/\bCr6\b/gi, 'Hexavalent Chromium')
    .replace(/µg\/kg/gi, 'micrograms per kilogram')
    .replace(/ug\/kg/gi, 'micrograms per kilogram')
    .replace(/µg\/L/gi, 'micrograms per liter')
    .replace(/ug\/L/gi, 'micrograms per liter')
    .replace(/\b49×\b/gi, 'forty-nine times')
    .replace(/\b49x\b/gi, 'forty-nine times')
    .replace(/\b47\.5×\b/gi, 'forty-seven point five times')
    .replace(/\b3,310×\b/gi, 'three thousand three hundred ten times')
    // Acronyms and legal citations
    .replace(/\bHBNC\b/g, 'H B N C')
    .replace(/\bEHR\b/g, 'electronic health record')
    .replace(/\bDTSC\b/g, 'D T S C')
    .replace(/\bOEHHA\b/g, 'O E H H A')
    .replace(/\bEPA\b/g, 'E P A')
    .replace(/\bADA\b/g, 'A D A')
    .replace(/\bFHA\b/g, 'Fair Housing Act')
    .replace(/\bRCRA\b/g, 'Rick-rah')
    .replace(/\bEADACPA\b/g, 'Elder Abuse and Dependent Adult Civil Protection Act')
    .replace(/\bFPPC\b/g, 'Fair Political Practices Commission')
    .replace(/\bFRE 201\b/gi, 'Federal Rule of Evidence 201')
    .replace(/\bCCP § 335\.1\b/gi, 'Code of Civil Procedure Section 335 point 1')
    .replace(/\bGov\. Code § 911\.2\b/gi, 'Government Code Section 911 point 2')
    .replace(/\bGov\. Code § 835\b/gi, 'Government Code Section 835')
    .replace(/\bGov\. Code § 1090\b/gi, 'Government Code Section 1090')
    .replace(/\bWelf\. & Inst\. Code § 15657\b/gi, 'Welfare and Institutions Code Section 15657')
    .replace(/§\s*(\d+)/g, 'Section $1')
    .replace(/§/g, 'Section ')
    .replace(/\bet al\./gi, 'and others')
    .replace(/\bvoid ab initio\b/gi, 'void ab in-ish-ee-oh')
    .replace(/\bab initio\b/gi, 'ab in-ish-ee-oh')
    .replace(/\bsua sponte\b/gi, 'soo-ah spon-tay')
    // Exact name pronunciations mandated by user ("dimarcello is dee mar chello")
    .replace(/\bDiMarcello\b/gi, 'dee mar chello')
    .replace(/\bPetruccio\b/gi, 'Peh-troo-chee-oh')
    .replace(/\bMitsuru Yamada\b/gi, 'Mit-soo-roo Ya-ma-da')
    .replace(/\bHarry Sidhu\b/gi, 'Harry See-doo')
    .replace(/\bLaserfiche #5406552\b/gi, 'Laser-feesh contract 5 4 0 6 5 5 2')
    .replace(/\bLaserfiche 5406552\b/gi, 'Laser-feesh contract 5 4 0 6 5 5 2')
    .replace(/\b1-year\b/gi, 'one-year')
    .replace(/\b2-inch\b/gi, 'two-inch')
    .replace(/\s+/g, ' ')
    .trim();
}

// Synthesizes a subtle, warm acoustic chime using Web Audio API
export function playCyberChime(pitchModifier: number = 0.9): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220 * pitchModifier, now);
    osc1.frequency.exponentialRampToValueAtTime(329.63 * pitchModifier, now + 0.18);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(440 * pitchModifier, now);
    osc2.frequency.exponentialRampToValueAtTime(554.37 * pitchModifier, now + 0.22);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.48);
    osc2.stop(now + 0.48);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch {
    // Autoplay may be restricted
  }
}

// Finds the deepest natural male neural voice for browser speech fallback (locked to Charon profile)
export function getBestVoiceForPersona(
  _personaId: StudioVoicePersona,
  availableVoices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | undefined {
  if (!availableVoices || availableVoices.length === 0) return undefined;

  const profile = CHARON_DEEP_PROFILE;

  for (const namePattern of profile.preferredVoices) {
    const regex = new RegExp(namePattern, 'i');
    const matched = availableVoices.find(
      (v) =>
        regex.test(v.name) &&
        /natural|neural|online|google/i.test(v.name) &&
        v.lang.startsWith('en')
    );
    if (matched) return matched;
  }

  for (const namePattern of profile.preferredVoices) {
    const regex = new RegExp(namePattern, 'i');
    const matched = availableVoices.find(
      (v) => regex.test(v.name) && v.lang.startsWith('en')
    );
    if (matched) return matched;
  }

  const naturalEn = availableVoices.find(
    (v) => /natural|neural|online|premium/i.test(v.name) && v.lang.startsWith('en')
  );
  if (naturalEn) return naturalEn;

  const anyEn = availableVoices.find((v) => v.lang.startsWith('en'));
  if (anyEn) return anyEn;

  return availableVoices[0];
}
