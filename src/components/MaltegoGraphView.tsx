import React, { useState, useEffect, useRef } from 'react';
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  ExternalLink,
  Eye,
  ShieldAlert,
  Scale,
  Flame,
  Gavel,
  Activity,
  FileText,
  Sparkles,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

export type MaltegoNodeCategory =
  | 'victim'
  | 'toxic_plume'
  | 'contract_void'
  | 'public_entity'
  | 'medical_ehr'
  | 'statute_case';

export interface MaltegoNode {
  id: string;
  label: string;
  sublabel: string;
  category: MaltegoNodeCategory;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  severity: 'CRITICAL' | 'HIGH' | 'STATUTORY' | 'PRIMARY';
  exhibitFile?: string;
  previewImageUrl?: string;
  summary: string;
  keyMetrics: string[];
  statutoryLinks: string[];
}

export interface MaltegoEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'causation' | 'contract' | 'violation' | 'retaliation' | 'judicial_notice';
  highlightChain?: 'toxic' | 'void_deals' | 'retaliation';
}

interface MaltegoGraphViewProps {
  onOpenFileInViewer: (filename: string, fileData?: string) => void;
  embedded?: boolean;
  focusNodeId?: string;
}

export const MALTEGO_NODES_DATA: MaltegoNode[] = [
  // Center / Site & Toxic Plume Nodes
  {
    id: 'site_17631',
    label: '17631 Cameron Ln (HBNC)',
    sublabel: 'APN 111-010-28 · 174-Bed Sprung Tent',
    category: 'toxic_plume',
    x: 560,
    y: 320,
    vx: 0,
    vy: 0,
    radius: 30,
    severity: 'CRITICAL',
    exhibitFile: '17631 Cameron St_17642 Beach Blvd_1947.jpg',
    previewImageUrl: '/evidence/17631%20Cameron%20St_17642%20Beach%20Blvd_1947.jpg',
    summary:
      'Former oilfield, auto salvage, and aerospace industrial parcel converted in Nov 2020 into a 174-bed homeless shelter over unexcavated hexavalent chromium, PCE, and petroleum hydrocarbons.',
    keyMetrics: [
      'Peak Soil Cr(VI): 980 µg/kg (49× DTSC Screening Level)',
      'Adjacent Groundwater Cr(VI): 66.2 µg/L (3,310× OEHHA PHG)',
      'Abuse of Elder Reports: 28+ (Nov 2020 – Mar 2025)',
      'EMS / Paramedic Dispatches: 940+',
    ],
    statutoryLinks: ['42 U.S.C. § 6972(a)(1)(B) (RCRA)', 'Cal. Gov. Code § 835', 'Cal. Health & Safety Code § 25249.6'],
  },
  {
    id: 'geotracker_plume',
    label: 'GeoTracker T10000018579',
    sublabel: '980 µg/kg Cr(VI) · 17642 Beach Blvd',
    category: 'toxic_plume',
    x: 340,
    y: 170,
    vx: 0,
    vy: 0,
    radius: 25,
    severity: 'CRITICAL',
    exhibitFile: 'SAR_June2020_Fig2_BoringLocation_Cameron-020.png',
    previewImageUrl: '/evidence/SAR_June2020_Fig2_BoringLocation_Cameron-020.png',
    summary:
      'Official California Water Boards GeoTracker remediation file documenting shallow soil Hexavalent Chromium up to 980 µg/kg, total Chromium up to 313 mg/kg, Lead, Arsenic, and PCE vapor plumes.',
    keyMetrics: [
      '49× DTSC Residential Screening Level (20 µg/kg)',
      'Well W-4150 located ~75 feet from sleeping footprint',
      'OCWD Monitoring Well MW-42 adjacent',
    ],
    statutoryLinks: ['42 U.S.C. § 6972(a)(1)(B)', 'Cal. Gov. Code § 835'],
  },
  {
    id: 'county_cap_condition',
    label: 'OC Health Condition (07/01/2020)',
    sublabel: 'navigation_center_003.jpg · Mandatory Cap',
    category: 'toxic_plume',
    x: 330,
    y: 330,
    vx: 0,
    vy: 0,
    radius: 24,
    severity: 'CRITICAL',
    exhibitFile: 'navigation_center_003.jpg',
    previewImageUrl: '/evidence/navigation_center_003.jpg',
    summary:
      'Orange County Health Care Agency letter dated July 1, 2020 explicitly conditioning approval of temporary homeless shelter occupancy on continuous maintenance of an intact asphalt cover.',
    keyMetrics: [
      'Verbatim Mandate: "so long as the site is covered by asphalt"',
      'Engineered vapor/particulate barrier required at all times',
      'Directly breached underneath resident beds on 11/07/2023',
    ],
    statutoryLinks: ['Cal. Gov. Code § 815.6 (Mandatory Duty)', 'Cal. Gov. Code § 835'],
  },
  {
    id: 'laserfiche_5406552',
    label: 'Laserfiche #5406552 Contract',
    sublabel: 'TTS Engineering · 1-Yr Cap Warranty',
    category: 'contract_void',
    x: 420,
    y: 480,
    vx: 0,
    vy: 0,
    radius: 26,
    severity: 'CRITICAL',
    exhibitFile: '5406552_viewer.png',
    previewImageUrl: '/evidence/5406552_viewer.png',
    summary:
      'City of Huntington Beach Public Works grading and paving contract ($298,425) with TTS Engineering & Construction Inc. (License #814989, Classifications A & C12 only — no HAZ credential) warranting the 2-inch asphalt cap for only 1 year.',
    keyMetrics: [
      '1-Year Warranty Expired: ~November 2021',
      'Zero HAZWOPER / DTSC hazardous remediation certification',
      'Used to house vulnerable disabled residents for 4+ years',
    ],
    statutoryLinks: ['Cal. Gov. Code § 835', 'Cal. Civ. Code § 3479 (Nuisance)'],
  },
  {
    id: 'cap_breach_nov2023',
    label: 'Nov 7, 2023 Sub-Slab Breach',
    sublabel: 'HB_Shelter_Nov2023_photo_01.jpg · GPS Verified',
    category: 'toxic_plume',
    x: 560,
    y: 510,
    vx: 0,
    vy: 0,
    radius: 25,
    severity: 'CRITICAL',
    exhibitFile: 'HB_Shelter_Nov2023_photo_01.jpg',
    previewImageUrl: '/evidence/HB_Shelter_Nov2023_photo_01.jpg',
    summary:
      'Timestamped EXIF photographs (33.706389° N, 117.988611° W) taken inside the congregate sleeping tent showing corroded structural bolts pulled out of the floor, fractured asphalt, and raw sub-slab dirt beneath beds.',
    keyMetrics: [
      'EXIF Timestamp: Nov 7, 2023 (12:41:52–12:42:37)',
      'Direct dermal, inhalation, and particulate exposure pathway',
      'Reported immediately; met with retaliation rather than repair',
    ],
    statutoryLinks: ['Cal. Gov. Code § 835', '42 U.S.C. § 3604(f) (FHA Habitability)'],
  },

  // Victims & Affected Residents Cluster
  {
    id: 'victim_petruccio',
    label: 'Elizabeth Tina Petruccio',
    sublabel: 'DOB 07/29/1964 · 62yo Disabled Mother',
    category: 'victim',
    x: 790,
    y: 230,
    vx: 0,
    vy: 0,
    radius: 28,
    severity: 'CRITICAL',
    exhibitFile: 'scripps_ehr_page_1034.png',
    previewImageUrl: '/evidence/scripps_ehr_page_1034.png',
    summary:
      '62-year-old disabled mother of Anthony Michael DiMarcello III. Housed over breached 17631 Cameron Ln cap; suffered catastrophic empyema (WBC 103,752), sepsis, intubation, and T9-T10 discitis-osteomyelitis across 62 days institutionalized.',
    keyMetrics: [
      '01/12/2024 Scripps Mercy ICU: WBC 103,752 /mm³; Weight 160 -> 116 lbs',
      '01/22/2024: Exited from HBNC shelter while intubated in ICU',
      '07/25/2025 Hoag ED: Acute encephalopathy & personality change',
    ],
    statutoryLinks: ['Welf. & Inst. Code § 15657 (EADACPA)', '42 U.S.C. § 12132 (ADA Title II)', '42 U.S.C. § 3604(f)'],
  },
  {
    id: 'victim_dimarcello',
    label: 'Anthony M. DiMarcello III',
    sublabel: 'DOB 05/04/1983 · Son, Caregiver & Relator',
    category: 'victim',
    x: 820,
    y: 380,
    vx: 0,
    vy: 0,
    radius: 26,
    severity: 'CRITICAL',
    exhibitFile: '01_Formal_Statement.md',
    previewImageUrl: '/evidence/HB_Shelter_Nov2023_photo_04.jpg',
    summary:
      'Full-time caregiver, son of Elizabeth Petruccio, and federal whistleblower/relator (GAO #COMP-26-004512, FBI #20IC002). Documented the Nov 7, 2023 sub-slab breach and dispatched 184 formal agency notices.',
    keyMetrics: [
      'Caregiver associational standing under ADA Title II & FHA',
      'Subjected to retaliatory exclusion after reporting toxic breach',
      'Compiled 31-repo OSINT & 4,621-page EHR evidentiary archive',
    ],
    statutoryLinks: ['42 U.S.C. § 12203 (ADA Anti-Retaliation)', '42 U.S.C. § 3617 (FHA)', 'Cal. Health & Safety § 1278.5'],
  },
  {
    id: 'victim_knabb',
    label: 'Jesse Knabb (Lead Plaintiff)',
    sublabel: 'Knabb v. HB · 8:26-cv-00348-JWH-ADS',
    category: 'victim',
    x: 760,
    y: 510,
    vx: 0,
    vy: 0,
    radius: 23,
    severity: 'HIGH',
    exhibitFile: '02_The_Record.md',
    previewImageUrl: '/evidence/navigation_center_027.jpg',
    summary:
      'Disabled HBNC shelter resident and lead plaintiff in federal action 8:26-cv-00348-JWH-ADS. Suffered severe pulmonary disease, structural bed collapse, and MRSA skin infections inside the Sprung tent.',
    keyMetrics: [
      'Filed SAVC (ECF No. 115, 113 pages) & Opp. to MTD (ECF No. 130)',
      'Corroborates systemic ADA denials and toxic floor breaches',
    ],
    statutoryLinks: ['8:26-cv-00348-JWH-ADS', '42 U.S.C. § 1983 (Monell)'],
  },
  {
    id: 'victim_cluster_4',
    label: 'Bell Brothers & C. Simcox',
    sublabel: '4 Additional Hospitalized HBNC Residents',
    category: 'victim',
    x: 940,
    y: 310,
    vx: 0,
    vy: 0,
    radius: 21,
    severity: 'HIGH',
    exhibitFile: '02_The_Record.md',
    previewImageUrl: '/evidence/HB_Shelter_Nov2023_photo_06.jpg',
    summary:
      'Burt Bell (25+ yr mechanic, hospitalized after acute collapse inside shelter), Brian Bell (vascular surgical crisis), and Curtis Simcox (hospitalized with respiratory & spinal pain), completing the 6-resident biological cluster.',
    keyMetrics: [
      '6 documented hospitalizations from the exact same sleeping bay',
      'Identical respiratory, infectious, and osteomyelitis/spinal patterns',
    ],
    statutoryLinks: ['Cal. Gov. Code § 835', 'Welf. & Inst. Code § 15657'],
  },

  // Medical & EHR Primary Nodes
  {
    id: 'scripps_ehr_985',
    label: 'Scripps Mercy EHR p. 985',
    sublabel: '01/22/2024 ICU Lockout & 30-Day Bar',
    category: 'medical_ehr',
    x: 980,
    y: 170,
    vx: 0,
    vy: 0,
    radius: 25,
    severity: 'CRITICAL',
    exhibitFile: 'scripps_ehr_page_985.png',
    previewImageUrl: '/evidence/scripps_ehr_page_985.png',
    summary:
      'Contemporaneous Social Work Progress Note by Courtney M.uff, MSW (01/22/2024 3:15 PM) proving HBNC Case Manager "Zurisadai" terminated Ms. Petruccio’s bed while she was intubated in the ICU and barred her for 30 days.',
    keyMetrics: [
      'Verbatim: "once missing for 7 days, pt loses spot at the shelter"',
      'Verbatim: "would have to wait 30 days before re-applying"',
      'Zero medical exception or ADA interactive process granted',
    ],
    statutoryLinks: ['28 C.F.R. § 35.130(b)(7) (ADA)', '42 U.S.C. § 3604(f)(3)(B) (FHA)', 'Welf. & Inst. § 15610.07'],
  },
  {
    id: 'scripps_ehr_1034',
    label: 'Scripps EHR p. 1034 & 1051',
    sublabel: 'WBC 103,752 · Empyema & T9-T10 Osteomyelitis',
    category: 'medical_ehr',
    x: 780,
    y: 90,
    vx: 0,
    vy: 0,
    radius: 23,
    severity: 'CRITICAL',
    exhibitFile: 'scripps_ehr_page_1051.png',
    previewImageUrl: '/evidence/scripps_ehr_page_1051.png',
    summary:
      'Pulmonary Critical Care & Infectious Disease records documenting loculated pleural empyema, septic shock, respiratory failure requiring mechanical ventilation, and hematogenous T9-T10 vertebral osteomyelitis.',
    keyMetrics: [
      'Pleural Fluid WBC: 103,752 /mm³ (93% neutrophils)',
      '62 consecutive days hospitalized / LTAC (01/12/2024–03/14/2024)',
      '44 lb weight loss (160 lbs down to 116 lbs)',
    ],
    statutoryLinks: ['Cal. Code Civ. Proc. § 335.1', 'Welf. & Inst. Code § 15657'],
  },

  // Void Ab Initio & Public Entities Cluster
  {
    id: 'yamada_form700',
    label: 'Mitsuru Yamada (UPX1978058)',
    sublabel: '0 Form 700s Filed · $6.09M Shelter Deal',
    category: 'contract_void',
    x: 190,
    y: 440,
    vx: 0,
    vy: 0,
    radius: 26,
    severity: 'CRITICAL',
    exhibitFile: 'navigation_center_001.jpg',
    previewImageUrl: '/evidence/navigation_center_001.jpg',
    summary:
      'Concurrent fee-title trustee on the 17631 Cameron Lane / 17642 Beach Blvd municipal easement footprint (Document #UPX1978058) with ZERO FPPC Form 700 Statements of Economic Interests on file across the $6.09M lease-to-purchase deal.',
    keyMetrics: [
      'FPPC Form 700 Search: 0 filings across all years',
      'Triggers strict liability contract nullification under Gov. Code § 1090',
      'No return of property to private grantors (Thomson v. Call)',
    ],
    statutoryLinks: ['Cal. Gov. Code §§ 1090, 1092, 81000', 'Thomson v. Call (1985) 38 Cal.3d 633'],
  },
  {
    id: 'sidhu_angel_stadium',
    label: 'Mayor Harry Sidhu ($320M Deal)',
    sublabel: 'USA v. Sidhu (8:23-cr-00114-JWH)',
    category: 'contract_void',
    x: 150,
    y: 260,
    vx: 0,
    vy: 0,
    radius: 24,
    severity: 'STATUTORY',
    exhibitFile: '03_Law_and_Remedies.md',
    previewImageUrl: '/evidence/navigation_center_002.jpg',
    summary:
      'Identical Orange County Form 700 / conflict-of-interest public land scandal presided over by the exact same federal judge (Hon. John W. Holcomb), resulting in voiding of the $320M Angel Stadium land sale and federal felony conviction.',
    keyMetrics: [
      'Presiding Judge: Hon. John W. Holcomb (C.D. Cal.)',
      'Mandatory Cross-Case Judicial Notice under FRE 201(b)(2)',
      'Establishes baseline OC municipal Form 700 voiding precedent',
    ],
    statutoryLinks: ['Fed. R. Evid. 201', 'USA v. Sidhu, 8:23-cr-00114-JWH'],
  },
  {
    id: 'city_hb_mercy_house',
    label: 'City of HB & Mercy House',
    sublabel: 'Owner & Shelter Operator Defendants',
    category: 'public_entity',
    x: 560,
    y: 150,
    vx: 0,
    vy: 0,
    radius: 25,
    severity: 'HIGH',
    exhibitFile: 'mercy_house_044.jpg',
    previewImageUrl: '/evidence/mercy_house_044.jpg',
    summary:
      'City of Huntington Beach (site owner/contracting authority) and Mercy House Living Centers (shelter operator receiving municipal/HUD funds) jointly operated the 174-bed shelter over expired 1-year cap and enforced the 7-day ICU forfeiture rule.',
    keyMetrics: [
      'Joint state action & Monell policy liability',
      'Received $6.09M+ in public homelessness & state/federal funds',
    ],
    statutoryLinks: ['42 U.S.C. § 1983 (Monell)', '42 U.S.C. § 12132 (ADA Title II)'],
  },
  {
    id: 'judge_holcomb_court',
    label: 'Hon. John W. Holcomb (C.D. Cal.)',
    sublabel: 'Presiding Judge · 8:26-cv-00348 & Sidhu',
    category: 'statute_case',
    x: 180,
    y: 110,
    vx: 0,
    vy: 0,
    radius: 24,
    severity: 'STATUTORY',
    exhibitFile: '03_Law_and_Remedies.md',
    previewImageUrl: '/evidence/5406552_viewer.png',
    summary:
      'U.S. District Judge presiding over both Knabb v. City of Huntington Beach (8:26-cv-00348-JWH-ADS) and USA v. Harry Sidhu (8:23-cr-00114-JWH), empowering mandatory judicial notice under FRE 201 and sua sponte void ab initio contract scrutiny.',
    keyMetrics: [
      'SAVC ECF No. 115 & Opp. to MTD ECF No. 130 pending',
      'Judicial duty to refuse enforcement of Gov. Code § 1090 void contracts',
    ],
    statutoryLinks: ['Fed. R. Evid. 201(c)(2)', 'Thomson v. Call, 38 Cal.3d 633'],
  },
  {
    id: 'thomson_v_call',
    label: 'Thomson v. Call (38 Cal.3d 633)',
    sublabel: '100% Strict Disgorgement Mandate',
    category: 'statute_case',
    x: 340,
    y: 590,
    vx: 0,
    vy: 0,
    radius: 23,
    severity: 'STATUTORY',
    exhibitFile: '03_Law_and_Remedies.md',
    previewImageUrl: '/evidence/navigation_center_045.jpg',
    summary:
      'Controlling California Supreme Court precedent holding that public contracts tainted by Gov. Code § 1090 financial interest or Form 700 concealment are void ab initio: the public retains the land and disgorges 100% of purchase funds.',
    keyMetrics: [
      'Strict Liability — good faith or fair market value is no defense',
      'Full forfeiture of $6.09M consideration + title retention',
    ],
    statutoryLinks: ['Cal. Gov. Code §§ 1090, 1092', 'Davis v. Fresno Unified (2023)'],
  },
];

export const MALTEGO_EDGES_DATA: MaltegoEdge[] = [
  {
    id: 'e1',
    source: 'geotracker_plume',
    target: 'site_17631',
    label: '980 µg/kg Cr(VI) Plume (49× DTSC)',
    type: 'causation',
    highlightChain: 'toxic',
  },
  {
    id: 'e2',
    source: 'county_cap_condition',
    target: 'site_17631',
    label: 'Mandated Intact Asphalt Cap (07/01/2020)',
    type: 'violation',
    highlightChain: 'toxic',
  },
  {
    id: 'e3',
    source: 'laserfiche_5406552',
    target: 'site_17631',
    label: '1-Yr Cap Warranty Expired Nov 2021',
    type: 'contract',
    highlightChain: 'toxic',
  },
  {
    id: 'e4',
    source: 'site_17631',
    target: 'cap_breach_nov2023',
    label: 'Sub-Slab Breach Under Beds (11/07/2023)',
    type: 'causation',
    highlightChain: 'toxic',
  },
  {
    id: 'e5',
    source: 'cap_breach_nov2023',
    target: 'victim_petruccio',
    label: 'Inhalation/Dermal Cr(VI) & Pathogens',
    type: 'causation',
    highlightChain: 'toxic',
  },
  {
    id: 'e6',
    source: 'victim_petruccio',
    target: 'scripps_ehr_1034',
    label: 'WBC 103,752 · Empyema & T9-T10 Osteo',
    type: 'causation',
    highlightChain: 'toxic',
  },
  {
    id: 'e7',
    source: 'city_hb_mercy_house',
    target: 'scripps_ehr_985',
    label: 'Enforced 7-Day ICU Forfeiture + 30d Bar',
    type: 'retaliation',
    highlightChain: 'retaliation',
  },
  {
    id: 'e8',
    source: 'scripps_ehr_985',
    target: 'victim_petruccio',
    label: 'Evicted While Intubated (01/22/2024)',
    type: 'retaliation',
    highlightChain: 'retaliation',
  },
  {
    id: 'e9',
    source: 'victim_dimarcello',
    target: 'cap_breach_nov2023',
    label: 'Captured GPS/EXIF Breach Photos',
    type: 'causation',
    highlightChain: 'retaliation',
  },
  {
    id: 'e10',
    source: 'city_hb_mercy_house',
    target: 'victim_dimarcello',
    label: 'Retaliatory Lockout of Caregiver',
    type: 'retaliation',
    highlightChain: 'retaliation',
  },
  {
    id: 'e11',
    source: 'site_17631',
    target: 'victim_knabb',
    label: 'Bed Collapse, Pulmonary & MRSA Injury',
    type: 'causation',
    highlightChain: 'toxic',
  },
  {
    id: 'e12',
    source: 'site_17631',
    target: 'victim_cluster_4',
    label: 'Same-Bay Hospitalization Cluster (6 Total)',
    type: 'causation',
    highlightChain: 'toxic',
  },
  {
    id: 'e13',
    source: 'yamada_form700',
    target: 'site_17631',
    label: 'Easement UPX1978058 · 0 Form 700s',
    type: 'contract',
    highlightChain: 'void_deals',
  },
  {
    id: 'e14',
    source: 'yamada_form700',
    target: 'thomson_v_call',
    label: 'Triggers 100% Strict Disgorgement ($6.09M)',
    type: 'violation',
    highlightChain: 'void_deals',
  },
  {
    id: 'e15',
    source: 'sidhu_angel_stadium',
    target: 'judge_holcomb_court',
    label: 'Guilty Plea & $320M Land Voiding',
    type: 'judicial_notice',
    highlightChain: 'void_deals',
  },
  {
    id: 'e16',
    source: 'judge_holcomb_court',
    target: 'yamada_form700',
    label: 'FRE 201 Cross-Case Judicial Notice',
    type: 'judicial_notice',
    highlightChain: 'void_deals',
  },
  {
    id: 'e17',
    source: 'city_hb_mercy_house',
    target: 'site_17631',
    label: 'Operated 174-Bed Shelter on Expired Cap',
    type: 'violation',
    highlightChain: 'toxic',
  },
  {
    id: 'e18',
    source: 'laserfiche_5406552',
    target: 'thomson_v_call',
    label: 'Public Works Contract Without HAZ License',
    type: 'contract',
    highlightChain: 'void_deals',
  },
];

const CATEGORY_COLORS: Record<
  MaltegoNodeCategory,
  { fill: string; stroke: string; glow: string; label: string }
> = {
  toxic_plume: {
    fill: '#450a0a',
    stroke: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.45)',
    label: 'Toxic Plume / Breach',
  },
  victim: {
    fill: '#064e3b',
    stroke: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    label: 'Victim / Relator',
  },
  medical_ehr: {
    fill: '#1e1b4b',
    stroke: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
    label: 'Hospital EHR Proof',
  },
  contract_void: {
    fill: '#451a03',
    stroke: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.45)',
    label: 'Form 700 / Contract',
  },
  public_entity: {
    fill: '#3b0764',
    stroke: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.45)',
    label: 'Defendant Entity',
  },
  statute_case: {
    fill: '#0f172a',
    stroke: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.45)',
    label: 'Court / Precedent',
  },
};

export const MaltegoGraphView: React.FC<MaltegoGraphViewProps> = ({
  onOpenFileInViewer,
  embedded = false,
  focusNodeId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<MaltegoNode[]>(() =>
    MALTEGO_NODES_DATA.map((n) => ({ ...n }))
  );
  const [selectedNode, setSelectedNode] = useState<MaltegoNode>(
    () =>
      MALTEGO_NODES_DATA.find((n) => n.id === focusNodeId) ||
      MALTEGO_NODES_DATA[0]
  );
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<MaltegoNodeCategory | 'all'>('all');
  const [activeChain, setActiveChain] = useState<'all' | 'toxic' | 'void_deals' | 'retaliation'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoom, setZoom] = useState<number>(embedded ? 0.82 : 0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 10 });
  const [isPhysicsActive, setIsPhysicsActive] = useState<boolean>(true);

  const draggingNodeIdRef = useRef<string | null>(null);
  const isPanningRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const nodesRef = useRef<MaltegoNode[]>(nodes);
  nodesRef.current = nodes;

  useEffect(() => {
    if (focusNodeId) {
      const found = nodesRef.current.find((n) => n.id === focusNodeId);
      if (found) setSelectedNode(found);
    }
  }, [focusNodeId]);

  // Reset layout
  const handleResetGraph = () => {
    const fresh = MALTEGO_NODES_DATA.map((n) => ({ ...n }));
    setNodes(fresh);
    nodesRef.current = fresh;
    setZoom(embedded ? 0.82 : 0.95);
    setPan({ x: 20, y: 10 });
    setActiveFilter('all');
    setActiveChain('all');
  };

  // Interactive HTML5 Canvas render + subtle force relaxation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const renderLoop = () => {
      tick += 1;
      const width = canvas.width;
      const height = canvas.height;

      // Gentle force-directed relaxation if active
      if (isPhysicsActive && tick % 2 === 0) {
        const cur = nodesRef.current;
        for (let i = 0; i < cur.length; i++) {
          for (let j = i + 1; j < cur.length; j++) {
            const dx = cur[j].x - cur[i].x;
            const dy = cur[j].y - cur[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const minDist = 135;
            if (dist < minDist) {
              const force = ((minDist - dist) / minDist) * 0.35;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              if (draggingNodeIdRef.current !== cur[i].id && cur[i].id !== 'site_17631') {
                cur[i].x -= fx;
                cur[i].y -= fy;
              }
              if (draggingNodeIdRef.current !== cur[j].id && cur[j].id !== 'site_17631') {
                cur[j].x += fx;
                cur[j].y += fy;
              }
            }
          }
        }
      }

      // Clear background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle tactical coordinate grid
      ctx.save();
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.55)';
      ctx.lineWidth = 1;
      const gridStep = 45 * zoom;
      const offsetX = pan.x % gridStep;
      const offsetY = pan.y % gridStep;
      for (let x = offsetX; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const currentNodes = nodesRef.current;
      const nodeMap = new Map<string, MaltegoNode>();
      currentNodes.forEach((n) => nodeMap.set(n.id, n));

      // Draw Edges + Animated Telemetry Flow Particles
      MALTEGO_EDGES_DATA.forEach((edge, eIdx) => {
        const src = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!src || !tgt) return;

        const isChainMatch =
          activeChain === 'all' || edge.highlightChain === activeChain;
        const isSelectedEdge =
          selectedNode?.id === src.id || selectedNode?.id === tgt.id;

        const alpha = !isChainMatch ? 0.14 : isSelectedEdge ? 0.95 : 0.55;

        let edgeColor = '#38bdf8';
        if (edge.type === 'causation') edgeColor = '#ef4444';
        else if (edge.type === 'retaliation') edgeColor = '#f43f5e';
        else if (edge.type === 'contract') edgeColor = '#f59e0b';
        else if (edge.type === 'judicial_notice') edgeColor = '#a855f7';

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = isSelectedEdge ? 2.6 : 1.5;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();

        // Animated flow pulse along active edges
        if (isChainMatch) {
          const t = ((tick * 0.008 + eIdx * 0.17) % 1);
          const px = src.x + (tgt.x - src.x) * t;
          const py = src.y + (tgt.y - src.y) * t;
          ctx.fillStyle = edgeColor;
          ctx.beginPath();
          ctx.arc(px, py, isSelectedEdge ? 4 : 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Edge midpoint label
        if (!embedded || isSelectedEdge) {
          const mx = (src.x + tgt.x) / 2;
          const my = (src.y + tgt.y) / 2;
          ctx.font = 'bold 9.5px ui-monospace, SFMono-Regular, Menlo, monospace';
          const textW = ctx.measureText(edge.label).width;
          ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
          ctx.fillRect(mx - textW / 2 - 4, my - 8, textW + 8, 14);
          ctx.fillStyle = isSelectedEdge ? '#f8fafc' : '#94a3b8';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.label, mx, my - 1);
        }

        ctx.restore();
      });

      // Draw Nodes
      currentNodes.forEach((node) => {
        const style = CATEGORY_COLORS[node.category];
        const matchesFilter =
          activeFilter === 'all' || node.category === activeFilter;
        const matchesSearch =
          !searchQuery.trim() ||
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.sublabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.summary.toLowerCase().includes(searchQuery.toLowerCase());

        const isDimmed = !matchesFilter || !matchesSearch;
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNodeId === node.id;

        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.2 : 1;

        // Outer pulsing ring for selected or critical center node
        if (isSelected || node.id === 'site_17631') {
          const pulseRadius =
            node.radius + 7 + Math.sin(tick * 0.08) * 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isSelected ? '#22d3ee' : style.stroke;
          ctx.lineWidth = isSelected ? 2.5 : 1.5;
          ctx.stroke();
        }

        // Glow shadow
        ctx.shadowColor = isSelected ? 'rgba(34, 211, 238, 0.85)' : style.glow;
        ctx.shadowBlur = isSelected || isHovered ? 22 : 12;

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = style.fill;
        ctx.fill();
        ctx.lineWidth = isSelected ? 3.2 : isHovered ? 2.5 : 2;
        ctx.strokeStyle = isSelected ? '#22d3ee' : style.stroke;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Node Icon / Category Initial
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px ui-monospace, SFMono-Regular, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const badgeText =
          node.category === 'toxic_plume'
            ? 'Cr6'
            : node.category === 'victim'
            ? 'VIC'
            : node.category === 'medical_ehr'
            ? 'EHR'
            : node.category === 'contract_void'
            ? '700'
            : node.category === 'public_entity'
            ? 'GOV'
            : 'LAW';
        ctx.fillText(badgeText, node.x, node.y);

        // Node Label Pill below circle
        ctx.font = 'bold 11px Inter, system-ui, sans-serif';
        const labelW = ctx.measureText(node.label).width;
        const subW = ctx.measureText(node.sublabel).width;
        const boxW = Math.max(labelW, subW * 0.85) + 14;
        const boxY = node.y + node.radius + 6;

        ctx.fillStyle = isSelected
          ? 'rgba(8, 51, 68, 0.95)'
          : 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = isSelected ? '#22d3ee' : 'rgba(51, 65, 85, 0.9)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(node.x - boxW / 2, boxY, boxW, 28, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSelected ? '#67e8f9' : '#f8fafc';
        ctx.fillText(node.label, node.x, boxY + 10);

        ctx.font = '9.5px ui-monospace, SFMono-Regular, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(node.sublabel, node.x, boxY + 21);

        ctx.restore();
      });

      ctx.restore();
      animationFrameId = window.requestAnimationFrame(renderLoop);
    };

    animationFrameId = window.requestAnimationFrame(renderLoop);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [zoom, pan, activeFilter, activeChain, searchQuery, selectedNode, hoveredNodeId, isPhysicsActive, embedded]);

  // Convert screen coordinates to canvas graph coordinates
  const toGraphCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.width / rect.width;
    const scaleY = e.currentTarget.height / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    return {
      gx: (canvasX - pan.x) / zoom,
      gy: (canvasY - pan.y) / zoom,
      rawX: e.clientX,
      rawY: e.clientY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { gx, gy, rawX, rawY } = toGraphCoords(e);
    lastMousePosRef.current = { x: rawX, y: rawY };

    // Check if clicked on a node
    for (let i = nodesRef.current.length - 1; i >= 0; i--) {
      const n = nodesRef.current[i];
      const dx = gx - n.x;
      const dy = gy - n.y;
      if (dx * dx + dy * dy <= (n.radius + 8) * (n.radius + 8)) {
        draggingNodeIdRef.current = n.id;
        setSelectedNode(n);
        return;
      }
    }

    isPanningRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { gx, gy, rawX, rawY } = toGraphCoords(e);

    if (draggingNodeIdRef.current) {
      const updated = nodesRef.current.map((n) =>
        n.id === draggingNodeIdRef.current ? { ...n, x: gx, y: gy } : n
      );
      nodesRef.current = updated;
      setNodes(updated);
      return;
    }

    if (isPanningRef.current) {
      const dx = rawX - lastMousePosRef.current.x;
      const dy = rawY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: rawX, y: rawY };
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    // Hover hit test
    let foundHover: string | null = null;
    for (let i = nodesRef.current.length - 1; i >= 0; i--) {
      const n = nodesRef.current[i];
      const dx = gx - n.x;
      const dy = gy - n.y;
      if (dx * dx + dy * dy <= (n.radius + 8) * (n.radius + 8)) {
        foundHover = n.id;
        break;
      }
    }
    setHoveredNodeId(foundHover);
  };

  const handleMouseUp = () => {
    draggingNodeIdRef.current = null;
    isPanningRef.current = false;
  };

  return (
    <div
      id="maltego-graph-root"
      className={embedded ? 'w-full' : 'max-w-7xl mx-auto px-4 py-6'}
    >
      {!embedded && (
        <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-xl p-5 mb-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <Network className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Interactive HTML5 Canvas Maltego Entity &amp; Evidentiary Link Graph
              </h2>
            </div>
            <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-700 px-3 py-1 rounded-full font-bold">
              15 Forensic Nodes &middot; 18 Verified Causal Links &middot; Live Exhibit Preview
            </span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Drag any entity node, filter by forensic chain (<b>Toxic Exposure</b>, <b>Form 700 Void Deals</b>, or <b>ICU Lockout &amp; Retaliation</b>), and click any node to inspect its primary exhibit image, statutory predicates, and Federal Rule of Evidence 201 links.
          </p>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Preset Causal Trace Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-slate-400 font-bold mr-1">TRACE CHAIN:</span>
          {[
            { id: 'all', label: 'All Links (18)', color: 'cyan' },
            { id: 'toxic', label: '🔥 49× Cr(VI) -> Breach -> ICU', color: 'red' },
            { id: 'void_deals', label: '⚖️ Form 700 Void Deals ($326.1M)', color: 'amber' },
            { id: 'retaliation', label: '🚨 7-Day ICU Lockout & Retaliation', color: 'rose' },
          ].map((chain) => (
            <button
              key={chain.id}
              onClick={() => setActiveChain(chain.id as any)}
              className={`px-2.5 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                activeChain === chain.id
                  ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-300'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {chain.label}
            </button>
          ))}
        </div>

        {/* Search & Canvas Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter node / docket..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white outline-none focus:border-cyan-500 w-40 sm:w-48"
            />
          </div>

          <button
            onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.12).toFixed(2)))}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.12).toFixed(2)))}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetGraph}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-mono font-bold flex items-center gap-1 cursor-pointer"
            title="Reset Graph View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px] font-mono">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-2.5 py-1 rounded-full border cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-100 text-slate-950 font-bold border-white'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          All Entities ({MALTEGO_NODES_DATA.length})
        </button>
        {(Object.keys(CATEGORY_COLORS) as MaltegoNodeCategory[]).map((cat) => {
          const cfg = CATEGORY_COLORS[cat];
          const isCurr = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(isCurr ? 'all' : cat)}
              style={{
                borderColor: isCurr ? cfg.stroke : undefined,
                backgroundColor: isCurr ? cfg.fill : undefined,
              }}
              className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 cursor-pointer transition-all ${
                isCurr ? 'text-white font-bold shadow' : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cfg.stroke }}
              />
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Split Grid: Canvas on Left, Live Forensic Node & Exhibit Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive HTML5 Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden relative shadow-2xl">
          <canvas
            ref={canvasRef}
            width={1100}
            height={embedded ? 560 : 660}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-[420px] sm:h-[540px] lg:h-[620px] cursor-grab active:cursor-grabbing block"
          />

          {/* Overlay Legend in Bottom-Left of Canvas */}
          <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-2 text-[11px] font-mono text-slate-300 pointer-events-none backdrop-blur-md">
            <div className="text-cyan-400 font-bold mb-1">
              CANVAS TELEMETRY // DRAG NODES OR PAN VIEWPORT
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
              <span>🔴 Red Flow: Toxic / Injury Causation</span>
              <span>🟡 Amber Flow: Form 700 / Contract Voiding</span>
              <span>🟣 Purple Flow: FRE 201 Judicial Notice</span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Node Forensic Dossier & Direct Primary Exhibit Preview */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {CATEGORY_COLORS[selectedNode.category].label}
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1.5">
                  {selectedNode.label}
                </h3>
                <p className="text-xs font-mono text-amber-400">
                  {selectedNode.sublabel}
                </p>
              </div>
              <span className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-700/60 shrink-0">
                {selectedNode.severity}
              </span>
            </div>

            {/* Live Primary Exhibit Thumbnail Preview */}
            {selectedNode.previewImageUrl && (
              <div className="mb-3 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden group relative">
                <img
                  src={selectedNode.previewImageUrl}
                  alt={selectedNode.label}
                  className="w-full h-44 object-cover object-top group-hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                  onClick={() =>
                    selectedNode.exhibitFile &&
                    onOpenFileInViewer(selectedNode.exhibitFile, selectedNode.previewImageUrl)
                  }
                />
                <div className="p-2 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300 truncate">
                    Exhibit: <b className="text-cyan-300">{selectedNode.exhibitFile}</b>
                  </span>
                  {selectedNode.exhibitFile && (
                    <button
                      onClick={() =>
                        onOpenFileInViewer(
                          selectedNode.exhibitFile!,
                          selectedNode.previewImageUrl
                        )
                      }
                      className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Full Exhibit</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            <p className="text-xs text-slate-200 leading-relaxed mb-3 font-serif">
              {selectedNode.summary}
            </p>

            {/* Key Evidentiary Metrics */}
            <div className="mb-3">
              <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase mb-1.5">
                Verified Forensic Proof Points:
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {selectedNode.keyMetrics.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Controlling Statutes */}
            <div className="mb-4">
              <div className="text-[11px] font-mono font-bold text-amber-400 uppercase mb-1.5">
                Linked Statutory Authorities (/ailaws):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.statutoryLinks.map((st, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-amber-500/40 text-amber-200 text-[11px] font-mono"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          {selectedNode.exhibitFile && (
            <button
              onClick={() =>
                onOpenFileInViewer(
                  selectedNode.exhibitFile!,
                  selectedNode.previewImageUrl
                )
              }
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Inspect Primary Record ({selectedNode.exhibitFile})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
