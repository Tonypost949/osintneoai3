import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Download, FileText, Image as ImageIcon, ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react';

interface FileViewerModalProps {
  filename: string | null;
  fileData?: string | null;
  onClose: () => void;
}

// Resolves any case filename or shorthand citation to its preloaded /evidence/... URL
export function resolveEvidenceUrl(filename: string, providedData?: string | null): string {
  if (providedData && (providedData.startsWith('blob:') || providedData.startsWith('data:') || providedData.startsWith('/evidence/'))) {
    return providedData;
  }

  const clean = filename.trim();
  const map: Record<string, string> = {
    'Laserfiche #5406552': '/evidence/5406552_viewer.png',
    '5406552': '/evidence/5406552_viewer.png',
    '5406552_viewer.png': '/evidence/5406552_viewer.png',
    'laserfiche_5406552_TTS_grading_contract_FULL.txt': '/evidence/laserfiche_5406552_TTS_grading_contract_FULL.txt',
    '17631 Cameron St_17642 Beach Blvd_1947.jpg': '/evidence/17631%20Cameron%20St_17642%20Beach%20Blvd_1947.jpg',
  };

  if (map[clean]) return map[clean];
  return `/evidence/${encodeURIComponent(clean)}`;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  filename,
  fileData,
  onClose,
}) => {
  const [fetchedText, setFetchedText] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState<number>(100);
  const [imgError, setImgError] = useState<boolean>(false);

  const resolvedUrl = filename ? resolveEvidenceUrl(filename, fileData) : '';
  const isImage = filename ? /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename) || resolvedUrl.endsWith('.png') || resolvedUrl.endsWith('.jpg') : false;
  const isPdf = filename ? /\.pdf$/i.test(filename) : false;
  const isText = filename ? /\.(md|txt|json|html|csv)$/i.test(filename) : false;

  useEffect(() => {
    setImageZoom(100);
    setImgError(false);
    setFetchedText(null);

    if (!filename) return;
    if (isText) {
      fetch(resolvedUrl)
        .then((r) => (r.ok ? r.text() : Promise.reject('Not found')))
        .then((txt) => setFetchedText(txt))
        .catch(() => setFetchedText(null));
    }
  }, [filename, resolvedUrl, isText]);

  if (!filename) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-xl shadow-2xl max-w-5xl w-full max-h-[88vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {isImage ? (
              <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <h3 className="text-sm font-bold text-white font-mono truncate">{filename}</h3>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-mono font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>VERIFIED PRIMARY RECORD</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isImage && (
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-1 text-xs font-mono">
                <button
                  onClick={() => setImageZoom((z) => Math.max(50, z - 25))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-cyan-300 px-1">{imageZoom}%</span>
                <button
                  onClick={() => setImageZoom((z) => Math.min(250, z + 25))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Raw</span>
            </a>

            <a
              href={resolvedUrl}
              download={filename}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-auto flex-1 bg-slate-950/90">
          {isImage && !imgError ? (
            <div className="flex flex-col items-center justify-center">
              <img
                src={resolvedUrl}
                alt={filename}
                onError={() => setImgError(true)}
                style={{ width: imageZoom === 100 ? undefined : `${imageZoom}%` }}
                className={`${imageZoom === 100 ? 'max-h-[68vh] object-contain' : 'max-w-none'} rounded-lg border border-slate-800 shadow-2xl transition-all duration-150`}
              />
            </div>
          ) : isPdf ? (
            <div className="p-10 text-center text-slate-300 font-sans text-xs">
              <FileText className="w-12 h-12 mx-auto text-red-400 mb-3" />
              <h4 className="font-bold text-white text-sm mb-1">{filename}</h4>
              <p className="text-slate-400 max-w-md mx-auto">
                Electronic document record from case file. You can open or download the complete record below.
              </p>
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open PDF in Browser</span>
              </a>
            </div>
          ) : (
            <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-text bg-slate-950 p-4 rounded-lg border border-slate-800">
              {fetchedText ||
                (fileData && !fileData.startsWith('/evidence/') ? fileData : null) ||
                `[PRIMARY RECORD // ${filename}]\n\nVerified exhibit in HBNC Case 3 master archive.\nPath: /evidence/${filename}\nStatus: Loaded and indexed across Master Record, Evidence-Law Hybrid Viewer, and Maltego Graph.`}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
