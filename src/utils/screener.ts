export interface ExposureSubmission {
  id: string;
  timestamp: string;
  contributorName: string;
  contactEmailOrPhone: string;
  stayDates: string;
  bedNumber?: string;
  facilityLocation: string;
  symptoms: string[];
  notes: string;
  fileName?: string;
  fileSize?: string;
  fileDataUrl?: string;
  riskLevel: 'HIGH_CORRELATION' | 'MODERATE_CORRELATION' | 'INFORMATIONAL';
  matchedCohortResident?: string;
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
  const subject = encodeURIComponent(`[HBNC Victim Intake / Comment] New Submission from ${submission.contributorName || 'Anonymous'}`);
  const body = encodeURIComponent(
    `URGENT HBNC CONTAMINATION INTAKE / VICTIM REPORT\n` +
    `-----------------------------------------------------\n` +
    `Date/Time: ${submission.timestamp}\n` +
    `Name: ${submission.contributorName || 'Anonymous'}\n` +
    `Contact: ${submission.contactEmailOrPhone || 'Not provided'}\n` +
    `Shelter Dates: ${submission.stayDates || 'Not specified'}\n` +
    `Bed Number: ${submission.bedNumber || 'Unknown'}\n` +
    `Facility: ${submission.facilityLocation}\n` +
    `Risk Level: ${submission.riskLevel}\n` +
    `Reported Symptoms:\n - ${submission.symptoms.join('\n - ')}\n\n` +
    `Attached File: ${submission.fileName ? `${submission.fileName} (${submission.fileSize})` : 'None'}\n\n` +
    `Statement / Comments:\n${submission.notes}\n\n` +
    `-----------------------------------------------------\n` +
    `Transmitted via OSINT Neo AI & Legal Action Command Center (HBNC Case 3)`
  );
  return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
}
