export type TagType = 'RECORD' | 'ACCOUNT' | 'ALLEGATION' | 'TO VERIFY';

export interface TaggedItem {
  id: string;
  tag: TagType;
  title?: string;
  content: string;
  sourceDoc?: string;
}

export interface ResidentProfile {
  id: string;
  name: string;
  dob: string;
  role: string;
  shelterPeriod: string;
  hospitalizations: string;
  documentedPathology: string;
  outcomeStatus: string;
  evidenceFiles: string[];
}

export interface StatutoryClaim {
  id: string;
  number: number;
  title: string;
  category: 'disability' | 'environmental' | 'elder' | 'constitutional';
  statuteCitation: string;
  clock: string;
  clockUrgency: 'critical' | 'high' | 'medium';
  elementsToProve: string[];
  recordProofFiles: {
    filename: string;
    description: string;
  }[];
  remedies: string[];
  keyCaseLaw?: string;
}

export interface OutreachRecord {
  id: string;
  date: string;
  sector: string;
  targetEntity: string;
  subject: string;
  disposition: string;
  docketId: string;
  deliveryVector: string;
  agencyResponse: string;
  evidentiarySignificance: string;
}

export interface OutreachTelemetry {
  totalRecords: number;
  publicSectorFilings: number;
  successfulDispatches: number;
  bouncedBlocked: number;
  agencyResponses: number;
  sectorBreakdown: {
    category: string;
    count: number;
    share: string;
    focus: string;
  }[];
  statusBreakdown: {
    status: string;
    count: number;
    deliveryRate: string;
    vector: string;
  }[];
  yearlyBreakdown: {
    year: string;
    count: number;
    share: string;
    milestone: string;
  }[];
}

export interface OsintRepoRecord {
  name: string;
  fileCount: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'REFERENCE' | 'IGNORE' | 'ALL';
  actionsCopy: string;
  actionsMerge: string;
  recommendation?: string;
}

export interface OsintCategoryRecord {
  category: string;
  fileCount: number;
  share: string;
}

export interface EvidenceFile {
  name: string;
  category: 'primary_document' | 'photograph' | 'medical' | 'dossier_markdown' | 'subfolder';
  subfolder: string;
  description: string;
  gpsCoordinates?: string;
  dateTimestamp?: string;
  fileSize?: string;
}
