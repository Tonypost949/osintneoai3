import { ResidentProfile } from '../types';

export const SIX_DEMANDS = [
  {
    number: 1,
    title: 'Independent Causation Review',
    description: 'Conducted by an independent occupational/environmental medicine (OEM) physician and a certified industrial hygienist (CIH) not employed by the City, County, or Mercy House, provided with the complete 1,400+ page EHR and environmental Phase II file.',
    badge: 'Medical / Scientific',
  },
  {
    number: 2,
    title: 'Written Determination on the 1-Year Asphalt Cap',
    description: 'An official accounting of the required design life, ongoing maintenance obligations, post-acceptance inspections, and whether a formal Land Use Covenant (LUC) was ever recorded with DTSC.',
    badge: 'Regulatory / DTSC',
  },
  {
    number: 3,
    title: 'Written Reasonable Accommodation Determination',
    description: 'A formal determination for both claimants establishing that future disability-related medical absences or hospitalizations will never trigger an automatic 7-day bed forfeiture or 30-day exclusionary lockout.',
    badge: 'ADA / § 504 / FHA',
  },
  {
    number: 4,
    title: 'Legal Representation & Case Evaluation',
    description: 'Formal evaluation and representation by a civil rights, toxic tort, elder abuse, or public interest law firm with capacity to litigate municipal conditions and advance expert costs.',
    badge: 'Legal / Counsel',
  },
  {
    number: 5,
    title: 'Official Review of the Arrest & Warrant',
    description: 'Independent review of the criminal complaint mailed to a 2021 former address after protected whistleblower disclosures to federal and state agencies, examining potential retaliatory animus.',
    badge: 'Oversight / § 1983',
  },
  {
    number: 6,
    title: 'Supportive Housing Placement & Written Exclusion Reason',
    description: 'Immediate permanent supportive housing placement and a written accounting explaining why the only two continuous original shelter residents were never transitioned into Oasis housing.',
    badge: 'Housing Rights',
  },
];

export const SIX_RESIDENTS: ResidentProfile[] = [
  {
    id: 'res-anthony',
    name: 'Anthony Michael DiMarcello III',
    dob: '05/04/1983',
    role: 'Son & Caregiver',
    shelterPeriod: '2023 – 02/11/2024',
    hospitalizations: 'Hoag (03/24 & 03/28/2023); Hoag ED (02/11/2024); Hoag & Arrowhead (08/29–12/05/2024); UCI (12/14/2025)',
    documentedPathology: 'Pulmonary infiltrates, bronchiectasis, left pleural effusion, four fractured left ribs; non-healing MRSA cellulitis left leg; comminuted proximal humerus fracture with posterior dislocation resulting in permanent left shoulder disability; syncope with occipital laceration requiring 6 staples.',
    outcomeStatus: 'Permanently disabled shoulder; works one-handed; continuing pulmonary impairment.',
    evidenceFiles: ['Hoag_ED_2024.pdf', 'Arrowhead_discharge.pdf', 'UCI_radiology_2025.pdf'],
  },
  {
    id: 'res-elizabeth',
    name: 'Elizabeth Tina Petruccio',
    dob: '07/29/1964',
    role: 'Mother / Disabled 62-Year-Old Resident',
    shelterPeriod: 'Oct 2023 – Jan 2024',
    hospitalizations: 'Hoag (Nov 2023); Scripps Mercy (01/12–02/17/2024, 36 days); Mission Hills SNF (02/17–03/14/2024, 26 days)',
    documentedPathology: 'Atypical pneumonia J18.9 with reverse-halo RUL opacity & bilateral cavitary disease; right pleural empyema (103,752 WBC, 94% neutrophils, glucose <20) requiring chest tube thoracostomy; sepsis A41.9; acute hypercapnic respiratory failure J96.02 requiring intubation; C4–C5 discitis-osteomyelitis M46.22; severe cachexia with weight collapse from 160 lb baseline down to 116 lb.',
    outcomeStatus: '62 days institutionalized. Exited from shelter while in ICU and barred for 30 days.',
    evidenceFiles: ['1.E.Petruccio Patient Health.pdf', 'scripps_ehr_page_985.png', 'album7_photo_204.jpg'],
  },
  {
    id: 'res-jesse',
    name: 'Jesse Knabb',
    dob: '04/04/1978',
    role: 'Co-Resident / Lead Plaintiff (8:26-cv-00348)',
    shelterPeriod: 'Nov 2022 – Oct 2024',
    hospitalizations: '09/19–10/11/2023 (22 days inpatient); 10/15–10/24/2023 (9 days readmission 4 days post-discharge)',
    documentedPathology: 'Chemical pneumonitis, recurrent severe pneumonia, pleural effusion and empyema requiring thoracentesis; acute sepsis; renal impairment; microcytic anemia; eosinophilia.',
    outcomeStatus: 'Active federal relator/plaintiff in Knabb v. City of Huntington Beach (C.D. Cal.).',
    evidenceFiles: ['Knabb_hospital_2023.pdf', 'Opp_MTD_Ex_J1.pdf', 'SAVC_ECF_115.pdf'],
  },
  {
    id: 'res-burt',
    name: 'Burt Bell',
    dob: 'Deceased',
    role: 'Resident (Bed #91)',
    shelterPeriod: '2023 – Early 2024',
    hospitalizations: 'Admitted early 2024; died in hospital care.',
    documentedPathology: 'Community-acquired pneumonia with documented environmental respiratory vulnerability.',
    outcomeStatus: 'FATALITY. Amended Sheriff-Coroner certificate issued 04/11/2024. Exited from shelter while hospitalized, on same day as Mr. DiMarcello.',
    evidenceFiles: ['Coroner_Cert_04112024.pdf', 'Shelter_Bed_91_Log.pdf'],
  },
  {
    id: 'res-brian',
    name: 'Brian Bell',
    dob: 'Deceased',
    role: 'Resident (Bed #91 / Oasis)',
    shelterPeriod: '2024 – Jan 2025+',
    hospitalizations: 'Multiple emergency department admissions; transferred to Oasis supportive housing.',
    documentedPathology: 'Traumatic brain injury (TBI), four minor strokes, severe arthritis, progressive cognitive loss.',
    outcomeStatus: 'FATALITY. Died at Oasis supportive housing. Submitted formal grievance 01/20/2025 signed by staff; request-for-consideration follow-up page left completely blank.',
    evidenceFiles: ['Grievance_01202025.pdf', 'Oasis_Death_Investigation.pdf'],
  },
  {
    id: 'res-curtis',
    name: 'Curtis M. Simcox',
    dob: 'MRN 14017651',
    role: 'Resident',
    shelterPeriod: 'January 2025',
    hospitalizations: '01/19/2025 14:00 Emergency Admission',
    documentedPathology: 'Acute myocardial injury with Troponin I spiking to 6.300; monocytosis 13.4%.',
    outcomeStatus: 'Critical cardiac injury following acute shelter stay.',
    evidenceFiles: ['Simcox_EHR_14017651.pdf', 'Cardiac_Panel_01192025.pdf'],
  },
];

export const CONTAMINATION_TABLE = [
  { contaminant: 'Hexavalent Chromium, Cr(VI)', concentration: 'up to 980 µg/kg (range 200–980)', benchmark: 'DTSC Residential: 20 µg/kg', multiple: '49× Residential', tag: 'RECORD' },
  { contaminant: 'Hexavalent Chromium, Cr(VI)', concentration: 'up to 980 µg/kg', benchmark: 'DTSC Commercial/Industrial: 300 µg/kg', multiple: '3.27× Commercial', tag: 'RECORD' },
  { contaminant: 'Lead', concentration: '84.2 mg/kg (up to 145 mg/kg)', benchmark: 'DTSC Screening Guideline', multiple: 'Severely Elevated', tag: 'RECORD' },
  { contaminant: 'Arsenic', concentration: '9.36 mg/kg', benchmark: 'Regional Background Limit', multiple: 'Elevated Carcinogen', tag: 'RECORD' },
  { contaminant: 'Toxaphene', concentration: '500–1,600 µg/kg', benchmark: 'Pesticide Toxicity Benchmark', multiple: 'Elevated Persistent Organic', tag: 'RECORD' },
  { contaminant: '4,4\'-DDE', concentration: '3,100 µg/kg', benchmark: 'Organochlorine Screening Threshold', multiple: 'Elevated Pesticide Metabolite', tag: 'RECORD' },
  { contaminant: 'Sub-slab Soil Gas', concentration: 'PCE, TCE, Benzene detected', benchmark: 'OEHHA Inhalation Cancer Benchmarks', multiple: 'Vapor Intrusion Pathway', tag: 'RECORD' },
];

export const GROUNDWATER_TABLE = [
  { well: 'SMCMWC North Well', cr6: '0.95 µg/L', benchmark: 'OEHHA Public Health Goal 0.02 µg/L', multiple: '47.5×', tag: 'RECORD' },
  { well: 'Liberty Park Water Assn. Well 01 (CA3000618)', cr6: '0.41–1.30 µg/L (6 tests 2014–2026)', benchmark: '0.02 µg/L', multiple: '20.5–65×', tag: 'RECORD' },
  { well: 'OCWD Monitoring Well MW-42', cr6: '270 µg/L', benchmark: 'Groundwater Baseline Limit', multiple: '13,500× PHG', tag: 'RECORD' },
  { well: 'OCWD Monitoring Well MW-43B', cr6: '62 µg/L', benchmark: 'Groundwater Baseline Limit', multiple: '3,100× PHG', tag: 'RECORD' },
];

export const COMPANION_FILES = [
  { filename: '00_README_START_HERE.md', label: 'Start Here', badge: 'Start', type: 'md', desc: 'Case orientation, document catalog, and immediate reading directions.' },
  { filename: '01_Formal_Statement.md', label: 'Formal Statement', badge: 'Account', type: 'md', desc: 'Sworn factual account of residency, exposure, lockout, and hospitalizations.' },
  { filename: '02_The_Record.md', label: 'The Record', badge: 'Evidence', type: 'md', desc: 'Complete documentary inventory with Laserfiche, EHR, and PACER citations.' },
  { filename: '03_Law_and_Remedies.md', label: 'Law & Remedies', badge: 'Law', type: 'md', desc: 'In-depth statutory claims analysis, tolling rules, and damages.' },
  { filename: '04_Outreach_Pack.md', label: 'Outreach Pack', badge: 'Letters', type: 'md', desc: '10 ready-to-send agency letters (Legal Aid, DRC, HUD FHEO, APS, DTSC).' },
  { filename: '05_Protection_Plan.md', label: 'Protection Plan', badge: 'Safety', type: 'md', desc: 'Emergency protocols, medical binder guidelines, and law enforcement rules.' },
  { filename: '06_Relator_Protection_Record.md', label: 'Relator Protection', badge: 'FCA / § 3730', type: 'md', desc: 'False Claims Act seal protocol, anti-retaliation, and DOJ disclosures.' },
  { filename: '07_Master_Chronology_and_Index.md', label: 'Master Chronology', badge: 'Timeline', type: 'md', desc: 'Hour-by-hour and day-by-day sequence of events from 2021 to 2026.' },
  { filename: '08_Mother_Behavioral_Change.md', label: 'Medical Dossier', badge: 'Medical', type: 'md', desc: 'Detailed tracking of cognitive, physical, and respiratory decline.' },
  { filename: '09_EMERGENCY_PROTECTION.md', label: 'Emergency Protection', badge: 'Urgent', type: 'md', desc: 'Immediate emergency directives and crisis response coordination.' },
  { filename: '10_THE_ONE_EMAIL.md', label: 'The One Email', badge: 'Email', type: 'md', desc: 'Single comprehensive master transmittal email text for attorneys and agencies.' },
  { filename: '11_EMAIL_CALL_TO_ACTION.html', label: 'Action HTML', badge: 'CTA HTML', type: 'html', desc: 'Standalone formatted call-to-action email dispatch page.' },
];

export const VERIFICATION_REGISTER = [
  { item: 'Cr(VI) 980 µg/kg and 49× DTSC residential level', source: 'EEC Phase II (08/03/2020); SAVC ¶ 93', verified: 'YES (08/17/2026)', status: 'RECORD' },
  { item: 'Asphalt cover condition quoted verbatim', source: 'County Briefing navigation_center_003.jpg', verified: 'YES (08/20/2026)', status: 'RECORD' },
  { item: '1-year warranty and "not 40-hour trained" terms', source: 'City Contract Laserfiche #5406552; Proposal #20390', verified: 'YES (09/01/2026)', status: 'RECORD' },
  { item: 'Breach photos GPS, date & timestamp metadata', source: 'EXIF metadata of HB_Shelter_Nov2023_photo_01.jpg', verified: 'YES (11/07/2023)', status: 'RECORD' },
  { item: 'All hospitalization dates, intubation & empyema', source: 'Scripps Mercy & Mission Hills EHR; SAVC ¶¶ 11–13', verified: 'YES (01/12–03/14/2024)', status: 'RECORD' },
  { item: 'Social work shelter quotes on pages 985, 1034, 1051', source: '1.E.Petruccio Patient Health.pdf', verified: 'YES (01/19/2024)', status: 'RECORD' },
  { item: 'Absence of shelter from 25+ physician notes', source: '1.E.Petruccio Patient Health.pdf, pp. 654–983', verified: 'YES (Confirmed)', status: 'RECORD' },
  { item: '30-day exclusionary bar recorded in EHR', source: 'scripps_ehr_page_985.png', verified: 'YES (Bettina S., SW)', status: 'RECORD' },
  { item: 'Federal court filings ECF 1, 105, 115, 130', source: 'PACER / CM-ECF (8:26-cv-00348-JWH-ADS)', verified: 'YES (Active)', status: 'RECORD' },
  { item: '2021 Sheriff lockout dates & Stay order', source: 'OC Sheriff File #2021102780; Minute Order Event ID 73592630', verified: 'YES (08/20/2021)', status: 'RECORD' },
  { item: 'GAO FraudNet Control ID COMP-26-004512', source: 'GAO Intake Confirmation Ledger', verified: 'YES (05/09/2026)', status: 'RECORD' },
  { item: 'FBI IC3 Active Docket 20IC002', source: 'FBI Electronic Complaint Filing Record', verified: 'YES (10/18/2026)', status: 'RECORD' },
];
