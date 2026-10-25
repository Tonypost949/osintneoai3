import React, { useState } from 'react';
import JSZip from 'jszip';
import { COMPANION_FILES } from '../utils/dossierData';
import { FolderOpen, Upload, FileText, Image as ImageIcon, Search, Download, CheckCircle2, FileArchive, Eye, Lock } from 'lucide-react';

interface EvidenceLockerViewProps {
  onOpenFileInViewer: (filename: string, fileData?: string) => void;
}

interface LoadedFileItem {
  name: string;
  size: string;
  relPath: string;
  type: string;
  blobUrl?: string;
  isZipExtracted?: boolean;
}

export const EvidenceLockerView: React.FC<EvidenceLockerViewProps> = ({ onOpenFileInViewer }) => {
  const [localIndexedFiles, setLocalIndexedFiles] = useState<LoadedFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProcessingZip, setIsProcessingZip] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Handle ANY file upload including ZIP archives and whole folders
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setStatusMessage('Processing files...');
    const newItems: LoadedFileItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const relPath = file.webkitRelativePath || file.name;
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      // If it's a ZIP file, unpack and index its contents with JSZip!
      if (file.name.toLowerCase().endsWith('.zip')) {
        setIsProcessingZip(true);
        setStatusMessage(`Unpacking ZIP archive: ${file.name}...`);
        try {
          const zip = await JSZip.loadAsync(file);
          const zipFileNames = Object.keys(zip.files);
          zipFileNames.forEach((zPath) => {
            const zFile = zip.files[zPath];
            if (!zFile.dir) {
              newItems.push({
                name: zPath.split('/').pop() || zPath,
                relPath: `${file.name} > ${zPath}`,
                size: 'Extracted from ZIP',
                type: zPath.split('.').pop() || 'unknown',
                isZipExtracted: true,
              });
            }
          });
        } catch (err) {
          console.error('Error unpacking zip:', err);
        } finally {
          setIsProcessingZip(false);
        }
      } else {
        const blobUrl = URL.createObjectURL(file);
        newItems.push({
          name: file.name,
          relPath: relPath,
          size: sizeStr,
          type: file.name.split('.').pop() || 'unknown',
          blobUrl,
        });
      }
    }

    setLocalIndexedFiles((prev) => [...newItems, ...prev]);
    setStatusMessage(`Successfully connected ${newItems.length} files to Evidence Locker!`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const filteredLocalFiles = localIndexedFiles.filter((f) => {
    const q = searchQuery.toLowerCase();
    return !q || f.name.toLowerCase().includes(q) || f.relPath.toLowerCase().includes(q);
  });

  return (
    <div id="locker-root" className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header Card */}
      <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-extrabold text-white">
              Evidence Locker &amp; Multi-Archive Hub (HBNC_Case_3)
            </h2>
          </div>
          <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded font-bold">
            ZIP &middot; Folders &middot; Subfolders &middot; All Files Allowed
          </span>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-serif">
          Connect your local <code>HBNC_Case_3</code> directory or upload any <code>.zip</code> file, document, photo, or medical PDF. Every citation across the dossier automatically cross-references and activates working previews.
        </p>

        {/* Upload & Folder Buttons */}
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg cursor-pointer transition-all">
            <FolderOpen className="w-4 h-4" />
            <span>Select Folder / Subfolders (webkitdirectory)</span>
            <input
              type="file"
              {...({ webkitdirectory: '', directory: '' } as any)}
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs shadow-md cursor-pointer transition-all">
            <FileArchive className="w-4 h-4 text-amber-400" />
            <span>Upload .ZIP Archive or Any File</span>
            <input
              type="file"
              multiple
              accept="*/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {statusMessage && (
          <div className="mt-4 p-2.5 bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 text-xs rounded-lg animate-in fade-in">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Pre-Indexed Companion Files (00 to 11) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Core Case Companion Files in HBNC_Case_3 (00 to 11):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {COMPANION_FILES.map((file) => (
            <div
              key={file.filename}
              onClick={() => onOpenFileInViewer(file.filename)}
              className="bg-slate-950 border border-slate-800 hover:border-cyan-500/80 p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-2 group"
            >
              <div className="min-w-0">
                <span className="font-mono text-slate-200 group-hover:text-cyan-300 font-semibold block truncate">
                  {file.filename}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">{file.desc}</span>
              </div>
              <span className="bg-slate-900 text-cyan-400 border border-cyan-900 px-2 py-0.5 rounded text-[10px] font-mono shrink-0">
                {file.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Subfolders Status Strip */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono">Known Subfolders in Root:</span>
          <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono">📁 Evidence_Locker/</span>
          <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono">📁 Hosted_Dossiers/</span>
          <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono">📁 HBNC_Case_2/</span>
          <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono">📁 desktop items for this/</span>
        </div>
        <span className="text-slate-500 font-mono text-[11px]">
          Files automatically mapped across subfolders
        </span>
      </div>

      {/* User Connected & Extracted Files Section */}
      {localIndexedFiles.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Locally Connected Files ({localIndexedFiles.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Available for instant inspection</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search connected files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500 w-52 sm:w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs max-h-80 overflow-y-auto">
            {filteredLocalFiles.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onOpenFileInViewer(item.name, item.blobUrl)}
                className="bg-slate-950 border border-slate-800 hover:border-cyan-500/80 p-2.5 rounded-lg flex items-center justify-between gap-2 cursor-pointer transition-all"
              >
                <div className="min-w-0">
                  <div className="font-mono text-slate-200 truncate font-semibold">{item.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{item.relPath}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded">
                    {item.size}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
