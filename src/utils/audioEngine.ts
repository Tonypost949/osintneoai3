// Studio Neural AI Audio Engine powered by Gemini Flash Lite TTS & Deep Forensic Personas

export type StudioVoicePersona = 'Charon' | 'Fenrir' | 'Kore' | 'Zephyr' | 'Puck' | 'Kimi';

export interface PersonaProfile {
  id: StudioVoicePersona;
  label: string;
  badge: string;
  desc: string;
  rateMultiplier: number;
  pitch: number;
  preferredVoices: string[];
}

export const STUDIO_PERSONAS: Record<StudioVoicePersona, PersonaProfile> = {
  Charon: {
    id: 'Charon',
    label: 'Charon (Deep Forensic Cinema)',
    badge: '🎬 Gemini Studio',
    desc: 'Authoritative, deep cinematic documentary narrator with measured gravitas and supreme clarity',
    rateMultiplier: 0.95,
    pitch: 0.90,
    preferredVoices: ['Guy', 'David', 'Male', 'Natural', 'en-US', 'en-GB'],
  },
  Fenrir: {
    id: 'Fenrir',
    label: 'Fenrir (Courtroom Prosecutor)',
    badge: '🏛️ Courtroom',
    desc: 'Intense, solemn legal indictment tone for criminal fraud and strict disgorgement matrices',
    rateMultiplier: 0.92,
    pitch: 0.86,
    preferredVoices: ['Ryan', 'David', 'Oliver', 'Male', 'Neural', 'en-US'],
  },
  Kore: {
    id: 'Kore',
    label: 'Kore (Federal Briefing)',
    badge: '🛡️ Federal',
    desc: 'Clear, calm, analytical executive briefing anchor for statutory and agency enforcement',
    rateMultiplier: 0.98,
    pitch: 0.98,
    preferredVoices: ['Jenny', 'Sonia', 'Aria', 'Female', 'Natural', 'en-US'],
  },
  Zephyr: {
    id: 'Zephyr',
    label: 'Zephyr (Broadcast Investigative)',
    badge: '📡 Broadcast',
    desc: 'Polished broadcast journalism delivery for public release and news transmission',
    rateMultiplier: 1.0,
    pitch: 1.0,
    preferredVoices: ['Christopher', 'Daniel', 'Natural', 'en-US'],
  },
  Puck: {
    id: 'Puck',
    label: 'Puck (Tactical Telemetry)',
    badge: '⚡ Telemetry',
    desc: 'Rapid tactical analyst with high-clarity technical articulation',
    rateMultiplier: 1.05,
    pitch: 1.02,
    preferredVoices: ['George', 'Arthur', 'en-US'],
  },
  Kimi: {
    id: 'Kimi',
    label: 'Kimi Intelligence Lead',
    badge: '🎙️ Studio AI',
    desc: 'Balanced, modern conversational AI intelligence briefing voice',
    rateMultiplier: 0.98,
    pitch: 0.98,
    preferredVoices: ['Jenny', 'Aria', 'Natural', 'Neural', 'en-US'],
  },
};

// Memory cache for synthesized Gemini Studio audio WAVs
const ttsAudioCache = new Map<string, string>();

// Calls the backend /api/tts endpoint powered by Gemini Flash Lite TTS
export async function fetchGeminiNeuralAudio(
  text: string,
  voice: StudioVoicePersona = 'Charon'
): Promise<string | null> {
  const cacheKey = `${voice}:::${text.trim()}`;
  if (ttsAudioCache.has(cacheKey)) {
    return ttsAudioCache.get(cacheKey)!;
  }

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: normalizeTextForSpeech(text),
        voice: voice === 'Kimi' ? 'Charon' : voice,
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
    console.warn('Gemini Neural TTS fetch failed, using natural browser speech fallback:', err);
    return null;
  }
}

// Normalizes legal, toxicological, and case terms for human-quality articulation
export function normalizeTextForSpeech(rawText: string): string {
  if (!rawText) return '';

  return rawText
    // Remove markdown asterisks and backticks
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Chemical and toxicological names
    .replace(/Cr\(VI\)/gi, 'Hexavalent Chromium')
    .replace(/\bCr6\b/gi, 'Hexavalent Chromium')
    .replace(/µg\/kg/gi, 'micrograms per kilogram')
    .replace(/ug\/kg/gi, 'micrograms per kilogram')
    .replace(/µg\/L/gi, 'micrograms per liter')
    .replace(/ug\/L/gi, 'micrograms per liter')
    .replace(/\b49×\b/gi, 'forty-nine times')
    .replace(/\b49x\b/gi, 'forty-nine times')
    // Acronyms and legal terminology
    .replace(/\bHBNC\b/g, 'H B N C')
    .replace(/\bEHR\b/g, 'electronic health record')
    .replace(/\bDTSC\b/g, 'D T S C')
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
    // Latin legal phrases
    .replace(/\bvoid ab initio\b/gi, 'void ab in-ish-ee-oh')
    .replace(/\bab initio\b/gi, 'ab in-ish-ee-oh')
    .replace(/\bsua sponte\b/gi, 'soo-ah spon-tay')
    // Case and person names
    .replace(/\bMitsuru Yamada\b/gi, 'Mit-soo-roo Ya-ma-da')
    .replace(/\bHarry Sidhu\b/gi, 'Harry See-doo')
    .replace(/\bLaserfiche #5406552\b/gi, 'Laser-feesh document number 5 4 0 6 5 5 2')
    .replace(/\b1-year\b/gi, 'one-year')
    .replace(/\b2-inch\b/gi, 'two-inch')
    // Clean up excessive whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Synthesizes a subtle, cinematic low chime using Web Audio API
export function playCyberChime(pitchModifier: number = 0.9): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Resonant cinematic tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220 * pitchModifier, now); // A3
    osc1.frequency.exponentialRampToValueAtTime(329.63 * pitchModifier, now + 0.18); // E4

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(440 * pitchModifier, now); // A4
    osc2.frequency.exponentialRampToValueAtTime(554.37 * pitchModifier, now + 0.22); // C#5

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.06, now + 0.03);
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

// Finds the optimal voice for the given persona
export function getBestVoiceForPersona(
  personaId: StudioVoicePersona,
  availableVoices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | undefined {
  if (!availableVoices || availableVoices.length === 0) return undefined;

  const profile = STUDIO_PERSONAS[personaId] || STUDIO_PERSONAS.Charon;

  // 1. Search for preferred voice names
  for (const namePattern of profile.preferredVoices) {
    const regex = new RegExp(namePattern, 'i');
    const matched = availableVoices.find(
      (v) => regex.test(v.name) && (v.lang.startsWith('en') || v.lang.startsWith('en-US'))
    );
    if (matched) return matched;
  }

  // 2. Search for any high quality neural / natural English voice
  const naturalEn = availableVoices.find(
    (v) => /natural|neural|online|premium/i.test(v.name) && v.lang.startsWith('en')
  );
  if (naturalEn) return naturalEn;

  // 3. Fallback to any English voice
  const anyEn = availableVoices.find((v) => v.lang.startsWith('en'));
  if (anyEn) return anyEn;

  return availableVoices[0];
}
