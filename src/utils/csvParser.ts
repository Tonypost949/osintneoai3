import { OutreachRecord, OutreachTelemetry, OsintRepoRecord, OsintCategoryRecord } from '../types';

export const STATIC_OUTREACH_TELEMETRY: OutreachTelemetry = {
  totalRecords: 184,
  publicSectorFilings: 76,
  successfulDispatches: 105,
  bouncedBlocked: 79,
  agencyResponses: 11,
  sectorBreakdown: [
    { category: 'Public Sector', count: 74, share: '40.2%', focus: 'Federal, State & Municipal Oversight' },
    { category: 'Private Sector', count: 90, share: '48.9%', focus: 'Corporate, Media & Financial Entities' },
    { category: 'NGO & Non-Profit', count: 12, share: '6.5%', focus: 'Civil Rights, Legal Aid & Shelters' },
    { category: 'Academic / Legal Clinics', count: 6, share: '3.3%', focus: 'Law Schools, Universities & Clinics' },
    { category: 'Public / Private', count: 2, share: '1.1%', focus: 'Joint Programs & Verification Bodies' },
  ],
  statusBreakdown: [
    { status: 'Sent / Active Transmissions', count: 89, deliveryRate: '48.4%', vector: 'Outbound SMTP Transmitted' },
    { status: 'Bounced (Perimeter Rejections)', count: 37, deliveryRate: '20.1%', vector: '550 User Unknown / NXDOMAIN' },
    { status: 'Blocked by Mail Flow Rules', count: 8, deliveryRate: '4.3%', vector: 'EOP / GCC Custom Rule Drop' },
    { status: 'Formal Intake & Agency Responses', count: 8, deliveryRate: '4.3%', vector: 'Casework & Confirmation Notice' },
    { status: 'Declined (Pilot / Resources)', count: 2, deliveryRate: '1.1%', vector: 'DOJ Pilot / Legal Defense Clinic' },
    { status: 'Documented Evidence & Dossiers', count: 12, deliveryRate: '6.5%', vector: 'Internal Investigative Ledger' },
    { status: 'Direct Filings & Case Outreach', count: 28, deliveryRate: '15.2%', vector: 'Under-Seal Filings & Prior Outreach' },
  ],
  yearlyBreakdown: [
    { year: '2021', count: 5, share: '2.7%', milestone: 'Pandemic Layoff, Housing Displacement & EDD Identity Blocks' },
    { year: '2022', count: 5, share: '2.7%', milestone: 'Feinstein Casework, Emergency Relief & Early Whistleblower Alerts' },
    { year: '2023', count: 3, share: '1.6%', milestone: 'CFTC Commodities Fraud Disclosure & Identity Theft Cases' },
    { year: '2024', count: 3, share: '1.6%', milestone: 'FEMA Emergency Relief Requests & Shelter Placement Advocacy' },
    { year: '2025', count: 11, share: '6.0%', milestone: 'DOJ Task Force Contact & Environmental Records FOIA Demands' },
    { year: '2026', count: 157, share: '85.3%', milestone: 'Federal Whistleblower Package, Qui Tam & Under-Seal Filings' },
  ],
};

export const STATIC_OUTREACH_DISPATCHES: OutreachRecord[] = [
  {
    id: 'disp-1',
    date: '2022-07-27',
    sector: 'Public Sector',
    targetEntity: "Sen. Dianne Feinstein's Office (Marshall Wu)",
    subject: 'Stolen Hero Pay (IHSS), EDD & Eviction',
    disposition: 'Casework Written Reply',
    docketId: 'Feinstein Casework',
    deliveryVector: 'Direct Staff Email',
    agencyResponse: 'Staff replied: IHSS & legal disputes are state/law enforcement matters outside federal jurisdiction',
    evidentiarySignificance: 'Confirmed human staff casework response establishing early notice',
  },
  {
    id: 'disp-2',
    date: '2023-01-01',
    sector: 'Public Sector',
    targetEntity: 'CFTC Whistleblower Office',
    subject: 'Original commodities fraud disclosure',
    disposition: 'Automated Intake Acknowledgment',
    docketId: 'CFTC Intake Receipt',
    deliveryVector: 'Electronic Portal',
    agencyResponse: 'Automated intake confirmation issued cataloging corporate fiduciary & securities disclosures',
    evidentiarySignificance: 'Active regulatory tracking record',
  },
  {
    id: 'disp-3',
    date: '2024-05-22',
    sector: 'Public Sector',
    targetEntity: 'Federal Emergency Management Agency (FEMA)',
    subject: 'Emergency relief & shelter conditions request',
    disposition: 'Agency Response Received',
    docketId: 'askia@fema.dhs.gov',
    deliveryVector: 'SMTP Email',
    agencyResponse: 'Official FEMA response received regarding emergency relief inquiry',
    evidentiarySignificance: 'Confirmed federal disaster agency contact regarding displaced disabled persons',
  },
  {
    id: 'disp-4',
    date: '2026-04-02',
    sector: 'Public Sector',
    targetEntity: 'DOJ Corporate Whistleblower Unit',
    subject: 'Federal Whistleblower Protection Request',
    disposition: 'Formal Written Declination',
    docketId: 'DOJ Pilot Program',
    deliveryVector: 'CorporateWhistleblower@usdoj.gov',
    agencyResponse: "Official agency decision: 'Submission not eligible for pilot program'",
    evidentiarySignificance: 'Exhaustion of administrative remedy',
  },
  {
    id: 'disp-5',
    date: '2026-04-15',
    sector: 'Academic / Legal',
    targetEntity: 'Loyola Law School (LLS) Admissions / Clinic',
    subject: 'Pro bono qui tam attorney requests',
    disposition: 'Intake Referral',
    docketId: 'LLS Intake',
    deliveryVector: 'Clinic Ingestion',
    agencyResponse: 'Institutional response: referred to legal clinic intake line for case screening',
    evidentiarySignificance: 'Institutional clinical routing of whistleblower packet',
  },
  {
    id: 'disp-6',
    date: '2026-04-15',
    sector: 'Academic / Legal',
    targetEntity: 'USC Gould School of Law Admissions',
    subject: 'Pro bono qui tam attorney requests',
    disposition: 'Bar Referral',
    docketId: 'USC Gould Review',
    deliveryVector: 'Admissions Desk',
    agencyResponse: 'Institutional response: declined clinical representation; referred to LA County Bar',
    evidentiarySignificance: 'Exhaustion of regional pro bono law clinics',
  },
  {
    id: 'disp-7',
    date: '2026-04-19',
    sector: 'NGO & Non-Profit',
    targetEntity: 'Native American Rights Fund (NARF)',
    subject: 'ICWA assistance & IIM trust advocacy',
    disposition: 'Resource Declination',
    docketId: 'NARF Case Intake',
    deliveryVector: 'Legal Direct',
    agencyResponse: 'Institutional response: formal declination due to limited litigation resources',
    evidentiarySignificance: 'Documented lack of institutional resources from regional advocacy organizations',
  },
  {
    id: 'disp-8',
    date: '2026-04-20',
    sector: 'Academic / Legal',
    targetEntity: 'Stanford Law Mills Legal Clinic',
    subject: 'Whistleblower evidence distribution & pro bono',
    disposition: 'Clinic Referral',
    docketId: 'Mills Clinic Intake',
    deliveryVector: 'Academic Direct',
    agencyResponse: 'Institutional response: formal clinical referral issued',
    evidentiarySignificance: 'Documented clinical referral for statutory whistleblower evaluation',
  },
  {
    id: 'disp-9',
    date: '2026-05-09',
    sector: 'Public Sector',
    targetEntity: 'GAO FraudNet',
    subject: '$598.7M municipal & grant fraud referral',
    disposition: 'Active Federal Docket',
    docketId: 'COMP-26-004512',
    deliveryVector: 'FraudNet Intake Engine',
    agencyResponse: 'Assigned active GAO FraudNet control number COMP-26-004512 for federal program audit',
    evidentiarySignificance: 'Active federal tracking docket with ongoing jurisdiction',
  },
  {
    id: 'disp-10',
    date: '2026-10-18',
    sector: 'Public Sector',
    targetEntity: 'FBI IC3 / Public Corruption Field Office',
    subject: 'Criminal Referral & False Claims Filing',
    disposition: 'Active Federal Docket',
    docketId: '20IC002',
    deliveryVector: 'FBI IC3 Portal',
    agencyResponse: 'Verified electronic complaint record logged following direct email perimeter drops',
    evidentiarySignificance: 'Active federal law enforcement tracking docket (Record ID: 20IC002)',
  },
];

export const STATIC_OSINT_REPOS: OsintRepoRecord[] = [
  { name: 'osint-agent', fileCount: '512', priority: 'CRITICAL', actionsCopy: '510', actionsMerge: '2', recommendation: 'Immediate copy: core dossiers & investigation scripts' },
  { name: 'Tonypost949.github.io', fileCount: '2', priority: 'CRITICAL', actionsCopy: '2', actionsMerge: '0', recommendation: 'Immediate copy: public release portal' },
  { name: 'RICONWO', fileCount: '16', priority: 'HIGH', actionsCopy: '16', actionsMerge: '0', recommendation: 'Prioritize: municipal matrices & BigQuery pipelines' },
  { name: 'OSINTRnDi', fileCount: '69', priority: 'HIGH', actionsCopy: '69', actionsMerge: '0', recommendation: 'Prioritize: R&D intelligence ledgers' },
  { name: 'NPI---Non-Profiteers-Index', fileCount: '1', priority: 'HIGH', actionsCopy: '1', actionsMerge: '0', recommendation: 'Non-profit municipal subsidy indexing' },
  { name: 'riconow', fileCount: '997', priority: 'MEDIUM', actionsCopy: '500', actionsMerge: '497', recommendation: 'Integrate: entity extractors, graphs & riconow review' },
  { name: 'osint_analyzer', fileCount: '140', priority: 'MEDIUM', actionsCopy: '140', actionsMerge: '0', recommendation: 'Automated document analysis routines' },
  { name: 'OSINTNeoAiCLI', fileCount: '36', priority: 'MEDIUM', actionsCopy: '16', actionsMerge: '20', recommendation: 'CLI utilities & batch dispatch runners' },
  { name: 'osintneoai-a1', fileCount: '1,173', priority: 'MEDIUM', actionsCopy: '0', actionsMerge: '1', recommendation: 'Graph and entity extraction review' },
  { name: 'ailaws', fileCount: '4', priority: 'REFERENCE', actionsCopy: '4', actionsMerge: '0', recommendation: 'Statutory proof framework & legal matrix' },
  { name: 'TaxFunded', fileCount: '12', priority: 'LOW', actionsCopy: '9', actionsMerge: '3', recommendation: 'Public funding contract ledger' },
  { name: 'civil-rights-activist-emailer', fileCount: '2,280', priority: 'LOW', actionsCopy: '2,280', actionsMerge: '0', recommendation: 'Automated email dispatch templates' },
  { name: 'ai-agents-for-beginners', fileCount: '10,217', priority: 'REFERENCE', actionsCopy: '10,213', actionsMerge: '4', recommendation: 'Archived reference library' },
  { name: 'vertex-ai-creative-studio', fileCount: '945', priority: 'REFERENCE', actionsCopy: '937', actionsMerge: '8', recommendation: 'AI Studio studio configuration models' },
];

export const STATIC_OSINT_CATEGORIES: OsintCategoryRecord[] = [
  { category: 'Scripts', fileCount: 1204, share: '36.0%' },
  { category: 'Reports & Documents', fileCount: 1106, share: '33.1%' },
  { category: 'Data & Config', fileCount: 639, share: '19.1%' },
  { category: 'Web Assets', fileCount: 267, share: '8.0%' },
  { category: 'Text & Notes', fileCount: 126, share: '3.8%' },
  { category: 'Other', fileCount: 1, share: '0.0%' },
];

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
