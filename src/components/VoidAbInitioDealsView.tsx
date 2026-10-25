import React, { useState } from 'react';
import { Scale, AlertTriangle, ShieldCheck, FileText, Download, CheckCircle2, ChevronRight, Gavel, Building, Landmark, ExternalLink, Hash } from 'lucide-react';

interface DealDetail {
  id: string;
  dealNumber: 1 | 2;
  title: string;
  location: string;
  valuation: string;
  keyActors: string;
  form700Finding: string;
  statutoryGrounds: string;
  plumeOrFraudDetail: string;
  courtDocket: string;
  status: string;
}

const DEALS: DealDetail[] = [
  {
    id: 'deal-hbnc',
    dealNumber: 1,
    title: 'DEAL 1: HBNC Shelter Acquisition & Easement Steering',
    location: '17631 Cameron Lane / 17642 Beach Blvd, Huntington Beach, CA 92648',
    valuation: '$6,094,847 Public Allocation',
    keyActors: 'Mitsuru Yamada (Trustee) · 25-Year OC Environmental Management Agency (EMA) Subdivision Engineer',
    form700Finding: 'ZERO (0) FPPC Form 700 Filings on Record · Omission of Reciprocal Easement UPX1978058 (Chen-Yamada)',
    statutoryGrounds: 'Cal. Gov. Code § 1090 · Void Ab Initio · Mandatory Strict Disgorgement under Thomson v. Call (38 Cal.3d 633)',
    plumeOrFraudDetail: 'GeoTracker Plume T10000018579 · Hexavalent Chromium Cr(VI) at 49× DTSC Residential Limit (980 µg/kg) · Unsealed Asphalt Cap',
    courtDocket: 'Knabb v. City of Huntington Beach, No. 8:26-cv-00348-JWH-ADS (C.D. Cal.) · Clerk\'s Entry of Default (ECF 82) · SAVC ECF 115',
    status: 'ACTIVE CHALLENGE · VOID AB INITIO DEFECT',
  },
  {
    id: 'deal-angel-stadium',
    dealNumber: 2,
    title: 'DEAL 2: Anaheim Angel Stadium Land Sale & Sidhu Plea',
    location: '2000 E Gene Autry Way, Anaheim, CA 92806',
    valuation: '$320,000,000 Public Land Transaction',
    keyActors: 'Mayor Harry Sidhu & SRB Management (Arte Moreno) · Anaheim Chamber of Commerce Conduit',
    form700Finding: 'Omission of Secret Negotiations, Campaign Flight Gifts & Real Estate Lobbyist Conduits from FPPC Form 700',
    statutoryGrounds: 'Honest Services Wire Fraud (18 U.S.C. §§ 1343, 1346) · Unanimously Voided by Anaheim City Council May 24, 2022',
    plumeOrFraudDetail: 'Surreptitious disclosure of confidential municipal appraisals & land valuation secrets to commercial buyer',
    courtDocket: 'United States v. Sidhu, No. 8:23-cr-00114-JWH (C.D. Cal.) · Guilty Plea before Hon. John W. Holcomb',
    status: 'DECLARED VOID BY CITY COUNCIL · FEDERAL CONVICTION',
  },
];

export const VoidAbInitioDealsView: React.FC = () => {
  const [selectedDeal, setSelectedDeal] = useState<DealDetail | null>(null);

  const exportAuditJson = () => {
    const payload = {
      archiveTitle: 'FORM 700 & VOID AB INITIO DUAL DEAL FORENSIC MATRIX',
      cryptographicSeniority: {
        relatorTransmissionDate: '2022-05-23T08:14:00Z',
        sha256Hash: 'cc5d02b68f4c7c69b2be61f1fe906a8a1962704531ee443a01ce07faf0576834',
        noticeSignificance: 'Pre-dates Anaheim City Council voidance vote of May 24, 2022 and establishes priority notice',
      },
      judicialNoticeNexus: {
        presidingJudge: 'Hon. John W. Holcomb (U.S. District Court, Central District of California)',
        freRule: 'Federal Rule of Evidence 201 Mandatory Judicial Notice',
        criminalMatter: 'USA v. Sidhu, No. 8:23-cr-00114-JWH (Honest services wire fraud guilty plea)',
        civilMatter: 'Knabb v. City of Huntington Beach, No. 8:26-cv-00348-JWH-ADS (Clerk\'s Entry of Default ECF 82)',
      },
      controllingPrecedents: [
        {
          citation: 'Thomson v. Call (1985) 38 Cal.3d 633',
          doctrine: '100% strict disgorgement of public funds without offset; fairness or good faith is no defense; public entity has no capacity to ratify void contract.',
        },
        {
          citation: 'Lewis & Queen v. N. M. Ball Sons (1957) 48 Cal.2d 141',
          doctrine: 'Mandatory affirmative judicial duty to sua sponte refuse relief on contracts violating public policy, regardless of party pleadings.',
        },
      ],
      deals: DEALS,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Void_Ab_Initio_Deals_Form700_Audit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="void-deals-root" className="max-w-6xl mx-auto px-4 py-8">
      {/* Cryptographic Seniority Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-2 border-purple-500/80 rounded-xl p-5 mb-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-black uppercase tracking-widest text-purple-300 font-mono">
              CRYPTOGRAPHIC SENIORITY &middot; MAY 23, 2022 RELATOR NOTICE
            </span>
          </div>
          <span className="bg-purple-900/60 border border-purple-500/50 text-purple-200 text-[11px] font-mono px-2 py-0.5 rounded">
            Pre-Dates Anaheim Voidance Vote by 24 Hours
          </span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-lg border border-purple-900/60 font-mono text-xs text-slate-300 mb-2 overflow-x-auto">
          <span className="text-slate-500 block text-[10px] uppercase">May 23, 2022 Formal Transmission SHA-256 Digest:</span>
          <span className="text-purple-300 font-bold select-all">
            cc5d02b68f4c7c69b2be61f1fe906a8a1962704531ee443a01ce07faf0576834
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          This cryptographic digest establishes chronological priority and constructive legal notice of conflict-of-interest defects across Orange County municipal land transactions, linking the <b>May 24, 2022 Angel Stadium voidance</b> directly with the <b>Huntington Beach Navigation Center toxic site acquisition</b>.
        </p>
      </div>

      {/* Top Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-red-500" />
              <span>The Two Void Ab Initio Land Deals &amp; FPPC Form 700 Audit</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Cross-Case Judicial Notice (FRE 201) before Hon. John W. Holcomb &middot; <i>Thomson v. Call</i> Strict Disgorgement Doctrine
            </p>
          </div>
          <button
            onClick={exportAuditJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Structured JSON Audit</span>
          </button>
        </div>

        {/* Visual Comparison Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950 border border-red-900/60 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-red-400 font-bold block mb-1">
              Deal 1 Exposure: Huntington Beach Navigation Center
            </span>
            <div className="text-2xl font-black text-white font-mono mb-1">$6,094,847 Public Allocation</div>
            <p className="text-xs text-slate-400">
              Purchased over GeoTracker T10000018579 toxic plume. Subdivision engineer Mitsuru Yamada held trustee ownership with <b>0 Form 700 disclosures</b>.
            </p>
          </div>

          <div className="bg-slate-950 border border-blue-900/60 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block mb-1">
              Deal 2 Exposure: Anaheim Angel Stadium Land Sale
            </span>
            <div className="text-2xl font-black text-white font-mono mb-1">$320,000,000 Public Asset Sale</div>
            <p className="text-xs text-slate-400">
              Mayor Harry Sidhu pleaded guilty to honest services fraud in <i>USA v. Sidhu</i> (8:23-cr-00114-JWH). Deal declared <b>unanimously void ab initio</b> on May 24, 2022.
            </p>
          </div>
        </div>

        {/* Legal Controlling Authorities Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 text-xs space-y-2">
          <div className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Gavel className="w-4 h-4 text-amber-400" />
            <span>Controlling California Supreme Court Doctrine on Void Public Contracts:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
            <div className="bg-slate-900/90 p-3 rounded-md border border-slate-800">
              <strong className="text-white block font-mono">Thomson v. Call (1985) 38 Cal.3d 633:</strong>
              Contracts made in violation of conflict-of-interest statutes (Cal. Gov. Code § 1090) are <b>void ab initio</b>. The public entity is entitled to <b>100% strict disgorgement</b> of all public moneys paid without returning the property or providing any offset. Fairness or good faith is no defense.
            </div>
            <div className="bg-slate-900/90 p-3 rounded-md border border-slate-800">
              <strong className="text-white block font-mono">Lewis &amp; Queen v. N. M. Ball Sons (1957) 48 Cal.2d 141:</strong>
              Trial and appellate courts have an <b>affirmative mandatory duty to sua sponte refuse relief</b> on illegal or void public contracts, even if neither party raised the issue in their pleadings.
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Transaction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {DEALS.map((deal) => (
          <div
            key={deal.id}
            className={`bg-slate-900 border rounded-xl p-6 shadow-xl flex flex-col justify-between transition-all ${
              deal.dealNumber === 1
                ? 'border-red-500/70 hover:border-red-400'
                : 'border-blue-500/70 hover:border-blue-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  deal.dealNumber === 1
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {deal.status}
                </span>
                <span className="text-xs font-mono font-bold text-white">{deal.valuation}</span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">{deal.title}</h3>
              <p className="text-xs text-slate-400 font-mono mb-4">{deal.location}</p>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono uppercase block text-[10px]">Key Actor / Conflict Nexus:</span>
                  <p className="text-slate-200 mt-0.5 font-semibold">{deal.keyActors}</p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-mono uppercase block text-[10px]">FPPC Form 700 Omission Finding:</span>
                  <p className="text-slate-200 mt-0.5">{deal.form700Finding}</p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <span className="text-red-400 font-mono uppercase block text-[10px]">Environmental / Fraud Mechanism:</span>
                  <p className="text-slate-200 mt-0.5">{deal.plumeOrFraudDetail}</p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <span className="text-purple-400 font-mono uppercase block text-[10px]">Federal Docket (Hon. John W. Holcomb):</span>
                  <p className="text-slate-200 mt-0.5 font-mono">{deal.courtDocket}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">{deal.statutoryGrounds}</span>
              <button
                onClick={() => setSelectedDeal(deal)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <span>Drill Down</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Drill-Down Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-red-400 font-bold">Comprehensive Deal Brief</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedDeal.title}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedDeal.location}</p>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 uppercase font-mono block">Financial Valuation:</span>
                <span className="text-sm font-bold text-white">{selectedDeal.valuation}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-mono block">FPPC Disclosure Audit:</span>
                <p className="text-slate-300 mt-0.5">{selectedDeal.form700Finding}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-mono block">Controlling Statutory Grounds:</span>
                <p className="text-amber-300 mt-0.5 font-mono">{selectedDeal.statutoryGrounds}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-mono block">Federal Judicial Notice Nexus:</span>
                <p className="text-cyan-300 mt-0.5 font-mono">{selectedDeal.courtDocket}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDeal(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
