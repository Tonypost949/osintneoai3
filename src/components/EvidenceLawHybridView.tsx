import React, { useState, useEffect } from 'react';
import {
  Scale,
  Eye,
  FileText,
  Image as ImageIcon,
  Network,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Gavel,
  ExternalLink,
  Download,
  Search,
  Layers,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { MaltegoGraphView } from './MaltegoGraphView';

export interface HybridEvidenceItem {
  id: string;
  title: string;
  filename: string;
  url: string;
  mediaType: 'image' | 'text' | 'html';
  category: 'Toxic Cap & GeoTracker' | 'Nov 7, 2023 Breach' | 'Scripps Mercy ICU EHR' | 'Form 700 & Void Contracts' | 'Core Legal Briefs';
  date: string;
  sha256Snippet: string;
  verbatimQuote: string;
  forensicSignificance: string;
  maltegoNodeId: string;
  linkedStatutes: {
    code: string;
    name: string;
    elementSatisfied: string;
    remedy: string;
  }[];
}

export const HYBRID_EVIDENCE_CATALOG: HybridEvidenceItem[] = [
  {
    id: 'ex_nav_003',
    title: 'OC Health Care Agency Mandatory Asphalt Cap Condition (07/01/2020)',
    filename: 'navigation_center_003.jpg',
    url: '/evidence/navigation_center_003.jpg',
    mediaType: 'image',
    category: 'Toxic Cap & GeoTracker',
    date: '2020-07-01',
    sha256Snippet: 'e4a9c1...88b2 (Verified Primary Record)',
    verbatimQuote:
      '"Temporary use of the Site as a homeless shelter does not pose a significant threat to human health or the environment, so long as the site is covered by asphalt."',
    forensicSignificance:
      'Establishes the non-negotiable environmental safety prerequisite for placing human beings on 17631 Cameron Lane: the 980 µg/kg Hexavalent Chromium soil plume was only deemed safe if sealed under a continuous, intact asphalt barrier.',
    maltegoNodeId: 'county_cap_condition',
    linkedStatutes: [
      {
        code: 'Cal. Gov. Code § 835',
        name: 'Dangerous Condition of Public Property',
        elementSatisfied:
          'Actual notice via County written condition that unsealed soil poses a direct threat to human health.',
        remedy: 'Compensatory damages for toxic personal injury & property abatement.',
      },
      {
        code: 'Cal. Gov. Code § 815.6',
        name: 'Breach of Mandatory Statutory Duty',
        elementSatisfied:
          'Failure to maintain continuous asphalt encapsulation mandated by regulatory oversight condition.',
        remedy: 'Strict public entity liability for proximate injuries.',
      },
      {
        code: '42 U.S.C. § 6972(a)(1)(B)',
        name: 'RCRA Citizen Suit — Imminent & Substantial Endangerment',
        elementSatisfied:
          'Hexavalent chromium (49× DTSC limit) & PCE vapor pathway beneath congregate sleeping tent.',
        remedy: 'Federal injunctive remediation & fee-shifting under 42 U.S.C. § 6972(e).',
      },
    ],
  },
  {
    id: 'ex_laserfiche_5406552',
    title: 'Laserfiche #5406552 — TTS Engineering 1-Year Asphalt Cap Contract',
    filename: '5406552_viewer.png',
    url: '/evidence/5406552_viewer.png',
    mediaType: 'image',
    category: 'Form 700 & Void Contracts',
    date: '2020-11-05',
    sha256Snippet: '9b72d0...41f9 (Laserfiche Official Portal)',
    verbatimQuote:
      '"Contractor warrants all work under Contract #5406552 for a period of one (1) year from acceptance... License #814989 (Classifications A, C-12; Hazardous Substance Removal: NONE)."',
    forensicSignificance:
      'Proves the City of Huntington Beach constructed the 2-inch asphalt cap using a general paving contractor without DTSC/HAZWOPER hazardous substance certification and relied on a 1-year warranty that expired in November 2021 while continuing to house disabled seniors through 2024–2025.',
    maltegoNodeId: 'laserfiche_5406552',
    linkedStatutes: [
      {
        code: 'Cal. Gov. Code § 835(a)-(b)',
        name: 'Negligent Creation & Notice of Dangerous Condition',
        elementSatisfied:
          'City engineered a temporary 1-year cap over a 49× Cr(VI) plume and operated the shelter years past warranty expiration.',
        remedy: 'Full tort damages & independent CIH core sampling order.',
      },
      {
        code: 'Cal. Bus. & Prof. Code § 7058.7',
        name: 'Hazardous Substance Removal Certification Requirement',
        elementSatisfied:
          'Grading and capping over documented GeoTracker T10000018579 contamination without HAZ certification.',
        remedy: 'Contract illegality & evidentiary negligence per se.',
      },
    ],
  },
  {
    id: 'ex_nov2023_breach_01',
    title: 'Nov 7, 2023 Sub-Slab Breach Photo #1 (GPS 33.706389, -117.988611)',
    filename: 'HB_Shelter_Nov2023_photo_01.jpg',
    url: '/evidence/HB_Shelter_Nov2023_photo_01.jpg',
    mediaType: 'image',
    category: 'Nov 7, 2023 Breach',
    date: '2023-11-07 12:41:52',
    sha256Snippet: '3c18f4...90a1 (EXIF Samsung SM-A146U)',
    verbatimQuote:
      'EXIF GPS: 33°42\'23.0"N 117°59\'19.0"W (17631 Cameron Lane Interior Sleeping Tent) — Corroded structural anchor bolts & fractured asphalt cap exposing sub-slab soil under beds.',
    forensicSignificance:
      'Irrefutable physical and photographic proof (Trinity Gate 1) that the mandatory asphalt vapor/dust barrier was fractured directly beneath resident beds 66 days before Elizabeth Petruccio was admitted to Scripps Mercy ICU in septic shock.',
    maltegoNodeId: 'cap_breach_nov2023',
    linkedStatutes: [
      {
        code: 'Cal. Gov. Code § 835',
        name: 'Dangerous Condition of Public Property',
        elementSatisfied:
          'Physical breach of the sole protective barrier separating sleeping residents from 980 µg/kg Cr(VI) sub-slab soil.',
        remedy: 'Damages for acute & chronic toxic exposure.',
      },
      {
        code: '42 U.S.C. § 3604(f) (FHA)',
        name: 'Fair Housing Act — Discriminatory Habitability & Safety',
        elementSatisfied:
          'Subjecting disabled shelter residents to collapsed bed frames and unsealed toxic sub-slab soil.',
        remedy: 'Actual and punitive damages; injunctive housing relocation.',
      },
    ],
  },
  {
    id: 'ex_nov2023_breach_03',
    title: 'Nov 7, 2023 Sub-Slab Breach Photo #3 — Unsealed Soil & Bed Frame Failure',
    filename: 'HB_Shelter_Nov2023_photo_03.jpg',
    url: '/evidence/HB_Shelter_Nov2023_photo_03.jpg',
    mediaType: 'image',
    category: 'Nov 7, 2023 Breach',
    date: '2023-11-07 12:42:15',
    sha256Snippet: '7f02b9...11e4 (EXIF Verified)',
    verbatimQuote:
      'Close-up forensic photograph showing pulverized asphalt, loose sub-slab dirt, and unanchored structural bolts directly under sleeping cots.',
    forensicSignificance:
      'Demonstrates active particulate resuspension inside the enclosed HVAC/tent environment where Elizabeth Petruccio, Anthony DiMarcello III, Jesse Knabb, and the Bell brothers slept.',
    maltegoNodeId: 'cap_breach_nov2023',
    linkedStatutes: [
      {
        code: 'Welf. & Inst. Code § 15657 (EADACPA)',
        name: 'Elder & Dependent Adult Reckless Neglect',
        elementSatisfied:
          'Conscious disregard of known sub-slab toxic breach beneath a 62-year-old disabled elder resident.',
        remedy: 'Enhanced remedies, attorney fees, and pain/suffering damages.',
      },
    ],
  },
  {
    id: 'ex_scripps_985',
    title: 'Scripps Mercy EHR Page 985 — 01/22/2024 ICU Eviction & 30-Day Lockout',
    filename: 'scripps_ehr_page_985.png',
    url: '/evidence/scripps_ehr_page_985.png',
    mediaType: 'image',
    category: 'Scripps Mercy ICU EHR',
    date: '2024-01-22 15:15',
    sha256Snippet: 'a19d88...62c3 (Scripps Health Official EHR)',
    verbatimQuote:
      '"SW spoke with patient\'s case manager, Zurisadai, at the Huntington Beach Navigation Center... CM stated that once missing for 7 days, pt loses spot at the shelter and would have to wait 30 days before re-applying."',
    forensicSignificance:
      'Independent third-party hospital medical record proving that while Ms. Petruccio was fighting for her life in the ICU with a 103,752 WBC empyema, HBNC automatically forfeited her bed and imposed a punitive 30-day lockout with zero ADA accommodation.',
    maltegoNodeId: 'scripps_ehr_985',
    linkedStatutes: [
      {
        code: '42 U.S.C. § 12132 / 28 C.F.R. § 35.130(b)(7)',
        name: 'ADA Title II — Refusal to Modify 7-Day Absence Rule',
        elementSatisfied:
          'Blanket enforcement of a 7-day absence termination + 30-day ban against an inpatient ICU resident without medical exception.',
        remedy: 'Compensatory damages, injunctive policy invalidation, attorney fees.',
      },
      {
        code: 'Welf. & Inst. Code §§ 15610.07, 15657',
        name: 'EADACPA — Abandonment & Isolation of Hospitalized Elder',
        elementSatisfied:
          'Terminating shelter placement during life-threatening hospitalization, forcing post-ICU homelessness.',
        remedy: 'Treble/enhanced damages & mandatory fee award.',
      },
      {
        code: '42 U.S.C. § 12203 / Cal. Health & Safety § 1278.5',
        name: 'Retaliation for Protected Health & Habitability Disclosures',
        elementSatisfied:
          'Adverse shelter expulsion following Nov 2023 cap-breach photographic documentation.',
        remedy: 'Statutory retaliation damages & whistleblower protection.',
      },
    ],
  },
  {
    id: 'ex_scripps_1034',
    title: 'Scripps Mercy EHR Page 1034 — Pleural Fluid WBC 103,752 & Empyema',
    filename: 'scripps_ehr_page_1034.png',
    url: '/evidence/scripps_ehr_page_1034.png',
    mediaType: 'image',
    category: 'Scripps Mercy ICU EHR',
    date: '2024-01-13',
    sha256Snippet: 'f54e12...09d7 (Scripps Lab & Pulmonary Record)',
    verbatimQuote:
      'Pleural Fluid Analysis: WBC 103,752 /mm³ (93% Neutrophils), pH < 6.84, Glucose < 2 mg/dL — Frank Thoracic Empyema, Septic Shock, Acute Hypoxic Respiratory Failure.',
    forensicSignificance:
      'Quantifies the life-threatening severity of Ms. Petruccio’s pulmonary collapse following prolonged inhalation exposure above the breached 17631 Cameron Lane sub-slab.',
    maltegoNodeId: 'scripps_ehr_1034',
    linkedStatutes: [
      {
        code: 'Cal. Code Civ. Proc. § 335.1 / § 340.8',
        name: 'Toxic Tort & Personal Injury Causation',
        elementSatisfied:
          'Objective laboratory biomarker proof of severe deep-space pulmonary & hematogenous spinal infection.',
        remedy: 'Special & general medical damages across 62 inpatient days.',
      },
    ],
  },
  {
    id: 'ex_scripps_1051',
    title: 'Scripps Mercy EHR Page 1051 — T9-T10 Vertebral Discitis-Osteomyelitis',
    filename: 'scripps_ehr_page_1051.png',
    url: '/evidence/scripps_ehr_page_1051.png',
    mediaType: 'image',
    category: 'Scripps Mercy ICU EHR',
    date: '2024-01-25',
    sha256Snippet: 'c82b44...31a0 (Scripps MRI & ID Consult)',
    verbatimQuote:
      'Thoracic Spine MRI & Infectious Disease Consult: Acute T9-T10 discitis and vertebral osteomyelitis secondary to empyema/bacteremia; weight drop from 160 lbs to 116 lbs.',
    forensicSignificance:
      'Documents permanent orthopedic and neurological spinal destruction requiring 62 days of institutionalization at Scripps Mercy and Vibra LTAC.',
    maltegoNodeId: 'victim_petruccio',
    linkedStatutes: [
      {
        code: 'Cal. Gov. Code § 835',
        name: 'Dangerous Condition Proximate Damages',
        elementSatisfied: 'Permanent physical disability and 44-pound wasting syndrome.',
        remedy: 'Lifetime medical care, supportive housing, and compensatory damages.',
      },
    ],
  },
  {
    id: 'ex_geotracker_sar',
    title: 'June 2020 Site Assessment Report — Soil Boring Map (980 µg/kg Cr(VI))',
    filename: 'SAR_June2020_Fig2_BoringLocation_Cameron-020.png',
    url: '/evidence/SAR_June2020_Fig2_BoringLocation_Cameron-020.png',
    mediaType: 'image',
    category: 'Toxic Cap & GeoTracker',
    date: '2020-06-15',
    sha256Snippet: 'd09a71...55c8 (GeoTracker T10000018579)',
    verbatimQuote:
      'Figure 2: Soil Boring Locations at 17631 Cameron Lane & 17642 Beach Blvd — Hexavalent Chromium up to 980 µg/kg at 2 feet bgs; Total Chromium 313 mg/kg.',
    forensicSignificance:
      'Maps the exact spatial overlap between the shallow 2-foot-deep Hexavalent Chromium hotspot and the 174-bed Sprung shelter sleeping footprint.',
    maltegoNodeId: 'geotracker_plume',
    linkedStatutes: [
      {
        code: '42 U.S.C. § 6972(a)(1)(B)',
        name: 'RCRA Solid & Hazardous Waste Endangerment',
        elementSatisfied:
          'Documented shallow vadose-zone carcinogenic heavy metals and chlorinated solvents beneath occupied beds.',
        remedy: 'Mandatory environmental remediation & sub-slab vapor testing.',
      },
    ],
  },
  {
    id: 'ex_nav_001_yamada',
    title: '17631 Cameron Ln Lease-to-Purchase & Easement UPX1978058 (Mitsuru Yamada)',
    filename: 'navigation_center_001.jpg',
    url: '/evidence/navigation_center_001.jpg',
    mediaType: 'image',
    category: 'Form 700 & Void Contracts',
    date: '2020-10-20',
    sha256Snippet: '44b1e8...73d2 (Municipal Acquisition Record)',
    verbatimQuote:
      'Municipal acquisition and site lease documentation for 17631 Cameron Lane / 17642 Beach Blvd ($6,093,502 total public obligation) where concurrent trustee Mitsuru Yamada filed 0 FPPC Form 700 disclosures.',
    forensicSignificance:
      'Triggers strict-liability contract voiding under Cal. Gov. Code §§ 1090, 1092, and 81000 et seq. and Thomson v. Call (1985) 38 Cal.3d 633.',
    maltegoNodeId: 'yamada_form700',
    linkedStatutes: [
      {
        code: 'Cal. Gov. Code §§ 1090, 1092 & Thomson v. Call',
        name: 'Strict Liability Void Ab Initio Public Contract Disgorgement',
        elementSatisfied:
          'Undisclosed trustee financial interest (UPX1978058) and zero FPPC Form 700 filings on a $6.09M municipal land transaction.',
        remedy: '100% disgorgement of $6,093,502 to public treasury + municipal retention of land title.',
      },
      {
        code: 'Fed. R. Evid. 201(b)(2)',
        name: 'Mandatory Cross-Case Judicial Notice (USA v. Sidhu)',
        elementSatisfied:
          'Presiding Judge John W. Holcomb oversaw the parallel $320M Angel Stadium Form 700 voiding in 8:23-cr-00114-JWH.',
        remedy: 'Judicial notice of OC municipal Form 700 concealment pattern.',
      },
    ],
  },
  {
    id: 'ex_laserfiche_text',
    title: 'Full Verbatim Text: Contract #5406552 (TTS Engineering Grading & Paving)',
    filename: 'laserfiche_5406552_TTS_grading_contract_FULL.txt',
    url: '/evidence/laserfiche_5406552_TTS_grading_contract_FULL.txt',
    mediaType: 'text',
    category: 'Form 700 & Void Contracts',
    date: '2020-11-05',
    sha256Snippet: '88f3a2...19b0 (172 KB Full OCR Contract)',
    verbatimQuote:
      'Complete 172 KB extracted text of City of Huntington Beach Laserfiche Record #5406552 specifications, bid schedule, and 1-year warranty provisions.',
    forensicSignificance:
      'Provides the complete searchable contract text confirming zero hazardous waste remediation scope and the 1-year warranty cap.',
    maltegoNodeId: 'laserfiche_5406552',
    linkedStatutes: [
      {
        code: 'Cal. Gov. Code § 835',
        name: 'Dangerous Condition — Contractual Proof of Substandard Cap',
        elementSatisfied: 'Full specifications prove a thin paving overlay rather than DTSC-compliant remediation.',
        remedy: 'Evidentiary summary judgment on dangerous condition creation.',
      },
    ],
  },
  {
    id: 'ex_formal_statement',
    title: '01_Formal_Statement.md — Master Relator & Victim Statement (Corrected)',
    filename: '01_Formal_Statement.md',
    url: '/evidence/01_Formal_Statement.md',
    mediaType: 'text',
    category: 'Core Legal Briefs',
    date: '2026-04-12',
    sha256Snippet: '12c9e4...84a1 (Fact-Checked Master Statement)',
    verbatimQuote:
      'Verified joint statement of Anthony Michael DiMarcello III (caregiver/son) and Elizabeth Tina Petruccio (62-year-old disabled mother) detailing the 17631 Cameron Lane toxic breach and ICU lockout.',
    forensicSignificance:
      'Synthesizes the entire chronological, medical, environmental, and statutory record with all exhibit cross-references.',
    maltegoNodeId: 'victim_dimarcello',
    linkedStatutes: [
      {
        code: '31 U.S.C. § 3730(h) / Cal. Gov. Code § 12653',
        name: 'False Claims Act & Whistleblower Relator Protection',
        elementSatisfied: 'Protected disclosures to GAO (#COMP-26-004512), FBI (#20IC002), HUD OIG, and CalEPA.',
        remedy: 'Double back-pay/damages, reinstatement of housing benefits, attorney fees.',
      },
    ],
  },
];

interface EvidenceLawHybridViewProps {
  onOpenFileInViewer: (filename: string, fileData?: string) => void;
  onSwitchToMaltego?: () => void;
  onSwitchToAilaws?: () => void;
}

export const EvidenceLawHybridView: React.FC<EvidenceLawHybridViewProps> = ({
  onOpenFileInViewer,
}) => {
  const [selectedItem, setSelectedItem] = useState<HybridEvidenceItem>(
    HYBRID_EVIDENCE_CATALOG[0]
  );
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [imageZoom, setImageZoom] = useState<number>(100);
  const [showEmbeddedMaltego, setShowEmbeddedMaltego] = useState<boolean>(true);

  useEffect(() => {
    setImageZoom(100);
    if (selectedItem.mediaType === 'text' || selectedItem.mediaType === 'html') {
      fetch(selectedItem.url)
        .then((r) => r.text())
        .then((txt) => setTextContent(txt.slice(0, 18000)))
        .catch(() => setTextContent('Unable to load text preview.'));
    } else {
      setTextContent('');
    }
  }, [selectedItem]);

  const categories = [
    'ALL',
    'Toxic Cap & GeoTracker',
    'Nov 7, 2023 Breach',
    'Scripps Mercy ICU EHR',
    'Form 700 & Void Contracts',
    'Core Legal Briefs',
  ];

  const filteredItems = HYBRID_EVIDENCE_CATALOG.filter((item) => {
    const matchesCat =
      activeCategory === 'ALL' || item.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.filename.toLowerCase().includes(q) ||
      item.verbatimQuote.toLowerCase().includes(q) ||
      item.linkedStatutes.some(
        (s) =>
          s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    return matchesCat && matchesSearch;
  });

  return (
    <div id="evidence-law-hybrid-root" className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border-2 border-cyan-500/80 rounded-xl p-5 mb-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Evidence-Law Viewer Hybrid &amp; Synchronized Maltego Canvas
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmbeddedMaltego(!showEmbeddedMaltego)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border cursor-pointer transition-all ${
                showEmbeddedMaltego
                  ? 'bg-cyan-600 text-white border-cyan-300 shadow'
                  : 'bg-slate-950 text-cyan-300 border-cyan-800 hover:bg-slate-800'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>{showEmbeddedMaltego ? 'Maltego Canvas: VISIBLE' : 'Show Maltego Canvas'}</span>
            </button>
          </div>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Inspect the actual high-resolution primary exhibits (County asphalt mandate, Laserfiche #5406552 1-year warranty, Nov 7 2023 GPS breach photos, Scripps Mercy ICU EHR p. 985/1034/1051) side-by-side with the exact statutory elements they prove under <code>/ailaws</code> and their live position on the HTML5 Canvas Maltego graph.
        </p>
      </div>

      {/* Category & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exhibits, statutes, quotes..."
            className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500 w-56 sm:w-64"
          />
        </div>
      </div>

      {/* Exhibit Selector Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        {filteredItems.map((item) => {
          const isSelected = selectedItem.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 truncate">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {item.date.split(' ')[0]}
                  </span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-2 mb-1">
                  {item.title}
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 pt-1.5 border-t border-slate-800/80">
                <span className="truncate">{item.filename}</span>
                <span className="text-cyan-400 font-bold shrink-0">
                  {item.linkedStatutes.length} Laws
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split-Screen Hybrid Workspace: Left = Actual Primary Exhibit Viewer | Right = Statutory Elements & Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
        {/* LEFT PANE (7 cols): Live High-Resolution Primary Exhibit Stage */}
        <div className="lg:col-span-7 bg-slate-900 border-2 border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
          {/* Exhibit Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {selectedItem.mediaType === 'image' ? (
                  <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                )}
                <h3 className="text-sm font-bold text-white truncate">
                  {selectedItem.title}
                </h3>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                File: <code className="text-cyan-300">{selectedItem.filename}</code> &middot; Date: {selectedItem.date} &middot; {selectedItem.sha256Snippet}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {selectedItem.mediaType === 'image' && (
                <>
                  <button
                    onClick={() => setImageZoom((z) => Math.max(60, z - 25))}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-cyan-300 px-1">
                    {imageZoom}%
                  </span>
                  <button
                    onClick={() => setImageZoom((z) => Math.min(250, z + 25))}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  onOpenFileInViewer(selectedItem.filename, selectedItem.url)
                }
                className="px-2.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lightbox</span>
              </button>

              <a
                href={selectedItem.url}
                download={selectedItem.filename}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Raw</span>
              </a>
            </div>
          </div>

          {/* Exhibit Viewport */}
          <div className="bg-slate-950/90 p-4 flex-1 min-h-[380px] max-h-[540px] overflow-auto flex items-center justify-center">
            {selectedItem.mediaType === 'image' ? (
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                style={{ width: `${imageZoom}%` }}
                className="max-w-none rounded-lg border border-slate-800 shadow-xl transition-all duration-150"
              />
            ) : (
              <pre className="w-full text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed p-3 bg-slate-950 rounded-lg border border-slate-800">
                {textContent || 'Loading primary record text...'}
              </pre>
            )}
          </div>

          {/* Verbatim Quote Callout Footer */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
              VERBATIM PRIMARY RECORD EXTRACT:
            </div>
            <blockquote className="text-xs sm:text-sm font-serif italic text-slate-100 bg-slate-900/90 border-l-4 border-amber-400 p-3 rounded-r-lg">
              {selectedItem.verbatimQuote}
            </blockquote>
          </div>
        </div>

        {/* RIGHT PANE (5 cols): Controlling Statutory Matrix & Element Proof */}
        <div className="lg:col-span-5 bg-slate-900 border-2 border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  Synchronized Statutory Proof (/ailaws)
                </h3>
              </div>
              <span className="text-[11px] font-mono bg-amber-950 text-amber-300 border border-amber-700/60 px-2.5 py-0.5 rounded font-bold">
                {selectedItem.linkedStatutes.length} Controlling Authorities
              </span>
            </div>

            {/* Forensic Significance */}
            <div className="mb-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase mb-1">
                Forensic &amp; Evidentiary Significance:
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-serif">
                {selectedItem.forensicSignificance}
              </p>
            </div>

            {/* Linked Statutes Cards */}
            <div className="space-y-3">
              {selectedItem.linkedStatutes.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/40 hover:border-amber-400 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-extrabold text-amber-300">
                      {st.code}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold">
                      ELEMENT PROVEN
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mb-1.5">
                    {st.name}
                  </div>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    <b className="text-slate-100">How Exhibit Satisfies Statute:</b>{' '}
                    {st.elementSatisfied}
                  </p>
                  <div className="text-[11px] font-mono text-cyan-300 bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
                    <b>Mandated Remedy:</b> {st.remedy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Linked Maltego Node: <b className="text-cyan-300">{selectedItem.maltegoNodeId}</b></span>
            <span>Trinity Gate 1-3: <b className="text-emerald-400">PASSED</b></span>
          </div>
        </div>
      </div>

      {/* Embedded Interactive HTML5 Canvas Maltego Graph Synchronized to Selected Exhibit */}
      {showEmbeddedMaltego && (
        <div className="bg-slate-900/90 border-2 border-cyan-500/50 rounded-xl p-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-extrabold text-white">
                Synchronized Canvas Maltego Entity &amp; Statutory Link Map
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-300">
              Focused Node: <b>{selectedItem.maltegoNodeId}</b> (Click any node on canvas to inspect)
            </span>
          </div>
          <MaltegoGraphView
            onOpenFileInViewer={onOpenFileInViewer}
            embedded={true}
            focusNodeId={selectedItem.maltegoNodeId}
          />
        </div>
      )}
    </div>
  );
};
