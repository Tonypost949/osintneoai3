import React, { useState } from 'react';
import { BrainCircuit, ShieldAlert, Sparkles, RefreshCw, X, Copy, Check, Download, FileText } from 'lucide-react';

interface ThinkingAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  focusNode?: string | null;
}

export const ThinkingAuditModal: React.FC<ThinkingAuditModalProps> = ({
  isOpen,
  onClose,
  focusNode,
}) => {
  const [prompt, setPrompt] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRunAudit = async () => {
    setLoading(true);
    setReport(null);
    try {
      const response = await fetch('/api/gemini/thinking-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || 'Synthesize full enterprise predicate act liability, municipal steering, and Clean Water Act civil/criminal exposure.',
          focusNode: focusNode || 'Primary Chokepoints (Cameron Lane Holdings LLC, Permit 2024-081, Nest Seekers)',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Thinking audit failed.');
      }

      setReport(data.auditReport);
    } catch (err: any) {
      setReport(`⚠️ High Thinking Audit Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RICO_Forensic_Thinking_Audit_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-700/60 text-purple-400">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  High-Depth Reasoning Forensic Audit
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  gemini-4-argon • ThinkingLevel.HIGH
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Uncapped multi-hop legal predicate act synthesis & chokepoint liability audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Target Context */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Active Investigative Focus:</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono">
              {focusNode || 'Global Enterprise Topology (Cameron Lane, Permit 081, Nest Seekers)'}
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Custom audit angle (e.g. Clean Water Act 33 U.S.C. 1319 criminal penalties or wire fraud conduits)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
            />
            <button
              onClick={handleRunAudit}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl font-medium text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/25"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reasoning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute High Thinking</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Report Display Area */}
        <div className="flex-1 overflow-y-auto p-5 select-text">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
              <div className="relative">
                <BrainCircuit className="w-12 h-12 text-purple-400 animate-bounce" />
                <div className="absolute inset-0 blur-xl bg-purple-500/20 rounded-full" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Executing Deep Forensic Reasoning with gemini-4-argon...
                </h4>
                <p className="text-xs text-slate-400 max-w-md mt-1">
                  Synthesizing betweenness centrality paths, municipal steering conflicts under Cal. Gov. Code § 1090, 
                  mail/wire fraud predicate acts, and Clean Water Act NPDES liability.
                </p>
              </div>
            </div>
          )}

          {!loading && !report && (
            <div className="text-center py-16 text-slate-500 text-xs">
              <ShieldAlert className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p>Click "Execute High Thinking" to trigger the full multi-statute RICO indictment brief.</p>
            </div>
          )}

          {!loading && report && (
            <div className="prose prose-invert prose-xs max-w-none space-y-3 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Reasoning Completed via ThinkingLevel.HIGH
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Brief'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-slate-200 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
                {report}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
