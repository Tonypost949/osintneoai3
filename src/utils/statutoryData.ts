import { StatutoryClaim } from '../types';

export const STATUTORY_CLAIMS: StatutoryClaim[] = [
  {
    id: 'claim-1',
    number: 1,
    title: 'ADA Title II & Rehabilitation Act § 504 (Medical-Exit Expulsion & Integration Mandate)',
    category: 'disability',
    statuteCitation: '42 U.S.C. §§ 12131–12134 · 29 U.S.C. § 794 · 28 C.F.R. § 35.130(b)(7) · Cal. Gov. Code § 11135',
    clock: '2 Years (Borrowed Cal. Code Civ. Proc. § 335.1)',
    clockUrgency: 'critical',
    elementsToProve: [
      'Plaintiff is a qualified individual with a physical/mental disability that substantially limits major life activities;',
      "Plaintiff was excluded from participation in or denied the benefits of a public entity's/federally funded emergency shelter program;",
      'Public entity / operator refused to make reasonable modifications to rules/policies (7-day hospitalization automatic exit + 30-day re-entry bar);',
      'Deliberate indifference under Duvall v. County of Kitsap, 260 F.3d 1124 (9th Cir. 2001) (en banc) for compensatory damages.',
    ],
    recordProofFiles: [
      {
        filename: 'scripps_ehr_page_985.png',
        description: 'Hospital social worker Bettina S. (01/19/2024) records automatic shelter exit & 30-day bar while patient was intubated in the ICU.',
      },
      {
        filename: 'album6_photo_006.jpg',
        description: 'Written Good Neighbor Rules: no-walk-up / no-bike-up ban under threat of immediate summary exit.',
      },
      {
        filename: 'album6_photo_017.jpg',
        description: 'Single 30-minute pharmacy window (5:00 PM) and 4:30 AM shuttle sign-up severely burdening disabled residents.',
      },
      {
        filename: 'HHAP MOU (04/29/2026)',
        description: 'HHAP grant funding agreement establishing federal and state statutory non-discrimination jurisdiction.',
      },
    ],
    remedies: [
      'Injunctive order permanently invalidating the 7-day hospitalization bed forfeiture rule;',
      'Immediate supportive housing placement under the Olmstead v. L.C. integration mandate (527 U.S. 581);',
      "Compensatory damages and mandatory statutory attorney's fees under 42 U.S.C. § 12205 and 29 U.S.C. § 794a.",
    ],
    keyCaseLaw: 'Duvall v. County of Kitsap, 260 F.3d 1124 (9th Cir. 2001); Olmstead v. L.C., 527 U.S. 581 (1999)',
  },
  {
    id: 'claim-2',
    number: 2,
    title: 'Fair Housing Act (FHA) & California FEHA Housing Discrimination',
    category: 'disability',
    statuteCitation: '42 U.S.C. § 3604(f)(1)–(3)(B) · Cal. Gov. Code § 12955',
    clock: '2 Years Civil Action / 1 Year HUD FHEO Administrative Complaint',
    clockUrgency: 'critical',
    elementsToProve: [
      'Subject premises is a "dwelling" covered under the Fair Housing Act (transitional and emergency navigation center);',
      'Resident handicap/disability was known or should reasonably have been known to shelter management and municipal supervisors;',
      'Defendants refused to make reasonable accommodations in rules, policies, practices, or services necessary to afford equal opportunity to use and enjoy the dwelling.',
    ],
    recordProofFiles: [
      {
        filename: '1.E.Petruccio Patient Health.pdf',
        description: 'Hospital EHR pp. 985, 1034, 1051 verifying medical staff communicated directly with shelter case management during admission.',
      },
      {
        filename: 'scripps_ehr_page_985.png',
        description: 'Enforcement of 30-day exclusionary ban against hospitalized resident rather than granting medical bed-hold.',
      },
      {
        filename: 'Oasis Placement Ledger',
        description: 'Disparate exclusion from permanent supportive housing (Oasis) compared to other original 2021–2023 shelter cohorts.',
      },
    ],
    remedies: [
      'HUD Office of Fair Housing (FHEO) administrative subpoena and formal investigation findings;',
      "Actual damages for pain, suffering, and displacement; punitive damages; injunctive relief; and attorney's fees (42 U.S.C. § 3613(c)).",
    ],
    keyCaseLaw: 'City of Edmonds v. Oxford House, Inc., 514 U.S. 725 (1995)',
  },
  {
    id: 'claim-3',
    number: 3,
    title: 'Resource Conservation and Recovery Act (RCRA) — Imminent & Substantial Endangerment',
    category: 'environmental',
    statuteCitation: '42 U.S.C. § 6972(a)(1)(B)',
    clock: 'Active in Federal Docket: Knabb v. City of HB, No. 8:26-cv-00348 (ECF 115 / ECF 130)',
    clockUrgency: 'high',
    elementsToProve: [
      'Defendants are past or present owners, operators, generators, or transporters who handled solid or hazardous waste;',
      'Conditions present an imminent and substantial endangerment to public health or the environment;',
      'Statutory 90-day pre-suit notice fulfilled and absence of diligent administrative prosecution bar under § 6972(b)(1)(B).',
    ],
    recordProofFiles: [
      {
        filename: 'EEC Environmental Phase II (08/03/2020)',
        description: 'Soil Cr(VI) up to 980 µg/kg (49× DTSC residential screening level of 20 µg/kg); lead, arsenic, toxaphene, DDE, and soil gas PCE/TCE.',
      },
      {
        filename: 'navigation_center_003.jpg',
        description: 'County briefing: Site approved for shelter occupancy ONLY "as long as an asphalt pavement cover was placed over the soil."',
      },
      {
        filename: 'HB_Shelter_Nov2023_photo_01.jpg - 08.jpg',
        description: 'GPS 33.706389, -117.988611 (11/07/2023): Corroded anchor bolts breaching asphalt cap beneath beds with raw sand and sub-slab soil on sleeping floor.',
      },
      {
        filename: 'SAVC ¶¶ 8, 109(b)',
        description: 'RWQCB Deputy AG John Sasaki formal on-the-record stipulation: Water Board does not assert a diligent prosecution bar.',
      },
    ],
    remedies: [
      'Federal court injunction ordering certified indoor air/wipe testing, comprehensive cap remediation, or facility relocation;',
      "Prevailing party litigation costs, expert witness fees, and reasonable attorney's fees under 42 U.S.C. § 6972(e).",
    ],
    keyCaseLaw: 'Meghrig v. KFC Western, Inc., 516 U.S. 479 (1996)',
  },
  {
    id: 'claim-4',
    number: 4,
    title: 'Dangerous Condition of Public Property & Negligent Premises Maintenance',
    category: 'environmental',
    statuteCitation: 'Cal. Gov. Code §§ 835, 815.6 · Cal. Civ. Code § 1714',
    clock: 'Cal. Gov. Code § 911.2 (6 Months Public Entity) / CCP § 335.1 (2 Years Private Operator)',
    clockUrgency: 'critical',
    elementsToProve: [
      'Property owned/controlled by public entity was in a dangerous, defective condition at time of injury;',
      'Dangerous condition created a reasonably foreseeable risk of the kind of injury that occurred;',
      'Condition was caused by negligent/wrongful act of employee or entity had actual/constructive notice with time to take protective measures;',
      'Private contractor/operator Mercy House owed independent common-law duty of habitability (not shielded by Gov. Code § 911.2 presentation).',
    ],
    recordProofFiles: [
      {
        filename: 'City Contract Laserfiche #5406552 ($2.41M)',
        description: 'TTS Engineering contract: 2-inch asphalt cap given only a ONE (1) YEAR warranty (§ 9, lines 331–340).',
      },
      {
        filename: 'Contractor Proposal #20390 (Line 1196)',
        description: 'Explicit contract term: "CREW INSTALLING AC WILL NOT BE 40-HOUR TRAINED."',
      },
      {
        filename: 'mercy_house_044.jpg - 046.jpg',
        description: 'Expired 2020 Temporary Certificate of Occupancy still posted above exit signs in April 2025.',
      },
      {
        filename: 'navigation_center_027.jpg, 029.jpg, 045.jpg',
        description: 'Collapsed exhaust fan grille with exposed wire-nuts, shattered bathroom sink, standing water, and rusted wall panels.',
      },
    ],
    remedies: [
      'Economic and non-economic damages for severe pulmonary trauma, 62-day hospitalization, permanent orthopedic impairment, and medical bills;',
      'Direct civil claims against private non-profit operator Mercy House under CCP § 335.1 (no tort claim act bar).',
    ],
  },
  {
    id: 'claim-5',
    number: 5,
    title: 'California Elder & Dependent Adult Civil Protection Act (EADACPA)',
    category: 'elder',
    statuteCitation: 'Cal. Welf. & Inst. Code §§ 15610.23, 15610.57, 15657',
    clock: '2 Years (CCP § 335.1)',
    clockUrgency: 'high',
    elementsToProve: [
      'Plaintiff is a "dependent adult" (aged 18–64 with physical/mental limitations restricting ability to carry out normal activities) or elder;',
      'Defendant had care or custody and failed to protect plaintiff from health and safety hazards (neglect under § 15610.57);',
      'Defendant acted with recklessness, oppression, fraud, or malice under § 15657.',
    ],
    recordProofFiles: [
      {
        filename: '1.E.Petruccio Patient Health.pdf',
        description: 'Documented 44-lb weight collapse (160 lb to 116 lb), intubation, bilateral cavitary disease, and C4-C5 discitis-osteomyelitis.',
      },
      {
        filename: 'scripps_ehr_page_985.png',
        description: 'Shelter exiting patient while comatose/intubated in ICU and imposing 30-day lockout upon discharge.',
      },
      {
        filename: 'Sheriff-Coroner Death Cert (04/11/2024)',
        description: 'Resident Burt Bell died of pneumonia with environmental vulnerability after being exited while hospitalized on same day.',
      },
      {
        filename: 'Brian Bell Grievance (01/20/2025)',
        description: 'Brain injury resident signed formal grievance; shelter follow-up page left completely blank before his subsequent death.',
      },
    ],
    remedies: [
      "Enhanced statutory remedies under Welf. & Inst. Code § 15657: mandatory reasonable attorney's fees and costs;",
      'Punitive damages and survival damages for pain and suffering;',
      'Immediate referral to Orange County Adult Protective Services (APS).',
    ],
    keyCaseLaw: 'Delaney v. Baker, 20 Cal. 4th 23 (1999)',
  },
  {
    id: 'claim-6',
    number: 6,
    title: '42 U.S.C. § 1983 — Fourteenth Amendment State-Created Danger & Monell Policy Liability',
    category: 'constitutional',
    statuteCitation: '42 U.S.C. § 1983 · Monell v. Dep\'t of Soc. Servs., 436 U.S. 658 (1978)',
    clock: '2 Years',
    clockUrgency: 'high',
    elementsToProve: [
      'Affirmative government conduct that placed plaintiffs in a known, foreseeable danger to bodily integrity and health;',
      'Municipal actors acted with deliberate indifference to that danger;',
      'The constitutional violation was caused by an official municipal policy, custom, or failure to train/maintain.',
    ],
    recordProofFiles: [
      {
        filename: 'album6_photo_006.jpg (Rule 13)',
        description: 'Official Good Neighbor policy confining residents inside the toxic footprint under threat of immediate street ejection.',
      },
      {
        filename: 'Laserfiche #5406552 & Proposal #20390',
        description: 'Municipal decision to cap a 49× Cr(VI) site with a 1-year warranted 2" cap installed by non-HAZWOPER laborers.',
      },
      {
        filename: 'Rules 8 & 9 (Photo/Fingerprint Ban)',
        description: 'Prohibiting residents from documenting or photographing interior facility conditions while imposing biometric logging.',
      },
    ],
    remedies: [
      "Compensatory and punitive damages against individual officials; 42 U.S.C. § 1988 statutory attorney's fees;",
      'Declaratory and structural injunctive relief dismantling the unconstitutional confinement and medical-expulsion policies.',
    ],
    keyCaseLaw: 'Kennedy v. City of Ridgefield, 439 F.3d 1055 (9th Cir. 2006); Monell, 436 U.S. 658 (1978)',
  },
  {
    id: 'claim-7',
    number: 7,
    title: 'California Unruh Civil Rights Act & Tom Bane Civil Rights Act',
    category: 'disability',
    statuteCitation: 'Cal. Civ. Code §§ 51, 52, 52.1',
    clock: '2 Years',
    clockUrgency: 'medium',
    elementsToProve: [
      'Unruh Act § 51(f): Any violation of the federal ADA constitutes a per se violation of the Unruh Civil Rights Act;',
      'Bane Act § 52.1: Interference or attempted interference with constitutional/statutory rights accomplished by threats, intimidation, or coercion.',
    ],
    recordProofFiles: [
      {
        filename: 'album6_photo_006.jpg',
        description: 'Written threat of immediate expulsion onto the street used to coerce submission to photography bans and confinement rules.',
      },
      {
        filename: 'scripps_ehr_page_985.png',
        description: 'Per se ADA Title II violation through enforcement of automatic medical exit against hospitalized disabled resident.',
      },
    ],
    remedies: [
      'Statutory minimum damages of $4,000 per violation under Civ. Code § 52(a);',
      'Treble actual damages and mandatory attorney fees under Civ. Code § 52.1.',
    ],
  },
  {
    id: 'claim-8',
    number: 8,
    title: 'First Amendment Retaliation & False Claims Act Anti-Retaliation',
    category: 'constitutional',
    statuteCitation: '42 U.S.C. § 1983 (1st Am.) · 31 U.S.C. § 3730(h) · Cal. Gov. Code § 12653',
    clock: '3 Years (§ 3730(h)) / 2 Years (§ 1983)',
    clockUrgency: 'critical',
    elementsToProve: [
      'Plaintiffs engaged in constitutionally and statutorily protected whistleblowing disclosures to government oversight and legal bodies;',
      'Defendants subjected plaintiffs to adverse actions that would chill a person of ordinary firmness;',
      'Protected whistleblowing activity was a substantial or motivating factor in the retaliatory actions.',
    ],
    recordProofFiles: [
      {
        filename: 'amd949609@gmail.com Email Archive',
        description: 'Disclosures to ACLU, two U.S. Senate offices, Congressional office, City Attorney, and federal task force.',
      },
      {
        filename: 'photo_a74G5sEDR54YwTiF7.jpg',
        description: 'Arrest warrant mailed to former 2021 address following protected disclosures; permanent exclusion from Oasis housing.',
      },
      {
        filename: '06_Relator_Protection_Record.md',
        description: 'CRITICAL SEAL WARNING: Strict protocol isolating False Claims Act relator disclosures to prevent waiver under § 3730(b)(2).',
      },
    ],
    remedies: [
      'Reinstatement, 2× back pay, interest, special damages, and attorney fees under 31 U.S.C. § 3730(h);',
      'Civil rights damages for retaliatory investigation and prosecution under 42 U.S.C. § 1983.',
    ],
  },
];
