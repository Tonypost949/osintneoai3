import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink, RefreshCw, Sparkles, Map as MapIcon, Compass } from 'lucide-react';

interface MapsGroundingPanelProps {
  demoTourActive?: boolean;
}

export const MapsGroundingPanel: React.FC<MapsGroundingPanelProps> = ({
  demoTourActive = false,
}) => {
  const [query, setQuery] = useState('Huntington Beach Civic Center 2000 Main St and proximity to 17631 Cameron Lane parcel');
  const [result, setResult] = useState<{ text: string; mapSources: Array<{ uri: string; title: string }> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMapsGrounding = async (qText?: string) => {
    const q = qText || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          latitude: 33.7224,
          longitude: -117.9892,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Maps grounding query failed.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const samplePlaces = [
    'Huntington Beach Public Works Department 2000 Main St',
    '17631 Cameron Ln Huntington Beach parcel boundary and drainage route',
    'City of Newport Beach Civic Center 100 Civic Center Dr',
    'Nest Seekers West Hollywood Beverly Hills office location',
  ];

  // Automatically trigger live maps grounding & cycle place chips during Cinematic Demo Act 19
  useEffect(() => {
    if (!demoTourActive) return;
    if (!result && !loading) {
      handleMapsGrounding(samplePlaces[0]);
    }
    let idx = 0;
    const interval = window.setInterval(() => {
      idx = (idx + 1) % samplePlaces.length;
      setQuery(samplePlaces[idx]);
    }, 5500);
    return () => window.clearInterval(interval);
  }, [demoTourActive]);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 overflow-y-auto text-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Google Maps Grounding
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                gemini-3.8-flash • googleMaps
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Grounded geographical intelligence, municipal boundaries & place verification
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 gap-2 focus-within:border-emerald-500">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMapsGrounding()}
              placeholder="Search geographical location, civic center, or site..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>
          <button
            onClick={() => handleMapsGrounding()}
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-medium text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Ground Location</span>
          </button>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {samplePlaces.map((place, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(place);
                handleMapsGrounding(place);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            >
              {place}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <MapIcon className="w-4 h-4" />
              <span>Maps Spatial Reasoning & Description</span>
            </div>
            <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-text font-sans">
              {result.text}
            </div>
          </div>

          {result.mapSources && result.mapSources.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-2">
                <Navigation className="w-4 h-4" />
                <span>Extracted Google Maps Locations & Review Sources ({result.mapSources.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.mapSources.map((source, i) => (
                  <a
                    key={i}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/80 text-xs text-slate-300 hover:text-white flex items-start justify-between gap-2 group transition-all"
                  >
                    <div>
                      <p className="font-medium text-slate-200 group-hover:text-emerald-300">
                        {source.title}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5 max-w-[200px]">
                        {source.uri}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
