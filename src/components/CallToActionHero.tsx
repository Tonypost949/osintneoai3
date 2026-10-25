import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  Scale,
  Activity,
  Shield,
  Users,
  Mail,
  CheckCircle2,
  Flame,
  FileText,
  Volume2,
  Copy,
  Zap,
  ExternalLink
} from 'lucide-react';
import { SIX_DEMANDS } from '../utils/dossierData';
import { playCyberChime } from '../utils/audioEngine';

interface CallToActionHeroProps {
  onSelectRole: (role: 'counsel' | 'agency' | 'physician' | 'public') => void;
  onOpenActionEmail: () => void;
  onJumpToSection: (sectionId: string) => void;
}

export const CallToActionHero: React.FC<CallToActionHeroProps> = ({
  onSelectRole,
  onOpenActionEmail,
  onJumpToSection,
}) => {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'smoking-guns' | 'demands'>('breakdown');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleCopyMemo = () => {
    playCyberChime(1.1);
    const summary = [
      'HBNC CASE 3 — RELATOR & INTAKE EVALUATION MEMORANDUM',
      'Site: 17631 Cameron Lane, Huntington Beach, CA (Mercy House Living Centers)',
      'Victims: Elizabeth Tina Petruccio (disabled 62-year-old mother & resident) & Anthony DiMarcello III (caregiver son)',
      'Contaminant: Hexavalent Chromium at 980 µg/kg (49x DTSC residential screening limit)',
      'Breach: Asphalt cap breached by anchor bolts under beds on Nov 7, 2023 (1-yr warranty expired)',
      'Injury: Admitted 01/12/2024 to Scripps Mercy with empyema (103,752 WBC), intubated, 62 days ICU; expelled while intubated',
      'Void Ab Initio Deal: Mitsuru Yamada trustee on UPX1978058 with 0 Form 700s, paralleling Mayor Sidhu Angel Stadium wire fraud',
      'Legal Relief: 8 Fee-shifting claims under ADA, FHA, RCRA, Gov Code 835, EADACPA 15657, Thomson v. Call disgorgement.',
      'Contact: amd949609@gmail.com'
    ].join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    });
  };

  return (
    <section id="cta-action-hero" className="mb-10 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/40 border-2 border-red-500/70 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badges & Urgency Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-widest text-red-400 font-mono">
            URGENT INTERVENTION WINDOW // STATUTORY SPOLIATION NOTICE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono bg-amber-950/80 border border-amber-700/70 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Gov. Code § 911.2 &middot; CCP § 335.1</span>
          </div>

          <button
            onClick={handleCopyMemo}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition-all"
            title="Quick Copy Case Executive Summary"
          >
            <Copy className="w-3 h-3" />
            <span>{copiedNotification ? '✓ Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Main Headline */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
        Hexavalent Chromium at 49&times; EPA Limits &amp; Retaliatory ICU Expulsion at Huntington Beach Shelter
      </h2>

      {/* Subtitle / Core Narrative Card */}
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-serif max-w-4xl bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
        A 62-year-old disabled mother and resident (<span className="text-white font-semibold">Elizabeth Petruccio</span>) and her caregiver son (<span className="text-white font-semibold">Anthony DiMarcello III</span>) were placed in a municipal shelter built over soil contaminated with <span className="text-red-400 font-bold underline decoration-red-500 underline-offset-4">hexavalent chromium at 49&times; the state residential screening limit</span>. County approval was conditioned on an asphalt cap that the City contracted with only a <span className="text-amber-300 font-bold">1-year warranty</span>. On November 7, 2023, anchor bolts punctured the cap beneath resident beds. Within nine weeks Elizabeth was intubated in the ICU with sepsis and pleural empyema—and <span className="text-red-400 font-bold">the shelter expelled and locked her out while on life support</span>.
      </p>

      {/* Visual Live KPI Metrics with Neon Dials */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 font-mono">
        <div className="bg-slate-950/90 border border-red-500/60 rounded-xl p-3 text-center shadow-lg hover:border-red-400 transition-all">
          <span className="block text-2xl font-black text-red-400">980</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">µg/kg Cr(VI) Peak</span>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
            <div className="bg-red-500 h-full w-[98%]" />
          </div>
        </div>

        <div className="bg-slate-950/90 border border-red-500/60 rounded-xl p-3 text-center shadow-lg hover:border-red-400 transition-all">
          <span className="block text-2xl font-black text-red-400">49&times;</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">DTSC Screening</span>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
            <div className="bg-red-500 h-full w-[100%]" />
          </div>
        </div>

        <div className="bg-slate-950/90 border border-amber-500/60 rounded-xl p-3 text-center shadow-lg hover:border-amber-400 transition-all">
          <span className="block text-2xl font-black text-amber-400">1 Year</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Cap Warranty</span>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
            <div className="bg-amber-500 h-full w-[25%]" />
          </div>
        </div>

        <div className="bg-slate-950/90 border border-blue-500/60 rounded-xl p-3 text-center shadow-lg hover:border-blue-400 transition-all">
          <span className="block text-2xl font-black text-blue-400">62 Days</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Scripps ICU Stay</span>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
            <div className="bg-blue-500 h-full w-[85%]" />
          </div>
        </div>

        <div className="bg-slate-950/90 border border-purple-500/60 rounded-xl p-3 text-center shadow-lg hover:border-purple-400 transition-all">
          <span className="block text-2xl font-black text-purple-400">6 Cases</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Victim Cluster</span>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
            <div className="bg-purple-500 h-full w-[70%]" />
          </div>
        </div>

        <div className="bg-slate-950/90 border border-emerald-500/60 rounded-xl p-3 text-center shadow-lg hover:border-emerald-400 transition-all">
          <span className="block text-2xl font-black text-emerald-400">184</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Dispatches</span>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
            <div className="bg-emerald-500 h-full w-[95%]" />
          </div>
        </div>
      </div>

      {/* Streamlined Interactive Section Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'breakdown'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>30-Second Forensic Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('smoking-guns')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'smoking-guns'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>The 3 Smoking Guns</span>
          </button>

          <button
            onClick={() => setActiveTab('demands')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'demands'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>The Six Demands</span>
          </button>
        </div>

        {/* Tab 1: 30-Second Forensic Breakdown */}
        {activeTab === 'breakdown' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase block mb-1">
                STEP 01 // TOXIC SITE ACQUISITION
              </span>
              <h4 className="font-bold text-white text-sm mb-1">Heavy Industrial Chemical Plume</h4>
              <p className="text-slate-400">
                17631 Cameron Lane: former auto &amp; aerospace site contaminated with Hexavalent Chromium (49× screening level), Trichloroethene, and Arsenic. County mandated an unbroken asphalt cap.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block mb-1">
                STEP 02 // BREACH BENEATH BEDS
              </span>
              <h4 className="font-bold text-white text-sm mb-1">Nov 7, 2023 Anchor Bolt Breach</h4>
              <p className="text-slate-400">
                City contracted an asphalt cap with only a 1-year warranty. Anchor bolts drilled directly into the contaminated sub-slab floor right where Elizabeth Petruccio slept.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                STEP 03 // ICU INTUBATION &amp; LOCKOUT
              </span>
              <h4 className="font-bold text-white text-sm mb-1">62 Days Sepsis ICU &amp; 30-Day Ban</h4>
              <p className="text-slate-400">
                Elizabeth admitted 01/12/2024 with 103,752 WBC empyema and sepsis. Shelter applied rigid 7-day rule, dumped her belongings, and barred her while in intensive care.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: The 3 Smoking Guns */}
        {activeTab === 'smoking-guns' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed font-mono">
            <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/50">
              <span className="text-amber-400 font-bold block mb-1">GUN #1: County Approval</span>
              <p className="text-slate-300 font-sans mb-2">
                County briefing approved human occupancy <b>ONLY "as long as an asphalt pavement cover was placed over the soil."</b>
              </p>
              <span className="text-[10px] text-cyan-400">Exhibit: navigation_center_003.jpg</span>
            </div>

            <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/50">
              <span className="text-amber-400 font-bold block mb-1">GUN #2: 1-Year Cap Contract</span>
              <p className="text-slate-300 font-sans mb-2">
                City contract Laserfiche #5406552 warranted the 2-inch cap for only <b>1 single year</b> with untrained, non-HAZWOPER labor.
              </p>
              <span className="text-[10px] text-cyan-400">Exhibit: Laserfiche #5406552</span>
            </div>

            <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/50">
              <span className="text-amber-400 font-bold block mb-1">GUN #3: ICU Expulsion Record</span>
              <p className="text-slate-300 font-sans mb-2">
                Scripps EHR p. 985: Shelter discharged Elizabeth on 01/19/2024 while intubated in ICU and barred her from returning for 30 days.
              </p>
              <span className="text-[10px] text-cyan-400">Exhibit: scripps_ehr_page_985.png</span>
            </div>
          </div>
        )}

        {/* Tab 3: The Six Demands */}
        {activeTab === 'demands' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            {SIX_DEMANDS.map((demand) => (
              <div key={demand.number} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-red-400">Demand #{demand.number}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {demand.badge}
                  </span>
                </div>
                <h5 className="font-bold text-slate-200 mb-1">{demand.title}</h5>
                <p className="text-slate-400 leading-relaxed text-[11px]">{demand.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role-Based Action Selection Buttons */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-mono">
          <span>Choose Your Role &amp; Access Immediate Proof:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onSelectRole('counsel')}
            className="text-left bg-slate-950/80 hover:bg-slate-900 border-t-4 border-t-red-500 border border-slate-800 rounded-xl p-4 transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Scale className="w-5 h-5 text-red-400" />
              <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded font-mono">Intake Ready</span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-red-300 mb-1">
              Civil Rights &amp; Tort Counsel
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access the element-by-element statutory matrix, 8 fee-shifting claims (ADA, FHA, RCRA, EADACPA), and active clocks.
            </p>
          </button>

          <button
            onClick={() => onSelectRole('agency')}
            className="text-left bg-slate-950/80 hover:bg-slate-900 border-t-4 border-t-emerald-500 border border-slate-800 rounded-xl p-4 transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-mono">Oversight</span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 mb-1">
              Agency Investigators (HUD/DTSC)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect the smoking gun document pair: County approval vs. 1-year warranty contract and Nov 7, 2023 breach photos.
            </p>
          </button>

          <button
            onClick={() => onSelectRole('physician')}
            className="text-left bg-slate-950/80 hover:bg-slate-900 border-t-4 border-t-blue-500 border border-slate-800 rounded-xl p-4 transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded font-mono">Clinical</span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-300 mb-1">
              Physicians &amp; Hygienists
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare 1,400+ page Scripps EHR discrepancy (social work documented shelter; 25+ MDs omitted it) and 6-resident cluster.
            </p>
          </button>

          <button
            onClick={() => onSelectRole('public')}
            className="text-left bg-slate-950/80 hover:bg-slate-900 border-t-4 border-t-purple-500 border border-slate-800 rounded-xl p-4 transition-all hover:scale-[1.01] group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded font-mono">Upload / Act</span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-300 mb-1">
              Victims, Press &amp; Public
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload personal exposure records (.zip or any file), check contamination symptoms without login, or send ready transmittals.
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};
