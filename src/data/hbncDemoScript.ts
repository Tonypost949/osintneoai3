export type AppViewportTab =
  | 'master'
  | 'ailaws'
  | 'screener'
  | 'void-deals'
  | 'crypto-transparency'
  | 'broadsheet-newspaper'
  | 'user-workspaces'
  | 'outreach'
  | 'osint'
  | 'locker'
  | 'integrations'
  | 'maltego'
  | 'evidence-law-hybrid';

export interface PrimaryExhibitAsset {
  filename: string;
  label: string;
  url: string;
  type: 'image' | 'text' | 'html';
  dateOrCitation: string;
  caption: string;
  keyQuote?: string;
}

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
  primaryExhibits: PrimaryExhibitAsset[];
  controllingStatutes: string[];
  buttonSequence?: string[];
  metrics: {
    label: string;
    value: string;
    accent: 'cyan' | 'red' | 'emerald' | 'amber' | 'purple';
  }[];
}

export const CINEMATIC_DEMO_SCENES: CinematicSceneConfig[] = [
  {
    id: 'ACT_1_DIRECT_DATA_OVERVIEW',
    actNumber: '1',
    featureBadge: 'OSINT NEO AI · LIVE INVESTIGATION & LEGAL MATRIX · RELATOR MISSION',
    title: 'Act 1: OSINT Neo AI — Live Investigation & Legal Matrix',
    subtitle: 'Orange County Homeless & Disabled Displacement · Whistleblower Anthony DiMarcello III · Read-Only + Live Upload',
    narrative:
      'OSINT Neo AI, Live Investigation and Legal Matrix. The current demo presentation of the system is a real investigation into the ongoing displacement and abuse of Orange County, California’s homeless and disabled population. At 17631 Cameron Lane, the Huntington Beach Navigation Center was built over an industrial toxic plume measuring 980 micrograms per kilogram of hexavalent chromium—49 times the state residential screening limit—under a 1-year asphalt cap contract that breached beneath resident beds on November 7, 2023, causing six documented hospitalizations and two deaths, alongside 326.1 million dollars in Form 700 void ab initio public land deals mapped across our 617-entity forensic RICO graph and anchored on-chain by our Web3 Transparency Token and 40/30/30 Sepolia crypto escrow architecture. This case was brought to the system by federal whistleblower and relator Anthony Michael DiMarcello III—who holds GAO FraudNet docket COMP-26-004512 and FBI control record 20IC002—and his 62-year-old disabled mother Elizabeth Tina Petruccio. After sleeping directly over the breached floor cap, Elizabeth suffered a 103,752 white blood cell pleural empyema, septic shock, intubation, spinal osteomyelitis, and a 44-pound weight collapse from 160 pounds down to 116 pounds across 62 days institutionalized. While she was intubated in the ICU, the shelter terminated her bed under a 7-day absence rule, barred her from returning for 30 days, and subjected the relator to violent guard ejection and institutional stonewalling across 184 formal agency dispatches. The purpose of this system at osintneoai.me is to be a voice for those who cannot get help—like the relator and the victims—and the AI Laws Legal Matrix and Transparency Token crypto ledger help with that too by mapping every primary exhibit to controlling federal and California statutes, minting immutable Tax-Funded Transparency Tokens and Public Audit Tokens on Ethereum Sepolia, and generating ready-to-serve legal demands. Finally, this system is protected in Read-Only, Comment-Only mode so the master record can never be altered, while input from anyone else—such as any type of file, folder, or zip archive—can be uploaded and the data will be incorporated live into the system to see the immediate correlated results across every tool.',
    targetAppTab: 'evidence-law-hybrid',
    targetElementId: 'evidence-law-hybrid-root',
    evidenceModalTarget: 'navigation_center_001.jpg',
    durationMs: 115000,
    evidencePath: 'PACER 8:26-cv-00348-JWH-ADS · GAO #COMP-26-004512 · FBI #20IC002 · /ailaws Matrix',
    primaryExhibits: [
      {
        filename: 'navigation_center_001.jpg',
        label: 'HBNC Sprung Structure & Perimeter (17631 Cameron Ln)',
        url: '/evidence/navigation_center_001.jpg',
        type: 'image',
        dateOrCitation: '17631 Cameron Lane, Huntington Beach, CA 92648',
        caption: 'Congregate 174-bed Sprung structure sited over GeoTracker ID T10000018579 plume (980 µg/kg Cr(VI), 49× residential screening limit).',
        keyQuote: 'OSINT Neo AI: Built as a voice for Relator Anthony DiMarcello III, disabled mother Elizabeth Petruccio, and Orange County victims.',
      },
      {
        filename: '01_Formal_Statement.md',
        label: 'Sworn First-Person Account (Relator Anthony DiMarcello III & Elizabeth Petruccio)',
        url: '/evidence/01_Formal_Statement.md',
        type: 'text',
        dateOrCitation: 'Formal Statement of Account · Oct 2026',
        caption: 'Details the issues faced by the whistleblower/relator and the Six Non-Negotiable Demands: OEM/CIH review, cap warranty accounting, ADA bed-hold, legal representation, warrant review, and supportive housing.',
        keyQuote: 'Read-Only / Comment-Only Master Record Protection + Live Universal File & .ZIP Upload Incorporation Active.',
      },
      {
        filename: 'scripps_ehr_page_985.png',
        label: 'Scripps EHR Page 985: Exited While in ICU & 30-Day Lockout (01/19/2024)',
        url: '/evidence/scripps_ehr_page_985.png',
        type: 'image',
        dateOrCitation: 'Scripps Mercy EHR p. 985 · 01/19/2024',
        caption: 'Primary hospital social work proof that Ms. Petruccio was terminated from her shelter bed while intubated in the ICU and barred for 30 days.',
      },
    ],
    controllingStatutes: [
      '42 U.S.C. § 12132 (ADA Title II Disability Protection)',
      '31 U.S.C. §§ 3729, 3730(h) (False Claims Act Relator Protection)',
      '42 U.S.C. § 6972(a)(1)(B) (RCRA Citizen Suit Endangerment)',
      'Cal. Gov. Code § 1090 / Thomson v. Call (Void Ab Initio Disgorgement)',
    ],
    buttonSequence: [
      '1. Case Summary: 49× Cr(VI), Nov 7 Breach, 6 Hospitalized & 2 Deaths',
      '2. Relator & Issues: Anthony DiMarcello III & Elizabeth Petruccio (62 Days ICU / Exited)',
      '3. Purpose & /ailaws Legal Matrix: Voice for Victims & Statutory Demand Engine',
      '4. Read-Only / Comment-Only Protection + Live File & .ZIP Incorporation',
    ],
    metrics: [
      { label: 'Site Peak Cr(VI)', value: '980 µg/kg (49×)', accent: 'red' },
      { label: 'Mother ICU Stay', value: '62 Days (160→116 lb)', accent: 'purple' },
      { label: 'Relator Dockets', value: 'GAO & FBI Active', accent: 'emerald' },
      { label: 'Data Mode', value: 'Read-Only + Live ZIP', accent: 'cyan' },
    ],
  },
  {
    id: 'ACT_2_PHASE_II_PLUME_AND_COUNTY_CONDITION',
    actNumber: '2',
    featureBadge: 'TOOL: FORENSIC COMMAND HUD & MASTER RECORD · GEOTRACKER T10000018579',
    title: 'Act 2: Master Record Tool — Phase II Plume Data & County Asphalt Cap Condition',
    subtitle: 'GeoTracker T10000018579 · 1947 Oil Well W-4150 · Exhibit navigation_center_003.jpg',
    narrative:
      'In the Forensic Command HUD and Master Record workspace, the system indexes the complete environmental and historical baseline of 17631 Cameron Lane and adjacent 17642 Beach Boulevard under California State Water Board GeoTracker ID T10000018579. Historical 1947 aerial survey photography confirms that abandoned oil and gas well W-4150 and former industrial heat-treating and aerospace operations sat approximately 75 feet from the congregate shelter beds. On August 3, 2020, EEC Environmental Phase II soil borings B1 through B12 and soil vapor probes SV1 through SV12 measured hexavalent chromium at 200 to 980 micrograms per kilogram at shallow depths of 0.5 to 5 feet—up to 49 times the California DTSC residential screening level of 20 micrograms per kilogram and nearly double the 500 microgram industrial ceiling. The same samples confirmed lead at 145 milligrams per kilogram, arsenic at 9.36 milligrams per kilogram—134 times the residential screening threshold—plus sub-slab trichloroethene, tetrachloroethene, and benzene vapors, while adjacent monitoring well MW-42 recorded 270 micrograms per liter of hexavalent chromium in groundwater. Crucially, County of Orange briefing exhibit navigation center 3 states verbatim that placing homeless residents on this parcel posed no significant threat only so long as an intact asphalt pavement cover was placed and maintained over the contaminated soil.',
    targetAppTab: 'master',
    targetElementId: 'site-section',
    evidenceModalTarget: 'navigation_center_003.jpg',
    durationMs: 92000,
    evidencePath: 'EEC Phase II (08/03/2020) · GeoTracker T10000018579 · navigation_center_003.jpg',
    primaryExhibits: [
      {
        filename: 'navigation_center_003.jpg',
        label: 'Exhibit 1: County Mandatory Asphalt Cap Condition (navigation_center_003.jpg)',
        url: '/evidence/navigation_center_003.jpg',
        type: 'image',
        dateOrCitation: 'County of Orange Briefing · navigation_center_003.jpg',
        caption: 'Official County briefing document conditioning human occupancy on an intact asphalt pavement barrier.',
        keyQuote: 'Site approved for shelter occupancy ONLY "so long as the site is covered by asphalt."',
      },
      {
        filename: 'SAR_June2020_Fig2_BoringLocation_Cameron-020.png',
        label: 'Exhibit 2: EEC Phase II Boring Map (B1–B12 / SV1–SV12)',
        url: '/evidence/SAR_June2020_Fig2_BoringLocation_Cameron-020.png',
        type: 'image',
        dateOrCitation: 'GeoTracker T10000018579 · June–Aug 2020 SAR',
        caption: 'Boring map where shallow soil (0.5–5 ft) tested at 200–980 µg/kg Cr(VI) (49× residential screening limit).',
      },
      {
        filename: '17631 Cameron St_17642 Beach Blvd_1947.jpg',
        label: 'Exhibit 3: 1947 Aerial Survey (Oil Well W-4150)',
        url: '/evidence/17631 Cameron St_17642 Beach Blvd_1947.jpg',
        type: 'image',
        dateOrCitation: '1947 Aerial Survey · 17631 Cameron Ln & 17642 Beach Blvd',
        caption: 'Historical industrial/oilfield footprint showing Well W-4150 (~75 ft from shelter beds).',
      },
    ],
    controllingStatutes: [
      '42 U.S.C. § 6972(a)(1)(B) (RCRA Imminent & Substantial Endangerment)',
      'Cal. Health & Safety Code § 25356 (DTSC Screening & LUC Requirements)',
      'Cal. Gov. Code § 835 (Dangerous Condition of Public Property)',
    ],
    buttonSequence: [
      'Tool: Forensic Command HUD & Master Record Baseline',
      'Exhibit 1: County Asphalt Cap Mandate (navigation_center_003.jpg)',
      'Exhibit 2: Phase II Soil Boring Map (980 µg/kg Cr(VI) / 49× Limit)',
      'Exhibit 3: 1947 Oilfield Survey (Well W-4150) & Well MW-42 (270 µg/L)',
    ],
    metrics: [
      { label: 'Soil Cr(VI)', value: '980 µg/kg (49×)', accent: 'red' },
      { label: 'Lead / Arsenic', value: '145 / 9.36 mg/kg', accent: 'amber' },
      { label: 'Well MW-42', value: '270 µg/L Cr(VI)', accent: 'purple' },
      { label: 'Sole Control', value: 'Asphalt Cap Only', accent: 'cyan' },
    ],
  },
  {
    id: 'ACT_3_CONTRACT_WARRANTY_AND_UNTRAINED_CREW',
    actNumber: '3',
    featureBadge: 'TOOL: EVIDENCE-LAW HYBRID VIEWER · LASERFICHE CONTRACT #5406552',
    title: 'Act 3: Evidence-Law Hybrid Viewer — Contract #5406552 & 1-Year Cap Warranty',
    subtitle: 'City Contract Doc ID 20-9041/235642 ($2,410,716.24) · TTS Proposal #20390 · Non-HAZWOPER Crew',
    narrative:
      'Switching to the Evidence-Law Hybrid Viewer tool, the system pairs high-resolution municipal contract scans on the left directly with statutory element proof on the right. City of Huntington Beach Contract Laserfiche number 5406552—Document ID 20-9041, totaling 2,410,716 dollars and 24 cents with TTS Engineering—governed the site grading and asphalt paving used as the shelter’s sole environmental barrier. Instead of an engineered, DTSC-monitored vapor membrane and reinforced concrete slab, Bid Item 2 installed a thin 2-inch asphalt concrete layer directly over native contaminated soil at a budget cost of 1 dollar and 62 cents per square foot across 50,700 square feet. Under Section 9 of the contract, lines 331 through 340, that 2-inch asphalt cap carried a total warranty of only 1 year after City acceptance. Even worse, attached Contractor Proposal 20390, line 1196, stipulated in all-capital letters: CREW INSTALLING AC WILL NOT BE 40-HOUR TRAINED—violating federal OSHA 29 CFR 1910.120 and Cal/OSHA 8 CCR 5192 HAZWOPER mandates. When the 1-year warranty expired in late 2021 with zero DTSC Land Use Covenant recorded, the City and Mercy House continued housing 174 disabled residents inside the tent, later admitting in the 2026 HHAP Grant Memorandum of Understanding that 75,000 dollars was required because the base floor seals had failed.',
    targetAppTab: 'evidence-law-hybrid',
    targetElementId: 'evidence-law-hybrid-root',
    evidenceModalTarget: '5406552_viewer.png',
    durationMs: 95000,
    evidencePath: 'Laserfiche #5406552 (p. 6, § 9, lines 331–340) & TTS Proposal #20390 (lines 1083, 1196)',
    primaryExhibits: [
      {
        filename: '5406552_viewer.png',
        label: 'Exhibit 1: City Laserfiche #5406552 Portal Capture',
        url: '/evidence/5406552_viewer.png',
        type: 'image',
        dateOrCitation: 'City of Huntington Beach Laserfiche #5406552',
        caption: 'Official municipal contract record for TTS Engineering grading and 2-inch asphalt paving ($2,410,716.24).',
        keyQuote: 'Section 9 (lines 331–340): Warrants grading and asphalt paving for "a period of one (1) year after CITY\'s acceptance thereof."',
      },
      {
        filename: 'laserfiche_5406552_TTS_grading_contract_FULL.txt',
        label: 'Exhibit 2: Verbatim Text of Contract #5406552 & Proposal #20390',
        url: '/evidence/laserfiche_5406552_TTS_grading_contract_FULL.txt',
        type: 'text',
        dateOrCitation: 'Doc ID 20-9041/235642 · Lines 331–340 & 1083, 1196',
        caption: 'Verbatim contract text proving 2" AC paving over native soil at $1.62/sq ft and non-HAZWOPER crew stipulation.',
        keyQuote: 'Proposal #20390, Line 1196: "CREW INSTALLING AC WILL NOT BE 40-HOUR TRAINED."',
      },
    ],
    controllingStatutes: [
      '29 C.F.R. § 1910.120 / 8 CCR § 5192 (40-Hour HAZWOPER Mandate)',
      'Cal. Gov. Code §§ 835, 815.6 (Mandatory Duty & Dangerous Condition)',
      '42 U.S.C. § 1983 (Fourteenth Amendment State-Created Danger)',
    ],
    buttonSequence: [
      'Tool: Split-Screen Evidence-Law Hybrid Viewer',
      'Contract § 9: 1-Year Asphalt Cap Warranty (Lines 331–340)',
      'Proposal #20390 Line 1196: Crew NOT 40-Hour HAZWOPER Trained',
      '2026 HHAP MOU: $75,000 Base-Seal Failure Admission',
    ],
    metrics: [
      { label: 'Cap Thickness', value: '2 Inches ($1.62/sf)', accent: 'amber' },
      { label: 'Warranty Term', value: '1 Year Only', accent: 'red' },
      { label: 'HAZWOPER Crew', value: 'NOT 40-Hr Trained', accent: 'red' },
      { label: 'Contract Value', value: '$2,410,716.24', accent: 'cyan' },
    ],
  },
  {
    id: 'ACT_4_NOV7_2023_UNDER_BED_CAP_BREACH',
    actNumber: '4',
    featureBadge: 'EXHIBITS: HB_Shelter_Nov2023_photo_01.jpg – photo_08.jpg · EXIF GPS VERIFIED',
    title: 'Act 4: Nov 7, 2023 GPS Photographs — Sub-Slab Cap Breach Under Resident Beds',
    subtitle: 'Samsung SM-T580 EXIF · GPS 33.706389, -117.988611 · 66 Days Before ICU & 11 Months Pre-Oct 2024',
    narrative:
      'Inside the Evidence-Law Hybrid Viewer, the system displays the eight forensic photographs captured by relator Anthony DiMarcello III on November 7, 2023 between 12:20 and 12:36 PM using a Samsung SM-T580 tablet. Cryptographic SHA-256 hashes and embedded EXIF metadata verify exact GPS coordinates of 33.706389 North, 117.988611 West inside the sleeping dormitory at 17631 Cameron Lane. Photo 1 and Photo 2 show heavily corroded steel perimeter anchor bolts driven directly through the blue-painted 2-inch asphalt floor cap beneath Elizabeth Petruccio and Anthony DiMarcello’s beds, with white mineral efflorescence crusting around the unsealed penetrations. Photo 3 through Photo 5 document peeling black adhesive tape used as an improvised floor seal and raw sub-slab sand intruding directly onto the sleeping bay floor. Photo 6 captures 62-year-old disabled resident Elizabeth Petruccio on November 7, 2023 forced to sweep raw sub-slab sand and contaminated soil from underneath her own bed with a broom and dustpan—occurring 66 days before her emergency ICU admission and 11 full months before October 2024. Furthermore, Exhibit mercy house 44 proves that an expired 2020 Temporary Certificate of Occupancy remained posted above the shelter exit as late as April 4, 2025 alongside rusted structural panels and mold.',
    targetAppTab: 'evidence-law-hybrid',
    targetElementId: 'evidence-law-hybrid-root',
    evidenceModalTarget: 'HB_Shelter_Nov2023_photo_01.jpg',
    durationMs: 96000,
    evidencePath: 'HB_Shelter_Nov2023_photo_01.jpg – photo_08.jpg (EXIF GPS 33.706389, -117.988611) · mercy_house_044.jpg',
    primaryExhibits: [
      {
        filename: 'HB_Shelter_Nov2023_photo_01.jpg',
        label: 'Nov 7, 2023 Photo 1: Corroded Bolt Puncturing Cap Under Bed',
        url: '/evidence/HB_Shelter_Nov2023_photo_01.jpg',
        type: 'image',
        dateOrCitation: '2023-11-07 12:20:47 PST · GPS 33.706389, -117.988611 · SHA256 063c0b7a',
        caption: 'Corroded perimeter anchor bolt driven through blue-painted asphalt floor cap directly beneath resident sleeping area.',
        keyQuote: 'EXIF Verified: Samsung SM-T580 · Nov 7, 2023 12:20:47 PM · 33.706389, -117.988611.',
      },
      {
        filename: 'HB_Shelter_Nov2023_photo_03.jpg',
        label: 'Nov 7, 2023 Photo 3: Failed Seal & Sub-Slab Soil Intrusion',
        url: '/evidence/HB_Shelter_Nov2023_photo_03.jpg',
        type: 'image',
        dateOrCitation: '2023-11-07 12:20:57 PST · GPS 33.706389, -117.988611 · SHA256 88a81c15',
        caption: 'Unsealed base perimeter with raw sub-slab sand and particulate soil emerging onto the sleeping floor.',
      },
      {
        filename: 'HB_Shelter_Nov2023_photo_06.jpg',
        label: 'Nov 7, 2023 Photo 6: Sweeping Raw Sub-Slab Soil Under Bed',
        url: '/evidence/HB_Shelter_Nov2023_photo_06.jpg',
        type: 'image',
        dateOrCitation: '2023-11-07 12:32:42 PST · GPS 33.706389, -117.988611 · SHA256 da79eac1',
        caption: 'Elizabeth Petruccio sweeping raw sub-slab sand and soil with broom and dustpan beneath beds 66 days before ICU admission.',
      },
      {
        filename: 'mercy_house_044.jpg',
        label: 'Expired 2020 Temporary Certificate of Occupancy (mercy_house_044.jpg)',
        url: '/evidence/mercy_house_044.jpg',
        type: 'image',
        dateOrCitation: 'Photographed April 4, 2025 · mercy_house_044.jpg',
        caption: 'Expired 2020 Temporary Certificate of Occupancy still posted above exit sign alongside rusted panels.',
      },
    ],
    controllingStatutes: [
      'Cal. Gov. Code § 835 (Actual & Constructive Notice of Cap Breach)',
      'Cal. Civ. Code § 1714 & § 1941.1 (Premises Liability & Habitability)',
      '42 U.S.C. § 6972(a)(1)(B) (Completed Exposure Pathway)',
    ],
    buttonSequence: [
      'Photo 1: Corroded Anchor Bolt Breach (12:20:47 PM EXIF)',
      'Photo 3: Peeling Tape & Sub-Slab Sand Intrusion (12:20:57 PM)',
      'Photo 6: Broom & Dustpan Sub-Slab Soil Cleanup (66 Days Pre-ICU)',
      'Exhibit mercy_house_044.jpg: Expired 2020 Certificate of Occupancy',
    ],
    metrics: [
      { label: 'Capture Date', value: 'Nov 7, 2023', accent: 'emerald' },
      { label: 'EXIF GPS', value: '33.7063, -117.9886', accent: 'cyan' },
      { label: 'Photo Series', value: '8 High-Res Exhibits', accent: 'purple' },
      { label: 'Lead Time', value: '66 Days Pre-ICU', accent: 'red' },
    ],
  },
  {
    id: 'ACT_5_SCRIPPS_EHR_ICU_LOCKOUT_AND_MD_OMISSION',
    actNumber: '5',
    featureBadge: 'EXHIBITS: SCRIPPS MERCY EHR (1,428 PAGES) · PAGES 985, 1034, 1051, 785',
    title: 'Act 5: Scripps Mercy EHR — 103,752 WBC Empyema, ICU Expulsion & Chart Omission',
    subtitle: 'Scripps Mercy EHR · 103,752 WBC Empyema · 160 lb → 116 lb · 3 SW Notes vs. 25+ Physician Notes',
    narrative:
      'In Act 5, the system audits the 1,428-page Scripps Mercy Hospital Electronic Health Record for Elizabeth Tina Petruccio, admitted January 12, 2024 following her sub-slab exposure at 17631 Cameron Lane. Laboratory and imaging records confirm acute respiratory failure with hypoxia, bilateral cavitary pneumonia, a massive loculated right pleural empyema with a pleural fluid white blood cell count of 103,752 at 94 percent neutrophils, septic shock, endotracheal intubation, severe protein-calorie malnutrition collapsing her weight from 160 pounds to 116 pounds, and C4-C5 vertebral osteomyelitis and discitis across 62 consecutive days institutionalized through March 14, 2024. Forensic audit of the chart exposes a stark institutional disconnect: on page 1051, registered nurse Channy documented shelter residency on January 13; on page 1034, licensed clinical social worker Ada R. recorded in all-capital letters on January 15: SHELTER HISTORY: HB Navigation Center; and on page 985, social worker Bettina S. documented on January 19 that the shelter terminated Elizabeth’s bed while she was intubated in the ICU because her hospital stay exceeded 7 days and barred her from returning for 30 days. Yet across 25 consecutive physician progress notes from pages 654 to 983, doctors copy-forwarded the false phrase unsheltered or squatting in abandoned buildings, omitting the municipal shelter entirely and preventing an inpatient occupational and environmental toxicology workup.',
    targetAppTab: 'evidence-law-hybrid',
    targetElementId: 'evidence-law-hybrid-root',
    evidenceModalTarget: 'scripps_ehr_page_985.png',
    durationMs: 102000,
    evidencePath: '1.E.Petruccio Patient Health.pdf · scripps_ehr_page_985.png, 1034.png, 1051.png, 785.png',
    primaryExhibits: [
      {
        filename: 'scripps_ehr_page_985.png',
        label: 'Scripps EHR Page 985: ICU Expulsion & 30-Day Re-Entry Ban (01/19/2024)',
        url: '/evidence/scripps_ehr_page_985.png',
        type: 'image',
        dateOrCitation: 'Scripps Mercy EHR p. 985 · Bettina S., SW (01/19/2024)',
        caption: 'Hospital social work record documenting that HB Navigation Center exited Ms. Petruccio while in the ICU and barred her for 30 days.',
        keyQuote: 'Page 985 (01/19/2024): Exited due to hospitalization >7 days; must wait 30 days before returning.',
      },
      {
        filename: 'scripps_ehr_page_1034.png',
        label: 'Scripps EHR Page 1034: "SHELTER HISTORY: HB Navigation Center" (01/15/2024)',
        url: '/evidence/scripps_ehr_page_1034.png',
        type: 'image',
        dateOrCitation: 'Scripps Mercy EHR p. 1034 · Ada R., LCSW (01/15/2024)',
        caption: 'Licensed Clinical Social Worker explicitly documents HB Navigation Center residency in capital letters.',
        keyQuote: 'Page 1034 (01/15/2024): "SHELTER HISTORY: HB Navigation Center" — omitted from all 25+ physician progress notes (pp. 654–983).',
      },
      {
        filename: 'scripps_ehr_page_1051.png',
        label: 'Scripps EHR Page 1051: Nursing Admission Note (01/13/2024)',
        url: '/evidence/scripps_ehr_page_1051.png',
        type: 'image',
        dateOrCitation: 'Scripps Mercy EHR p. 1051 · Channy RN (01/13/2024)',
        caption: 'Initial nursing documentation recording family report of staying at Huntington Beach homeless shelter and prior Nov 2023 Hoag admission.',
      },
      {
        filename: 'scripps_ehr_page_785.png',
        label: 'Scripps EHR Page 785: Physician Note Omission ("Unsheltered / Squatting")',
        url: '/evidence/scripps_ehr_page_785.png',
        type: 'image',
        dateOrCitation: 'Scripps Mercy EHR pp. 654–983 (Representative Physician Note)',
        caption: 'Demonstrates the clinical chart disconnect where physician notes repeated "unsheltered" while omitting the contaminated shelter.',
      },
    ],
    controllingStatutes: [
      '42 U.S.C. § 12132 & 28 C.F.R. § 35.130(b)(7) (ADA Title II Medical Exit Ban)',
      '42 U.S.C. § 3604(f)(3)(B) (Fair Housing Act Reasonable Accommodation)',
      'Cal. Welf. & Inst. Code § 15657 (EADACPA Dependent Adult Reckless Neglect)',
      '45 C.F.R. § 164.526 (HIPAA Right to Amend Incorrect EHR)',
    ],
    buttonSequence: [
      'EHR Page 985: Exited While in ICU + 30-Day Bar (01/19/2024)',
      'EHR Page 1034: "SHELTER HISTORY: HB Navigation Center" (01/15/2024)',
      'EHR Page 1051: Channy RN Shelter Intake Note (01/13/2024)',
      'EHR Page 785: 25+ Physician Notes Omission Contrast',
    ],
    metrics: [
      { label: 'Pleural WBC', value: '103,752 (94% Neut)', accent: 'red' },
      { label: 'Weight Collapse', value: '160 lb → 116 lb', accent: 'purple' },
      { label: 'EHR Disconnect', value: '3 SW Notes vs 0 MD', accent: 'amber' },
      { label: 'ICU Penalty', value: 'Exited + 30-Day Ban', accent: 'red' },
    ],
  },
  {
    id: 'ACT_6_SIX_RESIDENTS_CLUSTER_AND_FATALITIES',
    actNumber: '6',
    featureBadge: 'CLINICAL CLUSTER · 6 HOSPITALIZED RESIDENTS & 2 DOCUMENTED DEATHS',
    title: 'Act 6: Six-Resident Hospitalization Cluster & Two Documented Deaths',
    subtitle: 'Petruccio · DiMarcello · Jesse Knabb · Burt Bell (Deceased) · Brian Bell (Deceased) · Curtis Simcox',
    narrative:
      'In the Master Record People and Clinical Cohort matrix, OSINT Neo AI demonstrates that Elizabeth Petruccio’s catastrophic illness was not an isolated medical event, but part of a six-resident hospitalization cluster and two documented deaths inside the exact same Sprung tent structure within 14 months. Resident 1, relator Anthony Michael DiMarcello III, suffered bilateral lower-lobe pulmonary infiltrates, left pleural effusion, non-healing cellulitis, and four fractured left ribs with permanent shoulder disability after Mercy House security guards violently ejected him into traffic while he tried to retrieve his hospitalized mother’s belongings. Resident 2, his mother Elizabeth Petruccio, suffered the 103,752 white blood cell pleural empyema, sepsis, intubation, and spinal osteomyelitis. Resident 3, lead federal plaintiff Jesse Knabb in Case 8:26-cv-00348-JWH-ADS, suffered acute chemical pneumonitis and loculated pleural empyema requiring thoracentesis after sleeping over the same floor. Resident 4, Burt Bell in Bed 91, was exited while hospitalized on the exact same day as Anthony and died in hospital custody—his April 11, 2024 official death certificate confirms pneumonia with environmental respiratory vulnerability. Resident 5, Brian Bell, submitted a January 20, 2025 shelter grievance left completely blank in the staff resolution section before dying at the Oasis facility. Resident 6, Curtis Simcox, was hospitalized with acute myocardial injury and a Troponin I spike at 6.300.',
    targetAppTab: 'master',
    targetElementId: 'people-section',
    evidenceModalTarget: '02_The_Record.md',
    durationMs: 100000,
    evidencePath: '02_The_Record.md · SAVC ECF 115 ¶¶ 11–13 · Opp. MTD ECF 130 Ex. J-1',
    primaryExhibits: [
      {
        filename: '02_The_Record.md',
        label: 'Part B: Six-Resident Clinical & Pathology Matrix (02_The_Record.md)',
        url: '/evidence/02_The_Record.md',
        type: 'text',
        dateOrCitation: '02_The_Record.md · Part B (Residents 1–6)',
        caption: 'Side-by-side clinical comparison of Petruccio, DiMarcello, Knabb, Burt Bell, Brian Bell, and Curtis Simcox.',
        keyQuote: '6 residents in one Sprung structure hospitalized with pneumonia, pleural effusion/empyema, sepsis, or acute cardiac injury; 2 fatalities.',
      },
      {
        filename: '08_Mother_Behavioral_Change_Workup.md',
        label: 'Medical & Longitudinal Decline Workup (Elizabeth Petruccio)',
        url: '/evidence/08_Mother_Behavioral_Change_Workup.md',
        type: 'text',
        dateOrCitation: 'Dossier File 8 · Medical Workup',
        caption: 'Detailed tracking of respiratory, spinal (C4–C5 discitis-osteomyelitis), and physical decline from 160 lb baseline.',
      },
    ],
    controllingStatutes: [
      'Cal. Welf. & Inst. Code §§ 15610.57, 15657 (Dependent Adult Neglect & Survival Claims)',
      'Cal. Code Civ. Proc. § 377.60 (Wrongful Death & Coroner Cluster Corroboration)',
      'Fed. R. Evid. 404(b) / 406 (Pattern, Habit & Common Environmental Exposure)',
    ],
    buttonSequence: [
      'Resident 1: Relator Anthony DiMarcello III (Pleural Effusion & Rib/Shoulder Trauma)',
      'Resident 2: Elizabeth Petruccio (103,752 WBC Empyema, Intubation, 160→116 lb)',
      'Resident 3: Jesse Knabb (Lead Federal Plaintiff / Chemical Pneumonitis & Empyema)',
      'Residents 4 & 5: Burt Bell (Bed 91 Coroner Pneumonia Death) & Brian Bell (Deceased)',
      'Resident 6: Curtis Simcox (Acute Troponin I 6.300 Cardiac Injury)',
    ],
    metrics: [
      { label: 'Cluster Size', value: '6 Residents', accent: 'purple' },
      { label: 'Fatalities', value: '2 Documented Deaths', accent: 'red' },
      { label: 'Bed #91 Nexus', value: 'Burt & Brian Bell', accent: 'amber' },
      { label: 'Simcox Troponin', value: '6.300 (Acute MI)', accent: 'cyan' },
    ],
  },
  {
    id: 'ACT_7_VOID_AB_INITIO_DEALS_AND_FORM700',
    actNumber: '7',
    featureBadge: 'TOOL: FORM 700 & 2 VOID AB INITIO DEALS COMPARATOR · $326.1M TOTAL',
    title: 'Act 7: Form 700 Omissions, Two Void Ab Initio Deals & Thomson v. Call',
    subtitle: 'HBNC ($6.09M / Yamada 0 Form 700s) vs. Angel Stadium ($320M / USA v. Sidhu) Before Judge Holcomb',
    narrative:
      'Opening the Form 700 and Two Void Ab Initio Public Land Deals Comparator tool, the system exposes the structural financial corruption behind the contaminated parcel. Orange County Environmental Management Agency subdivision engineer Mitsuru Yamada held concurrent private trustee ownership on reciprocal easement UPX1978058 across the 17631 Cameron Lane and 17642 Beach Boulevard footprint while filing zero Fair Political Practices Commission Form 700 Statements of Economic Interest across the 6,094,847-dollar municipal shelter allocation. Under California Government Code Section 1090, Political Reform Act Section 87100, and the California Supreme Court’s landmark ruling in Thomson v. Call, 38 Cal.3d 633, any public land deal or contract tainted by an undisclosed financial conflict of interest is void ab initio—legally nonexistent from inception—mandating 100 percent strict disgorgement of public funds and municipal retention of title. Under Lewis and Queen v. N. M. Ball Sons, 48 Cal.2d 141, the court is bound by an affirmative sua sponte duty to refuse enforcement of a void contract even if not pleaded. Under Federal Rule of Evidence 201, the comparator establishes that the exact same federal judge presiding over the Huntington Beach case—the Honorable John W. Holcomb—also presided over Anaheim Mayor Harry Sidhu’s federal corruption guilty plea in United States v. Sidhu, Case 8:23-cr-00114-JWH, which voided the 320-million-dollar Angel Stadium land sale just 24 hours after relator Anthony DiMarcello’s May 23, 2022 cryptographic SHA-256 disclosure.',
    targetAppTab: 'void-deals',
    targetElementId: 'void-deals-root',
    evidenceModalTarget: '06_Relator_Protection_Record.md',
    durationMs: 102000,
    evidencePath: 'USA v. Sidhu (8:23-cr-00114-JWH) · Knabb v. HB (8:26-cv-00348-JWH-ADS) · Thomson v. Call',
    primaryExhibits: [
      {
        filename: '06_Relator_Protection_Record.md',
        label: 'False Claims Act Relator Record & Cryptographic Seniority',
        url: '/evidence/06_Relator_Protection_Record.md',
        type: 'text',
        dateOrCitation: 'May 23, 2022 SHA-256: cc5d02b68f4c7c69b2be61f1fe906a8a1962704531ee443a01ce07faf0576834',
        caption: 'Establishes relator priority 24 hours before Anaheim City Council voided the $320M Angel Stadium deal.',
        keyQuote: 'Thomson v. Call (1985) 38 Cal.3d 633: 100% strict disgorgement of public funds on Gov. Code § 1090 void ab initio contracts.',
      },
      {
        filename: 'Addl_Aug2020_Fig1_SiteLocation_BeachBlvd-010.png',
        label: 'Adjacent Parcel 17642 Beach Blvd & Reciprocal Easement Footprint',
        url: '/evidence/Addl_Aug2020_Fig1_SiteLocation_BeachBlvd-010.png',
        type: 'image',
        dateOrCitation: '17631 Cameron Ln & 17642 Beach Blvd · UPX1978058',
        caption: 'Site map showing adjacency of 17631 Cameron Lane shelter parcel and 17642 Beach Boulevard easement.',
      },
    ],
    controllingStatutes: [
      'Cal. Gov. Code § 1090 & § 87100 (FPPC Form 700 Conflict of Interest)',
      'Thomson v. Call (1985) 38 Cal.3d 633 (100% Strict Disgorgement)',
      'Lewis & Queen v. N. M. Ball Sons (1957) 48 Cal.2d 141 (Sua Sponte Judicial Duty)',
      'Fed. R. Evid. 201 (Cross-Case Judicial Notice Before Hon. John W. Holcomb)',
    ],
    buttonSequence: [
      'Tool: Form 700 & Two Void Ab Initio Deals Comparator ($326.1M)',
      'Deal 1: HBNC $6.09M Allocation & Mitsuru Yamada 0 Form 700 Filings',
      'Deal 2: Anaheim $320M Angel Stadium Voidance & Sidhu Guilty Plea (Judge Holcomb)',
      'Precedent: Thomson v. Call Disgorgement & May 23, 2022 Relator Hash',
    ],
    metrics: [
      { label: 'Deal 1 (HBNC)', value: '$6,094,847 Void', accent: 'red' },
      { label: 'Deal 2 (Angels)', value: '$320,000,000 Void', accent: 'purple' },
      { label: 'Yamada Form 700s', value: '0 Filings Found', accent: 'amber' },
      { label: 'Disgorgement', value: '100% Strict (Thomson)', accent: 'emerald' },
    ],
  },
  {
    id: 'ACT_8_MALTEGO_CANVAS_LINK_ANALYSIS',
    actNumber: '8',
    featureBadge: 'TOOL: 617-ENTITY RICO GRAPH, 3D HOLO-CHAMBER, MAPS & PUBCHEM SUITE',
    title: 'Act 8: 617-Entity RICO Graph, 3D Holo-Chamber, Search/Maps Grounding & PubChem Suite',
    subtitle: '617 Forensic Nodes & 615 Causal Edges · 3D Three.js Plume & Holo-Chamber · PubChem & 4K Diagram Gen',
    narrative:
      'In Act 8, the presentation launches the unified Evidence and Forensic Graph Intelligence Suite, combining our 617-entity RICO network topology across 615 directional causal links with the 15-node core causal graph, the 3D WebGL Holo-Chamber, the 3D Subsurface Plume Visualizer, and the GIS Satellite Map. Investigators and attorneys can inspect any of the 617 entities—including municipal officials, shell companies, permits, hospital records, and injured or deceased residents—run Dijkstra shortest-path routing, isolate critical RICO hubs, or trigger three automated causal trace chains. Trace 1 highlights the environmental exposure pathway from GeoTracker plume T10000018579 at 980 micrograms per kilogram and County condition navigation center 3, through City Contract 5406552’s expired 1-year warranty and the November 7, 2023 under-bed floor breach, directly to the six-resident hospitalization cluster and two fatalities. Trace 2 illuminates the 326.1-million-dollar Form 700 Void Ab Initio axis linking Mitsuru Yamada’s undisclosed easement ownership and Mayor Harry Sidhu’s federal conviction before Judge John W. Holcomb. Trace 3 maps the retaliation and ADA lockout chain from relator Anthony DiMarcello’s November 7 breach photographs to the January 19 ICU expulsion on Scripps EHR page 985, while integrated Google Search Grounding, Maps Geospatial Grounding, 4K Courtroom Diagram Generation, and PubChem NPDES Toxicology panels provide live external verification.',
    targetAppTab: 'maltego',
    targetElementId: 'maltego-graph-root',
    evidenceModalTarget: 'SAR_June2020_Fig1_SiteLocation_Cameron-019.png',
    durationMs: 102000,
    evidencePath: '617-Entity RICO Graph · 3D Holo-Chamber · Maps & Search Grounding · PubChem Toxicology',
    primaryExhibits: [
      {
        filename: 'SAR_June2020_Fig1_SiteLocation_Cameron-019.png',
        label: 'Geospatial & Infrastructure Node Overlay (17631 Cameron Ln)',
        url: '/evidence/SAR_June2020_Fig1_SiteLocation_Cameron-019.png',
        type: 'image',
        dateOrCitation: 'GeoTracker T10000018579 · Spatial Link Node',
        caption: 'Geospatial anchor linking 17631 Cameron Lane, 17642 Beach Blvd, Well W-4150, and Walgreens #05771.',
      },
      {
        filename: '07_Master_Chronology_and_Retaliation_Log.md',
        label: 'Master Chronology & Retaliation Vector Log (2021–2026)',
        url: '/evidence/07_Master_Chronology_and_Retaliation_Log.md',
        type: 'text',
        dateOrCitation: 'Dossier File 7 · Master Chronology',
        caption: 'Complete chronological edge list connecting the August 2021 lockout stay order through 2026 federal filings.',
      },
    ],
    controllingStatutes: [
      '18 U.S.C. §§ 1343, 1346, 1962 (Wire Fraud & Civil RICO Enterprise Topology)',
      '31 U.S.C. §§ 3729, 3730(h) (False Claims Act & Relator Retaliation)',
      '42 U.S.C. § 1983 (First & Fourteenth Amendment Retaliation & Monell)',
    ],
    buttonSequence: [
      'Tool: 617-Entity RICO Network Canvas & 15-Node Core Causal Graph',
      'Trace 1: 49× Cr(VI) Plume → 1-Yr Cap → Nov 7 Breach → ICU Cluster',
      'Trace 2: Yamada 0 Form 700s → Sidhu Parallel → Thomson v. Call',
      '3D Holo-Chamber, Search/Maps Grounding, 4K Diagram & PubChem Toxicology',
    ],
    metrics: [
      { label: 'Full Network', value: '617 Nodes / 615 Links', accent: 'cyan' },
      { label: 'Core Causal', value: '15 Nodes / 18 Links', accent: 'emerald' },
      { label: '3D Engines', value: 'Holo-Chamber + Plume', accent: 'purple' },
      { label: 'Live Grounding', value: 'Search · Maps · PubChem', accent: 'amber' },
    ],
  },
  {
    id: 'ACT_9_AILAWS_STATUTORY_MATRIX_AND_DEMAND_GEN',
    actNumber: '9',
    featureBadge: 'TOOL: /AILAWS LEGAL MATRIX, 4 DEMAND GENERATORS & GEMINI AI ASSISTANT',
    title: 'Act 9: The /ailaws Legal Matrix, 4 Demand Generators & AI Dossier Assistant',
    subtitle: '8 Fee-Shifting Causes of Action · 4 Ready-to-Serve Legal Notices · Gemini 4 Argon / 3.1 Pro Assistant',
    narrative:
      'In Act 9, we examine how the AI Laws Legal Matrix empowers the relator and unrepresented victims who have been denied help by traditional institutions. The workspace maps eight distinct fee-shifting federal and California causes of action element-by-element against primary documentary proof: first, Americans with Disabilities Act Title II, 42 U.S.C. 12132, and Rehabilitation Act Section 504 for exiting a disabled resident because she was intubated in the ICU; second, Fair Housing Act 42 U.S.C. 3604(f) for refusal to grant a medical bed-hold accommodation; third, Resource Conservation and Recovery Act Citizen Suit 42 U.S.C. 6972(a)(1)(B) for imminent and substantial toxic endangerment; fourth, California Government Code Section 835 for dangerous condition of public property; fifth, Welfare and Institutions Code Section 15657 Elder and Dependent Adult Abuse carrying unilateral plaintiff attorney fee-shifting; sixth, 42 U.S.C. 1983 Monell municipal liability; seventh, Unruh and Tom Bane Civil Rights Acts under Civil Code Sections 51 and 52.1; and eighth, False Claims Act and First Amendment whistleblower retaliation. Directly below the matrix, four one-click formal legal notice generators produce ready-to-serve documents—a Co-Counsel Intake Memorandum, an ADA and FHA Emergency Bed-Hold Demand, a formal HIPAA 45 CFR 164.526 Medical Record Amendment Demand to Scripps Mercy Health Information Management, and a Municipal Evidence Spoliation Hold—paired with the live Gemini AI Dossier Assistant for instant statutory querying.',
    targetAppTab: 'ailaws',
    targetElementId: 'ailaws-root',
    evidenceModalTarget: '03_Law_and_Remedies.md',
    durationMs: 105000,
    evidencePath: '03_Law_and_Remedies.md · 04_Outreach_Pack.md · /ailaws.html Matrix',
    primaryExhibits: [
      {
        filename: '03_Law_and_Remedies.md',
        label: 'Complete Statutory Analysis, Tolling Rules & Fee-Shifting Remedies',
        url: '/evidence/03_Law_and_Remedies.md',
        type: 'text',
        dateOrCitation: 'Dossier File 3 · Law and Remedies',
        caption: 'Element-by-element breakdown of federal and California claims, limitation periods, and fee-shifting statutes.',
        keyQuote: 'All 8 causes of action carry statutory attorney fee-shifting (42 U.S.C. § 12205, § 3613(c), § 6972(e), Welf. & Inst. § 15657).',
      },
      {
        filename: '04_Outreach_Pack.md',
        label: '10 Ready-to-Send Agency & Counsel Transmittal Letters',
        url: '/evidence/04_Outreach_Pack.md',
        type: 'text',
        dateOrCitation: 'Dossier File 4 · Outreach Pack',
        caption: 'Formal notices prepared for Legal Aid, Disability Rights California, HUD FHEO, OC Adult Protective Services, and DTSC.',
      },
    ],
    controllingStatutes: [
      '42 U.S.C. § 12205 & 29 U.S.C. § 794a (Mandatory ADA/§504 Attorney Fees)',
      '42 U.S.C. § 3613(c) & § 6972(e) (FHA & RCRA Fee-Shifting)',
      'Cal. Welf. & Inst. Code § 15657(a) (Unilateral Plaintiff Fee-Shifting)',
      'Cal. Civ. Code §§ 52(a), 52.1 (Treble Damages & Statutory Penalties)',
    ],
    buttonSequence: [
      'Tool: /ailaws Statutory Proof Matrix (8 Fee-Shifting Claims)',
      'Generator 1 & 2: Counsel Intake Memo & ADA/FHA Bed-Hold Demand',
      'Generator 3: HIPAA 45 C.F.R. § 164.526 Scripps EHR Amendment Demand',
      'Generator 4 & AI Assistant: Spoliation Hold + Live Gemini Legal Query',
    ],
    metrics: [
      { label: 'Total Causes', value: '8 Mapped Claims', accent: 'cyan' },
      { label: 'Fee-Shifting', value: 'ADA, FHA, RCRA, §15657', accent: 'emerald' },
      { label: 'Notice Templates', value: '4 Instant Generators', accent: 'purple' },
      { label: 'Clocks', value: 'CCP §335.1 / Gov §911.2', accent: 'red' },
    ],
  },
  {
    id: 'ACT_10_CRYPTO_TRANSPARENCY_TOKEN_AND_WEB3_ESCROW',
    actNumber: '10',
    featureBadge: 'TOOL: TRANSPARENCY TOKEN (TFT / PAT / OSINT) · SEPOLIA 40/30/30 ESCROW & ERROR COIN',
    title: 'Act 10: Transparency Token (TFT / PAT / OSINT), Sepolia 40/30/30 Escrow & Error Coin',
    subtitle: '5 Verified Sepolia Smart Contracts · StakingGate (100 OSINT) · MultiPoolEscrow (40/30/30) · Law 16 Error Coin',
    narrative:
      'In Act 10, the system opens the built-in Web3 Crypto and Transparency Token Intelligence Exchange deployed on the Ethereum Sepolia Testnet across five verified smart contracts. Under our foundational Truth and Transparency architecture, Truth and Accuracy are validated through the Three-Gate Trinity of Physics, Probability, and Reversion to Mean, while Transparency is enforced on-chain through our Dual Audit Token System. First, the Tax-Funded Transparency Token, TFT, at contract 0x0977909b254EC33C4D1039135F351B1d3Fb27F14 with a 10-million-token pool, and the Public Audit Token, PAT, mint 100 PAT for every 1,000 dollars of verified taxpayer waste exposed—including 609,400 PAT minted for the void 6.09-million-dollar Huntington Beach shelter allocation and 32 million PAT for the void 320-million-dollar Anaheim stadium deal, bridged autonomously to taxfunded.osintneoai.me via AutonomousTaxFundedBridge.sol. Second, OSINT Coin at 0xA74B3fAfd838fC273f7c6e201B6210AC2b3A0296 powers the StakingGate Sybil-defense contract at 0xdA7655b7007a1C7F8191066Bb9A69E4D8987E725, requiring a 100 OSINT stake per evidentiary submission that is refunded with plus-10 reputation upon Trinity verification or slashed for fabricated noise. Third, MultiPoolEscrow at 0x15564C9A8a5903336CC67F2cBa00dBdAd944dC5B executes deterministic UTXO lineage traversal to split USDC bounties at 0x7236F4982a31537d07f3182A1CdAD3f3E4452A53 automatically: 40 percent to the Catalyst whistleblower, 30 percent to Corroborators, and 30 percent to the Closer—while Universal AI Law 16 enforces the Error Coin accountability ledger.',
    targetAppTab: 'crypto-transparency',
    targetElementId: 'crypto-transparency-root',
    evidenceModalTarget: '06_Relator_Protection_Record.md',
    durationMs: 108000,
    evidencePath: 'Sepolia TFT 0x0977...7F14 · OSINT 0xA74B...0296 · Escrow 0x1556...dC5B · StakingGate 0xdA76...E725',
    primaryExhibits: [
      {
        filename: '06_Relator_Protection_Record.md',
        label: 'Relator Cryptographic Priority & On-Chain SHA-256 Proof (May 23, 2022)',
        url: '/evidence/06_Relator_Protection_Record.md',
        type: 'text',
        dateOrCitation: 'SHA-256: cc5d02b68f4c7c69b2be61f1fe906a8a1962704531ee443a01ce07faf0576834',
        caption: 'Anchors Relator Anthony DiMarcello III as the 40% Catalyst genesis node in the MultiPoolEscrow UTXO lineage graph.',
        keyQuote: 'MultiPoolEscrow (0x15564C9A8a5903336CC67F2cBa00dBdAd944dC5B): 40% Catalyst / 30% Corroborator / 30% Closer USDC Split.',
      },
      {
        filename: '5406552_viewer.png',
        label: 'Laserfiche #5406552 ($2,410,716.24) — Anchored in DualAuditTokenSystem.sol',
        url: '/evidence/5406552_viewer.png',
        type: 'image',
        dateOrCitation: 'TFT Proof #1 · 241,000 PAT Minted',
        caption: 'Municipal contract proof anchored on-chain via TaxFundedToken (TFT) and PublicAuditToken (PAT).',
      },
    ],
    controllingStatutes: [
      '31 U.S.C. § 3730(b)–(d) (False Claims Act Relator Bounty & UTXO 40/30/30 Split)',
      'Cal. Gov. Code § 1090 / Thomson v. Call (100% Disgorgement Anchored in PAT)',
      'Universal AI Law 16 (Error Coin / AI Swear Jar Accountability Ledger)',
    ],
    buttonSequence: [
      'Tool: Transparency Token (TFT / PAT) & OSINT Coin Dual-Token Hub',
      '5 Verified Sepolia Smart Contracts: TFT, OSINT, USDC, StakingGate & MultiPoolEscrow',
      'UTXO 40/30/30 Bounty Split Simulator & 100 OSINT Sybil StakingGate',
      'AutonomousTaxFundedBridge.sol & Law 16 Error Coin Ledger ($1,550.00)',
    ],
    metrics: [
      { label: 'Sepolia Contracts', value: '5 Verified Live', accent: 'amber' },
      { label: 'TFT Pool / PAT', value: '10M TFT / 609K PAT', accent: 'emerald' },
      { label: 'UTXO Escrow Split', value: '40% / 30% / 30%', accent: 'cyan' },
      { label: 'Sybil StakingGate', value: '100 OSINT Stake', accent: 'purple' },
    ],
  },
  {
    id: 'ACT_11_OUTREACH_SCREENER_AND_EVIDENCE_LOCKER',
    actNumber: '11',
    featureBadge: 'TOOLS: OUTREACH (184) · OSINT (15,320) · SCREENER · READ-ONLY + LIVE .ZIP LOCKER',
    title: 'Act 11: Outreach Telemetry, OSINT Library, Screener & Live File / .ZIP Incorporation',
    subtitle: '184 Dispatches · GAO #COMP-26-004512 · 15,320 OSINT Records · Read-Only Master + Live Upload Engine',
    narrative:
      'In our final act, we review the four remaining operational tools that complete the OSINT Neo AI Command Center. First, the Outreach and Dispatch Telemetry Dashboard logs all 184 formal agency, legislative, oversight, and legal dispatches transmitted between 2021 and 2026—including 76 public agency filings, U.S. Government Accountability Office FraudNet control docket COMP-26-004512 auditing 598.7 million dollars in federal homelessness funds, and FBI public corruption control record 20IC002—proving exhaustive administrative diligence while tracking every non-responsive entity. Second, the OSINT Research Library indexes 15,320 cataloged files across 31 investigative repositories. Third, the No-Login Contamination Exposure Screener allows any former shelter resident, worker, or family member to check their symptoms against the six-resident clinical cohort, generate an anonymized HBNC Victim card on the Read-Only Comment Board, and transmit intake alerts directly to the case coordinator. Finally, in the Evidence Locker and Multi-Archive Hub, all 44 verified primary exhibits and 12 master dossier files are locked in Read-Only, Comment-Only protection so the core evidentiary record can never be altered or erased—while anyone can upload any type of file, photo, medical record, folder, or zip archive and watch their uploaded data unpack and incorporate live into the system to see immediate correlated results.',
    targetAppTab: 'locker',
    targetElementId: 'locker-root',
    evidenceModalTarget: '10_THE_ONE_EMAIL.md',
    durationMs: 110000,
    evidencePath: '10_THE_ONE_EMAIL.md · GAO COMP-26-004512 · FBI 20IC002 · Live .ZIP Unpacker',
    primaryExhibits: [
      {
        filename: '10_THE_ONE_EMAIL.md',
        label: 'Master Single-Email Transmittal Package (10_THE_ONE_EMAIL.md)',
        url: '/evidence/10_THE_ONE_EMAIL.md',
        type: 'text',
        dateOrCitation: 'Dossier File 10 · Master Transmittal',
        caption: 'Consolidated executive transmittal for civil rights counsel, federal investigators, and medical experts.',
        keyQuote: 'Read-Only / Comment-Only Master Archive + Live Universal File & .ZIP Upload Incorporation.',
      },
      {
        filename: '00_README_START_HERE.md',
        label: 'Master Dossier Index & Verification Protocol (00_README_START_HERE.md)',
        url: '/evidence/00_README_START_HERE.md',
        type: 'text',
        dateOrCitation: 'Dossier File 0 · Start Here Guide',
        caption: 'Complete orientation guide to the 12 companion files, 44 primary exhibits, and live upload verification.',
      },
    ],
    controllingStatutes: [
      '31 U.S.C. § 3730(b)(2) (FCA Relator Disclosure Protocol)',
      'GAO FraudNet Control Docket COMP-26-004512 ($598.7M Audit)',
      'FBI IC3 Public Corruption Control Record 20IC002',
    ],
    buttonSequence: [
      'Outreach Tool: 184 Logged Dispatches · GAO #COMP-26-004512 · FBI #20IC002',
      'OSINT Library Tool: 15,320 Cataloged Files Across 31 Repositories',
      'Victim Screener Tool: Read-Only Comment Board & Cohort Symptom Matcher',
      'Evidence Locker Tool: Read-Only Master Protection + Live Any-File / .ZIP Incorporation',
    ],
    metrics: [
      { label: 'Total Dispatches', value: '184 Logged Filings', accent: 'purple' },
      { label: 'GAO / FBI Dockets', value: 'COMP-26-004512 / 20IC002', accent: 'emerald' },
      { label: 'Master Record', value: 'Read-Only Protected', accent: 'cyan' },
      { label: 'Live Upload', value: 'Any File / .ZIP Ready', accent: 'amber' },
    ],
  },
];
