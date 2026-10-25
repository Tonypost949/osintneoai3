import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, RefreshCw, Download, Sliders, Maximize, AlertCircle } from 'lucide-react';

interface EvidentiaryImageGenProps {
  demoTourActive?: boolean;
}

export const EvidentiaryImageGen: React.FC<EvidentiaryImageGenProps> = ({
  demoTourActive = false,
}) => {
  const [prompt, setPrompt] = useState(
    'Aerial architectural site reconnaissance diagram of 17631 Cameron Lane parcel showing subdivision boundary, public right-of-way encroachment zone, and underground stormwater bypass pipe layout in Huntington Beach, forensic investigation style'
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3'>('16:9');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (customPrompt?: string) => {
    const p = customPrompt || prompt;
    if (!p.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: p,
          imageSize,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Image generation failed.');
      }

      setImageUrl(data.imageUrl);
      setCaption(data.caption);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sampleImagePrompts = [
    'Aerial forensic site plan of 17631 Cameron Lane parcel with CAD redline permit boundaries and storm drain outfall, high detail, technical schematic',
    'Technical cutaway schematic of StormTech MC-3500 subsurface retention chamber removed from civil permit blueprints, technical engineering drawing',
    'Satellite ortho-mosaic view of Huntington Beach and Newport Beach coastal storm drainage channel nexus with environmental runoff markers',
  ];

  // Automated button walkthrough during Cinematic Demo Act 20
  useEffect(() => {
    if (!demoTourActive) return;
    const sizes: ('1K' | '2K' | '4K')[] = ['1K', '2K', '4K'];
    const ratios: ('1:1' | '16:9' | '4:3')[] = ['16:9', '4:3', '1:1'];
    let step = 0;
    const interval = window.setInterval(() => {
      step = (step + 1) % 3;
      setImageSize(sizes[step]);
      setAspectRatio(ratios[step]);
      setPrompt(sampleImagePrompts[step]);
    }, 4800);
    return () => window.clearInterval(interval);
  }, [demoTourActive]);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 overflow-y-auto text-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-950 border border-amber-800 text-amber-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Evidentiary Diagram & Reconnaissance Visualizer
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                gemini-3-pro-image
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Generate 1K, 2K, and 4K aerial parcel diagrams, engineering schematics, and site mockups
            </p>
          </div>
        </div>
      </div>

      {/* Controls & Size Selector */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Image Size Affordance: 1K, 2K, 4K */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Resolution Quality:
            </span>
            <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-mono">
              {(['1K', '2K', '4K'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setImageSize(size)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    imageSize === size
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Aspect Ratio:</span>
            <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-mono text-xs">
              {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    aspectRatio === ratio
                      ? 'bg-slate-700 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe evidentiary aerial mockup, parcel layout, or blueprint..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 resize-none"
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {sampleImagePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p);
                    handleGenerate(p);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                >
                  Prompt {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-xl font-medium text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-600/25 shrink-0"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate {imageSize} Diagram</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Image Generation Notice</p>
            <p className="text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Placeholder */}
      {loading && (
        <div className="border border-slate-800 bg-slate-900/60 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-xs font-mono text-slate-300">
            Rendering high-fidelity {imageSize} evidentiary diagram with gemini-3-pro-image...
          </p>
        </div>
      )}

      {/* Image Display */}
      {imageUrl && !loading && (
        <div className="border border-slate-800 bg-slate-900/80 rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-mono text-amber-400 font-semibold flex items-center gap-1.5">
              <Maximize className="w-3.5 h-3.5" />
              Generated {imageSize} Resolution Reconnaissance Diagram
            </span>
            <a
              href={imageUrl}
              download={`evidentiary_diagram_${imageSize}_${Date.now()}.png`}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full Resolution</span>
            </a>
          </div>
          <div className="relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Generated evidentiary diagram"
              className="w-full max-h-[500px] object-contain rounded-xl"
            />
          </div>
          {caption && (
            <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              {caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
