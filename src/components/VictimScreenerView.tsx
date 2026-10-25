import React, { useState, useEffect } from 'react';
import { UserCheck, Upload, AlertCircle, Send, CheckCircle2, Trash2, MessageSquare, Mail, ShieldCheck, HeartPulse, FileText, Lock, Gavel, FolderOpen } from 'lucide-react';
import {
  KNOWN_TOXIC_SYMPTOMS,
  calculateExposureRisk,
  buildNotificationMailto,
  ExposureSubmission,
  getNextVictimAlias,
  getMatchedEvidenceFiles,
  getVoidAbInitioCorrelation
} from '../utils/screener';

const INITIAL_PUBLIC_COMMENTS: ExposureSubmission[] = [
  {
    id: 'sub-sample-1',
    victimAlias: 'HBNC Victim 1',
    timestamp: '2026-09-14 14:22 PST',
    contributorName: 'Confidential (Intake Verified)',
    contactEmailOrPhone: 'Verified by Coordinator',
    stayDates: 'November 2023 – January 2024',
    bedNumber: '78',
    facilityLocation: '17631 Cameron Lane (Sprung Structure)',
    symptoms: ['Severe / Recurrent / Atypical Pneumonia', 'Pleural Empyema or Thoracentesis (Fluid in Lungs)', 'Rapid Unexplained Weight Loss (>20 lbs)'],
    notes: 'I slept two beds down from Elizabeth. Within two months I developed a violent rattle in my chest and was hospitalized at Hoag with pleural fluid. Staff told me if I stayed in the hospital over a week they would give my bed away.',
    fileName: 'Hoag_discharge_summary_redacted.pdf',
    fileSize: '1.8 MB',
    riskScore: 10,
    riskLevel: 'HIGH_CORRELATION',
    matchedCohortResident: 'Elizabeth Petruccio / Jesse Knabb',
    matchedEvidenceFiles: ['GeoTracker T10000018579', 'navigation_center_003.jpg', 'Laserfiche #5406552', 'scripps_ehr_page_985.png', 'HB_Shelter_Nov2023_photo_01.jpg'],
    voidAbInitioDealCorrelation: 'Infected by Deal 1 (17631 Cameron Lane allocation, Mitsuru Yamada trustee conflict, 0 Form 700 filings, UPX1978058). Void ab initio under Thomson v. Call (38 Cal.3d 633) with 100% strict disgorgement, directly parallel to Mayor Harry Sidhu in USA v. Sidhu (8:23-cr-00114-JWH).',
    adminApproved: true,
    adminAnswer: 'Coordinator Note: Corroborated with November 2023 shelter log. Bed #78 was along the unsealed east anchor bolt breach line.',
  },
  {
    id: 'sub-sample-2',
    victimAlias: 'HBNC Victim 2',
    timestamp: '2026-10-02 11:05 PST',
    contributorName: 'Confidential (Intake Verified)',
    contactEmailOrPhone: 'Private Intake',
    stayDates: 'Spring 2024',
    bedNumber: '92',
    facilityLocation: 'Huntington Beach Navigation Center',
    symptoms: ['Non-healing Cellulitis / Staph Infection', 'Chronic Cough, Shortness of Breath, Hemoptysis'],
    notes: 'My brother slept right next to Burt Bell (Bed 91). Burt died from pneumonia, and my brother developed severe skin sores on his legs that would not heal for four months after sleeping on that floor.',
    riskScore: 8,
    riskLevel: 'HIGH_CORRELATION',
    matchedCohortResident: 'Burt Bell (Bed 91) / Anthony DiMarcello III',
    matchedEvidenceFiles: ['GeoTracker T10000018579', 'HB_Shelter_Nov2023_photo_01.jpg', 'Laserfiche #5406552'],
    voidAbInitioDealCorrelation: 'Infected by Deal 1 (17631 Cameron Lane allocation, Mitsuru Yamada trustee conflict, 0 Form 700 filings, UPX1978058). Void ab initio under Thomson v. Call (38 Cal.3d 633) with 100% strict disgorgement, directly parallel to Mayor Harry Sidhu in USA v. Sidhu (8:23-cr-00114-JWH).',
    adminApproved: true,
    adminAnswer: 'Coordinator Note: Burt Bell died in hospital custody after same-day exit. Crucial corroborating evidence.',
  },
];

export const VictimScreenerView: React.FC = () => {
  // State for form
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [stayedAtHBNC, setStayedAtHBNC] = useState<boolean>(true);
  const [stayDates, setStayDates] = useState<string>('');
  const [bedNumber, setBedNumber] = useState<string>('');
  const [contributorName, setContributorName] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [userComment, setUserComment] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewName, setFilePreviewName] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [lastSubmitted, setLastSubmitted] = useState<ExposureSubmission | null>(null);

  // Community Comments & Admin moderation state
  const [submissions, setSubmissions] = useState<ExposureSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('hbnc_victim_submissions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved submissions:', e);
    }
    return INITIAL_PUBLIC_COMMENTS;
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminAnswerText, setAdminAnswerText] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    try {
      localStorage.setItem('hbnc_victim_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.warn('Could not persist submissions:', e);
    }
  }, [submissions]);

  // Live calculation of exposure risk
  const riskAnalysis = calculateExposureRisk(selectedSymptoms, stayedAtHBNC);

  const toggleSymptom = (symId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symId) ? prev.filter((id) => id !== symId) : [...prev, symId]
    );
  };

  const handleSingleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setFilePreviewName(file.name);
      setFileSizeStr(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setFilePreviewName('');
    setFileSizeStr('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSymptoms.length === 0 && !userComment.trim() && !uploadedFile) {
      alert('Please select at least one symptom, upload a record, or leave a statement.');
      return;
    }

    const newSub: ExposureSubmission = {
      id: `sub-${Date.now()}`,
      victimAlias: getNextVictimAlias(submissions.length),
      timestamp: new Date().toLocaleString(),
      contributorName: contributorName.trim() || 'Confidential (Intake Verified)',
      contactEmailOrPhone: contactInfo.trim() || 'Not provided',
      stayDates: stayDates.trim() || 'Unspecified period',
      bedNumber: bedNumber.trim() || 'Unknown',
      facilityLocation: '17631 Cameron Lane (HB Navigation Center)',
      symptoms: selectedSymptoms.map(
        (id) => KNOWN_TOXIC_SYMPTOMS.find((s) => s.id === id)?.label || id
      ),
      notes: userComment.trim(),
      fileName: filePreviewName || undefined,
      fileSize: fileSizeStr || undefined,
      riskScore: riskAnalysis.score,
      riskLevel: riskAnalysis.riskLevel,
      matchedCohortResident: riskAnalysis.matchedResidents.join(', ') || undefined,
      matchedEvidenceFiles: getMatchedEvidenceFiles(selectedSymptoms, bedNumber),
      voidAbInitioDealCorrelation: getVoidAbInitioCorrelation(),
      adminApproved: true, // Visible in read-only comment board
    };

    setSubmissions((prev) => [newSub, ...prev]);
    setLastSubmitted(newSub);
    setSubmittedSuccess(true);

    // Auto trigger mailto to amd949609@gmail.com
    const mailtoUrl = buildNotificationMailto(newSub, 'amd949609@gmail.com');
    window.location.href = mailtoUrl;
  };

  // Admin moderation actions
  const handleDeleteComment = (id: string) => {
    if (confirm('Delete this comment/record permanently?')) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSaveAdminAnswer = (id: string) => {
    const answer = adminAnswerText[id];
    if (!answer || !answer.trim()) return;
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, adminAnswer: answer.trim() } : s))
    );
    setAdminAnswerText((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div id="screener-root" className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Header Card */}
      <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-extrabold text-white">
              Contamination Exposure Screener &amp; Direct Record Upload
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded text-xs font-mono text-emerald-300">
            <Lock className="w-3.5 h-3.5" />
            <span>NO LOGIN REQUIRED &middot; READ-ONLY OR SINGLE-FILE UPLOAD</span>
          </div>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4 font-serif">
          If you or a family member stayed or worked at the <b>Huntington Beach Navigation Center (17631 Cameron Lane)</b> and suffered severe pneumonia, pleural empyema, sudden weight loss, cardiac injury, or hospital discharge lockouts, check your symptoms below. You can upload a single medical record or photo and submit your statement directly to the case coordinator (<span className="text-emerald-300 font-mono font-semibold">amd949609@gmail.com</span>).
        </p>

        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Direct Email Transmission to Anthony DiMarcello III
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            Moderated Community Testimony Board
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <HeartPulse className="w-4 h-4 text-red-400" />
            Matched Against 6 Documented Resident Cases
          </span>
        </div>
      </div>

      {/* Main Intake Form Grid */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-lg mb-10">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>Step 1: Check Documented Symptoms &amp; Exposure Indicators</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {KNOWN_TOXIC_SYMPTOMS.map((sym) => {
            const isChecked = selectedSymptoms.includes(sym.id);
            return (
              <label
                key={sym.id}
                onClick={() => toggleSymptom(sym.id)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-100">{sym.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Documented in cohort: <span className="text-amber-300/90">{sym.resident}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Real-time Risk Assessment Box */}
        <div className={`p-4 rounded-lg border mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          riskAnalysis.riskLevel === 'HIGH_CORRELATION'
            ? 'bg-red-950/40 border-red-500 text-red-200'
            : riskAnalysis.riskLevel === 'MODERATE_CORRELATION'
            ? 'bg-amber-950/40 border-amber-500 text-amber-200'
            : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HeartPulse className="w-5 h-5 text-red-400" />
              <span className="font-bold text-sm uppercase tracking-wider">
                Preliminary Toxicity Correlation: {riskAnalysis.riskLevel.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-2xl">
              {riskAnalysis.riskLevel === 'HIGH_CORRELATION' ? (
                <span>
                  <b>CRITICAL CORRELATION:</b> Your selected symptoms match the exact severe pulmonary, empyemic, or osteomyelitic clinical profile documented in Elizabeth Petruccio, Jesse Knabb, and Burt Bell. Immediate environmental records review is warranted.
                </span>
              ) : riskAnalysis.riskLevel === 'MODERATE_CORRELATION' ? (
                <span>
                  <b>ELEVATED RISK:</b> Symptoms match documented toxic endpoints for hexavalent chromium and volatile organic compound inhalation.
                </span>
              ) : (
                <span>
                  Select your symptoms above to evaluate clinical correlation against the 6 resident hospital records.
                </span>
              )}
            </p>
          </div>
          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
            <span className="block text-2xl font-black font-mono">Score: {riskAnalysis.score}/15</span>
            <span className="text-[11px] text-slate-400">Clinical Weight</span>
          </div>
        </div>

        {/* Step 2: Shelter Stay Details */}
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>Step 2: Shelter Residency &amp; Contact Details (Optional / No Login Required)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name / Pseudonym</label>
            <input
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="e.g. Bed #45 Resident / Jane D."
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email or Phone (For Coordinator Response)</label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="e.g. name@example.com or phone"
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bed Number (if known)</label>
            <input
              type="text"
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
              placeholder="e.g. Bed #91, #32, etc."
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Approximate Stay Dates</label>
            <input
              type="text"
              value={stayDates}
              onChange={(e) => setStayDates(e.target.value)}
              placeholder="e.g. October 2023 – February 2024"
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="stayedCheckbox"
              checked={stayedAtHBNC}
              onChange={(e) => setStayedAtHBNC(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="stayedCheckbox" className="text-xs text-slate-300">
              I stayed or worked at 17631 Cameron Lane (HB Navigation Center)
            </label>
          </div>
        </div>

        {/* Step 3: Record Upload */}
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>Step 3: Upload Evidence File or .ZIP Archive (Optional)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Upload <b>any file type</b> (.ZIP archive, medical PDF, discharge summary, CT scan, blood lab, or photo).
        </p>

        <div className="mb-6">
          {uploadedFile ? (
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-emerald-500/80 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold text-white">{filePreviewName}</span>
                <span className="text-slate-500">({fileSizeStr})</span>
                {filePreviewName.toLowerCase().endsWith('.zip') && (
                  <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
                    ZIP Archive
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleClearFile}
                className="text-xs text-red-400 hover:text-red-300 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-lg cursor-pointer bg-slate-950/60 transition-all">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-300">Click to attach file or .ZIP archive</span>
              <span className="text-[11px] text-slate-500 mt-1">ZIP archives, PDF, JPG, PNG, TXT, DOCX, etc. (Any type accepted)</span>
              <input
                type="file"
                onChange={handleSingleFileUpload}
                accept="*/*"
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Step 4: Statement / Comments */}
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 border-b border-slate-800 pb-2">
          <span>Step 4: Statement, Details, or Questions for the Coordinator</span>
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Leave your statement or comments. Anthony DiMarcello III will review, verify, answer, or delete comments per intake protocol.
        </p>

        <textarea
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          placeholder="Describe what happened to you at the shelter: floor conditions, hospitalization dates, shelter staff notices, or questions for our legal team..."
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-sm text-white focus:outline-none focus:border-emerald-500 mb-6 font-sans leading-relaxed"
        ></textarea>

        {/* Submit Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Clicking Submit prepares a verified intake email to <span className="text-emerald-400 font-mono">amd949609@gmail.com</span> and records your submission.
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Report &amp; Email Coordinator</span>
          </button>
        </div>
      </form>

      {/* Submission Success Modal / Alert */}
      {submittedSuccess && lastSubmitted && (
        <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-xl p-6 mb-10 shadow-2xl">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-lg mb-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span>Submission Successfully Recorded!</span>
          </div>
          <p className="text-sm text-slate-200 mb-3">
            Your intake report has been logged. An email transmittal was prepared for <b>amd949609@gmail.com</b>. If your email client did not automatically open, click the button below to dispatch it directly:
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={buildNotificationMailto(lastSubmitted, 'amd949609@gmail.com')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              <Mail className="w-4 h-4" />
              <span>Send Pre-Filled Email to amd949609@gmail.com</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `HBNC VICTIM INTAKE:\nName: ${lastSubmitted.contributorName}\nDates: ${lastSubmitted.stayDates}\nBed: ${lastSubmitted.bedNumber}\nRisk: ${lastSubmitted.riskLevel}\nSymptoms: ${lastSubmitted.symptoms.join(', ')}\nNotes: ${lastSubmitted.notes}`
                );
                alert('Copied report details to clipboard!');
              }}
              className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
            >
              Copy Report to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* Community Comments & Testimonies Board */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Community Testimonies &amp; Case Notes ({submissions.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Read-only statements from residents, staff, and advocates. Filtered and answered by Case Coordinator Anthony DiMarcello III.
            </p>
          </div>

          {/* Admin Moderation Mode Toggle */}
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
              isAdminMode
                ? 'bg-amber-600 text-slate-950 border-amber-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isAdminMode ? '🔓 Moderator Mode Active' : '🔒 Moderator Filter & Delete'}
          </button>
        </div>

        <div className="space-y-4">
          {submissions.map((sub, idx) => {
            const victimTitle = sub.victimAlias || `HBNC Victim ${submissions.length - idx}`;
            return (
              <div
                key={sub.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-300 text-sm font-mono tracking-wide bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-700/60">
                      {victimTitle}
                    </span>
                    {sub.bedNumber && (
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs font-mono">
                        Bed #{sub.bedNumber}
                      </span>
                    )}
                    {sub.riskLevel === 'HIGH_CORRELATION' && (
                      <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        High Toxicity Match
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">{sub.timestamp}</div>
                </div>

                {sub.stayDates && (
                  <div className="text-xs text-slate-400 mb-2 font-mono">
                    Stay Period: <span className="text-slate-300">{sub.stayDates}</span> &middot; Facility: <span className="text-slate-300">{sub.facilityLocation}</span>
                  </div>
                )}

                {sub.symptoms && sub.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {sub.symptoms.map((s, i) => (
                      <span
                        key={i}
                        className="bg-slate-900 border border-slate-800 text-emerald-400 text-[11px] px-2 py-0.5 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-sm text-slate-300 leading-relaxed font-serif mb-3 whitespace-pre-wrap">
                  {sub.notes}
                </p>

                {/* Form 700 Void Ab Initio Nexus Box */}
                <div className="bg-purple-950/30 border border-purple-800/50 rounded-lg p-3 text-xs mb-3 font-mono">
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold mb-1">
                    <Gavel className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Form 700 Void Ab Initio Nexus (Thomson v. Call / USA v. Sidhu):</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {sub.voidAbInitioDealCorrelation ||
                      'Infected by Deal 1 (17631 Cameron Lane allocation, Mitsuru Yamada trustee conflict, 0 Form 700 filings, UPX1978058). Void ab initio under Thomson v. Call (38 Cal.3d 633) with 100% strict disgorgement, directly parallel to Mayor Harry Sidhu in USA v. Sidhu (8:23-cr-00114-JWH).'}
                  </p>
                </div>

                {/* Matched Evidence Locker Exhibits */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 mb-3 flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className="text-slate-400 font-bold mr-1 flex items-center gap-1">
                    <FolderOpen className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>Cross-Matched Exhibits:</span>
                  </span>
                  {(sub.matchedEvidenceFiles && sub.matchedEvidenceFiles.length > 0
                    ? sub.matchedEvidenceFiles
                    : ['GeoTracker T10000018579', 'navigation_center_003.jpg', 'Laserfiche #5406552', 'HB_Shelter_Nov2023_photo_01.jpg']
                  ).map((ex, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-cyan-800/60 text-[10px]"
                    >
                      {ex}
                    </span>
                  ))}
                </div>

                {sub.fileName && (
                  <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-950/40 border border-blue-900/60 px-3 py-1.5 rounded mb-3 font-mono">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>Attached Evidence: {sub.fileName} ({sub.fileSize || 'Attached'})</span>
                  </div>
                )}

                {/* Coordinator Answer if present */}
                {sub.adminAnswer && (
                  <div className="bg-slate-900/90 border-l-4 border-l-emerald-500 p-3 rounded text-xs text-slate-200 mt-2">
                    <span className="font-bold text-emerald-400 block mb-0.5">Response from Anthony DiMarcello III:</span>
                    <p className="text-slate-300 font-sans">{sub.adminAnswer}</p>
                  </div>
                )}

              {/* Admin Moderation Tools */}
              {isAdminMode && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 p-2.5 rounded">
                  <div className="flex-1 min-w-[240px]">
                    <input
                      type="text"
                      placeholder="Add coordinator answer / verification note..."
                      value={adminAnswerText[sub.id] || ''}
                      onChange={(e) => setAdminAnswerText({ ...adminAnswerText, [sub.id]: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveAdminAnswer(sub.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Post Answer
                    </button>
                    <button
                      onClick={() => handleDeleteComment(sub.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-900/80 hover:bg-red-800 text-red-200 text-xs font-semibold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
