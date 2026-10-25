import React from 'react';
import { X, ExternalLink, Download, FileText, Image as ImageIcon } from 'lucide-react';

interface FileViewerModalProps {
  filename: string | null;
  fileData?: string | null;
  onClose: () => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  filename,
  fileData,
  onClose,
}) => {
  if (!filename) return null;

  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename);
  const isPdf = /\.pdf$/i.test(filename);
  const isText = /\.(md|txt|json|html|csv)$/i.test(filename);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {isImage ? (
              <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <h3 className="text-sm font-bold text-white font-mono truncate">{filename}</h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {fileData && (
              <a
                href={fileData}
                download={filename}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/70">
          {isImage ? (
            <div className="flex flex-col items-center justify-center">
              {fileData ? (
                <img src={fileData} alt={filename} className="max-h-[60vh] object-contain rounded-lg border border-slate-800" />
              ) : (
                <div className="p-12 text-center text-slate-400 font-mono text-xs">
                  <ImageIcon className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                  <p>Photo Asset: <b>{filename}</b></p>
                  <p className="text-slate-500 mt-1">Stored in local Evidence_Locker folder. Click 'Scan Folder' to connect full-resolution bytes.</p>
                </div>
              )}
            </div>
          ) : isPdf ? (
            <div className="p-10 text-center text-slate-300 font-sans text-xs">
              <FileText className="w-12 h-12 mx-auto text-red-400 mb-3" />
              <h4 className="font-bold text-white text-sm mb-1">{filename}</h4>
              <p className="text-slate-400 max-w-md mx-auto">
                Electronic document record from case file. You can open or download the complete PDF below.
              </p>
              {fileData && (
                <a
                  href={fileData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open PDF in Browser</span>
                </a>
              )}
            </div>
          ) : (
            <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
              {fileData || `[DOCUMENT PREVIEW // ${filename}]\n\nFormal case document in HBNC Case 3 master archive.\nRelative path: Evidence_Locker/${filename}\nStatus: Sourced and cataloged.`}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
