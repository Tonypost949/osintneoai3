import React, { useState } from 'react';
import { TagType } from '../types';
import { SIX_RESIDENTS, CONTAMINATION_TABLE, GROUNDWATER_TABLE, VERIFICATION_REGISTER } from '../utils/dossierData';
import {
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Shield,
  Calendar,
  MapPin,
  Eye,
  FileText,
  ChevronRight,
  Flame,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Clock,
  ArrowRight
} from 'lucide-react';
import { playCyberChime } from '../utils/audioEngine';

interface MasterRecordViewProps {
  onOpenFileInViewer: (filename: string) => void;
  isStreamlinedMode?: boolean;
}

export const MasterRecordView: React.FC<MasterRecordViewProps> = ({
  onOpenFileInViewer,
  isStreamlinedMode = true,
}) => {
  const [activeTagFilter, setActiveTagFilter] = useState<'ALL' | TagType>('ALL');
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(0);

  const TIMELINE_STEPS = [
    {
      step: 1,
      date: '2018–2020',
      title: 'Toxic Site Allocation ($6.09M)',
      desc: 'City acquires 17631 Cameron Lane. Former auto/industrial yard with GeoTracker ID T10000018579. Trustee Mitsuru Yamada files 0 FPPC Form 700 statements.',
      exhibit: 'navigation_center_003.jpg',
      tag: 'RECORD' as TagType,
    },
    {
      step: 2,
      date: '2020–2021',
      title: 'County Approval Condition',
      desc: 'County conditions human occupancy ONLY as long as an asphalt pavement cap is maintained. City contract Laserfiche #5406552 gives cap only a 1-year warranty with untrained labor.',
      exhibit: 'Laserfiche #5406552',
      tag: 'RECORD' as TagType,
    },
    {
      step: 3,
      date: 'Nov 7, 2023',
      title: 'Bed Anchor Bolt Breach',
      desc: 'Samsung SM-T580 photos document corroded steel anchor bolts driven through the asphalt cap beneath resident beds, exposing raw sub-slab soil (GPS 33.706389, -117.988611).',
      exhibit: 'HB_Shelter_Nov2023_photo_01.jpg',
      tag: 'RECORD' as TagType,
    },
    {
      step: 4,
      date: 'Jan 12, 2024',
      title: '62-Day Sepsis ICU Intubation',
      desc: 'Elizabeth Petruccio admitted to Scripps Mercy with bilateral pleural empyema (103,752 WBC), sepsis, discitis-osteomyelitis, and respiratory failure (weight fell 160 to 116 lb).',
      exhibit: 'scripps_ehr_page_1034.png',
      tag: 'RECORD' as TagType,
    },
    {
      step: 5,
      date: 'Jan 19, 2024',
      title: 'Retaliatory ICU Lockout (30 Days)',
      desc: 'While Elizabeth was intubated on life support, shelter applied 7-day rule, dumped her belongings, and barred her from returning for 30 days (EHR p. 985).',
      exhibit: 'scripps_ehr_page_985.png',
      tag: 'RECORD' as TagType,
    },
  ];

  const renderTag = (tag: TagType) => {
    switch (tag) {
      case 'RECORD':
        return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 uppercase">RECORD</span>;
      case 'ACCOUNT':
        return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-700/60 uppercase">ACCOUNT</span>;
      case 'ALLEGATION':
        return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/60 uppercase">ALLEGATION</span>;
      case 'TO VERIFY':
        return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700/60 uppercase">TO VERIFY</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 text-slate-100 font-sans leading-relaxed">
      {/* Interactive 5-Step Incident Timeline Strip */}
      <section className="mb-8 bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 font-mono">
              INTERACTIVE FORENSIC TIMELINE // 5 FATAL STEPS
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Click any step to inspect</span>
        </div>

        {/* Timeline Step Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4 font-mono text-xs">
          {TIMELINE_STEPS.map((step, idx) => {
            const isCurr = activeTimelineStep === idx;
            return (
              <button
                key={step.step}
                onClick={() => {
                  playCyberChime(1.0 + idx * 0.05);
                  setActiveTimelineStep(idx);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurr
                    ? 'bg-cyan-950 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-300'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold ${isCurr ? 'text-amber-400' : 'text-slate-500'}`}>
                    STEP 0{step.step}
                  </span>
                  <span className="text-[10px] text-slate-400">{step.date}</span>
                </div>
                <div className={`font-bold text-xs truncate ${isCurr ? 'text-white' : 'text-slate-300'}`}>
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Timeline Step Deep Dive Card */}
        {TIMELINE_STEPS[activeTimelineStep] && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 font-mono">
                <span className="text-xs font-bold text-amber-400">
                  {TIMELINE_STEPS[activeTimelineStep].date} &middot; {TIMELINE_STEPS[activeTimelineStep].title}
                </span>
                {renderTag(TIMELINE_STEPS[activeTimelineStep].tag)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {TIMELINE_STEPS[activeTimelineStep].desc}
              </p>
            </div>

            <button
              onClick={() => onOpenFileInViewer(TIMELINE_STEPS[activeTimelineStep].exhibit)}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow cursor-pointer shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Exhibit</span>
            </button>
          </div>
        )}
      </section>

      {/* 3-Document Smoking Gun Grid */}
      <section id="site-section" className="mb-10">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4 font-mono">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
            The Three-Document Smoking Gun
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          {/* Doc 1 */}
          <div className="bg-slate-900/90 border border-amber-500/50 rounded-2xl p-5 hover:border-amber-400 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2 font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  DOCUMENT 1: Mandatory Cap
                </span>
                {renderTag('RECORD')}
              </div>
              <h4 className="font-bold text-white text-sm mb-2">County Human Occupancy Condition</h4>
              <p className="text-slate-300 leading-relaxed mb-4">
                County briefing records that the site was approved for human shelter occupancy <b>ONLY "as long as an asphalt pavement cover was placed over the soil."</b>
              </p>
            </div>
            <button
              onClick={() => onOpenFileInViewer('navigation_center_003.jpg')}
              className="w-full py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View navigation_center_003.jpg</span>
            </button>
          </div>

          {/* Doc 2 */}
          <div className="bg-slate-900/90 border border-red-500/50 rounded-2xl p-5 hover:border-red-400 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2 font-mono">
                <span className="text-red-400 font-bold uppercase tracking-wider text-[11px]">
                  DOCUMENT 2: 1-Year Warranty
                </span>
                {renderTag('RECORD')}
              </div>
              <h4 className="font-bold text-white text-sm mb-2">City Contract Laserfiche #5406552</h4>
              <p className="text-slate-300 leading-relaxed mb-4">
                City Contract ($2.41M) warranted that 2-inch cap for only <b>"one (1) year after acceptance."</b> Contractor admitted: <b>"CREW INSTALLING AC WILL NOT BE 40-HOUR TRAINED."</b>
              </p>
            </div>
            <button
              onClick={() => onOpenFileInViewer('Laserfiche #5406552')}
              className="w-full py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Laserfiche Contract</span>
            </button>
          </div>

          {/* Doc 3 */}
          <div className="bg-slate-900/90 border border-cyan-500/50 rounded-2xl p-5 hover:border-cyan-400 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2 font-mono">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                  DOCUMENT 3: Cap Breach
                </span>
                {renderTag('RECORD')}
              </div>
              <h4 className="font-bold text-white text-sm mb-2">Anchor Bolts Puncturing Beneath Beds</h4>
              <p className="text-slate-300 leading-relaxed mb-4">
                Samsung photos (Nov 7, 2023, GPS 33.706389, -117.988611) show corroded anchor bolts drilled through the cap beneath beds with sub-slab soil exposed.
              </p>
            </div>
            <button
              onClick={() => onOpenFileInViewer('HB_Shelter_Nov2023_photo_01.jpg')}
              className="w-full py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Nov 7 Breach Photo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Contamination Radar: 49x Hexavalent Chromium Visual Meter */}
      <section className="mb-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 font-mono">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              SOIL CONTAMINATION TELEMETRY // DTSC SCREENING BENCHMARKS
            </h3>
          </div>
          <span className="text-xs text-red-400 font-bold">GeoTracker ID T10000018579</span>
        </div>

        <div className="space-y-4 text-xs font-mono">
          {CONTAMINATION_TABLE.map((row, i) => {
            const isCrVI = row.contaminant.includes('Cr(VI)');
            return (
              <div key={i} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-white text-sm">{row.contaminant}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Concentration: <strong className="text-red-400">{row.concentration}</strong></span>
                    <span className="text-slate-400">Benchmark: <strong className="text-emerald-400">{row.benchmark}</strong></span>
                    <span className="bg-red-950 text-red-300 px-2 py-0.5 rounded font-bold">{row.multiple}</span>
                  </div>
                </div>
                {/* Visual Ratio Bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isCrVI ? 'bg-gradient-to-r from-amber-500 to-red-500 w-[100%]' : 'bg-cyan-500 w-[60%]'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 6: Hospitalized Residents Cluster */}
      <section id="people-section" className="mb-10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4 font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              6 Hospitalized Residents Cluster &amp; Scripps EHR Evidence
            </h3>
          </div>
          <span className="text-xs text-blue-400 font-bold">1,400+ Page EHR Audit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {SIX_RESIDENTS.map((res, idx) => (
            <div
              key={res.id || idx}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5 font-mono">
                <span className="font-bold text-blue-300">Case #{idx + 1}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  {res.role}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm mb-1">{res.name}</h4>
              <p className="text-slate-400 text-xs mb-2 leading-relaxed">{res.documentedPathology}</p>
              <div className="flex flex-col gap-1 text-[11px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
                <div><span className="text-slate-400">Admissions:</span> {res.hospitalizations}</div>
                <div><span className="text-slate-400">Status:</span> <span className="text-amber-400 font-bold">{res.outcomeStatus}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Section 15: Verification Register */}
      <section id="verify-section" className="mb-8 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Verification Register (15 Key Evidence Items)
            </h3>
          </div>
          <span className="text-xs text-emerald-400">Primary Source Verified</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse bg-slate-950 border border-slate-800 rounded-lg">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-2.5">Factual Item to Verify</th>
                <th className="p-2.5">Primary Source Document</th>
                <th className="p-2.5">Verification Date / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
              {VERIFICATION_REGISTER.map((reg, i) => (
                <tr key={i} className="hover:bg-slate-900/50">
                  <td className="p-2.5 font-medium text-white font-sans">{reg.item}</td>
                  <td className="p-2.5 text-slate-400">{reg.source}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{reg.verified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
