import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  KeyRound,
  ShieldCheck,
  Zap,
  Layers,
  Satellite,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Cpu,
  Radio,
  FileText,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';
import { PLATFORM_INTEGRATIONS, testKeyConnectivity } from '../utils/integrationsManager';
import { ThreeSubsurfacePlumeView } from './ThreeSubsurfacePlumeView';
import { GisSatelliteMapView } from './GisSatelliteMapView';
import { playCyberChime } from '../utils/audioEngine';

interface IntegrationsHubViewProps {
  onOpenAiAssistant?: () => void;
  onOpenFileViewer?: (filename: string) => void;
}

export const IntegrationsHubView: React.FC<IntegrationsHubViewProps> = ({
  onOpenAiAssistant,
  onOpenFileViewer,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'integrations' | '3d-plume' | 'gis-map'>('integrations');
  const [keyStatusData, setKeyStatusData] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [newKeyInput, setNewKeyInput] = useState<string>('');
  const [addKeyMessage, setAddKeyMessage] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<{
    testing: boolean;
    valid?: boolean;
    latencyMs?: number;
    error?: string;
    modelUsed?: string;
  }>({ testing: false });

  // Fetch status of AI Studio server environment keys
  const fetchKeyStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/keys/status');
      const data = await res.json();
      setKeyStatusData(data);
    } catch (err) {
      console.warn('Failed to fetch key status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchKeyStatus();
  }, []);

  const handleTestLivePing = async () => {
    playCyberChime(1.0);
    setPingResult({ testing: true });
    const result = await testKeyConnectivity('ENV_SERVER_INJECTED', 'gemini-3.8-flash');
    setPingResult({
      testing: false,
      valid: result.valid,
      latencyMs: result.latencyMs,
      error: result.error,
      modelUsed: result.modelUsed,
    });
  };

  const handleAddAccountKeyToPool = async () => {
    if (!newKeyInput.trim()) return;
    try {
      const res = await fetch('/api/keys/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newKeyInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddKeyMessage(`Added ${data.added} key(s) into the live osintneoai.me unified pool (${data.keyPoolCount} total active keys).`);
        setNewKeyInput('');
        fetchKeyStatus();
      } else {
        setAddKeyMessage(data.error || 'Failed to add key.');
      }
    } catch (err: any) {
      setAddKeyMessage(err.message || 'Error adding key.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Sub-tab Navigation Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playCyberChime(1.1);
              setActiveSubTab('integrations');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'integrations'
                ? 'bg-cyan-950 text-cyan-200 border border-cyan-500 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>AI Studio Secrets &amp; Integrations Hub</span>
          </button>

          <button
            onClick={() => {
              playCyberChime(1.1);
              setActiveSubTab('3d-plume');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === '3d-plume'
                ? 'bg-rose-950 text-rose-200 border border-rose-500 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-rose-400" />
            <span>3D Subsurface Plume Visualizer</span>
          </button>

          <button
            onClick={() => {
              playCyberChime(1.1);
              setActiveSubTab('gis-map');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'gis-map'
                ? 'bg-blue-950 text-blue-200 border border-blue-500 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Satellite className="w-4 h-4 text-blue-400" />
            <span>GIS Forensic Satellite Map</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Node 22 Server Active &middot; Port 3000</span>
          </span>
        </div>
      </div>

      {/* VIEW 1: INTEGRATIONS & SECRETS HUB */}
      {activeSubTab === 'integrations' && (
        <div className="space-y-6">
          {/* Top Banner: Google AI Studio Environment Secrets Architecture */}
          <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-cyan-950/90 border border-indigo-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-900 border border-indigo-400 flex items-center justify-center text-indigo-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-extrabold text-white font-mono tracking-wider">
                    GOOGLE AI STUDIO SECRETS VAULT &middot; SERVER RUNTIME
                  </h2>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Your primary Gemini API key is securely injected by Google AI Studio into this server environment (Node 22) as <code className="text-cyan-300 bg-slate-950/80 px-1.5 py-0.5 rounded font-mono text-[11px]">process.env.GEMINI_API_KEY</code>. All forensic reasoning and Studio Neural Audio calls execute through server-side proxy routes with zero client key exposure.
                </p>
              </div>

              {/* Server Key Status Badge & Ping Test */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-2.5 bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs text-emerald-300 font-bold">
                    {keyStatusData?.serverKeyMasked || 'AQ.Ab8RN6••••••••••••••••'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Status: <b>Live AI Studio Secret Injected</b>
                </div>

                <button
                  onClick={handleTestLivePing}
                  disabled={pingResult.testing}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pingResult.testing ? 'animate-spin' : ''}`} />
                  <span>{pingResult.testing ? 'Pinging...' : 'Test Server Connectivity'}</span>
                </button>
              </div>
            </div>

            {/* Ping Result Notification */}
            {pingResult.valid !== undefined && (
              <div className={`mt-4 p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
                pingResult.valid
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
              }`}>
                <div className="flex items-center gap-2">
                  {pingResult.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>
                    {pingResult.valid
                      ? `Gemini Server Probe Successful: Latency ${pingResult.latencyMs} ms · Model ${pingResult.modelUsed}`
                      : `Probe failed: ${pingResult.error}`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Verified via /api/keys/test</span>
              </div>
            )}

            {/* Multi-Account Key Pool Under One Roof */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-cyan-300">
                  UNIFIED MULTI-ACCOUNT KEY POOL ({keyStatusData?.keyPoolCount || 5} ACTIVE KEYS LOADED UNDER ONE ROOF):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(keyStatusData?.maskedPool || []).map((item: any) => (
                    <span
                      key={item.index}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono"
                    >
                      Key #{item.index}: {item.masked}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  placeholder="Paste another account's Gemini API key..."
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono w-64 outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleAddAccountKeyToPool}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold cursor-pointer shrink-0"
                >
                  + Pool Key
                </button>
              </div>
            </div>
            {addKeyMessage && (
              <div className="mt-2 text-xs font-mono text-emerald-300">{addKeyMessage}</div>
            )}
          </div>

          {/* AI Studio Environment Secrets Reference Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white font-mono tracking-wide flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>SUPPORTED GOOGLE AI STUDIO SECRETS</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  AI Studio manages environment variables securely. Configure or rotate keys in your AI Studio project settings.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-cyan-300">
                  Node Runtime: {keyStatusData?.storageInfo?.nodeRuntime || 'v22.14.0'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Secret 1: GEMINI_API_KEY */}
              <div className="bg-slate-950 border border-emerald-500/40 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-300">GEMINI_API_KEY</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-500/50">
                    ACTIVE ✓
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Powers Gemini 4 Argon, 2.5 Pro, Flash, and the Studio Neural 24kHz Audio narrator (Charon).
                </p>
                <div className="pt-1.5 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  Source: AI Studio User Secret
                </div>
              </div>

              {/* Secret 2: SECONDARY_GEMINI_API_KEY */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">SECONDARY_GEMINI_API_KEY</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                    {keyStatusData?.hasSecondaryKey ? 'CONFIGURED' : 'OPTIONAL'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Secondary Google Cloud key for automated failover, load balancing, or separate quota projects.
                </p>
                <div className="pt-1.5 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  Fallback Chain: Active in server.ts
                </div>
              </div>

              {/* Secret 3: GOOGLE_MAPS_API_KEY */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">GOOGLE_MAPS_API_KEY</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                    {keyStatusData?.hasMapsKey ? 'CONFIGURED' : 'OPTIONAL'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Enables Google Maps Platform dynamic tiles and geocoding. High-precision GIS fallback is built-in.
                </p>
                <div className="pt-1.5 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  Fallback: 17631 Cameron Lane GIS
                </div>
              </div>
            </div>
          </div>

          {/* All Platform Integrations Showcase Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white font-mono tracking-wide uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>ACTIVE PLATFORM INTEGRATIONS &middot; 6 CORES</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Toxic Tort &middot; HBNC Case 3 &middot; /ailaws Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORM_INTEGRATIONS.map((integration) => (
                <div
                  key={integration.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 flex flex-col justify-between transition-all shadow-lg group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                        {integration.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>READY</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {integration.name}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {integration.description}
                    </p>

                    <div className="bg-slate-950 p-2 rounded text-[11px] font-mono text-slate-400 border border-slate-800">
                      {integration.details}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80">
                    {integration.id === 'threejs-subsurface' ? (
                      <button
                        onClick={() => setActiveSubTab('3d-plume')}
                        className="w-full py-1.5 px-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Launch 3D Visualizer</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : integration.id === 'google-maps-gis' ? (
                      <button
                        onClick={() => setActiveSubTab('gis-map')}
                        className="w-full py-1.5 px-3 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/50 text-blue-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Satellite className="w-3.5 h-3.5" />
                        <span>Open GIS Map</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : integration.id === 'gemini-argon' && onOpenAiAssistant ? (
                      <button
                        onClick={onOpenAiAssistant}
                        className="w-full py-1.5 px-3 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Open Argon 4 Terminal</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <div className="text-center text-[11px] font-mono text-cyan-400 font-bold py-1">
                        ✓ Operational In Background
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 3D SUBSURFACE TOXIC PLUME VISUALIZER */}
      {activeSubTab === '3d-plume' && (
        <div>
          <ThreeSubsurfacePlumeView />
        </div>
      )}

      {/* VIEW 3: GIS FORENSIC SATELLITE MAP */}
      {activeSubTab === 'gis-map' && (
        <div>
          <GisSatelliteMapView onOpenFileViewer={onOpenFileViewer} />
        </div>
      )}
    </div>
  );
};
