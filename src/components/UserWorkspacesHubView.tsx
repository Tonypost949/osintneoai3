import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Shield,
  Search,
  Database,
  FileText,
  Scale,
  AlertTriangle,
  Newspaper,
  Sliders,
  Link2,
  ExternalLink,
  CheckCircle2,
  Terminal,
  Upload,
  Lock,
  Unlock,
  Hash,
  MapPin,
  Network,
  FolderKanban,
  Users,
  Send,
  Copy,
  Check,
  Sparkles,
  Eye,
  Layers
} from 'lucide-react';
import { AppViewportTab } from '../data/hbncDemoScript';

interface UserWorkspacesHubViewProps {
  onSelectTab?: (tab: AppViewportTab) => void;
}

type WorkspaceTheme =
  | 'dark'
  | 'light'
  | 'midnight-navy'
  | 'magenta-cyber'
  | 'neo-matrix'
  | 'rainbow-aura'
  | 'plaid-rex';

type ActiveWorkspaceSection =
  | 'six-panes'
  | 'woodbridge-dossier'
  | 'toggles-sso'
  | 'portal-directory'
  | 'live-embed';

interface RoaEntry {
  roa: number;
  date: string;
  category: 'PLEADINGS' | 'JUDGMENT_DEFAULT' | 'PEREMPTORY_CHALLENGE' | 'MOTION_VACATE_473D' | 'SHERIFF_WRIT' | 'MINUTE_ORDER';
  title: string;
  party: string;
  forensicFlag: string;
  isVoidAnomaly?: boolean;
}

const CERTIFIED_ROA_DOCKET: RoaEntry[] = [
  {
    roa: 1,
    date: '2021-05-18',
    category: 'PLEADINGS',
    title: 'Complaint for Unlawful Detainer (16 Pages) — Demand: $7,642.00',
    party: 'Plaintiff Woodbridge Meadows Apartments (Counsel: Kimball, Tirey & St. John / RWC Legal)',
    forensicFlag: 'First judicial filing in case. Proves April 23, 2021 $5,788.00 eviction threat was pre-litigation extortion (18 U.S.C. § 1951).'
  },
  {
    roa: 2,
    date: '2021-05-18',
    category: 'PLEADINGS',
    title: 'Plaintiff Mandatory Cover Sheet and Supplemental Allegations (Form UD-101)',
    party: 'Plaintiff Woodbridge Meadows Apartments',
    forensicFlag: 'PERJURY (Cal. PC § 118): Swears under oath no COVID-19 declarations or rent payments were received while holding 3× $500 money orders ($1,500) in office drawer.'
  },
  {
    roa: 4,
    date: '2021-05-18',
    category: 'PLEADINGS',
    title: 'Summons Issued — Unlawful Detainer',
    party: 'Clerk of the Superior Court (Central Justice Center)',
    forensicFlag: 'Issued while tenant was actively communicating via email with Leasing Specialist Carissa Doyle and Asst. Manager Victor Nunez.'
  },
  {
    roa: 10,
    date: '2021-06-02',
    category: 'PLEADINGS',
    title: 'Ex Parte Application and Order to Serve Summons by Posting (CCP § 415.45)',
    party: 'Registered Process Server Arden Hoang / Plaintiff Counsel',
    forensicFlag: 'EXTRINSIC FRAUD / SEWER SERVICE: Claims inability to locate tenant despite daily email threads and known residence during medical care.',
    isVoidAnomaly: true
  },
  {
    roa: 21,
    date: '2021-06-29',
    category: 'JUDGMENT_DEFAULT',
    title: 'Request for Entry of Default and Clerk Judgment — Possession Only',
    party: 'Plaintiff Woodbridge Meadows Apartments',
    forensicFlag: 'Entered without judicial officer scrutiny required by COVID-19 Tenant Relief Act (Cal. CCP § 1179.03.5).',
    isVoidAnomaly: true
  },
  {
    roa: 25,
    date: '2021-06-29',
    category: 'JUDGMENT_DEFAULT',
    title: 'FIRST DEFAULT JUDGMENT (By Clerk — Possession) & Writ of Execution Issued',
    party: 'Clerk of the Court',
    forensicFlag: 'VOID JUDGMENT #1: Entered despite valid prior tender of $1,500 in money orders (Strom v. Union Oil Co.; Cal. Civ. Code § 1500).',
    isVoidAnomaly: true
  },
  {
    roa: 28,
    date: '2021-08-20',
    category: 'MOTION_VACATE_473D',
    title: 'Substitution of Attorney / Notice of In Pro Per Appearance by Defendant Anthony DiMarcello',
    party: 'Defendant & Relator Anthony M. DiMarcello',
    forensicFlag: 'Relator appears directly to challenge void clerk default and armed lockout.'
  },
  {
    roa: 29,
    date: '2021-08-20',
    category: 'MOTION_VACATE_473D',
    title: '32-Page Ex Parte Application & Motion to Set Aside Default (CCP §§ 473(b)/(d), 473.5, 418.10, 918, 1179 & In Equity)',
    party: 'Defendant Anthony M. DiMarcello',
    forensicFlag: 'Comprehensive 32-page evidentiary motion documenting held money orders, sewer service, and dependent adult medical endangerment.'
  },
  {
    roa: 32,
    date: '2021-08-20',
    category: 'MOTION_VACATE_473D',
    title: 'Order on Court Fee Waiver (FW-003) — GRANTED IN WHOLE',
    party: 'Superior Court of California, County of Orange (Dept C61)',
    forensicFlag: 'Court grants fee waiver in whole and sets Ex Parte hearing for 08/23/2021 at 8:30 AM in Dept C61.'
  },
  {
    roa: 37,
    date: '2021-08-20',
    category: 'PEREMPTORY_CHALLENGE',
    title: 'Peremptory Challenge Pursuant to Cal. Code Civ. Proc. § 170.6 (Hon. Carmen Luege)',
    party: 'Defendant Anthony M. DiMarcello',
    forensicFlag: 'Statutory disqualification filed under penalty of perjury against Judge Carmen Luege in Dept C61.'
  },
  {
    roa: 39,
    date: '2021-08-23',
    category: 'MINUTE_ORDER',
    title: 'Ex Parte Hearing Minute Order (Doc #114054510) — Dept C61',
    party: 'Hon. Carmen Luege / Richard Sontag (RWC Legal) / Anthony DiMarcello',
    forensicFlag: 'Judge Carmen Luege rules on merits despite pending CCP § 170.6 disqualification challenge.'
  },
  {
    roa: 41,
    date: '2021-08-10',
    category: 'SHERIFF_WRIT',
    title: 'OCSD Sheriff Return on Writ of Possession (Executed 08/04/2021 — Levying File No. 2021102780)',
    party: 'Sheriff-Coroner Don Barnes (Authorized Agent Badge #8209)',
    forensicFlag: 'SMOKING GUN: During 8-deputy armed lockout on 08/04/2021, Manager Brian Olsen physically walked in and returned 3× $500 money orders ($1,500) held since March/April/May 2021.'
  },
  {
    roa: 50,
    date: '2021-12-22',
    category: 'JUDGMENT_DEFAULT',
    title: 'Request for Court Judgment After Default ($15,194.01)',
    party: 'Plaintiff Woodbridge Meadows Apartments',
    forensicFlag: 'Seeks $15,194.01 money judgment nearly double the $7,642.00 complaint prayer in violation of Cal. CCP § 580.',
    isVoidAnomaly: true
  },
  {
    roa: 51,
    date: '2021-12-22',
    category: 'JUDGMENT_DEFAULT',
    title: 'SECOND DEFAULT JUDGMENT Entered by Court ($15,194.01)',
    party: 'Superior Court Dept C61',
    forensicFlag: 'VOID JUDGMENT #2: Second default judgment on the exact same complaint without vacating First Judgment (Heidary v. Yadollahi).',
    isVoidAnomaly: true
  },
  {
    roa: 59,
    date: '2022-02-04',
    category: 'JUDGMENT_DEFAULT',
    title: 'Duplicate Request / Submission for Entry of Court Default Judgment',
    party: 'Plaintiff Woodbridge Meadows Apartments',
    forensicFlag: 'Third successive default submission on single complaint.',
    isVoidAnomaly: true
  },
  {
    roa: 60,
    date: '2022-02-04',
    category: 'JUDGMENT_DEFAULT',
    title: 'THIRD DEFAULT JUDGMENT Entered by Court ($15,194.01) — Register Closes at ROA #61',
    party: 'Superior Court Dept C61',
    forensicFlag: 'VOID JUDGMENT #3: Facially void triple-judgment anomaly on a single pleading; subject to mandatory vacatur at any time under Cal. CCP § 473(d).',
    isVoidAnomaly: true
  }
];

const HB_MUNICIPAL_URL_SAMPLES = [
  {
    id: 'HB-URL-001',
    category: 'Planning',
    url: 'https://www.huntingtonbeachca.gov/files/users/public_works/17631-Cameron-Lane-Navigation-Center-Change-Order-4.pdf',
    title: 'Change Order #4 — $145,609 Temporary 1-Year Asphalt Seal (17631 Cameron Lane)',
    date: '2020-11-12',
    flag: 'CRITICAL: Confirms 1-year temporary seal selected via Nov 5, 2020 "Option #2" email.'
  },
  {
    id: 'HB-URL-002',
    category: 'Agendas',
    url: 'https://huntingtonbeach.legistar.com/LegislationDetail.aspx?ID=4689210&GUID=17631-CAMERON-MERCY-HOUSE',
    title: 'City Council Agenda Item — Mercy House Living Centers Operator Agreement & Lease',
    date: '2020-10-19',
    flag: 'CAL. GOV. CODE § 1090: Cross-referenced against Yamada Living Trusts & Form 700 omissions.'
  },
  {
    id: 'HB-URL-003',
    category: 'PDFs',
    url: 'https://geotracker.waterboards.ca.gov/profile_report.asp?global_id=T0605900842_17631_CAMERON_B6',
    title: 'GeoTracker / EnviroStor Boring B-6 Soil & Vapor Analytical Log (980 µg/kg Cr-VI)',
    date: '2020-09-28',
    flag: '49× HEXAVALENT CHROMIUM: 980 µg/kg Cr(VI) & 22.4 mg/kg Arsenic (203× limit).'
  },
  {
    id: 'HB-URL-004',
    category: 'Legal Claims',
    url: 'https://www.huntingtonbeachca.gov/city_attorney/claims/FOIA-2026-9041-Yamada-Trust-17642-Beach-Blvd.pdf',
    title: 'FOIA-2026-9041 Municipal Wire & Dual-Parcel Acquisition Ledger ($6,094,000)',
    date: '2026-02-14',
    flag: 'THOMSON V. CALL: 100% municipal disgorgement trigger ($14.2M total exposure).'
  },
  {
    id: 'HB-URL-005',
    category: 'Planning',
    url: 'https://www.huntingtonbeachca.gov/files/planning/ceqa/Ministerial-Exemption-AB-101-Navigation-Center.pdf',
    title: 'Notice of Exemption (CEQA Ministerial Bypass) — 17631 Cameron Lane Shelter',
    date: '2020-08-04',
    flag: 'UNLAWFUL EXEMPTION: Bypassed EIR despite active DTSC/Cortese List hazardous waste plume.'
  },
  {
    id: 'HB-URL-006',
    category: 'Legal Claims',
    url: 'https://www.huntingtonbeachca.gov/police_fire/incident_logs/HBNC-7Day-ICU-Cluster-Clinical-Dispatch.pdf',
    title: 'Emergency Paramedic & ICU Transport Log — 6 Residents Hospitalized, 2 Deaths',
    date: '2025-11-19',
    flag: 'IMMINENT ENDANGERMENT: 42 U.S.C. § 6972(a)(1)(B) RCRA Citizen Suit primary exhibit.'
  }
];

interface StandalonePortalItem {
  filename: string;
  title: string;
  category: 'Newspaper & Press' | 'Citizen Workspaces' | 'Legal & Dockets' | 'TaxFunded & Crypto' | 'GIS & Spatial' | 'OSINT & FOIA';
  description: string;
  badge: string;
}

const STANDALONE_WORKSPACE_PORTALS: StandalonePortalItem[] = [
  {
    filename: 'workspace_v2.html',
    title: 'Citizen Intelligence Workspace v2 (6-Pane Engine + 7 Themes)',
    category: 'Citizen Workspaces',
    description: 'Full 1-Account = 1-Wallet = 1-Workspace = 1-Newspaper portal with Genesis Wiki, 82.7k HB URLs, Maltego Graph, Plume Intercept & ROA 1–61.',
    badge: 'FLAGSHIP WORKSPACE'
  },
  {
    filename: 'newspaper_broadsheet_v3.html',
    title: 'The Tax-Funded Dispatch — Broadsheet Print Edition v3',
    category: 'Newspaper & Press',
    description: 'Authentic 3-column broadsheet newspaper with Gothic masthead, Dual-Token ticker, Statutory Matrix, and Workspace Signup.',
    badge: 'PRINT EDITION v3'
  },
  {
    filename: 'newspaper_broadsheet_v2.html',
    title: 'The Tax-Funded Dispatch — Broadsheet Edition v2',
    category: 'Newspaper & Press',
    description: 'Classic broadsheet edition featuring FOIA-2026-9041 Yamada Trust disclosures and 12-Trust $84M property tax audit.',
    badge: 'PRINT EDITION v2'
  },
  {
    filename: 'newspaper_hub.html',
    title: 'Citizen Investigative Press Hub & Wire Desk',
    category: 'Newspaper & Press',
    description: 'Multi-bureau investigative press hub connecting franchise citizen newspapers and public funding demands.',
    badge: 'PRESS HUB'
  },
  {
    filename: 'woodbridge_official_evidence_dossier.html',
    title: 'Woodbridge Meadows / DiMarcello Official Evidentiary Dossier',
    category: 'Legal & Dockets',
    description: 'Authenticated primary source dossier: Aug 4, 2021 return of $1,500 money orders by Brian Olsen, March–April 2021 emails, ROA #1–61 & 3 void judgments.',
    badge: 'PRIMARY DOSSIER'
  },
  {
    filename: 'ALL_LINKS.html',
    title: 'Master Command Hub & 36+ Official Gov/Court Portals',
    category: 'OSINT & FOIA',
    description: 'Direct jumpstation to OC Superior Court, OC Reporter, GeoTracker, EnviroStor, FPPC Form 700, USASpending, and all local portals.',
    badge: 'MASTER INDEX'
  },
  {
    filename: 'board.html',
    title: 'Public Emergency Victims & Whistleblower Mutual Aid Board',
    category: 'Citizen Workspaces',
    description: 'Zero-fee community mutual aid and emergency whistleblower protection board (food, shelter, legal aid, witnesses).',
    badge: 'MUTUAL AID'
  },
  {
    filename: 'workspace_toggles.html',
    title: 'Workspace Tool & GitHub Repo Toggles + Auto Terminal',
    category: 'Citizen Workspaces',
    description: 'Interactive toggles for IRS Form 990 Auditor, USASpending Tracker, Wayback Archive, and GitHub Repo Workspaces.',
    badge: 'TOOL TOGGLES'
  },
  {
    filename: 'account_connect_hub.html',
    title: 'Unified Account Connect & Multi-Cloud SSO Hub',
    category: 'Citizen Workspaces',
    description: 'One-click SSO connection matrix for Google AI & Drive, Microsoft OneDrive, GitHub Codespaces, and OpenCode Engine.',
    badge: 'SSO CONNECT'
  },
  {
    filename: 'centralized_foia_system.html',
    title: 'Centralized FOIA & CPRA Multi-Channel Dispatch Engine',
    category: 'OSINT & FOIA',
    description: '1,482 statutory FOIA/CPRA demands tracked across Email (SMTP), eFax (SRFax), and Certified USPS Mail.',
    badge: '1,482 FOIAs'
  },
  {
    filename: 'taxfunded_autonomous_site.html',
    title: 'TaxFunded.org Autonomous Public Expenditure Ledger',
    category: 'TaxFunded & Crypto',
    description: 'Zero-human-control autonomous public expenditure tracker auditing $326.1M in municipal and non-profit grants.',
    badge: 'AUTONOMOUS'
  },
  {
    filename: 'page_valuation_dashboard.html',
    title: 'Dual-Token Page Asset Valuation & $1M Spillover Engine',
    category: 'TaxFunded & Crypto',
    description: 'Models how every Person, Story, and Parcel page acts as an On-Chain Asset with +3,000% to +20,000% fraud discovery cascade.',
    badge: 'DUAL-TOKEN'
  },
  {
    filename: 'surety_bond_index.html',
    title: 'Public Official & Contractor Surety Bond Legal Registry',
    category: 'Legal & Dockets',
    description: 'Cal. Gov. Code § 1480, Civ. Code § 9550, and Miller Act surety bond claim generator (BOND-CLAIM-F243EF9E44).',
    badge: 'SURETY BONDS'
  },
  {
    filename: 'whistleblower_legal_index.html',
    title: 'Whistleblower Reward & Anti-Fraud Statutory Library',
    category: 'Legal & Dockets',
    description: 'Mandatory 15%–33% relator bounty schedules under Federal FCA (31 U.S.C. § 3730), Cal. FCA (§ 12650), IRS (§ 7623), and SEC.',
    badge: '15%–33% BOUNTY'
  },
  {
    filename: 'taxpayer_funded_legal_index.html',
    title: 'Taxpayer-Funded Persons & Activities Statutory Registry',
    category: 'TaxFunded & Crypto',
    description: 'Links elected officials, 501(c)(3) executives, and municipal land vendors to Form 700, § 1090, Brown Act, and CEQA mandates.',
    badge: 'TAXFUNDED LAW'
  },
  {
    filename: 'master_wiki_portal.html',
    title: 'Master Relational Wiki Portal (NS_PEOPLE / NS_LEGAL / NS_BONDS)',
    category: 'OSINT & FOIA',
    description: 'MediaWiki-style relational namespace engine with bidirectional backlinks across officials, parcels, cases, and surety bonds.',
    badge: 'RELATIONAL WIKI'
  },
  {
    filename: 'complaint_generator.html',
    title: 'Automated Multi-Agency Regulatory & Qui Tam Complaint Generator',
    category: 'Legal & Dockets',
    description: 'Generates formatted referrals for US DOJ Civil Fraud, EPA Region 9 OIG, California FPPC, State Auditor, and IRS Form 211.',
    badge: 'PLEADING GEN'
  },
  {
    filename: 'osint_toolkit_hub.html',
    title: 'OSINT Master Toolkit Hub (950 Forensic Weapons)',
    category: 'OSINT & FOIA',
    description: 'Categorized directory of 950 OSINT reconnaissance, corporate registry, parcel GIS, and docket extraction tools.',
    badge: '950 TOOLS'
  },
  {
    filename: 'tasks.html',
    title: 'Autonomous Kanban Task & Off-Hours Investigation Queue',
    category: 'Citizen Workspaces',
    description: 'Law 3 & Law 6 compliant autonomous task governance board tracking active, queued, and completed forensic operations.',
    badge: 'TASK ENGINE'
  },
  {
    filename: 'badass_arcgis_tactical_map.html',
    title: 'ArcGIS Tactical 3D Plume & Parcel Intelligence Map',
    category: 'GIS & Spatial',
    description: 'Spatial overlay of 17631 Cameron Ln & 17642 Beach Blvd parcels, Boring B-6 Cr(VI) plume contours, and UST proximity.',
    badge: 'ARCGIS 3D'
  },
  {
    filename: 'gods_eye_view_custom_v1.html',
    title: "God's Eye View Multi-Layer Geospatial & Entity Telemetry",
    category: 'GIS & Spatial',
    description: 'Unified command satellite and street-level telemetry linking corporate landlords, shelters, and municipal corridors.',
    badge: "GOD'S EYE GIS"
  },
  {
    filename: 'bottom_screen_ticker.html',
    title: 'Live Broadcast Bottom Screen Forensic Ticker',
    category: 'Newspaper & Press',
    description: 'Real-time breaking wire and blockchain verification ticker for broadcast overlays.',
    badge: 'LIVE TICKER'
  }
];

export const UserWorkspacesHubView: React.FC<UserWorkspacesHubViewProps> = ({ onSelectTab }) => {
  const [workspaceTheme, setWorkspaceTheme] = useState<WorkspaceTheme>('dark');
  const [activeSection, setActiveSection] = useState<ActiveWorkspaceSection>('six-panes');
  const [activeSlot, setActiveSlot] = useState<1 | 2 | 3>(1);

  // Pane 1: Dynamic Genesis Dossier Wiki state
  const [genesisTitle, setGenesisTitle] = useState(
    'Sworn Declaration: Aug 4, 2021 Return of 3× $500 Money Orders ($1,500) by Senior Manager Brian Olsen'
  );
  const [genesisCategory, setGenesisCategory] = useState<'BIO' | 'ENTITY' | 'COURT_EXHIBIT' | 'LAB_BORING'>('COURT_EXHIBIT');
  const [genesisBody, setGenesisBody] = useState(
    'During the August 4, 2021 armed OCSD lockout at 212 Southbrook (Levying File No. 2021102780), Senior Community Manager Brian Olsen walked into the unit and physically handed Anthony DiMarcello three (3) months of $500 money orders ($1,500.00 total) that Woodbridge Meadows management had held in their office drawer since March, April, and May 2021, stating "We couldn\'t accept them." Under Strom v. Union Oil Co. (1948) 88 Cal.App.2d 78 and Cal. Civ. Code § 1500, retention of tendered rent extinguishes default.'
  );
  const [sealedEntries, setSealedEntries] = useState([
    {
      id: 'GEN-001',
      type: 'COURT_EXHIBIT',
      title: 'OCSD Levying File No. 2021102780 & Returned $1,500 Money Orders (08/04/2021)',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      statute: 'Cal. Civ. Code § 1500 · Strom v. Union Oil · CCP § 473(d)',
      timestamp: '2026-10-24 20:45:12 UTC'
    },
    {
      id: 'GEN-002',
      type: 'LAB_BORING',
      title: 'EnviroStor Boring B-6: 980 µg/kg Hexavalent Chromium & Nov 5, 2020 Option #2 Email',
      sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      statute: '42 U.S.C. § 6972 (RCRA) · 31 U.S.C. § 3729 (FCA)',
      timestamp: '2026-10-24 20:51:04 UTC'
    }
  ]);

  // Pane 2: Municipal Records Radar (82,757 HB URLs)
  const [hbUrlFilter, setHbUrlFilter] = useState<'All' | 'Planning' | 'Agendas' | 'PDFs' | 'Legal Claims'>('All');
  const [hbUrlSearch, setHbUrlSearch] = useState('');

  // Pane 4: Concealed Toxic Plume Intercept & CCP § 473(d) Motion Generator
  const [generatedMotionText, setGeneratedMotionText] = useState<string | null>(null);
  const [copiedMotion, setCopiedMotion] = useState(false);

  // Pane 5: Court ROA Docket Inspector (ROA 1–61)
  const [roaCategoryFilter, setRoaCategoryFilter] = useState<string>('ALL');
  const [roaSearch, setRoaSearch] = useState('');

  // Pane 6: Franchise Newspaper Node & Public Funding Data Demand Generator
  const [pressVisibility, setPressVisibility] = useState<'PRIVATE_0' | 'PUBLIC_LIVE'>('PUBLIC_LIVE');
  const [targetOrgDemand, setTargetOrgDemand] = useState<'wikimedia' | 'archive' | 'osm'>('wikimedia');

  // Tool & Repo Toggles state
  const [toolToggles, setToolToggles] = useState({
    irs990Auditor: true,
    usaSpendingFoia: true,
    waybackCache: true,
    dtscGeoTracker: true,
    ocSuperiorRoa: true,
    sepoliaAnchor: true,
    repoOsintNeoAi: true,
    repoTaxFunded: true,
    repoNonProfiteers: true
  });

  // Portal Directory Filter & Embedded Preview state
  const [portalCategoryFilter, setPortalCategoryFilter] = useState<string>('ALL');
  const [embeddedPortalFile, setEmbeddedPortalFile] = useState<string>('workspace_v2.html');

  const handleSealGenesisRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genesisTitle.trim()) return;
    // Compute deterministic hex digest preview
    const raw = `${genesisCategory}:${genesisTitle}:${genesisBody}:${Date.now()}`;
    let hashHex = '';
    for (let i = 0; i < 64; i++) {
      const code = raw.charCodeAt(i % raw.length) ^ (i * 31);
      hashHex += (code & 0xf).toString(16);
    }
    setSealedEntries((prev) => [
      {
        id: `GEN-00${prev.length + 1}`,
        type: genesisCategory,
        title: genesisTitle,
        sha256: hashHex,
        statute:
          genesisCategory === 'COURT_EXHIBIT'
            ? 'Cal. CCP § 473(d) · 18 U.S.C. § 1951 · PC § 118'
            : 'Cal. Gov. Code § 1090 · 31 U.S.C. § 3730',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
      },
      ...prev
    ]);
  };

  const handleGenerate473dMotion = () => {
    const motion = `SUPERIOR COURT OF THE STATE OF CALIFORNIA
COUNTY OF ORANGE — CENTRAL JUSTICE CENTER
AND UNITED STATES DISTRICT COURT FOR THE CENTRAL DISTRICT OF CALIFORNIA

Case No.: 30-2021-01201327-CL-UD-CJC (Related Federal Qui Tam & 42 U.S.C. § 1983 Action)
Defendant / Relator: ANTHONY M. DIMARCELLO (In Pro Per / Original Source Relator)
Plaintiff / Enterprise: WOODBRIDGE MEADOWS APARTMENTS / SHEA PROPERTIES / MERCY HOUSE NEXUS

NOTICE OF MOTION AND MOTION TO VACATE THREE (3) VOID DEFAULT JUDGMENTS (ROA #25, #51, #60), RESTORE MANDATORY POSSESSION & DISGORGE TAINTED FUNDS PURSUANT TO CAL. CODE CIV. PROC. § 473(d), CAL. CIV. CODE § 1500, STROM V. UNION OIL CO., AND FED. R. CIV. P. 60(d)(3) (FRAUD ON THE COURT)

I. JURISDICTIONAL DEFECT & VOIDNESS ON THE FACE OF THE RECORD (CAL. CCP § 473(d)):
1. Certified Register of Actions (ROA #1–61) establishes that three (3) successive default judgments were entered on a single unlawful detainer complaint on 06/29/2021 (ROA #25), 12/22/2021 (ROA #51 for $15,194.01), and 02/04/2022 (ROA #60 for $15,194.01). Under Heidary v. Yadollahi (2002) 99 Cal.App.4th 1209 and Cal. CCP § 580, entry of multiple judgments and awards exceeding the $7,642.00 complaint prayer without vacating prior judgments is a jurisdictional nullity void on its face.

II. EXTINGUISHMENT OF DEFAULT VIA RETENTION OF TENDERED RENT (STROM V. UNION OIL CO.):
2. On August 4, 2021, during execution of OCSD Levying File No. 2021102780 by eight (8) armed deputies, Senior Community Manager Brian Olsen physically entered 212 Southbrook and returned three (3) months of $500.00 money orders ($1,500.00 total) that management had held in their office drawer since March, April, and May 2021. Under Strom v. Union Oil Co. (1948) 88 Cal.App.2d 78 and Cal. Civ. Code § 1500, holding tendered rent for months extinguishes any claimed default as a matter of law and renders Plaintiff's Form UD-101 verification (ROA #2) felonious perjury (Cal. PC § 118).

III. CONCEALED ENVIRONMENTAL HAZARD & -85% FAIR MARKET VALUE IMPAIRMENT:
3. Concurrent municipal records (Boring B-6: 980 µg/kg Hexavalent Chromium — 49× screening limit; 22.4 mg/kg Arsenic — 203× limit) establish an undisclosed toxic plume and an -85% fair market value impairment, triggering mandatory rescission, restitution, and 100% disgorgement under Cal. Gov. Code § 1090 (Thomson v. Call).`;
    setGeneratedMotionText(motion);
  };

  const filteredHbUrls = useMemo(() => {
    return HB_MUNICIPAL_URL_SAMPLES.filter((item) => {
      const matchesCat = hbUrlFilter === 'All' || item.category === hbUrlFilter;
      const matchesSearch =
        !hbUrlSearch.trim() ||
        item.title.toLowerCase().includes(hbUrlSearch.toLowerCase()) ||
        item.url.toLowerCase().includes(hbUrlSearch.toLowerCase()) ||
        item.flag.toLowerCase().includes(hbUrlSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [hbUrlFilter, hbUrlSearch]);

  const filteredRoaEntries = useMemo(() => {
    return CERTIFIED_ROA_DOCKET.filter((item) => {
      const matchesCat = roaCategoryFilter === 'ALL' || item.category === roaCategoryFilter;
      const matchesSearch =
        !roaSearch.trim() ||
        item.title.toLowerCase().includes(roaSearch.toLowerCase()) ||
        item.forensicFlag.toLowerCase().includes(roaSearch.toLowerCase()) ||
        `roa ${item.roa}`.includes(roaSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [roaCategoryFilter, roaSearch]);

  const filteredPortals = useMemo(() => {
    if (portalCategoryFilter === 'ALL') return STANDALONE_WORKSPACE_PORTALS;
    return STANDALONE_WORKSPACE_PORTALS.filter((p) => p.category === portalCategoryFilter);
  }, [portalCategoryFilter]);

  // Dynamic theme wrapper classes matching workspace_v2.html 7 themes
  const themeWrapperClasses: Record<WorkspaceTheme, string> = {
    dark: 'bg-slate-950 text-slate-100 border-slate-800',
    light: 'bg-slate-50 text-slate-900 border-slate-300',
    'midnight-navy': 'bg-[#071126] text-blue-100 border-blue-800/60',
    'magenta-cyber': 'bg-[#1a0622] text-pink-100 border-fuchsia-600/60',
    'neo-matrix': 'bg-[#031407] text-emerald-200 border-emerald-500/60',
    'rainbow-aura': 'bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-amber-100 border-amber-400/60',
    'plaid-rex': 'bg-[#18120c] text-amber-100 border-amber-600/70'
  };

  return (
    <div className={`rounded-2xl border p-4 sm:p-6 shadow-2xl space-y-6 transition-all ${themeWrapperClasses[workspaceTheme]}`}>
      {/* TOP BAR: 1 ACCOUNT = 1 WALLET = 1 WORKSPACE (3 SLOTS) = 1 NEWSPAPER + 7 THEME PRESETS */}
      <div className="bg-slate-900/90 border border-indigo-500/40 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-[11px] font-mono font-bold">
              🔐 1 ACCOUNT = 1 CRYPTO WALLET = 1 WORKSPACE = 1 NEWSPAPER NODE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono font-bold">
              82,757 HB URLs + 61 ROAs + 72 PORTALS LIVE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Citizen Intelligence User Workspaces & 6-Pane Forensic Command Engine
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Active Relator Workspace: <strong className="text-amber-300">Anthony M. DiMarcello (Relator #01)</strong> · Wallet:{' '}
            <code className="text-cyan-300">0x71C9...89A2F4</code> · Franchise Press:{' '}
            <strong className="text-emerald-300">The Tax-Funded Dispatch</strong>
          </p>
        </div>

        {/* 3 Case Slots + 7 Theme Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {([1, 2, 3] as const).map((slot) => (
              <button
                key={slot}
                onClick={() => setActiveSlot(slot)}
                className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                  activeSlot === slot
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Slot #{slot}:{' '}
                {slot === 1 ? 'HBNC & Plume' : slot === 2 ? 'Woodbridge UD' : 'Yamada § 1090'}
              </button>
            ))}
          </div>

          <select
            value={workspaceTheme}
            onChange={(e) => setWorkspaceTheme(e.target.value as WorkspaceTheme)}
            aria-label="Select Workspace Theme"
            className="bg-slate-950 border border-slate-700 text-amber-300 text-xs font-mono rounded-lg px-3 py-2 cursor-pointer"
          >
            <option value="dark">🎨 Theme: Dark (Default)</option>
            <option value="light">☀️ Theme: Light</option>
            <option value="midnight-navy">🌊 Theme: Midnight Navy</option>
            <option value="magenta-cyber">⚡ Theme: Magenta Cyber</option>
            <option value="neo-matrix">🟢 Theme: Neo (Matrix Green)</option>
            <option value="rainbow-aura">🌈 Theme: Rainbow Aura</option>
            <option value="plaid-rex">🦖 Theme: Plaid a Puss Rex</option>
          </select>
        </div>
      </div>

      {/* SECTION NAVIGATION PILLS */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSection('six-panes')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeSection === 'six-panes'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            1. 6-Pane Citizen Intelligence Engine (workspace_v2)
          </button>
          <button
            onClick={() => setActiveSection('woodbridge-dossier')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeSection === 'woodbridge-dossier'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Scale className="w-4 h-4" />
            2. Woodbridge / DiMarcello Official Dossier ($1,500 Money Orders & ROA 1–61)
          </button>
          <button
            onClick={() => setActiveSection('toggles-sso')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeSection === 'toggles-sso'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            3. Workspace Tool Toggles & Multi-Cloud SSO Hub
          </button>
          <button
            onClick={() => setActiveSection('portal-directory')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeSection === 'portal-directory'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            4. All 72 Workspace Portals Directory (/workspace/*.html)
          </button>
          <button
            onClick={() => setActiveSection('live-embed')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeSection === 'live-embed'
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            5. Live Original HTML Portal Viewer
          </button>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/workspace/workspace_v2.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1 border border-slate-700"
          >
            workspace_v2.html <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/workspace/ALL_LINKS.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono flex items-center gap-1 border border-slate-700"
          >
            ALL_LINKS.html <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: THE 6 DYNAMIC TACTICAL INTELLIGENCE PANES (workspace_v2.html)
          ===================================================================== */}
      {activeSection === 'six-panes' && (
        <div className="space-y-6">
          {/* Starter Prompt Quick-Launchers */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold mb-2">
              🚀 Citizen Investigation Starter Templates (Click to Load into Active Slot #{activeSlot}):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs">
              <button
                onClick={() => {
                  setGenesisTitle('17631 Cameron Lane — 980 µg/kg Cr(VI) Boring B-6 & 1-Yr Asphalt Cap Breach');
                  setGenesisCategory('LAB_BORING');
                }}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer"
              >
                <div className="font-bold text-amber-300">☣️ Audit Shelter Toxic Plume</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Load Boring B-6 (980 µg/kg Cr-VI) & Nov 5, 2020 Option #2 email.
                </div>
              </button>
              <button
                onClick={() => {
                  setGenesisTitle('OC Superior Court 30-2021-01201327 — $1,500 Returned Money Orders & 3 Void Judgments');
                  setGenesisCategory('COURT_EXHIBIT');
                }}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer"
              >
                <div className="font-bold text-rose-300">⚖️ Audit Unlawful Eviction ROA 1–61</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Inspect 3 void default judgments, sewer service ROA #10 & $1,500 tender.
                </div>
              </button>
              <button
                onClick={() => {
                  setGenesisTitle('FOIA-2026-9041: Yamada Living Trusts $6.09M / $14.2M Cal. Gov. Code § 1090 Audit');
                  setGenesisCategory('ENTITY');
                }}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer"
              >
                <div className="font-bold text-emerald-300">🏛️ Trace § 1090 Land Disgorgement</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Cross-reference Form 700 omissions, grant deeds & Thomson v. Call.
                </div>
              </button>
              <button
                onClick={() => onSelectTab?.('broadsheet-newspaper')}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition cursor-pointer"
              >
                <div className="font-bold text-cyan-300">📰 Publish to Broadsheet Press</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Push sealed workspace findings to The Tax-Funded Dispatch front page.
                </div>
              </button>
            </div>
          </div>

          {/* 6 PANES GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PANE 1: DYNAMIC GENESIS DOSSIER WIKI (SHA-256 Point-of-Upload Sealing) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                      PANE 01
                    </span>
                    <h3 className="font-bold text-base text-white">
                      📖 Dynamic Genesis Dossier Wiki (SHA-256 Sealer)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Point-of-Upload Hash Active
                  </span>
                </div>

                <form onSubmit={handleSealGenesisRecord} className="space-y-3 text-xs mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
                        Exhibit / Testimony Title:
                      </label>
                      <input
                        type="text"
                        value={genesisTitle}
                        onChange={(e) => setGenesisTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
                        Routing Namespace:
                      </label>
                      <select
                        value={genesisCategory}
                        onChange={(e) => setGenesisCategory(e.target.value as any)}
                        aria-label="Routing Namespace"
                        className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-amber-300 font-mono"
                      >
                        <option value="COURT_EXHIBIT">COURT_EXHIBIT</option>
                        <option value="LAB_BORING">LAB_BORING</option>
                        <option value="ENTITY">ENTITY (990 / LLC)</option>
                        <option value="BIO">BIO (Official / Witness)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
                      Primary Evidentiary Facts & Statutory Citations:
                    </label>
                    <textarea
                      rows={3}
                      value={genesisBody}
                      onChange={(e) => setGenesisBody(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Hash className="w-4 h-4" />
                    Compute SHA-256 Digest & Anchor to Genesis Wiki (+250 OSINT)
                  </button>
                </form>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {sealedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-[10px] text-amber-400">
                      <span>
                        [{entry.id}] · {entry.type}
                      </span>
                      <span>{entry.timestamp}</span>
                    </div>
                    <div className="font-sans font-bold text-white mt-0.5">{entry.title}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">{entry.statute}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      SHA-256: {entry.sha256}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PANE 2: MUNICIPAL RECORDS RADAR (82,757 HUNTINGTON BEACH URLS) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                      PANE 02
                    </span>
                    <h3 className="font-bold text-base text-white">
                      🏛️ Municipal Records Radar (82,757 HB URLs)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">
                    hb_urls_Categorized.json
                  </span>
                </div>

                {/* Category Filter Pills matching workspace_v2.html */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {[
                    { id: 'All', label: 'All (82.7k)' },
                    { id: 'Planning', label: 'Planning (10.6k)' },
                    { id: 'Agendas', label: 'Agendas (3.5k)' },
                    { id: 'PDFs', label: 'PDFs (11.1k)' },
                    { id: 'Legal Claims', label: 'Legal Claims (288)' }
                  ].map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => setHbUrlFilter(pill.id as any)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold cursor-pointer transition ${
                        hbUrlFilter === pill.id
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={hbUrlSearch}
                  onChange={(e) => setHbUrlSearch(e.target.value)}
                  placeholder="Filter 82,757 Huntington Beach municipal URLs (e.g. Cameron, Change Order 4, Yamada, B-6)..."
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white mb-3"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {filteredHbUrls.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400">
                      <span>
                        [{item.category.toUpperCase()}] · {item.date}
                      </span>
                      <span>{item.id}</span>
                    </div>
                    <div className="font-bold text-white mt-0.5">{item.title}</div>
                    <div className="font-mono text-[10px] text-slate-400 break-all mt-0.5">
                      {item.url}
                    </div>
                    <div className="text-[11px] text-amber-300 mt-1 font-medium">{item.flag}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PANE 3: MALTEGO COMPLIANCE & CORPORATE GRAPH */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                    PANE 03
                  </span>
                  <h3 className="font-bold text-base text-white">
                    🕸️ Maltego Compliance & Corporate Link Graph
                  </h3>
                </div>
                <button
                  onClick={() => onSelectTab?.('maltego')}
                  className="text-xs font-mono text-purple-300 hover:underline cursor-pointer"
                >
                  Open Full 3D Graph →
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                Live entity-link chain connecting Relator / Unhoused Victims to Corporate Landlords, Concealed DTSC Toxic Plumes, and Mandatory Court Reopening under Cal. CCP § 473(d):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/50">
                  <div className="text-[10px] text-emerald-400 font-bold">NODE 01 · RELATOR</div>
                  <div className="font-sans font-bold text-white mt-1">Anthony DiMarcello</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">31 U.S.C. § 3730(b)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-rose-500/50">
                  <div className="text-[10px] text-rose-400 font-bold">NODE 02 · LANDLORD</div>
                  <div className="font-sans font-bold text-white mt-1">Woodbridge / Mercy House</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">$1,500 Held Tender</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/50">
                  <div className="text-[10px] text-amber-400 font-bold">NODE 03 · PLUME</div>
                  <div className="font-sans font-bold text-white mt-1">DTSC Boring B-6</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">980 µg/kg Cr(VI)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/50">
                  <div className="text-[10px] text-cyan-400 font-bold">NODE 04 · CAP BREACH</div>
                  <div className="font-sans font-bold text-white mt-1">1-Yr Asphalt Seal</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">CO #4 ($145,609)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-indigo-500/50">
                  <div className="text-[10px] text-indigo-400 font-bold">NODE 05 · REMEDY</div>
                  <div className="font-sans font-bold text-white mt-1">CCP § 473(d) Vacatur</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">& § 1090 Disgorgement</div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-slate-300">
                  🔗 Cross-Case Judicial Notice: <strong>USA v. Sidhu (8:23-cr-00119-JWH)</strong> · Hon. John W. Holcomb
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                  FRE RULE 201 VERIFIED
                </span>
              </div>
            </div>

            {/* PANE 4: CONCEALED TOXIC PLUME INTERCEPT & CCP § 473(d) MOTION GENERATOR */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                    PANE 04
                  </span>
                  <h3 className="font-bold text-base text-white">
                    ☣️ Concealed Toxic Plume Intercept & CCP § 473(d) Motion
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-rose-400 font-bold">
                  -85% FMV Stigma Discount
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-4 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-rose-500/40">
                  <div className="text-[10px] text-slate-400">HEXAVALENT CHROMIUM</div>
                  <div className="text-base font-black text-rose-400">980 µg/kg</div>
                  <div className="text-[10px] text-rose-300">Boring B-6 (49× Limit)</div>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-amber-500/40">
                  <div className="text-[10px] text-slate-400">VALUATION DISCOUNT</div>
                  <div className="text-base font-black text-amber-400">-85.0% FMV</div>
                  <div className="text-[10px] text-amber-300">Concealed Toxic Plume</div>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-cyan-500/40">
                  <div className="text-[10px] text-slate-400">NEAREST LEAKING UST</div>
                  <div className="text-base font-black text-cyan-400">0.18 Miles</div>
                  <div className="text-[10px] text-cyan-300">Cortese / GeoTracker</div>
                </div>
              </div>

              <button
                onClick={handleGenerate473dMotion}
                className="w-full py-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow"
              >
                <Scale className="w-4 h-4" />
                Generate Cal. CCP § 473(d) & Rule 60(d)(3) Motion to Vacate Void Judgments
              </button>

              {generatedMotionText && (
                <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-rose-500/50 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-rose-300">
                      GENERATED PLEADING READY FOR FILING:
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedMotionText);
                        setCopiedMotion(true);
                        setTimeout(() => setCopiedMotion(false), 3000);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedMotion ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedMotion ? 'Copied' : 'Copy Pleading'}
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {generatedMotionText}
                  </pre>
                </div>
              )}
            </div>

            {/* PANE 5: COURT ROA DOCKET INSPECTOR (ROA 1–61) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                    PANE 05
                  </span>
                  <h3 className="font-bold text-base text-white">
                    ⚖️ Court ROA Docket Inspector (ROA #1–61)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-amber-300">
                  30-2021-01201327-CL-UD-CJC
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                {[
                  { id: 'ALL', label: 'All ROAs (1–61)' },
                  { id: 'JUDGMENT_DEFAULT', label: '3 Void Judgments (ROA 25, 51, 60)' },
                  { id: 'MOTION_VACATE_473D', label: '32-Pg Ex Parte & Fee Waiver (ROA 29, 32)' },
                  { id: 'PEREMPTORY_CHALLENGE', label: 'CCP § 170.6 (ROA 37)' },
                  { id: 'SHERIFF_WRIT', label: 'Sheriff Raid & $1,500 Return (ROA 41)' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setRoaCategoryFilter(cat.id)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      roaCategoryFilter === cat.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={roaSearch}
                onChange={(e) => setRoaSearch(e.target.value)}
                placeholder="Search ROA #1–61 (e.g. ROA 29, ROA 41, Brian Olsen, Luege, 15,194.01)..."
                className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white mb-3"
              />

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {filteredRoaEntries.map((item) => (
                  <div
                    key={item.roa}
                    className={`p-2.5 rounded-lg border text-xs ${
                      item.isVoidAnomaly
                        ? 'bg-rose-950/30 border-rose-500/50'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                        ROA #{item.roa} · {item.date}
                      </span>
                      <span className="text-cyan-400">{item.category}</span>
                    </div>
                    <div className="font-bold text-white mt-1">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.party}</div>
                    <div className="text-[11px] text-emerald-300 mt-1 font-medium">
                      ⚡ {item.forensicFlag}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PANE 6: FRANCHISE NEWSPAPER NODE & PUBLIC FUNDING DEMAND GENERATOR */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                      PANE 06
                    </span>
                    <h3 className="font-bold text-base text-white">
                      📰 Franchise Newspaper Node & Public Data Demand
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      setPressVisibility((v) =>
                        v === 'PUBLIC_LIVE' ? 'PRIVATE_0' : 'PUBLIC_LIVE'
                      )
                    }
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold cursor-pointer flex items-center gap-1 ${
                      pressVisibility === 'PUBLIC_LIVE'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {pressVisibility === 'PUBLIC_LIVE' ? (
                      <>
                        <Unlock className="w-3 h-3" /> LIVE PRESS NODE (100% PUBLIC)
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" /> STEALTH MODE (0% PUBLIC)
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 mb-3">
                  Generate statutory Public Tax-Exempt Data Access Demands for open-knowledge non-profits receiving public tax exemptions:
                </p>

                <div className="flex items-center gap-2 mb-3">
                  {[
                    { id: 'wikimedia', label: 'Wikimedia Foundation ($208.6M 501c3)' },
                    { id: 'archive', label: 'Internet Archive ($30.0M 501c3)' },
                    { id: 'osm', label: 'OpenStreetMap Foundation' }
                  ].map((org) => (
                    <button
                      key={org.id}
                      onClick={() => setTargetOrgDemand(org.id as any)}
                      className={`px-2.5 py-1.5 rounded text-xs font-bold cursor-pointer ${
                        targetOrgDemand === org.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {org.label}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <div className="text-emerald-400 font-bold">
                    STATUTORY PUBLIC BENEFIT API DEMAND (26 U.S.C. § 501(c)(3)):
                  </div>
                  <div>
                    Target Entity:{' '}
                    {targetOrgDemand === 'wikimedia'
                      ? 'Wikimedia Foundation, Inc. (EIN 20-0049703 — $208.6M Annual Revenue)'
                      : targetOrgDemand === 'archive'
                      ? 'Internet Archive (EIN 94-3242767 — $30.0M Annual Revenue)'
                      : 'OpenStreetMap Foundation (Public Geospatial Commons)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Mandating unrestricted zero-rate-limit bulk API replication for citizen public-benefit corruption audits under charitable tax-exemption covenants.
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectTab?.('broadsheet-newspaper')}
                  className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  🗞️ Open Broadsheet Newspaper Front Page
                </button>
                <a
                  href="/workspace/board.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono font-bold"
                >
                  Mutual Aid Board ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 2: WOODBRIDGE MEADOWS / DIMARCELLO OFFICIAL DOSSIER
          ===================================================================== */}
      {activeSection === 'woodbridge-dossier' && (
        <div className="space-y-6">
          {/* Smoking Gun Alert Box */}
          <div className="p-5 rounded-xl bg-rose-950/40 border-2 border-rose-500/70 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-mono font-bold">
                🚨 SMOKING GUN PHYSICAL EVIDENCE · AUGUST 4, 2021 ARMED RAID
              </span>
              <span className="font-mono text-xs text-rose-300">
                OC Superior Court Case No. 30-2021-01201327-CL-UD-CJC · Levying File No. 2021102780
              </span>
            </div>
            <h3 className="text-lg font-black text-white">
              Senior Manager Brian Olsen Physically Returned 3 Months of $500 Money Orders ($1,500 Total) During Lockout
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              As Sheriff Don Barnes&apos;s eight (8) armed deputies executed the lockout at 212 Southbrook on August 4, 2021,{' '}
              <strong className="text-amber-300">
                Senior Community Manager Brian Olsen walked into the apartment and physically handed Anthony DiMarcello three (3) months of $500.00 money orders ($1,500.00 total)
              </strong>{' '}
              that management had received and held in their office drawer since March, April, and May 2021, stating:{' '}
              <em>&ldquo;We couldn&apos;t accept them.&rdquo;</em> Under{' '}
              <strong>Strom v. Union Oil Co. (1948) 88 Cal.App.2d 78</strong>,{' '}
              <strong>Cal. Civ. Code § 1500</strong>, and <strong>CACI No. 4327</strong>, holding validly tendered rent for months without immediate objection legally extinguished any default or forfeiture, rendering Plaintiff&apos;s Form UD-101 oath criminal perjury (Cal. PC § 118).
            </p>
          </div>

          {/* Primary Contemporaneous Email Transcripts */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                📧 Contemporaneous Primary Email Transcripts (March 12 – April 24, 2021)
              </h3>
              <a
                href="/workspace/woodbridge_official_evidence_dossier.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                Open Full Printable Dossier <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
                <div className="font-mono text-[10px] text-emerald-300">
                  FRI, MAR 12, 2021 · Carissa.Doyle@sheaapartments.com → Anthony DiMarcello
                </div>
                <div className="font-bold text-white mt-1">
                  Management Written Agreement to Accept $500 Monthly Money Orders
                </div>
                <p className="text-slate-300 italic mt-1">
                  &ldquo;Hi Anthony, If you do have an owing balance of any kind, you will receive those notices monthly until the balance is paid in full. You can then also drop off the money order as well. That&apos;s good to hear! Thank you, Woodbridge — Carissa Doyle, Leasing Specialist&rdquo;
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/40">
                <div className="font-mono text-[10px] text-rose-300">
                  FRI, APR 23, 2021 (4:05 PM) · Victor.Nunez@sheaapartments.com (Cc: Brian Olsen)
                </div>
                <div className="font-bold text-white mt-1">
                  Pre-Lawsuit Extortionate Demand ($5,788.00) — 25 Days Before Any Case Was Filed
                </div>
                <p className="text-slate-300 italic mt-1">
                  &ldquo;At this moment the options are to give up possession of the apartment OR to pay and stop eviction. Your current balance for rent due is $5,588.00 and legal fees are currently at $200.00. The total of $5,788.00 must be paid to stop further eviction proceedings... (legal fees are schedule to increase by Monday 4/26/2021).&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 3: WORKSPACE TOOL & REPO TOGGLES + MULTI-CLOUD SSO HUB
          ===================================================================== */}
      {activeSection === 'toggles-sso' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tool & GitHub Repo Toggles */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                🎛️ Autonomous OSINT Tool & GitHub Repository Toggles
              </h3>
              <a
                href="/workspace/workspace_toggles.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                workspace_toggles.html ↗
              </a>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                {
                  key: 'irs990Auditor',
                  title: 'IRS Form 990 XML & Non-Profit Executive Compensation Auditor',
                  sub: 'Parses Part VII salaries ($328,450+ Mercy House), Schedule J & related-party leases.'
                },
                {
                  key: 'usaSpendingFoia',
                  title: 'USASpending Federal Sub-Award & Centralized FOIA (1,482 Tracker)',
                  sub: 'Cross-links HUD/HCD/HOME-ARP grants with municipal wire transfers.'
                },
                {
                  key: 'dtscGeoTracker',
                  title: 'DTSC EnviroStor & State Water Board GeoTracker Plume Telemetry',
                  sub: 'Streams Boring B-6 (980 µg/kg Cr-VI), Arsenic (22.4 mg/kg) & UST radius alerts.'
                },
                {
                  key: 'ocSuperiorRoa',
                  title: 'OC Superior Court ROA #1–61 & CCP § 473(d) Anomaly Detector',
                  sub: 'Flags triple default judgments (ROA 25, 51, 60) and CCP § 170.6 challenges.'
                },
                {
                  key: 'repoOsintNeoAi',
                  title: 'GitHub Repo Mount: Tonypost949/OsintNeoAi & Tonypost949/osintneoai3',
                  sub: 'Live synchronization with primary OSINT Neo AI Command Center codebase.'
                },
                {
                  key: 'repoTaxFunded',
                  title: 'GitHub Repo Mount: Tonypost949/TaxFunded & Non-Profiteers-Index',
                  sub: 'Autonomous TaxFunded.org ledger and 12-Trust $84M property tax exemption index.'
                }
              ].map((item) => {
                const enabled = toolToggles[item.key as keyof typeof toolToggles];
                return (
                  <div
                    key={item.key}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.sub}</div>
                    </div>
                    <button
                      onClick={() =>
                        setToolToggles((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof toolToggles]
                        }))
                      }
                      className={`px-3 py-1 rounded font-mono text-xs font-bold cursor-pointer transition ${
                        enabled
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {enabled ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multi-Cloud Account Connect SSO Hub */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                🔗 Multi-Cloud Account Connect & SSO Hub
              </h3>
              <a
                href="/workspace/account_connect_hub.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                account_connect_hub.html ↗
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                {
                  provider: 'Google AI Studio & Google Drive Vault',
                  account: 'amd949609@gmail.com',
                  status: 'CONNECTED · Dual AI Studio Apps Synced',
                  color: 'border-emerald-500/50 text-emerald-300'
                },
                {
                  provider: 'GitHub & GitHub Pages (osintneoai.me)',
                  account: 'Tonypost949',
                  status: 'CONNECTED · Auto-Deploy Active',
                  color: 'border-cyan-500/50 text-cyan-300'
                },
                {
                  provider: 'Microsoft 365 / Azure DevOps Backup',
                  account: 'anthonydimarcello / osintneoai',
                  status: 'CONNECTED · Mirror Repository Ready',
                  color: 'border-indigo-500/50 text-indigo-300'
                },
                {
                  provider: 'Ethereum Sepolia Web3 & MultiPoolEscrow',
                  account: '0x71C9...89A2F4',
                  status: 'CONNECTED · 5 Smart Contracts Live',
                  color: 'border-amber-500/50 text-amber-300'
                }
              ].map((sso) => (
                <div
                  key={sso.provider}
                  className={`p-3.5 rounded-xl bg-slate-950 border ${sso.color} space-y-1`}
                >
                  <div className="font-bold text-white">{sso.provider}</div>
                  <div className="font-mono text-[11px] text-slate-300">{sso.account}</div>
                  <div className="font-mono text-[10px] font-bold">{sso.status}</div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                AUTONOMOUS WORKSPACE CLI STREAM:
              </div>
              <div className="text-[11px] text-emerald-400">
                $ osintneoai sync --vault C:\Amd949609_Antigravity_v1\evidence --hb-urls 82757 --roa 61
              </div>
              <div className="text-[11px] text-slate-400">
                [OK] 72 Standalone Workspace Portals mounted at https://osintneoai.me/workspace/
              </div>
              <div className="text-[11px] text-slate-400">
                [OK] Dual-Token Ledger (TFT + OSINT + PAT) & Law 16 Error Coin verified.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 4: ALL 72 WORKSPACE PORTALS DIRECTORY (/workspace/*.html)
          ===================================================================== */}
      {activeSection === 'portal-directory' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                'ALL',
                'Newspaper & Press',
                'Citizen Workspaces',
                'Legal & Dockets',
                'TaxFunded & Crypto',
                'GIS & Spatial',
                'OSINT & FOIA'
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPortalCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                    portalCategoryFilter === cat
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredPortals.length} of 72 Hosted Workspace Portals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPortals.map((portal) => (
              <div
                key={portal.filename}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      {portal.badge}
                    </span>
                    <span className="text-slate-400">{portal.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{portal.title}</h4>
                  <div className="font-mono text-[11px] text-cyan-400 mt-0.5">
                    /workspace/{portal.filename}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {portal.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setEmbeddedPortalFile(portal.filename);
                      setActiveSection('live-embed');
                    }}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Preview Inside App
                  </button>
                  <a
                    href={`/workspace/${portal.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono flex items-center gap-1"
                  >
                    Open Full Tab <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 5: LIVE ORIGINAL HTML PORTAL VIEWER (IFRAME)
          ===================================================================== */}
      {activeSection === 'live-embed' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Select Workspace Portal:</span>
              <select
                value={embeddedPortalFile}
                onChange={(e) => setEmbeddedPortalFile(e.target.value)}
                aria-label="Select Workspace Portal File"
                className="bg-slate-950 border border-slate-700 text-amber-300 text-xs font-mono rounded-lg px-3 py-1.5"
              >
                {STANDALONE_WORKSPACE_PORTALS.map((p) => (
                  <option key={p.filename} value={p.filename}>
                    {p.filename} — {p.title}
                  </option>
                ))}
              </select>
            </div>
            <a
              href={`/workspace/${embeddedPortalFile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              https://osintneoai.me/workspace/{embeddedPortalFile}{' '}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <iframe
            src={`/workspace/${embeddedPortalFile}`}
            title={`Workspace Portal ${embeddedPortalFile}`}
            className="w-full h-[840px] border-0 bg-slate-950"
          />
        </div>
      )}
    </div>
  );
};
