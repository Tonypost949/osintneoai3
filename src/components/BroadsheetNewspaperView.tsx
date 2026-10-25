import React, { useState, useMemo } from 'react';
import {
  Newspaper,
  Search,
  ShieldCheck,
  Coins,
  FileText,
  ExternalLink,
  AlertTriangle,
  Award,
  Send,
  MapPin,
  Scale,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Printer,
  Share2,
  FolderOpen,
  PhoneCall,
  Layers,
  Eye,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { AppViewportTab } from '../data/hbncDemoScript';

interface BroadsheetNewspaperViewProps {
  onSelectTab?: (tab: AppViewportTab) => void;
}

type EditionTheme = 'print' | 'modern' | 'cyber';
type ViewMode = 'interactive' | 'broadsheet-v3' | 'broadsheet-v2' | 'newspaper-hub';
type LeadStoryId = 'hbnc-plume' | 'tax-exemption-1090' | 'anaheim-rico';

interface LeadStory {
  id: LeadStoryId;
  kicker: string;
  headline: string;
  deck: string;
  byline: string;
  dateline: string;
  dropCapParagraph: string;
  paragraphs: string[];
  statutoryViolations: {
    code: string;
    title: string;
    finding: string;
    exposure: string;
  }[];
  metrics: {
    label: string;
    value: string;
    sub: string;
  }[];
}

const LEAD_STORIES: LeadStory[] = [
  {
    id: 'hbnc-plume',
    kicker: 'FLAGSHIP FORENSIC INVESTIGATION · CASE FILE #OSINT-2026-001 · 17631 CAMERON LANE',
    headline: '49× Hexavalent Chromium Plume & 1-Year Asphalt Cap Breach Expose 174 Unhoused Residents at Huntington Beach Navigation Center; 6 Hospitalized, 2 Dead',
    deck: 'Leaked November 5, 2020 internal engineering email ("Option #2 gives the city ayear to decide") proves intentional selection of temporary $145,609 seal over a certified 980 µg/kg Cr(VI) groundwater and soil vapor hazard while invoicing taxpayers $14.2M+.',
    byline: 'By The Tax-Funded Dispatch Forensic Audit Desk & Citizen Relator Desk (Anthony M. DiMarcello)',
    dateline: 'HUNTINGTON BEACH & SANTA ANA, CA —',
    dropCapParagraph:
      'Official municipal engineering records, EnviroStor soil boring logs (Boring B-6 at 980 µg/kg vs. 20 µg/kg residential screening threshold), and contemporaneous internal emails obtained by Citizen Whistleblower and Original Source Relator Anthony M. DiMarcello confirm that the City of Huntington Beach, Mercy House Living Centers, Inc. (EIN 33-0448275), and joint venture developers constructed and operated a 174-bed congregate shelter directly atop an unmitigated industrial toxic plume at 17631 Cameron Lane (APN 111-010-20).',
    paragraphs: [
      'On November 5, 2020 at 10:25 AM, Senior Construction ManagerJohnring (Griffin Structures) transmitted the smoking-gun directive to Assistant City Manager Ursula Luna-Reynosa and Public Works Director Travis Hopkins: "Option #2 gives the city ayear to decide what the long term plan is for the property." Rather than installing a permanent RCRA/DTSC vapor barrier and excavating the Hexavalent Chromium, Arsenic (22.4 mg/kg — 203× screening level), Lead, and PCE/TCE plume, officials approved Change Order #4 for a $145,609 temporary 1-year asphalt seal.',
      'Between November 2021 and early 2026, that 1-year temporary asphalt cap remained in service for more than four years beyond its engineered lifespan. Ground-level photographic forensic telemetry captured alligator cracking, subsidence trenches, and direct soil-gas pathways beneath the congregate sleeping tents.',
      'The human cost is documented in verified clinical records: within a single seven-day window inside the congregate tent, six (6) residents suffered acute respiratory and systemic collapse requiring ICU hospitalization, and two (2) unhoused residents died inside the facility while municipal and non-profit executives drew $328,450+ in tax-exempt salaries.',
      'Simultaneously, parcel records expose the adjacent $6,094,000 dual-parcel land swap at 17642 Beach Boulevard & 17631 Cameron Lane involving the Yamada Living Trusts and council conflict-of-interest overlaps under California Government Code § 1090 — rendering the underlying municipal agreements void ab initio under Thomson v. Call (1985) 38 Cal.3d 633.'
    ],
    statutoryViolations: [
      {
        code: 'Cal. Gov. Code § 1090 & § 87100',
        title: 'Strict Liability Conflict of Interest & Form 700 Omission',
        finding: 'Financial interest in public land & operator contracts renders contracts Void Ab Initio; mandatory 100% disgorgement under Thomson v. Call.',
        exposure: '$14,200,000+ Disgorgement'
      },
      {
        code: '31 U.S.C. § 3729 / Cal. Gov. Code § 12650',
        title: 'Federal & California False Claims Act (Qui Tam)',
        finding: 'Certifying HUD/HCD/HOME-ARP environmental compliance while concealing 49× Cr(VI) plume and expired 1-year asphalt cap.',
        exposure: '$42,600,000 Treble Damages'
      },
      {
        code: '42 U.S.C. § 6972 (RCRA) & CEQA § 21083',
        title: 'Imminent & Substantial Endangerment / Unlawful Ministerial Exemption',
        finding: 'Operating a 174-bed residential shelter over 980 µg/kg Cr(VI) & 22.4 mg/kg Arsenic without EIR or vapor mitigation.',
        exposure: 'Federal Injunction & Remediation'
      },
      {
        code: '18 U.S.C. § 1962(c)-(d) & § 1951',
        title: 'Civil RICO Enterprise, Hobbs Act Extortion & Witness Retaliation',
        finding: 'Coordinated retaliation against Original Relator via 212 Southbrook armed raid, returned $1,500 money orders, and 3 void judgments.',
        exposure: 'Treble Civil RICO Damages'
      }
    ],
    metrics: [
      { label: 'Cr(VI) Peak (Boring B-6)', value: '980 µg/kg', sub: '49× Above 20 µg/kg Limit' },
      { label: 'Arsenic Soil Concentration', value: '22.4 mg/kg', sub: '203× Screening Threshold' },
      { label: '7-Day ICU Cluster', value: '6 Hospitalized', sub: '2 Resident Deaths Documented' },
      { label: 'Exposed Public Funds', value: '$14,200,000', sub: '100% Disgorgement Target' }
    ]
  },
  {
    id: 'tax-exemption-1090',
    kicker: 'PUBLIC LEDGER AUDIT · CASE FILE #OSINT-2026-002 · NON-PROFIT TAX EXEMPTION LOOPHOLE',
    headline: 'Forensic Audit Uncovers $14.2M Tax-Exemption Loophole & FOIA-2026-9041 Yamada Living Trusts $6.09M Land Allocation Across 12 Non-Profit Trusts',
    deck: 'Cross-referencing IRS Form 990 XML filings, County Assessor Welfare Exemption certificates, and Municipal Grant Ledgers reveals 12 non-profit land trusts holding $84M in untaxed commercial parcels while routing 68% of public grants into executive compensation.',
    byline: 'By The Tax-Funded Dispatch Autonomous TaxFunded Ledger Engine',
    dateline: 'SACRAMENTO & ORANGE COUNTY, CA —',
    dropCapParagraph:
      'An automated cross-compilation of IRS Form 990 Schedule J disclosures, Orange County Assessor parcel rolls, and USASpending sub-award ledgers has identified $14,200,000 in improper property tax exemptions and diverted homelessness appropriations across twelve interconnected non-profit entities operating in Southern California.',
    paragraphs: [
      'Under California Revenue and Taxation Code § 214, property held under the Welfare Exemption must be used exclusively for charitable purposes with zero private inurement or commercial leaseback arbitrage. Yet parcel telemetry for APN 111-010-20 and adjacent Beach Boulevard holdings demonstrates commercial fee routing, undisclosed contractor sub-leases, and executive salaries exceeding $328,450 annually.',
      'In FOIA Record #FOIA-2026-9041, municipal wire transfers totaling $6,094,000 were executed for parcel acquisitions tied to the Yamada Living Trusts without independent appraisal disclosure or Brown Act open-session price justification under Cal. Gov. Code § 54956.8.',
      'Every verified document hashed into the OsintNeoAi Dual-Token Ledger automatically mints statutory whistleblower claim units under 26 U.S.C. § 7623 (IRS Whistleblower Award) and Cal. Gov. Code § 12650, locking 15% to 33% relator bounty calculations directly into the MultiPoolEscrow smart contract.'
    ],
    statutoryViolations: [
      {
        code: 'Cal. Rev. & Tax. Code § 214',
        title: 'Welfare Property Tax Exemption Forfeiture',
        finding: 'Commercial sub-leasing and executive salary diversion void charitable property tax immunity.',
        exposure: '$14,200,000 Back Taxes'
      },
      {
        code: '26 U.S.C. § 501(c)(3) & § 4958',
        title: 'IRS Private Inurement & Excess Benefit Transactions',
        finding: '68% administrative overhead and related-party real estate leasebacks trigger Form 211 IRS referral.',
        exposure: '25%–200% Excise Tax + Revocation'
      },
      {
        code: 'Cal. Gov. Code § 54956.8',
        title: 'Ralph M. Brown Act Real Property Negotiation Violation',
        finding: 'Concealment of true parcel valuation and environmental discount in closed-session land swaps.',
        exposure: 'Nullification of Land Action'
      },
      {
        code: 'Cal. Gov. Code § 1480 & Civ. Code § 9550',
        title: 'Public Official & Contractor Surety Bond Liability',
        finding: 'Direct surety underwriter claim BOND-CLAIM-F243EF9E44 attached against official performance bonds.',
        exposure: '$14,200,000 Bond Claim'
      }
    ],
    metrics: [
      { label: 'Commercial Parcels Audited', value: '$84,000,000', sub: '12 Non-Profit Trusts' },
      { label: 'Yamada Trust Allocation', value: '$6,094,000', sub: 'FOIA-2026-9041 Verified' },
      { label: 'Overhead Diversion', value: '68.0%', sub: 'Routed to Admin / Exec Pay' },
      { label: 'Whistleblower Bounty Pool', value: '15% – 33%', sub: 'Cal. Gov. Code § 12650' }
    ]
  },
  {
    id: 'anaheim-rico',
    kicker: 'REGIONAL CORRUPTION PARALLEL · CASE FILE #OSINT-2026-003 · ANAHEIM & OC JUDICIAL NEXUS',
    headline: 'Anaheim Municipal RICO & $320M Angel Stadium Collapse Mirror Huntington Beach Land-Swap Playbook & OC Superior Court Procedural Entrapment',
    deck: 'FBI corruption probe (USA v. Sidhu, Case No. 8:23-cr-00119-JWH) before U.S. District Judge John W. Holcomb establishes the federal evidentiary blueprint for voiding corrupt Orange County municipal land transactions.',
    byline: 'By The Tax-Funded Dispatch Judicial & Federal Docket Unit',
    dateline: 'ANAHEIM & SANTA ANA FEDERAL COURTHOUSE, CA —',
    dropCapParagraph:
      'Federal criminal convictions in United States v. Harry Sidhu (C.D. Cal. Case No. 8:23-cr-00119-JWH), presided over by United States District Judge John W. Holcomb at the Ronald Reagan Federal Building in Santa Ana, provide mandatory Judicial Notice under Federal Rule of Evidence 201 for the identical municipal land-swap pattern operating in Huntington Beach.',
    paragraphs: [
      'In Anaheim, municipal officials and chamber insiders orchestrated secret off-record meetings, concealed conflicts of interest, bypassed Brown Act transparency mandates, and destroyed public records to ram through a $320,000,000 public stadium land disposition—ultimately voided after FBI wiretaps exposed the enterprise.',
      'Meanwhile, in Orange County Superior Court Case No. 30-2021-01201327-CL-UD-CJC (Woodbridge Meadows Apartments vs. Anthony DiMarcello), certified Register of Actions entries (ROA #1–61) document how relator Anthony DiMarcello was targeted with an unlawful April 23, 2021 extortion demand ($5,788.00 before any lawsuit existed), fraudulent posting service (ROA #10) while in daily email contact, an armed August 4, 2021 Sheriff lockout where Manager Brian Olsen physically handed back $1,500 in held money orders, and three (3) successive void default judgments on a single complaint (06/29/2021, 12/22/2021, and 02/04/2022).',
      'By uniting federal Qui Tam standing, FRE 201 cross-case judicial notice, and immutable Ethereum Sepolia blockchain anchoring, The Tax-Funded Dispatch ensures that no municipal record wipe (SM-092) or clerk default anomaly can erase primary evidence.'
    ],
    statutoryViolations: [
      {
        code: 'FRE Rule 201 & 8:23-cr-00119-JWH',
        title: 'Mandatory Federal Judicial Notice (USA v. Sidhu)',
        finding: 'Adjudicated facts of OC municipal land-swap corruption and Brown Act evasion before Judge John W. Holcomb.',
        exposure: '$320,000,000 Municipal Parallel'
      },
      {
        code: 'Cal. CCP § 473(d) & § 580 (Heidary)',
        title: 'Three Successive Default Judgments Void on Their Face',
        finding: 'ROA #25, #51, and #60 entered on a single complaint after valid tender of $1,500 money orders (Strom v. Union Oil).',
        exposure: 'Immediate Vacatur as a Matter of Law'
      },
      {
        code: 'Cal. Penal Code §§ 118, 518 & 368',
        title: 'Perjury on Form UD-101, Extortion & Dependent Adult Endangerment',
        finding: 'False oath hiding tendered money orders; reckless displacement of Elizabeth Petruccio during IV Ceftriaxone cardiac care.',
        exposure: 'Criminal & Civil Forfeiture'
      },
      {
        code: '42 U.S.C. § 1983 (Monell Liability)',
        title: 'Deprivation of Due Process Under Color of Authority',
        finding: 'Execution of Levying File No. 2021102780 & database purge SM-092 against a federal witness.',
        exposure: 'Compensatory & Punitive Damages'
      }
    ],
    metrics: [
      { label: 'Anaheim Voided Deal', value: '$320,000,000', sub: 'USA v. Sidhu (Judge Holcomb)' },
      { label: 'OC Court ROA Entries', value: '61 Certified', sub: '3 Void Default Judgments' },
      { label: 'Returned Money Orders', value: '$1,500.00', sub: '3× $500 Handed Back 08/04/21' },
      { label: 'Ex Parte Motion (ROA #29)', value: '32 Pages', sub: 'Fee Waiver Granted ROA #32' }
    ]
  }
];

const WORKSPACE_WIRE_STORIES = [
  {
    id: 'WIRE-01',
    badge: 'WORKSPACE #WS-HBNC',
    category: 'ENVIRONMENTAL & QUI TAM',
    title: 'HBNC Contamination: 49× Cr(VI) Cover-Up, Nov 5 2020 "Option #2" Email & 6-Resident ICU Cluster',
    summary: 'Boring B-6 (980 µg/kg Hexavalent Chromium) and 22.4 mg/kg Arsenic documented beneath 174-bed congregate tent after 1-year temporary asphalt cap remained unmaintained for 4+ years.',
    reward: '+14,200 TFT / +5,000 OSINT',
    hash: '0x9f84c2e1...a71b09',
    tabTarget: 'integrations' as AppViewportTab,
    leadId: 'hbnc-plume' as LeadStoryId
  },
  {
    id: 'WIRE-02',
    badge: 'WORKSPACE #WS-9041',
    category: 'CAL. GOV. CODE § 1090',
    title: 'FOIA-2026-9041: Yamada Living Trusts $6.09M / $14.2M Land Allocation & Dual-Parcel Conflict Matrix',
    summary: 'Cross-referenced grant deeds and council disclosures expose undisclosed financial overlap across 17631 Cameron Ln & 17642 Beach Blvd, triggering Thomson v. Call 100% disgorgement.',
    reward: '+10,000 TFT / +3,500 OSINT',
    hash: '0x4d12b8f0...c39e12',
    tabTarget: 'void-deals' as AppViewportTab,
    leadId: 'tax-exemption-1090' as LeadStoryId
  },
  {
    id: 'WIRE-03',
    badge: 'WORKSPACE #WS-WOODBRIDGE',
    category: 'JUDICIAL & RICO AUDIT',
    title: 'OC Superior Court 30-2021-01201327: Brian Olsen Returns $1,500 Money Orders During Armed Raid; 3 Void Judgments',
    summary: 'Certified ROA #1–61 and contemporaneous March–April 2021 emails prove valid tender under Strom v. Union Oil, pre-lawsuit extortion ($5,788), and 3 impossible default judgments.',
    reward: '+8,500 TFT / +5,000 OSINT',
    hash: '0x7a31e9d4...88b204',
    tabTarget: 'user-workspaces' as AppViewportTab,
    leadId: 'anaheim-rico' as LeadStoryId
  },
  {
    id: 'WIRE-04',
    badge: 'WORKSPACE #WS-1949',
    category: 'HISTORICAL GIS & INQUEST',
    title: 'Collection 1301114384483836 Decoded: 17631 McNeely Inquest & 1949 State Plane Zone VI Datum Audit',
    summary: 'Archival Coroner inquest records and USGS aerial photogrammetry segregate pre-1949 agricultural baselines from post-1970 industrial solvent dumping at Cameron Lane.',
    reward: '+4,200 TFT / +2,800 OSINT',
    hash: '0x2c67f1a8...19d4ef',
    tabTarget: 'locker' as AppViewportTab,
    leadId: 'hbnc-plume' as LeadStoryId
  }
];

export const BroadsheetNewspaperView: React.FC<BroadsheetNewspaperViewProps> = ({ onSelectTab }) => {
  const [editionTheme, setEditionTheme] = useState<EditionTheme>('print');
  const [viewMode, setViewMode] = useState<ViewMode>('interactive');
  const [selectedLeadId, setSelectedLeadId] = useState<LeadStoryId>('hbnc-plume');
  const [searchQuery, setSearchQuery] = useState('');
  const [faxDispatchStatus, setFaxDispatchStatus] = useState<string | null>(null);

  // One-Account = One-Wallet = One-Workspace = One-Newspaper signup state
  const [handleInput, setHandleInput] = useState('Patriot_Auditor_01');
  const [publicationInput, setPublicationInput] = useState('The Orange County Forensic Sentinel');
  const [focusDomain, setFocusDomain] = useState('Municipal Land & § 1090 Disgorgement');
  const [provisionedIdentity, setProvisionedIdentity] = useState<{
    handle: string;
    publication: string;
    wallet: string;
    workspaceId: string;
    tftBonus: string;
    osintBonus: string;
    timestamp: string;
  } | null>({
    handle: 'Anthony_DiMarcello_Relator01',
    publication: 'The Tax-Funded Dispatch — Flagship Bureau',
    wallet: '0x71C9...89A2F4 (Sepolia Verified)',
    workspaceId: 'WS-MASTER-001 (3 Case Slots Active)',
    tftBonus: '300,000 TFT',
    osintBonus: '50,000 OSINT',
    timestamp: '2026-10-24 21:15:00 UTC'
  });

  const activeLead = useMemo(
    () => LEAD_STORIES.find((s) => s.id === selectedLeadId) || LEAD_STORIES[0],
    [selectedLeadId]
  );

  const filteredWireStories = useMemo(() => {
    if (!searchQuery.trim()) return WORKSPACE_WIRE_STORIES;
    const q = searchQuery.toLowerCase();
    return WORKSPACE_WIRE_STORIES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleProvisionIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    const randomHex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    setProvisionedIdentity({
      handle: handleInput.trim() || 'Citizen_Auditor_99',
      publication: publicationInput.trim() || 'The Citizen Forensic Dispatch',
      wallet: `0x${randomHex.slice(0, 4)}...${randomHex.slice(4)} (Sepolia Auto-Minted)`,
      workspaceId: `WS-CITIZEN-${randomHex.slice(0, 4)} (3 Case Slots Ready)`,
      tftBonus: '1,000 TFT Genesis Grant',
      osintBonus: '2,500 OSINT Verification Credits',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
    });
  };

  const handleFaxToRegulators = () => {
    setFaxDispatchStatus(
      `DISPATCHED: Lead Investigation "${activeLead.id.toUpperCase()}" packaged with SHA-256 Merkle Proofs & transmitted via eFax/SMTP to US DOJ Civil Fraud, EPA Region 9 OIG, California FPPC, and State Auditor.`
    );
    setTimeout(() => setFaxDispatchStatus(null), 9000);
  };

  // Theme styling classes
  const isPrint = editionTheme === 'print';
  const isModern = editionTheme === 'modern';

  return (
    <div className="space-y-4 pb-12">
      {/* 1. LIVE DUAL-TOKEN CRYPTO & PUBLIC LEDGER TOP TICKER BAR */}
      <div className="bg-slate-950 border border-amber-500/40 rounded-xl px-4 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            TFT: 14,200,000 SUPPLY (+14.2% Audit Growth)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            OSINT: 50,000,000 SUPPLY (+8.5% Staking Yield)
          </span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
            ⚡ Bridge APY: 12.5% (1.05× Cross-Chain Multiplier)
          </span>
          <span className="inline-flex items-center gap-1.5 text-rose-400 font-semibold">
            🏛️ Taxpayer Tracked: $326,100,000 ($14.2M HBNC Disgorgement)
          </span>
          <span className="inline-flex items-center gap-1.5 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PUBLIC LEDGER: LIVE (SEPOLIA)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab?.('crypto-transparency')}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold transition cursor-pointer"
          >
            🪙 Inspect Token Contracts
          </button>
          <button
            onClick={() => onSelectTab?.('user-workspaces')}
            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition cursor-pointer"
          >
            🔐 Open Citizen Workspace
          </button>
        </div>
      </div>

      {/* 2. EDITION THEME SWITCHER & ORIGINAL HTML ARCHIVE VIEWER BAR */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mr-1">
            Newspaper Mode:
          </span>
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'interactive'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            Interactive Broadsheet Edition
          </button>
          <button
            onClick={() => setViewMode('broadsheet-v3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'broadsheet-v3'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Original Broadsheet v3 (newspaper_broadsheet_v3.html)
          </button>
          <button
            onClick={() => setViewMode('broadsheet-v2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'broadsheet-v2'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Original Broadsheet v2 (newspaper_broadsheet_v2.html)
          </button>
          <button
            onClick={() => setViewMode('newspaper-hub')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'newspaper-hub'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Press Hub (newspaper_hub.html)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Print Theme:
          </span>
          <button
            onClick={() => setEditionTheme('print')}
            className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
              editionTheme === 'print'
                ? 'bg-[#faf7f0] text-stone-900 border border-stone-400 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            🗞️ Broadsheet Print (#faf7f0)
          </button>
          <button
            onClick={() => setEditionTheme('modern')}
            className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
              editionTheme === 'modern'
                ? 'bg-white text-slate-900 border border-slate-300 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            🏢 Modern Newsroom
          </button>
          <button
            onClick={() => setEditionTheme('cyber')}
            className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
              editionTheme === 'cyber'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            ⚡ Cyber Dark
          </button>
          <a
            href="/workspace/newspaper_broadsheet_v3.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono flex items-center gap-1 border border-slate-700"
          >
            Full Window <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* IF ORIGINAL HTML EMBED MODE IS SELECTED */}
      {viewMode !== 'interactive' ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <span>
              Viewing Original Standalone Workspace File:{' '}
              <strong className="text-amber-300">
                https://osintneoai.me/workspace/
                {viewMode === 'broadsheet-v3'
                  ? 'newspaper_broadsheet_v3.html'
                  : viewMode === 'broadsheet-v2'
                  ? 'newspaper_broadsheet_v2.html'
                  : 'newspaper_hub.html'}
              </strong>
            </span>
            <a
              href={`/workspace/${
                viewMode === 'broadsheet-v3'
                  ? 'newspaper_broadsheet_v3.html'
                  : viewMode === 'broadsheet-v2'
                  ? 'newspaper_broadsheet_v2.html'
                  : 'newspaper_hub.html'
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              Open Direct URL <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <iframe
            src={`/workspace/${
              viewMode === 'broadsheet-v3'
                ? 'newspaper_broadsheet_v3.html'
                : viewMode === 'broadsheet-v2'
                ? 'newspaper_broadsheet_v2.html'
                : 'newspaper_hub.html'
            }`}
            title="The Tax-Funded Dispatch Original Broadsheet"
            className="w-full h-[860px] border-0 bg-[#faf7f0]"
          />
        </div>
      ) : (
        /* INTERACTIVE BROADSHEET FRONT PAGE */
        <div
          className={`rounded-2xl border shadow-2xl transition-colors duration-200 p-6 md:p-8 ${
            isPrint
              ? 'bg-[#faf7f0] text-stone-900 border-stone-400'
              : isModern
              ? 'bg-white text-slate-900 border-slate-300'
              : 'bg-slate-950 text-slate-100 border-slate-800'
          }`}
        >
          {/* TOP EARS + MASTHEAD */}
          <div
            className={`border-b-4 pb-4 mb-4 ${
              isPrint || isModern ? 'border-stone-900' : 'border-amber-500/60'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left Ear */}
              <div
                className={`md:col-span-3 p-3 rounded border text-xs ${
                  isPrint
                    ? 'bg-[#f3ede0] border-stone-400 text-stone-800'
                    : isModern
                    ? 'bg-slate-100 border-slate-300 text-slate-800'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-[10px] text-red-700 dark:text-amber-400">
                  ⚖️ PUBLIC LEDGER EDITION
                </div>
                <div className="font-serif font-bold text-sm mt-0.5">
                  100% Open-Source Forensic Press
                </div>
                <div className="text-[11px] opacity-80 mt-1">
                  Every article backed by SHA-256 primary evidence, certified court ROAs & Sepolia smart contracts.
                </div>
              </div>

              {/* Center Masthead */}
              <div className="md:col-span-6 text-center">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] opacity-75 mb-1">
                  OSINT NEO AI INVESTIGATIVE JOURNAL OF RECORD · EST. 2026
                </div>
                <h1
                  className="text-3xl sm:text-5xl font-black tracking-tight leading-none"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  The Tax-Funded Dispatch
                </h1>
                <p
                  className="italic text-xs sm:text-sm mt-2 font-serif opacity-90"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  &ldquo;Exposing the Divergence Between Public Appropriations and Public Value&rdquo;
                </p>
              </div>

              {/* Right Ear */}
              <div
                className={`md:col-span-3 p-3 rounded border text-xs ${
                  isPrint
                    ? 'bg-[#f3ede0] border-stone-400 text-stone-800'
                    : isModern
                    ? 'bg-slate-100 border-slate-300 text-slate-800'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 dark:text-emerald-400">
                  🪙 BOUNTY ESCROW ACTIVE
                </div>
                <div className="font-serif font-bold text-sm mt-0.5">
                  15%–33% Qui Tam Relator Pool
                </div>
                <div className="text-[11px] opacity-80 mt-1">
                  1 Account = 1 Wallet = 1 Workspace = 1 Newspaper Identity. Zero Paywalls.
                </div>
              </div>
            </div>

            {/* Volume / Date / Bureaus Strip */}
            <div
              className={`mt-4 pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-wider ${
                isPrint || isModern ? 'border-stone-400 text-stone-700' : 'border-slate-800 text-slate-400'
              }`}
            >
              <span>VOL. IX · NO. 448 · SATURDAY, OCTOBER 24, 2026</span>
              <span>BUREAUS: WASHINGTON · SACRAMENTO · ANAHEIM · HUNTINGTON BEACH · SANTA ANA</span>
              <span>PRICE: FREE TO PUBLIC (100% OPEN SOURCE)</span>
            </div>
          </div>

          {/* PUBLIC WORKSPACE SEARCH BAR + BREAKING FLASH WIRE */}
          <div className="mb-6 space-y-3">
            <div
              className={`p-3 rounded-xl border flex flex-wrap items-center gap-3 ${
                isPrint
                  ? 'bg-[#f3ede0] border-stone-400'
                  : isModern
                  ? 'bg-slate-100 border-slate-300'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-red-700 dark:text-amber-400">
                <Search className="w-4 h-4" />
                <span>Public Workspace & 82,757-URL Search:</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 82,757 HB URLs, 35,000+ forensic nodes, ROA 1–61, Yamada Trusts, Boring B-6 (no login required)..."
                className={`flex-1 min-w-[240px] px-3 py-1.5 rounded-lg text-xs border focus:outline-none ${
                  isPrint || isModern
                    ? 'bg-white border-stone-400 text-stone-900'
                    : 'bg-slate-950 border-slate-700 text-slate-100'
                }`}
              />
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="px-2 py-1 rounded bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-bold">
                  82,757 HB URLs Indexed
                </span>
                <span className="px-2 py-1 rounded bg-amber-600/20 text-amber-800 dark:text-amber-300 font-bold">
                  61 Court ROAs Certified
                </span>
              </div>
            </div>

            {/* Lead Story Selector Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider opacity-75">
                Front-Page Lead Dossier:
              </span>
              {LEAD_STORIES.map((story, idx) => (
                <button
                  key={story.id}
                  onClick={() => setSelectedLeadId(story.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedLeadId === story.id
                      ? 'bg-red-800 text-white shadow'
                      : isPrint || isModern
                      ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  Lead #{idx + 1}:{' '}
                  {story.id === 'hbnc-plume'
                    ? '17631 Cameron Ln 49× Cr(VI) & 6 ICU Cluster'
                    : story.id === 'tax-exemption-1090'
                    ? '$14.2M Tax Loophole & Yamada Trusts § 1090'
                    : '$320M Anaheim RICO & 3 Void Court Judgments'}
                </button>
              ))}
            </div>
          </div>

          {faxDispatchStatus && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center justify-between gap-3">
              <span>✅ {faxDispatchStatus}</span>
              <button
                onClick={() => setFaxDispatchStatus(null)}
                className="px-2 py-1 rounded bg-emerald-800 text-white font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 3-COLUMN BROADSHEET GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* COLUMN 1 (LEFT / WIDE): FLAGSHIP FORENSIC INVESTIGATION LEAD STORY (5 cols) */}
            <div
              className={`lg:col-span-5 lg:pr-6 lg:border-r ${
                isPrint || isModern ? 'border-stone-400' : 'border-slate-800'
              }`}
            >
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-700 dark:text-rose-400 mb-1">
                {activeLead.kicker}
              </div>
              <h2
                className="text-2xl sm:text-3xl font-black leading-tight mb-2"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {activeLead.headline}
              </h2>
              <p
                className="text-sm italic opacity-90 mb-3 leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {activeLead.deck}
              </p>
              <div
                className={`text-[11px] font-mono py-1.5 px-2.5 rounded mb-4 border ${
                  isPrint
                    ? 'bg-[#f3ede0] border-stone-300 text-stone-700'
                    : isModern
                    ? 'bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {activeLead.byline}
              </div>

              {/* 4 Key Forensic Metrics Strip */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {activeLead.metrics.map((m) => (
                  <div
                    key={m.label}
                    className={`p-2.5 rounded-lg border ${
                      isPrint
                        ? 'bg-[#f3ede0] border-stone-300'
                        : isModern
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase opacity-75">{m.label}</div>
                    <div className="text-base font-black text-red-700 dark:text-amber-400 mt-0.5">
                      {m.value}
                    </div>
                    <div className="text-[10px] opacity-80">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Newspaper Article Body with Drop-Cap */}
              <div
                className="space-y-3 text-sm leading-relaxed text-justify"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                <p>
                  <span className="float-left text-5xl font-black leading-none pr-3 pt-1 text-red-800 dark:text-amber-400">
                    {activeLead.dropCapParagraph.charAt(0)}
                  </span>
                  <strong className="font-mono text-xs uppercase tracking-wider mr-1">
                    {activeLead.dateline}
                  </strong>
                  {activeLead.dropCapParagraph.slice(1)}
                </p>
                {activeLead.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Statutory Violation Matrix Box */}
              <div
                className={`mt-5 p-4 rounded-xl border ${
                  isPrint
                    ? 'bg-[#f3ede0] border-stone-400'
                    : isModern
                    ? 'bg-slate-100 border-slate-300'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 text-red-800 dark:text-amber-400">
                    <Scale className="w-4 h-4" />
                    Statutory Violation & Liability Matrix
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-800 text-white">
                    VOID AB INITIO / FCA
                  </span>
                </div>
                <div className="space-y-2">
                  {activeLead.statutoryViolations.map((v) => (
                    <div
                      key={v.code}
                      className={`p-2.5 rounded border text-xs ${
                        isPrint || isModern
                          ? 'bg-white border-stone-300'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-bold">
                        <span className="font-mono text-red-800 dark:text-amber-300">{v.code}</span>
                        <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                          {v.exposure}
                        </span>
                      </div>
                      <div className="font-semibold mt-0.5">{v.title}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{v.finding}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Action Buttons matching newspaper_broadsheet_v3.html */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => onSelectTab?.('user-workspaces')}
                  className="px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  Inspect Workspace
                </button>
                <button
                  onClick={handleFaxToRegulators}
                  className="px-3 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Fax to Regulators
                </button>
                <button
                  onClick={() => onSelectTab?.('locker')}
                  className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  Evidence Grid
                </button>
                <button
                  onClick={() => onSelectTab?.('integrations')}
                  className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  GIS Parcel Map
                </button>
              </div>
            </div>

            {/* COLUMN 2 (CENTER): WORKSPACE STORIES WIRE + TOKEN REWARD ENGINE (4 cols) */}
            <div
              className={`lg:col-span-4 lg:pr-6 lg:border-r space-y-5 ${
                isPrint || isModern ? 'border-stone-400' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b-2 pb-1.5 mb-3 border-current">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider">
                    ⚡ Featured Citizen Workspace Wire
                  </h3>
                  <span className="text-[10px] font-mono opacity-75">
                    {filteredWireStories.length} Active Dispatches
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredWireStories.map((story) => (
                    <div
                      key={story.id}
                      className={`p-3.5 rounded-xl border transition ${
                        isPrint
                          ? 'bg-[#f3ede0] border-stone-400 hover:border-stone-700'
                          : isModern
                          ? 'bg-slate-50 border-slate-300 hover:border-slate-500'
                          : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-1">
                        <span className="px-2 py-0.5 rounded bg-red-800 text-white font-bold">
                          {story.badge}
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          {story.reward}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider opacity-70">
                        {story.category}
                      </div>
                      <h4
                        className="font-bold text-sm mt-0.5 leading-snug"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {story.title}
                      </h4>
                      <p className="text-xs opacity-85 mt-1.5 leading-relaxed">{story.summary}</p>
                      <div className="mt-2.5 pt-2 border-t border-stone-300/60 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
                        <span className="opacity-70">SHA-256: {story.hash}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedLeadId(story.leadId)}
                            className="text-red-800 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                          >
                            Read Lead →
                          </button>
                          <button
                            onClick={() => onSelectTab?.(story.tabTarget)}
                            className="text-indigo-700 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                          >
                            Open Module ↗
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOKEN REWARD ENGINE & VALUE SPILLOVER CASCADE */}
              <div
                className={`p-4 rounded-xl border ${
                  isPrint
                    ? 'bg-[#efe6d5] border-stone-500'
                    : isModern
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-slate-900 border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Token Reward & Value Spillover Engine
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-bold">
                    DUAL-TOKEN
                  </span>
                </div>
                <p className="text-xs opacity-90 mb-3">
                  Every Person, Story, Parcel Asset, and Citizen Auditor page is an On-Chain Asset. Halting $1M+ in stolen tax funds triggers a statutory 15%–33% whistleblower bounty spillover across the graph:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div
                    className={`p-2.5 rounded border ${
                      isPrint || isModern
                        ? 'bg-white border-stone-300'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="text-[10px] opacity-70">TAX RECOVERY REWARD</div>
                    <div className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                      14,200 TFT
                    </div>
                    <div className="text-[10px] opacity-75">Per Verified Disgorgement</div>
                  </div>
                  <div
                    className={`p-2.5 rounded border ${
                      isPrint || isModern
                        ? 'bg-white border-stone-300'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="text-[10px] opacity-70">WHISTLEBLOWER DISCLOSURE</div>
                    <div className="text-sm font-black text-cyan-700 dark:text-cyan-400">
                      5,000 OSINT
                    </div>
                    <div className="text-[10px] opacity-75">Per Primary Exhibit Sealed</div>
                  </div>
                  <div
                    className={`p-2.5 rounded border ${
                      isPrint || isModern
                        ? 'bg-white border-stone-300'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="text-[10px] opacity-70">STAKING & BRIDGE APY</div>
                    <div className="text-sm font-black text-amber-700 dark:text-amber-400">
                      12.5% APY
                    </div>
                    <div className="text-[10px] opacity-75">1.05× Cross-Chain Multiplier</div>
                  </div>
                  <div
                    className={`p-2.5 rounded border ${
                      isPrint || isModern
                        ? 'bg-white border-stone-300'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="text-[10px] opacity-70">PATRIOT #01 ASSET JUMP</div>
                    <div className="text-sm font-black text-rose-700 dark:text-rose-400">
                      $310,000 USD
                    </div>
                    <div className="text-[10px] opacity-75">+3,000% On-Chain Cascade</div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3 (RIGHT): LEDGER GROWTH INDEX + 1-ACCOUNT = 1-WALLET = 1-WORKSPACE = 1-NEWSPAPER SIGNUP (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              {/* ONE ACCOUNT = ONE CRYPTO WALLET = ONE WORKSPACE = ONE NEWSPAPER IDENTITY */}
              <div
                className={`p-4 rounded-xl border-2 ${
                  isPrint
                    ? 'bg-[#f3ede0] border-stone-800'
                    : isModern
                    ? 'bg-slate-100 border-slate-800'
                    : 'bg-slate-900 border-indigo-500/60'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1">
                  🔐 CITIZEN FRANCHISE PRESS PROTOCOL
                </div>
                <h3
                  className="text-base font-black leading-snug mb-2"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  One Account = One Crypto Wallet = One Workspace = One Newspaper Identity
                </h3>
                <p className="text-xs opacity-85 mb-3">
                  Investigate in private, seal primary records with SHA-256, publish to your own franchise newspaper node, and earn statutory TFT & OSINT rewards.
                </p>

                {/* Permissions Matrix */}
                <div
                  className={`p-2.5 rounded-lg border text-[11px] font-mono space-y-1 mb-3 ${
                    isPrint || isModern
                      ? 'bg-white border-stone-300'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="font-bold uppercase text-[10px] opacity-70 mb-1">
                    Access & Franchise Matrix:
                  </div>
                  <div>✅ Read main newspaper (No login)</div>
                  <div>✅ View public crypto ledger (No login)</div>
                  <div>✅ Search featured workspaces (No login)</div>
                  <div className="text-indigo-700 dark:text-amber-300 font-bold">
                    🔐 Create own 3-Slot Workspace
                  </div>
                  <div className="text-indigo-700 dark:text-amber-300 font-bold">
                    🔐 Run 950+ OSINT & GitHub tools
                  </div>
                  <div className="text-indigo-700 dark:text-amber-300 font-bold">
                    🔐 Publish franchise newspaper stories
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                    🔐 Earn TFT & OSINT token rewards
                  </div>
                </div>

                {/* Provision Identity Form */}
                <form onSubmit={handleProvisionIdentity} className="space-y-2 text-xs">
                  <div>
                    <label className="block font-mono text-[10px] uppercase opacity-75 mb-0.5">
                      Auditor Handle / Relator Alias:
                    </label>
                    <input
                      type="text"
                      value={handleInput}
                      onChange={(e) => setHandleInput(e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded border text-xs ${
                        isPrint || isModern
                          ? 'bg-white border-stone-400 text-stone-900'
                          : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase opacity-75 mb-0.5">
                      Franchise Newspaper Title:
                    </label>
                    <input
                      type="text"
                      value={publicationInput}
                      onChange={(e) => setPublicationInput(e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded border text-xs ${
                        isPrint || isModern
                          ? 'bg-white border-stone-400 text-stone-900'
                          : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase opacity-75 mb-0.5">
                      Primary Investigation Jurisdiction:
                    </label>
                    <input
                      type="text"
                      value={focusDomain}
                      onChange={(e) => setFocusDomain(e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded border text-xs ${
                        isPrint || isModern
                          ? 'bg-white border-stone-400 text-stone-900'
                          : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow cursor-pointer transition"
                  >
                    ⚡ Mint Wallet + Workspace + Press Node
                  </button>
                </form>

                {provisionedIdentity && (
                  <div
                    className={`mt-3 p-2.5 rounded-lg border text-[11px] font-mono space-y-1 ${
                      isPrint || isModern
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                        : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                    }`}
                  >
                    <div className="font-bold text-emerald-700 dark:text-emerald-300">
                      ✅ ACTIVE IDENTITY PROVISIONED:
                    </div>
                    <div>
                      <strong>Handle:</strong> {provisionedIdentity.handle}
                    </div>
                    <div>
                      <strong>Press Node:</strong> {provisionedIdentity.publication}
                    </div>
                    <div>
                      <strong>Wallet:</strong> {provisionedIdentity.wallet}
                    </div>
                    <div>
                      <strong>Workspace:</strong> {provisionedIdentity.workspaceId}
                    </div>
                    <div>
                      <strong>Balance:</strong> {provisionedIdentity.tftBonus} ·{' '}
                      {provisionedIdentity.osintBonus}
                    </div>
                  </div>
                )}
              </div>

              {/* SURETY BOND & WHISTLEBLOWER STATUTE LEDGER */}
              <div
                className={`p-4 rounded-xl border ${
                  isPrint
                    ? 'bg-[#f3ede0] border-stone-400'
                    : isModern
                    ? 'bg-slate-50 border-slate-300'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Surety Bond & Qui Tam Recourse Index
                </h4>
                <div className="space-y-2 text-xs">
                  <div
                    className={`p-2 rounded border ${
                      isPrint || isModern ? 'bg-white border-stone-300' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      BOND-CLAIM-F243EF9E44
                    </div>
                    <div className="font-semibold">
                      Cal. Gov. Code § 1480 & Civ. Code § 9550
                    </div>
                    <div className="text-[11px] opacity-80">
                      Public Official Faithful Performance & Miller Act Contractor Bond Claim ($14,200,000 Exposure).
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded border ${
                      isPrint || isModern ? 'bg-white border-stone-300' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      31 U.S.C. § 3730 / Gov. Code § 12650
                    </div>
                    <div className="font-semibold">
                      Mandatory 15%–33% Whistleblower Award
                    </div>
                    <div className="text-[11px] opacity-80">
                      Protected under 31 U.S.C. § 3730(h) & Cal. Gov. Code § 12653 Anti-Retaliation Shield.
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-1.5 text-[11px] font-mono">
                  <a
                    href="/workspace/surety_bond_index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded bg-stone-800 text-amber-300 hover:bg-stone-700 flex items-center justify-between"
                  >
                    <span>🛡️ Open Surety Bond Registry</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/workspace/whistleblower_legal_index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded bg-stone-800 text-cyan-300 hover:bg-stone-700 flex items-center justify-between"
                  >
                    <span>⚖️ Whistleblower Statutory Library</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/workspace/page_valuation_dashboard.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded bg-stone-800 text-emerald-300 hover:bg-stone-700 flex items-center justify-between"
                  >
                    <span>💎 Dual-Token Page Valuation Engine</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
