import React, { useState, useEffect } from 'react';
import { Search, Globe, ExternalLink, RefreshCw, Sparkles, BookOpen, CheckCircle } from 'lucide-react';

interface SearchGroundingPanelProps {
  demoTourActive?: boolean;
}

export const SearchGroundingPanel: React.FC<SearchGroundingPanelProps> = ({
  demoTourActive = false,
}) => {
  const [query, setQuery] = useState(
    'Huntington Beach Public Works encroachment permit regulations Cameron Lane and CEQA stormwater runoff exemptions'
  );
  const [result, setResult] = useState<{ text: string; sources: Array<{ uri: string; title: string }> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchTerm?: string) => {
    const q = searchTerm || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Search grounding request failed.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sampleSearches = [
    'City of Huntington Beach encroachment permit 2024 right of way public works',
    'California Secretary of State corporate registration Cameron Lane Holdings LLC',
    'Nest Seekers California designated broker license DRE disciplinary records',
    'Santa Ana Regional Water Quality Control Board NPDES Huntington Beach permit compliance',
  ];

  // Automatically trigger live search & step through preset chips during Cinematic Demo Act 18
  useEffect(() => {
    if (!demoTourActive) return;
    if (!result && !loading) {
      handleSearch(sampleSearches[0]);
    }
    let idx = 0;
    const interval = window.setInterval(() => {
      idx = (idx + 1) % sampleSearches.length;
      setQuery(sampleSearches[idx]);
    }, 5500);
    return () => window.clearInterval(interval);
  }, [demoTourActive]);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 overflow-y-auto text-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-950 border border-blue-800 text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Google Search Grounding Live Public Records
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                gemini-3.8-flash • googleSearch
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live web grounding against CA municipal codes, council minutes, and DRE filings
            </p>
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 gap-2 focus-within:border-blue-500">
            <Search className="w-4 h-4 text-blue-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Query public records, municipal notices, or corporate filings..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-medium text-xs flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Ground Search</span>
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {sampleSearches.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(s);
                handleSearch(s);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-4 animate-in fade-in">
          {/* Synthesized Answer */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Grounded Intelligence Synthesis</span>
            </div>
            <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-text font-sans">
              {result.text}
            </div>
          </div>

          {/* Extracted Web Grounding Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Grounding Citations ({result.sources.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/80 text-xs text-slate-300 hover:text-white flex items-start justify-between gap-2 group transition-all"
                  >
                    <div className="overflow-hidden">
                      <p className="font-medium text-slate-200 group-hover:text-blue-300 truncate">
                        {src.title}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                        {src.uri}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 mt-0.5" />
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
