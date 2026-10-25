export interface ApiKeySlot {
  id: string;
  label: string;
  provider: 'gemini' | 'google-maps' | 'firebase' | 'custom';
  key: string;
  isActive: boolean;
  notes?: string;
  lastTested?: string;
  latencyMs?: number;
  status: 'untested' | 'active' | 'valid' | 'invalid' | 'server-injected';
}

const STORAGE_KEY = 'hbnc_api_key_vault_v1';

export const DEFAULT_KEY_SLOTS: ApiKeySlot[] = [
  {
    id: 'server-primary',
    label: 'AI Studio Server Secret (Primary)',
    provider: 'gemini',
    key: 'ENV_SERVER_INJECTED',
    isActive: true,
    notes: 'Injected into backend server via GEMINI_API_KEY environment variable. Powers Argon 4 & Charon Voice.',
    status: 'server-injected',
  },
  {
    id: 'user-gemini-2',
    label: 'Secondary Gemini / Google Cloud Key',
    provider: 'gemini',
    key: '',
    isActive: false,
    notes: 'Add your personal Gemini API key or secondary project key for dedicated quota.',
    status: 'untested',
  },
  {
    id: 'google-maps-slot',
    label: 'Google Maps Platform Key',
    provider: 'google-maps',
    key: '',
    isActive: false,
    notes: 'Used for dynamic Google Maps Satellite & Geocoding JS SDK. If blank, GIS High-Precision Satellite fallback is used.',
    status: 'untested',
  },
];

export function getStoredKeySlots(): ApiKeySlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_KEY_SLOTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure server-primary slot is always preserved
      if (!parsed.some((s) => s.id === 'server-primary')) {
        return [DEFAULT_KEY_SLOTS[0], ...parsed];
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load key slots from localStorage:', e);
  }
  return DEFAULT_KEY_SLOTS;
}

export function saveKeySlots(slots: ApiKeySlot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  } catch (e) {
    console.error('Failed to save key slots:', e);
  }
}

export function getActiveGeminiKey(): string | null {
  const slots = getStoredKeySlots();
  const activeSlot = slots.find((s) => s.provider === 'gemini' && s.isActive);
  if (!activeSlot || activeSlot.id === 'server-primary' || !activeSlot.key) {
    return null; // Signals server to use process.env.GEMINI_API_KEY
  }
  return activeSlot.key.trim();
}

export function getGoogleMapsApiKey(): string | null {
  const slots = getStoredKeySlots();
  const mapsSlot = slots.find((s) => s.provider === 'google-maps' && s.key.trim().length > 0);
  return mapsSlot ? mapsSlot.key.trim() : null;
}

export async function testKeyConnectivity(
  apiKey: string,
  model = 'gemini-3.8-flash'
): Promise<{ valid: boolean; latencyMs?: number; error?: string; modelUsed?: string; snippet?: string }> {
  try {
    const res = await fetch('/api/keys/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: apiKey === 'ENV_SERVER_INJECTED' ? undefined : apiKey,
        model,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || 'Network error while contacting key validation endpoint',
    };
  }
}

export interface PlatformIntegration {
  id: string;
  name: string;
  category: 'AI & Voice' | 'GIS & Mapping' | '3D Spatial' | 'Offline & PWA' | 'Evidence & Cloud';
  status: 'connected' | 'ready' | 'offline-ready';
  description: string;
  details: string;
  actionLabel: string;
}

export const PLATFORM_INTEGRATIONS: PlatformIntegration[] = [
  {
    id: 'gemini-argon',
    name: 'Gemini 4 Argon & Multimodal GenAI',
    category: 'AI & Voice',
    status: 'connected',
    description: 'Premier statutory synthesis, /ailaws matrix validation, and forensic intake reasoning.',
    details: 'Connected via backend Node.js proxy to @google/genai SDK with multi-key rotation and zero-leak headers.',
    actionLabel: 'Configure Models & Keys',
  },
  {
    id: 'studio-tts',
    name: 'Gemini Studio Neural Audio (Charon Persona)',
    category: 'AI & Voice',
    status: 'connected',
    description: '24kHz broadcast-quality evidentiary narration engine with zero robotic browser artifacts.',
    details: 'Powered by gemini-3.8-flash-lite-tts with server audio caching and automated acronym expansion.',
    actionLabel: 'Test Narration Engine',
  },
  {
    id: 'google-maps-gis',
    name: 'Google Maps Platform & Satellite GIS',
    category: 'GIS & Mapping',
    status: 'ready',
    description: 'High-precision satellite mapping of 17631 Cameron Lane, DTSC boundaries, and soil sample boreholes.',
    details: 'Supports Google Maps JavaScript API with interactive layers, GPS pins (33.706389, -117.988611), and contour overlays.',
    actionLabel: 'Open GIS Mapping',
  },
  {
    id: 'threejs-subsurface',
    name: 'Three.js 3D Subsurface Toxic Plume Visualizer',
    category: '3D Spatial',
    status: 'connected',
    description: 'Real-time 3D cross-section rendering of the 1-year asphalt cap, 980 µg/kg Cr(VI) layer, and groundwater table.',
    details: 'Hardware-accelerated WebGL with software fallback, interactive stratum peel sliders, and bed-breach markers.',
    actionLabel: 'Launch 3D Visualizer',
  },
  {
    id: 'pwa-offline',
    name: 'PWA Offline Cache & Forensic Locker',
    category: 'Offline & PWA',
    status: 'offline-ready',
    description: 'Full offline readiness for courtroom and field investigations without internet connectivity.',
    details: 'Web App Manifest, Service Worker caching for documents, exhibits, and local storage data persistence.',
    actionLabel: 'Audit Offline Storage',
  },
  {
    id: 'dossier-export',
    name: 'Automated Judicial Dossier & ZIP Archive Engine',
    category: 'Evidence & Cloud',
    status: 'ready',
    description: 'Instantly compile and export comprehensive legal briefs, Form 700 cross-tables, and evidence logs.',
    details: 'Client-side JSZip engine bundled with SHA-256 integrity hashes and court-ready exhibits.',
    actionLabel: 'Export Evidence Bundle',
  },
];
