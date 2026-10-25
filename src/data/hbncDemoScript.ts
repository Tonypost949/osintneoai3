export type AppViewportTab = 'master' | 'ailaws' | 'screener' | 'void-deals' | 'outreach' | 'osint' | 'locker' | 'integrations';

export interface CinematicSceneConfig {
  id: string;
  actNumber: string;
  featureBadge: string;
  title: string;
  subtitle: string;
  narrative: string;
  targetAppTab: AppViewportTab;
  targetElementId?: string;
  evidenceModalTarget?: string;
  durationMs: number;
  evidencePath: string;
  buttonSequence?: string[];
  metrics: {
    label: string;
    value: string;
    accent: 'cyan' | 'red' | 'emerald' | 'amber' | 'purple';
  }[];
}

export const CINEMATIC_DEMO_SCENES: CinematicSceneConfig[] = [
  {
    id: 'ACT_01_URGENT_CALL_TO_ACTION',
    actNumber: '01',
    featureBadge: 'URGENT INTERVENTION · 72-HOUR WINDOW',
    title: 'Act 1: Executive Call to Action & The Six Immediate Demands',
    subtitle: 'Huntington Beach Navigation Center · 49× Hexavalent Chromium Contamination',
    narrative:
      'Welcome to the HBNC Case 3 and OSINT Neo AI Evidentiary Command Center. A 62-year-old disabled resident, Elizabeth Petruccio, and her caregiver son Anthony DiMarcello entered a publicly funded municipal shelter built over soil containing hexavalent chromium at 49 times state residential screening levels. Within nine weeks, Elizabeth was intubated in the ICU with empyema and sepsis, losing 44 pounds. While in intensive care, the shelter terminated her bed and barred her for 30 days. Every fact here is indexed to primary government contracts, GPS-stamped photographs, and hospital electronic health records.',
    targetAppTab: 'master',
    targetElementId: 'cta-action-hero',
    evidenceModalTarget: 'navigation_center_003.jpg',
    durationMs: 44000,
    evidencePath: 'PACER 8:26-cv-00348-JWH-ADS / SAVC ECF 115 / Opp. MTD ECF 130',
    buttonSequence: [
      'Top Banner: Urgent Call to Action Indicator',
      'Hero Stats: 980 µg/kg Cr(VI) · 49× Residential Benchmark',
      'Role Selectors: Counsel, Agency Investigator, Physician, Public',
      'Action Item: The Six Non-Negotiable Demands',
    ],
    metrics: [
      { label: 'Site Peak Cr(VI)', value: '980 µg/kg', accent: 'red' },
      { label: 'DTSC Benchmark', value: '49× Residential', accent: 'red' },
      { label: 'Hospital Stay', value: '62 Days (Jan–Mar)', accent: 'purple' },
      { label: 'Action Window', value: 'Immediate Intervention', accent: 'amber' },
    ],
  },
  {
    id: 'ACT_02_SMOKING_GUN_DOCUMENTS',
    actNumber: '02',
    featureBadge: 'PRIMARY EVIDENCE · THE 3-DOCUMENT SMOKING GUN',
    title: 'Act 2: The Three-Document Smoking Gun & November 7, 2023 Cap Breach',
    subtitle: 'County Condition vs. 1-Year Cap Warranty vs. GPS-Stamped Floor Photos',
    narrative:
      'Here is the documentary core of the case: Document One, County briefing navigation center 003, states the site was approved for shelter use only as long as an asphalt pavement cover was maintained over the soil. Document Two, City contract Laserfiche 5406552 for $2.41 million, warranted that 2-inch asphalt cap for only one single year, and contractor proposal 20390 admitted the crew was not 40-hour HAZWOPER trained. Document Three, photographed by Elizabeth on November 7, 2023, shows corroded anchor bolts puncturing the cap beneath beds with raw sub-slab soil on the sleeping floor at GPS 33.706389, -117.988611.',
    targetAppTab: 'master',
    targetElementId: 'site-section',
    evidenceModalTarget: 'HB_Shelter_Nov2023_photo_01.jpg',
    durationMs: 48000,
    evidencePath: 'City Contract Doc ID 20-9041/235642 (Laserfiche #5406552) & Proposal #20390',
    buttonSequence: [
      'Document 1: County Asphalt Cap Condition (navigation_center_003.jpg)',
      'Document 2: 1-Year Warranty & Untrained Labor (Laserfiche #5406552)',
      'Document 3: GPS Photo Breach (HB_Shelter_Nov2023_photo_01.jpg)',
      'Groundwater: 47.5× SMCMWC North Well & MW-42 270 µg/L',
    ],
    metrics: [
      { label: 'Cap Warranty', value: '1 Year Only', accent: 'amber' },
      { label: 'Crew HAZWOPER', value: 'NOT 40-Hr Trained', accent: 'red' },
      { label: 'Breach Photos', value: 'Nov 7, 2023 GPS', accent: 'emerald' },
      { label: 'Contract Total', value: '$2,410,716.24', accent: 'cyan' },
    ],
  },
  {
    id: 'ACT_03_SIX_RESIDENTS_CLUSTER',
    actNumber: '03',
    featureBadge: 'CLINICAL CLUSTER · 6 HOSPITALIZED RESIDENTS',
    title: 'Act 3: The Six-Resident Hospitalization Cluster & Fatalities',
    subtitle: 'Identical Pulmonary, Empyemic & Sepsis Pathology in One Structure',
    narrative:
      'This was not an isolated illness. Within a 14-month window, six residents sleeping in the same Sprung structure suffered acute pneumonia, pleural disease, sepsis, or cardiac trauma. Burt Bell died in early 2024; his coroner certificate confirms pneumonia with environmental vulnerability. Jesse Knabb suffered recurrent chemical pneumonitis and empyema. Brian Bell submitted a signed grievance that shelter management left completely blank, and later died. Anthony DiMarcello suffered four fractured ribs, multiple pulmonary infiltrates, and permanent shoulder disability. In Elizabeth Petruccio’s chart, social workers documented the Navigation Center three times, but 25 physician notes omitted it.',
    targetAppTab: 'master',
    targetElementId: 'people-section',
    evidenceModalTarget: 'scripps_ehr_page_985.png',
    durationMs: 48000,
    evidencePath: '1.E.Petruccio Patient Health.pdf (pp. 654–1051) & Sheriff-Coroner Cert 04/11/2024',
    buttonSequence: [
      'Resident 1: Anthony DiMarcello III (Caregiver / Shoulder Disability)',
      'Resident 2: Elizabeth Petruccio (Empyema, Intubation, 160→116 lb)',
      'Resident 3: Jesse Knabb (Lead Federal Relator / Empyema)',
      'Residents 4 & 5: Burt Bell & Brian Bell (Documented Fatalities)',
      'Resident 6: Curtis Simcox (Acute Troponin 6.300 Cardiac Injury)',
    ],
    metrics: [
      { label: 'Cluster Size', value: '6 Inmates / Residents', accent: 'purple' },
      { label: 'Fatalities', value: '2 Documented Deaths', accent: 'red' },
      { label: 'EHR Discrepancy', value: '3 Social Work vs 0 MD', accent: 'amber' },
      { label: 'Weight Collapse', value: '160 lb → 116 lb', accent: 'cyan' },
    ],
  },
  {
    id: 'ACT_04_AILAWS_STATUTORY_MATRIX',
    actNumber: '04',
    featureBadge: 'LEGAL THEORY · /AILAWS STATUTORY PROOF MAPPER',
    title: 'Act 4: The /ailaws Statutory Proof Matrix & Element Mapping',
    subtitle: 'ADA Title II · Fair Housing Act · RCRA § 6972 · Elder Abuse § 15657 · § 1983 Monell',
    narrative:
      'Under the ailaws framework, every legal cause of action is mapped directly to its statutory elements and corresponding documentary exhibits. Under ADA Title II and the Fair Housing Act, automatically expelling a hospitalized disabled resident and imposing a 30-day lockout is a per se violation of reasonable accommodation mandates. Under RCRA citizen suit provisions, the failed asphalt cap over 49 times screening levels establishes imminent and substantial endangerment. And under California Welfare and Institutions Code section 15657, abandoning a dependent adult while in intensive care triggers enhanced remedies, including mandatory attorney fees.',
    targetAppTab: 'ailaws',
    targetElementId: 'ailaws-root',
    evidenceModalTarget: 'navigation_center_003.jpg',
    durationMs: 48000,
    evidencePath: '42 U.S.C. § 12132 · 42 U.S.C. § 3604 · 42 U.S.C. § 6972 · Cal. Welf. & Inst. Code § 15657',
    buttonSequence: [
      'Category Filter: Disability & Housing Civil Rights (ADA/FHA)',
      'Category Filter: Environmental & Premises (RCRA 6972 / Cr6)',
      'Category Filter: Elder & Dependent Adult Neglect (§ 15657)',
      'Category Filter: Constitutional & Whistleblower Retaliation',
    ],
    metrics: [
      { label: 'Total Causes', value: '8 Mapped Claims', accent: 'cyan' },
      { label: 'Fee-Shifting', value: 'ADA, FHA, RCRA, EADACPA', accent: 'emerald' },
      { label: 'Civil Rights Clocks', value: '2 Years (CCP § 335.1)', accent: 'amber' },
      { label: 'Tort Presentation', value: 'Gov. Code § 911.2 (6 Mos)', accent: 'red' },
    ],
  },
  {
    id: 'ACT_05_DEMAND_GENERATOR',
    actNumber: '05',
    featureBadge: 'ACTION TOOL · 1-CLICK LEGAL DEMAND GENERATOR',
    title: 'Act 5: One-Click Legal Action & Formal Notice Generator',
    subtitle: 'Counsel Intake Memo · ADA/FHA Accommodation · HIPAA 164.526 Amendment · Spoliation Hold',
    narrative:
      'The ailaws module features an interactive legal notice generator. With a single click, attorneys, advocates, or the claimants can generate ready-to-send formal notices populated with exact dates, Laserfiche contract IDs, and EHR citations: Template 1 produces a comprehensive Counsel Intake and Co-Counsel Memo; Template 2 generates an Emergency Reasonable Accommodation and Bed-Hold Demand; Template 3 issues a HIPAA Section 164.526 Medical Record Amendment to correct the chart; and Template 4 serves a formal Spoliation and Evidence Preservation Hold Notice.',
    targetAppTab: 'ailaws',
    targetElementId: 'gen-box-section',
    evidenceModalTarget: 'scripps_ehr_page_1034.png',
    durationMs: 46000,
    evidencePath: '03_Law_and_Remedies.md & 04_Outreach_Pack.md',
    buttonSequence: [
      'Template 1: Counsel Intake & Case Evaluation Memo',
      'Template 2: ADA / FHA Reasonable Accommodation Demand',
      'Template 3: HIPAA § 164.524 / § 164.526 EHR Amendment Request',
      'Template 4: Evidence Preservation & Spoliation Hold Notice',
      'Actions: Copy to Clipboard & Download .TXT File',
    ],
    metrics: [
      { label: 'Templates', value: '4 Formal Notices', accent: 'purple' },
      { label: 'Export Options', value: '1-Click Copy & .TXT', accent: 'emerald' },
      { label: 'Citations', value: 'Fully Populated Exhibits', accent: 'cyan' },
      { label: 'Readiness', value: 'Instant Co-Counsel Pitch', accent: 'amber' },
    ],
  },
  {
    id: 'ACT_06_VOID_AB_INITIO_DEALS',
    actNumber: '06',
    featureBadge: 'FPPC FORM 700 · 2 VOID AB INITIO DEALS',
    title: 'Act 6: Two Void Ab Initio Public Land Deals ($320M vs $6.09M)',
    subtitle: 'Huntington Beach Shelter Site vs. Anaheim Angel Stadium · Thomson v. Call Strict Disgorgement',
    narrative:
      'We examine the controlling Form 700 audit comparing two illegal municipal transactions under California Government Code section 1090. Deal 1 is the 6.09 million dollar Huntington Beach Navigation Center acquisition: trustee Mitsuru Yamada, a 25-year Orange County EMA engineer, filed zero Form 700 statements despite owning reciprocal easement UPX1978058 over the contaminated parcel. Deal 2 is the 320 million dollar Anaheim Angel Stadium sale, where Mayor Harry Sidhu pleaded guilty to honest services fraud in USA v. Sidhu before Judge John W. Holcomb, leading the City Council to void the sale on May 24, 2022. Under Thomson v. Call, infected contracts are strictly void ab initio with mandatory 100 percent disgorgement without offset.',
    targetAppTab: 'void-deals',
    targetElementId: 'void-deals-root',
    evidenceModalTarget: 'Laserfiche #5406552',
    durationMs: 50000,
    evidencePath: 'Thomson v. Call (38 Cal.3d 633) & USA v. Sidhu (8:23-cr-00114-JWH)',
    buttonSequence: [
      'Side-by-Side: Deal 1 ($6.09M HBNC) vs Deal 2 ($320M Angel Stadium)',
      'Controlling Precedent: Thomson v. Call 100% Strict Disgorgement',
      'Cross-Case Notice: Hon. John W. Holcomb FRE 201 Judicial Nexus',
      'Export Audit: Structured JSON Evidence Dossier Download',
    ],
    metrics: [
      { label: 'Angel Stadium Sale', value: '$320,000,000', accent: 'purple' },
      { label: 'HBNC Acquisition', value: '$6,094,847', accent: 'red' },
      { label: 'Disgorgement Rule', value: '100% Strict No Offset', accent: 'emerald' },
      { label: 'Federal Judge', value: 'Hon. John W. Holcomb', accent: 'cyan' },
    ],
  },
  {
    id: 'ACT_07_VICTIM_SCREENER_UPLOAD',
    actNumber: '07',
    featureBadge: 'LIVE VICTIM MATRIX · ANONYMOUS UPLOAD & SCREENER',
    title: 'Act 7: Victim Contamination Screener & Live Anonymized Visual Matrix',
    subtitle: 'Strict HBNC Victim 1, 2, 3 Anonymization · Live Card Creation · ZIP & File Upload',
    narrative:
      'The Contamination Screener allows any victim, family member, or worker to check toxic symptoms and upload records with zero login required. Every submission automatically generates a live visual card in the app, strictly anonymizing patient names as HBNC Victim 1, HBNC Victim 2, and so forth, while preserving all clinical dates, bed coordinates, and pathology. Each entry is dynamically correlated with the GeoTracker 49 times Chromium plume, the Nov 7 cap breach photos, and the Form 700 void ab initio disgorgement framework. Submissions transmit instantly to coordinator email amd949609@gmail.com.',
    targetAppTab: 'screener',
    targetElementId: 'screener-root',
    evidenceModalTarget: 'HB_Shelter_Nov2023_photo_01.jpg',
    durationMs: 48000,
    evidencePath: 'Direct Coordinator Intake: amd949609@gmail.com',
    buttonSequence: [
      'Step 1: Check Symptoms & Calculate 49x Cr(VI) Plume Correlation',
      'Step 2: Instant Visual Card Generation (HBNC Victim 1, 2, 3...)',
      'Step 3: Universal File Upload (.ZIP, PDF, Image, EHR, Notes)',
      'Step 4: Automatic Cross-Matching with Form 700 & Evidence Locker',
    ],
    metrics: [
      { label: 'Privacy Standard', value: 'Strict HBNC Victim #ID', accent: 'emerald' },
      { label: 'Upload Support', value: '.ZIP & All File Types', accent: 'cyan' },
      { label: 'Live Generation', value: 'Instant Visual Matrix', accent: 'amber' },
      { label: 'Coordinator Email', value: 'amd949609@gmail.com', accent: 'red' },
    ],
  },
  {
    id: 'ACT_08_OUTREACH_TELEMETRY',
    actNumber: '08',
    featureBadge: 'DISPATCH ANALYTICS · 5-YEAR OUTREACH CAMPAIGN',
    title: 'Act 8: Five-Year Outreach Analytics & Active Federal Control Dockets',
    subtitle: '184 Cataloged Dispatches · 76 Public Filings · GAO COMP-26-004512 & FBI 20IC002',
    narrative:
      'Our outreach dashboard tracks 184 cataloged dispatches between 2021 and 2026. This includes 76 public sector filings across federal, state, and municipal oversight agencies. The evidentiary significance is profound: we have established constructive administrative notice and legal exhaustion. Active federal control numbers include GAO FraudNet docket COMP-26-004512 for federal program audit, and FBI IC3 public corruption docket 20IC002. Documented responses span the CFTC Whistleblower Office, FEMA, and academic legal clinics at Loyola, USC, and Stanford.',
    targetAppTab: 'outreach',
    targetElementId: 'outreach-root',
    evidenceModalTarget: 'navigation_center_003.jpg',
    durationMs: 44000,
    evidencePath: 'Summary_of_Outreach_Efforts__2021-Present__8418f504',
    buttonSequence: [
      'Metric Banner: 184 Total Records · 76 Public Filings · 11 Responses',
      'Federal Docket 1: GAO FraudNet COMP-26-004512 ($598.7M Grant Fraud)',
      'Federal Docket 2: FBI IC3 Record 20IC002 (Public Corruption)',
      'Timeline Scrubber: 2021 to 2026 Dissemination Trajectory',
    ],
    metrics: [
      { label: 'Total Dispatches', value: '184 Records', accent: 'purple' },
      { label: 'Public Filings', value: '76 Oversight Agencies', accent: 'cyan' },
      { label: 'GAO Docket', value: 'COMP-26-004512', accent: 'emerald' },
      { label: 'FBI IC3 Docket', value: 'Record 20IC002', accent: 'red' },
    ],
  },
  {
    id: 'ACT_09_EVIDENCE_LOCKER_AND_OSINT',
    actNumber: '09',
    featureBadge: 'DOCUMENT VAULT · EVIDENCE LOCKER & OSINT LIBRARY',
    title: 'Act 9: The Evidence Locker Hub & OSINT Research Library',
    subtitle: 'Local Folder Scanner · Subfolders Auto-Link · 3,344 Main Repo Files · 31 Repos',
    narrative:
      'The Evidence Locker Hub connects all 12 dossier markdown files and the 4 connected subfolders: Evidence Locker, Hosted Dossiers, HBNC Case 2, and Desktop Items. Click Scan and Link Subfolders to automatically index your local folder, transforming every exhibit citation into an instant-preview link. Next to it, the OSINT Research Library indexes 3,344 main repository files and 15,320 items across 31 investigative repositories, categorized by priority tier and migration recommendations. The tour now loops back to Act 1.',
    targetAppTab: 'locker',
    targetElementId: 'locker-root',
    evidenceModalTarget: 'scripps_ehr_page_985.png',
    durationMs: 46000,
    evidencePath: 'OSINT_Neo_AI_Index_baedd5dc & C:\\Users\\Amd949609\\Desktop\\HBNC_Case_3',
    buttonSequence: [
      'Evidence Hub: 12 Master Markdown Dossier Files (00 to 11)',
      'Subfolder Scanner: Auto-Index Evidence_Locker, Hosted_Dossiers, etc.',
      'OSINT Library: 3,344 Files & 15,320 Workload Across 31 Repos',
      'Export & Print: Save as Clean Formal Legal Brief (PDF)',
    ],
    metrics: [
      { label: 'Companion Files', value: '12 Master Dossiers', accent: 'emerald' },
      { label: 'OSINT Workload', value: '15,320 Cataloged Files', accent: 'amber' },
      { label: 'Subfolders', value: '4 Auto-Connected', accent: 'cyan' },
      { label: 'Format Support', value: 'Web, Print & PDF', accent: 'purple' },
    ],
  },
];
