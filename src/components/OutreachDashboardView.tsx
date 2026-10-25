import React, { useState } from 'react';
import { STATIC_OUTREACH_TELEMETRY, STATIC_OUTREACH_DISPATCHES } from '../utils/csvParser';
import { BarChart3, Search, Send, CheckCircle2, ShieldAlert, FileText, ExternalLink, Filter, Building2, Calendar } from 'lucide-react';

export const OutreachDashboardView: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const telemetry = STATIC_OUTREACH_TELEMETRY;

  const filteredDispatches = STATIC_OUTREACH_DISPATCHES.filter((d) => {
    const matchesSector = selectedSector === 'ALL' || d.sector.toLowerCase().includes(selectedSector.toLowerCase());
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q ||
      d.targetEntity.toLowerCase().includes(q) ||
      d.subject.toLowerCase().includes(q) ||
      d.docketId.toLowerCase().includes(q) ||
      d.agencyResponse.toLowerCase().includes(q);
    return matchesSector && matchesQuery;
  });

  return (
    <div id="outreach-root" className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border-2 border-purple-500/80 rounded-xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-extrabold text-white">
              Five-Year Outreach &amp; Dispatch Analytics Dashboard (2021–2026)
            </h2>
          </div>
          <span className="text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-1 rounded font-bold">
            184 Cataloged Dispatches &middot; 100% Telemetry Coverage
          </span>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-serif">
          Comprehensive transmission tracking across 76 public oversight agencies, federal law enforcement bodies, congressional committees, and academic legal clinics. Confirms constructive notice, exhaustion of administrative remedies, and active federal tracking dockets.
        </p>

        {/* 5 Big Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="block text-2xl font-mono font-bold text-white">{telemetry.totalRecords}</span>
            <span className="text-[10px] uppercase text-slate-400 font-semibold">Total Records</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="block text-2xl font-mono font-bold text-cyan-400">{telemetry.publicSectorFilings}</span>
            <span className="text-[10px] uppercase text-slate-400 font-semibold">Public Filings</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="block text-2xl font-mono font-bold text-emerald-400">{telemetry.successfulDispatches}</span>
            <span className="text-[10px] uppercase text-slate-400 font-semibold">Delivered Filings</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="block text-2xl font-mono font-bold text-rose-400">{telemetry.bouncedBlocked}</span>
            <span className="text-[10px] uppercase text-slate-400 font-semibold">Perimeter Drops</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="block text-2xl font-mono font-bold text-amber-400">{telemetry.agencyResponses}</span>
            <span className="text-[10px] uppercase text-slate-400 font-semibold">Formal Replies</span>
          </div>
        </div>
      </div>

      {/* Active Federal Control Dockets Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/70 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">ACTIVE FEDERAL AUDIT DOCKET</span>
            <span className="bg-emerald-900/80 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded">GAO FraudNet</span>
          </div>
          <h3 className="text-lg font-bold text-white font-mono mb-1">DOCKET ID: COMP-26-004512</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Assigned for federal municipal program and grant fraud audit regarding $598.7M public homelessness funding allocations.
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/70 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase">FEDERAL LAW ENFORCEMENT COMPLAINT</span>
            <span className="bg-red-900/80 text-red-200 text-[10px] font-mono px-2 py-0.5 rounded">FBI Public Corruption</span>
          </div>
          <h3 className="text-lg font-bold text-white font-mono mb-1">DOCKET ID: 20IC002</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Electronic complaint record filed following direct perimeter email drops; active federal corruption referral.
          </p>
        </div>
      </div>

      {/* Sector Breakdown & Year Trend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 text-xs">
        {/* Sector Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Outreach Distribution by Sector</span>
          </h3>
          <div className="space-y-2.5">
            {telemetry.sectorBreakdown.map((sec, idx) => (
              <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-200">{sec.category}</span>
                  <span className="font-mono text-cyan-400 font-bold">{sec.count} ({sec.share})</span>
                </div>
                <div className="text-[11px] text-slate-400">{sec.focus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Yearly Trajectory */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Outreach Dissemination Timeline (2021–2026)</span>
          </h3>
          <div className="space-y-2.5">
            {telemetry.yearlyBreakdown.map((yr, idx) => (
              <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white font-mono">{yr.year}</span>
                  <span className="font-mono text-purple-400 font-bold">{yr.count} Dispatches ({yr.share})</span>
                </div>
                <div className="text-[11px] text-slate-400">{yr.milestone}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Dispatch Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Documented Agency Replies &amp; Key Filings</h3>
            <span className="text-xs text-slate-400">Sample of 10 formal replies and active federal dockets</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search agency, docket, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-purple-500 w-52 sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse bg-slate-950 border border-slate-800 rounded-lg">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Target Entity / Agency</th>
                <th className="p-2.5">Subject / Formal Topic</th>
                <th className="p-2.5">Disposition</th>
                <th className="p-2.5">Docket / Control ID</th>
                <th className="p-2.5">Evidentiary Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredDispatches.map((disp) => (
                <tr key={disp.id} className="hover:bg-slate-900/50">
                  <td className="p-2.5 font-mono text-slate-400 whitespace-nowrap">{disp.date}</td>
                  <td className="p-2.5 font-bold text-white">{disp.targetEntity}</td>
                  <td className="p-2.5">{disp.subject}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                      {disp.disposition}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-purple-400 font-semibold">{disp.docketId}</td>
                  <td className="p-2.5 text-slate-400">{disp.evidentiarySignificance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
