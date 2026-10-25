import React, { useState } from 'react';
import { STATIC_OSINT_REPOS, STATIC_OSINT_CATEGORIES } from '../utils/csvParser';
import { Database, Search, FolderGit2, ArrowRight, Layers, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';

export const OsintLibraryView: React.FC = () => {
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRepos = STATIC_OSINT_REPOS.filter((r) => {
    const matchesPriority = selectedPriority === 'ALL' || r.priority === selectedPriority;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || (r.recommendation && r.recommendation.toLowerCase().includes(q));
    return matchesPriority && matchesSearch;
  });

  return (
    <div id="osint-root" className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-extrabold text-white">
              OSINT Neo AI Research Library &amp; Repository Index
            </h2>
          </div>
          <span className="text-xs font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-1 rounded font-bold">
            3,344 Main Repo Files &middot; 15,320 Workload Across 31 Repos
          </span>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-serif">
          Consolidated investigative catalog synchronizing 31 intelligence repositories under <span className="text-amber-300 font-mono">github.com/Tonypost949/OSINTNeoAi</span> (Commit SHA: <code>7621be1ec45050fca551bc152ce571fbbd02ab77</code>). Full visible paths and direct verification links.
        </p>

        {/* Categories Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {STATIC_OSINT_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
              <span className="block font-mono font-bold text-white text-base">{cat.fileCount}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide block">{cat.category}</span>
              <span className="text-[10px] text-amber-400 font-mono mt-0.5 block">{cat.share}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'REFERENCE', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-all ${
                selectedPriority === p
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search repository or recommendation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-amber-500 w-56 sm:w-72"
          />
        </div>
      </div>

      {/* Repository Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {filteredRepos.map((repo, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-white text-sm flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-amber-400" />
                  <span>{repo.name}</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    repo.priority === 'CRITICAL'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : repo.priority === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : repo.priority === 'MEDIUM'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {repo.priority}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[11px] mb-3">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Files</span>
                  <span className="text-white font-bold">{repo.fileCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Copy</span>
                  <span className="text-emerald-400">{repo.actionsCopy}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Merge</span>
                  <span className="text-cyan-400">{repo.actionsMerge}</span>
                </div>
              </div>

              {repo.recommendation && (
                <p className="text-slate-300 text-xs leading-relaxed font-sans">
                  <b>Action:</b> {repo.recommendation}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between">
              <a
                href={`https://github.com/Tonypost949/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-mono text-[11px] flex items-center gap-1"
              >
                <span>View on GitHub</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
