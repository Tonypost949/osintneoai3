export interface ExposureSubmission {
  id: string;
  victimAlias: string; // Strictly "HBNC Victim 1", "HBNC Victim 2", etc. (NEVER reveal real names in UI)
  timestamp: string;
  contributorName?: string; // Private intake info (only in direct email transmittal to coordinator)
  contactEmailOrPhone?: string; // Private
  stayDates: string;
  bedNumber?: string;
  facilityLocation: string;
  symptoms: string[];
  notes: string;
  fileName?: string;
  fileSize?: string;
  fileDataUrl?: string;
  fileType?: string;
  riskScore: number;
  riskLevel: 'HIGH_CORRELATION' | 'MODERATE_CORRELATION' | 'INFORMATIONAL';
  matchedCohortResident?: string;
  matchedEvidenceFiles: string[];
  voidAbInitioDealCorrelation: string;
  adminApproved: boolean;
  adminAnswer?: string;
}

export const KNOWN_TOXIC_SYMPTOMS = [
  { id: 'pneumonia', label: 'Severe / Recurrent / Atypical Pneumonia', weight: 3, resident: 'Elizabeth Petruccio / Jesse Knabb' },
  { id: 'empyema', label: 'Pleural Empyema or Thoracentesis (Fluid in Lungs)', weight: 4, resident: 'Elizabeth Petruccio / Jesse Knabb' },
  { id: 'respiratory_failure', label: 'Acute Respiratory Failure / Intubation', weight: 4, resident: 'Elizabeth Petruccio' },
  { id: 'osteomyelitis', label: 'Spinal Infection / Discitis-Osteomyelitis', weight: 3, resident: 'Elizabeth Petruccio' },
  { id: 'weight_loss', label: 'Rapid Unexplained Weight Loss (>20 lbs)', weight: 2, resident: 'Elizabeth Petruccio (160 → 116 lb)' },
  { id: 'rib_or_shoulder', label: 'Bone Weakness / Fractures / Syncope', weight: 2, resident: 'Anthony DiMarcello III' },
  { id: 'cellulitis', label: 'Non-healing Cellulitis / Staph Infection', weight: 2, resident: 'Anthony DiMarcello III' },
  { id: 'cardiac', label: 'Acute Cardiac Injury / Elevated Troponin', weight: 3, resident: 'Curtis M. Simcox' },
  { id: 'neurological', label: 'Confusion, Strokes, or Cognitive Decline', weight: 3, resident: 'Brian Bell' },
  { id: 'respiratory_vulnerability', label: 'Chronic Cough, Shortness of Breath, Hemoptysis', weight: 2, resident: 'Burt Bell' },
];

export function getNextVictimAlias(existingCount: number): string {
  return `HBNC Victim ${existingCount + 1}`;
}

export function getMatchedEvidenceFiles(symptoms: string[], bedNumber?: string): string[] {
  const matches: string[] = [
    'navigation_center_003.jpg',
    'Laserfiche #5406552',
    'GeoTracker_T10000018579_CrVI_Map.pdf',
  ];
  if (
    symptoms.some((s) =>
      /pneumonia|empyema|respiratory|intubation|lung/i.test(s)
    )
  ) {
    matches.push('scripps_ehr_page_985.png', 'scripps_ehr_page_1034.png');
  }
  if (bedNumber || symptoms.length > 0) {
    matches.push('HB_Shelter_Nov2023_photo_01.jpg', 'HB_Shelter_Nov2023_photo_08.jpg');
  }
  return Array.from(new Set(matches));
}

export function getVoidAbInitioCorrelation(): string {
  return 'Infected by Deal 1 (17631 Cameron Lane allocation, Mitsuru Yamada trustee conflict, 0 Form 700 filings, UPX1978058). Void ab initio under Thomson v. Call (38 Cal.3d 633) with 100% strict disgorgement, directly parallel to Mayor Harry Sidhu in USA v. Sidhu (8:23-cr-00114-JWH).';
}

export function calculateExposureRisk(selectedSymptomIds: string[], stayedAtHBNC: boolean): {
  score: number;
  riskLevel: 'HIGH_CORRELATION' | 'MODERATE_CORRELATION' | 'INFORMATIONAL';
  matchedResidents: string[];
  findings: string[];
} {
  let score = 0;
  const matchedResidents: string[] = [];
  const findings: string[] = [];

  for (const symId of selectedSymptomIds) {
    const found = KNOWN_TOXIC_SYMPTOMS.find(s => s.id === symId);
    if (found) {
      score += found.weight;
      if (!matchedResidents.includes(found.resident)) {
        matchedResidents.push(found.resident);
      }
      findings.push(found.label);
    }
  }

  if (stayedAtHBNC) {
    score += 4;
  }

  let riskLevel: 'HIGH_CORRELATION' | 'MODERATE_CORRELATION' | 'INFORMATIONAL' = 'INFORMATIONAL';
  if (score >= 7) {
    riskLevel = 'HIGH_CORRELATION';
  } else if (score >= 4) {
    riskLevel = 'MODERATE_CORRELATION';
  }

  return { score, riskLevel, matchedResidents, findings };
}

export function buildNotificationMailto(submission: ExposureSubmission, targetEmail = 'amd949609@gmail.com'): string {
  const victimLabel = submission.victimAlias || `HBNC Victim (Anonymous)`;
  const subject = encodeURIComponent(`[HBNC Victim Intake / Comment] New Submission for ${victimLabel} (${submission.contributorName || 'Confidential'})`);
  const body = encodeURIComponent(
    `URGENT HBNC CONTAMINATION INTAKE / VICTIM REPORT\n` +
    `-----------------------------------------------------\n` +
    `Victim Assigned Code: ${victimLabel}\n` +
    `Date/Time: ${submission.timestamp}\n` +
    `Private Intake Name: ${submission.contributorName || 'Anonymous'}\n` +
    `Contact: ${submission.contactEmailOrPhone || 'Not provided'}\n` +
    `Shelter Dates: ${submission.stayDates || 'Not specified'}\n` +
    `Bed Number: ${submission.bedNumber || 'Unknown'}\n` +
    `Facility: ${submission.facilityLocation}\n` +
    `Risk Score: ${submission.riskScore || 'Calculated'} (${submission.riskLevel})\n` +
    `Reported Symptoms:\n - ${submission.symptoms.join('\n - ')}\n\n` +
    `Attached File: ${submission.fileName ? `${submission.fileName} (${submission.fileSize})` : 'None'}\n\n` +
    `Form 700 / Void Ab Initio Correlation:\n${submission.voidAbInitioDealCorrelation || getVoidAbInitioCorrelation()}\n\n` +
    `Statement / Comments:\n${submission.notes}\n\n` +
    `-----------------------------------------------------\n` +
    `Transmitted via OSINT Neo AI & Legal Action Command Center (HBNC Case 3)`
  );
  return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
}
