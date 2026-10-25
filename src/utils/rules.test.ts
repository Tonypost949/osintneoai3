import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateExposureRisk, buildNotificationMailto } from './screener';
import { parseCSVLine } from './csvParser';
import { STATUTORY_CLAIMS } from './statutoryData';
import { normalizeTextForSpeech } from './audioEngine';

test('CSV parser properly splits commas and handles quotes', () => {
  const line = '2026-05-09,Public Sector,"GAO FraudNet,$598.7M municipal & grant fraud referral",Active Federal Docket,COMP-26-004512';
  const parsed = parseCSVLine(line);
  assert.equal(parsed.length, 5);
  assert.equal(parsed[0], '2026-05-09');
  assert.equal(parsed[1], 'Public Sector');
  assert.equal(parsed[2], 'GAO FraudNet,$598.7M municipal & grant fraud referral');
  assert.equal(parsed[4], 'COMP-26-004512');
});

test('calculateExposureRisk scores high correlation for severe respiratory and empyema cases', () => {
  const result = calculateExposureRisk(['pneumonia', 'empyema', 'respiratory_failure'], true);
  assert.equal(result.riskLevel, 'HIGH_CORRELATION');
  assert.ok(result.score >= 10);
  assert.ok(result.matchedResidents.length > 0);
});

test('calculateExposureRisk scores low/informational for empty symptom list without shelter stay', () => {
  const result = calculateExposureRisk([], false);
  assert.equal(result.riskLevel, 'INFORMATIONAL');
  assert.equal(result.score, 0);
});

test('buildNotificationMailto formats recipient email and subject correctly', () => {
  const mailto = buildNotificationMailto({
    id: 'test-1',
    timestamp: '2026-10-24 17:00:00',
    contributorName: 'Jane Doe',
    contactEmailOrPhone: 'jane@example.com',
    stayDates: 'Nov 2023 - Jan 2024',
    bedNumber: '42',
    facilityLocation: '17631 Cameron Lane (HBNC)',
    symptoms: ['Atypical Pneumonia', 'Pleural Empyema'],
    notes: 'Developed severe cough after sleeping near wall with corroded bolts.',
    fileName: 'chest_ct_scan.pdf',
    fileSize: '2.4 MB',
    victimAlias: 'HBNC Victim 1',
    riskScore: 10,
    matchedEvidenceFiles: ['GeoTracker T10000018579'],
    voidAbInitioDealCorrelation: 'Thomson v. Call 100% strict disgorgement',
    riskLevel: 'HIGH_CORRELATION',
    adminApproved: false,
  });

  assert.ok(mailto.startsWith('mailto:amd949609@gmail.com'));
  assert.ok(mailto.includes('Jane%20Doe'));
  assert.ok(mailto.includes('chest_ct_scan.pdf'));
});

test('STATUTORY_CLAIMS contains all required 8 legal causes of action with evidence mappings', () => {
  assert.equal(STATUTORY_CLAIMS.length, 8);
  const adaClaim = STATUTORY_CLAIMS.find(c => c.statuteCitation.includes('12131'));
  assert.ok(adaClaim !== undefined);
  assert.ok(adaClaim!.recordProofFiles.some(f => f.filename.includes('scripps_ehr_page_985.png')));

  const rcraClaim = STATUTORY_CLAIMS.find(c => c.statuteCitation.includes('6972'));
  assert.ok(rcraClaim !== undefined);
  assert.ok(rcraClaim!.recordProofFiles.some(f => f.filename.includes('navigation_center_003.jpg')));
});

test('normalizeTextForSpeech properly expands toxicological and statutory acronyms for clear voice narration', () => {
  const sample = 'Cr(VI) levels at 49x screening level at HBNC under FRE 201 and Welf. & Inst. Code § 15657';
  const normalized = normalizeTextForSpeech(sample);
  assert.ok(normalized.includes('Hexavalent Chromium'));
  assert.ok(normalized.includes('forty-nine times'));
  assert.ok(normalized.includes('Federal Rule of Evidence 201'));
  assert.ok(normalized.includes('Welfare and Institutions Code Section 15657'));
});

test('PLATFORM_INTEGRATIONS has all 6 active cores configured and ready', async () => {
  const { PLATFORM_INTEGRATIONS, DEFAULT_KEY_SLOTS } = await import('./integrationsManager');
  assert.equal(PLATFORM_INTEGRATIONS.length, 6);
  assert.ok(PLATFORM_INTEGRATIONS.some(i => i.id === 'threejs-subsurface'));
  assert.ok(PLATFORM_INTEGRATIONS.some(i => i.id === 'google-maps-gis'));
  assert.ok(PLATFORM_INTEGRATIONS.some(i => i.id === 'gemini-argon'));
  assert.ok(PLATFORM_INTEGRATIONS.some(i => i.id === 'studio-tts'));

  // Ensure default key slot maintains server primary without leaking raw key
  assert.ok(DEFAULT_KEY_SLOTS.some(s => s.id === 'server-primary'));
  assert.equal(DEFAULT_KEY_SLOTS[0].provider, 'gemini');
});



