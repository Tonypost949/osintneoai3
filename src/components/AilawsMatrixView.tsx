import React, { useState } from 'react';
import { STATUTORY_CLAIMS } from '../utils/statutoryData';
import { StatutoryClaim } from '../types';
import { Scale, FileText, Copy, Download, Clock, AlertTriangle, ShieldCheck, Check, Gavel, Filter } from 'lucide-react';

interface AilawsMatrixViewProps {
  onOpenFileInViewer: (filename: string) => void;
}

const TEMPLATES: Record<string, string> = {
  intake: `MEMORANDUM FOR LEGAL INTAKE / CO-COUNSEL EVALUATION
RE: HBNC Case 3 — Environmental Toxic Exposure, ADA/FHA Medical-Exit Expulsion & Dependent Adult Neglect
CLAIMANTS: Elizabeth Tina Petruccio (DOB 07/29/1964) & Anthony Michael DiMarcello III (DOB 05/04/1983)
CONTACT: amd949609@gmail.com
SITE: Huntington Beach Navigation Center (17631 Cameron Lane, Huntington Beach, CA 92648)
OPERATOR: Mercy House Living Centers | MUNICIPAL ENTITIES: City of Huntington Beach / County of Orange
RELATED FEDERAL ACTION: Knabb v. City of Huntington Beach et al., No. 8:26-cv-00348-JWH-ADS (C.D. Cal.) (SAVC ECF 115; Opp. MTD ECF 130)

I. EXECUTIVE SUMMARY OF DOCUMENTED CLAIMS
We are requesting formal legal evaluation and representation regarding severe personal injuries, disability discrimination, and unlawful shelter expulsion arising from our residency at the Huntington Beach Navigation Center (HBNC). Unlike typical pro se intakes, our file is completely indexed to primary government contracts, GPS-stamped photographs, and a 1,400+ page hospital Electronic Health Record (EHR).

II. FOUR ANCHOR EXHIBITS READY FOR IMMEDIATE INSPECTION
1. THE CONDITIONAL APPROVAL & 1-YEAR CAP WARRANTY:
   - EEC Phase II (08/03/2020) documented soil hexavalent chromium [Cr(VI)] up to 980 ug/kg (49x the DTSC residential screening level of 20 ug/kg), plus lead, arsenic, toxaphene, and 4,4'-DDE.
   - County briefing (Exhibit: navigation_center_003.jpg) states the site was approved for shelter occupancy ONLY "as long as an asphalt pavement cover was placed over the soil."
   - City contract with TTS Engineering (Laserfiche #5406552, $2,410,716.24) warranted that 2-inch asphalt cap for only ONE (1) YEAR, and Proposal #20390 states: "CREW INSTALLING AC WILL NOT BE 40-HOUR TRAINED."

2. GPS-STAMPED PHOTOGRAPHIC PROOF OF CAP BREACH (NOVEMBER 7, 2023):
   - Exhibits HB_Shelter_Nov2023_photo_01.jpg through photo_08.jpg (taken 11/07/2023, 12:20–12:36 PM PST, GPS 33.706389, -117.988611) show corroded steel anchor bolts driven through the floor cap beneath resident beds, with raw sub-slab sand/soil on the sleeping floor.

3. LIFE-THREATENING ILLNESS CLUSTER & AUTOMATIC EXPULSION FROM ICU (JANUARY 2024):
   - On 01/12/2024, Ms. Petruccio was admitted to Scripps Mercy (36 days inpatient + 26 days SNF) with right pleural empyema (103,752 WBC), bilateral cavitary pneumonia, sepsis, acute hypercapnic respiratory failure requiring intubation, and C4–C5 discitis-osteomyelitis. Her weight dropped from 160 lb to 116 lb.
   - Five other residents in the same structure suffered severe pulmonary, pleural, septic, or cardiac hospitalizations.
   - On 01/19/2024, while Ms. Petruccio was in the ICU, hospital social worker Bettina S. documented in her chart (Exhibit: scripps_ehr_page_985.png) that the shelter exited her from the program under a 7-day hospitalization rule and barred her from returning for 30 days.

4. THE MEDICAL CHART OMISSION:
   - Social workers recorded "SHELTER HISTORY: HB Navigation Center" on pages 985, 1034, and 1051 of her chart, yet across 25+ physician notes and the discharge summary (pp. 654–983), the shelter is never mentioned.

III. STATUTORY CAUSES OF ACTION & FEE-SHIFTING HOOKS
- ADA Title II (42 U.S.C. § 12132) & Rehabilitation Act § 504 (29 U.S.C. § 794) / Cal. Gov. Code § 11135
- Fair Housing Act (42 U.S.C. § 3604(f)(3)(B)) & Cal. FEHA
- California Elder & Dependent Adult Civil Protection Act (Welf. & Inst. Code § 15657 — unilateral attorney's fees)
- California Unruh & Tom Bane Civil Rights Acts (Civ. Code §§ 51, 52, 52.1)
- Premises Liability / Negligence against private operator Mercy House Living Centers (CCP § 335.1)

Please advise when we may transmit the Master Evidence Locker link for conflict check and intake review.`,

  ada: `FORMAL REQUEST FOR REASONABLE ACCOMMODATION, POLICY MODIFICATION & SUPPORTIVE HOUSING PLACEMENT
PURSUANT TO ADA TITLE II (42 U.S.C. § 12132; 28 C.F.R. § 35.130(b)(7)), REHABILITATION ACT § 504 (29 U.S.C. § 794), FAIR HOUSING ACT (42 U.S.C. § 3604(f)(3)(B)), AND CAL. GOV. CODE § 11135

TO: ADA / § 504 Coordinator & Executive Director, Mercy House Living Centers
    ADA Title II Coordinator, City of Huntington Beach & County of Orange Office of Care Coordination
FROM: Elizabeth Tina Petruccio (DOB 07/29/1964) and Anthony Michael DiMarcello III (DOB 05/04/1983, Caregiver)
EMAIL: amd949609@gmail.com

1. QUALIFIED DISABILITY STATUS:
Ms. Petruccio is a 62-year-old disabled woman with documented history of severe bilateral cavitary pneumonia, right pleural empyema, sepsis, acute hypercapnic respiratory failure, and C4–C5 spinal discitis-osteomyelitis (Scripps Mercy / Mission Hills SNF, Jan–Mar 2024). Mr. DiMarcello is her son and caregiver and has a permanently impaired left shoulder (comminuted proximal humerus fracture with posterior dislocation) and documented pulmonary disease.

2. CHALLENGED POLICY & PRIOR ADVERSE ACTION:
As documented in Ms. Petruccio's hospital chart on January 19, 2024 (Scripps EHR p. 985), while she was hospitalized in intensive care, the Huntington Beach Navigation Center exited her from the program pursuant to its 7-day hospitalization policy and imposed a 30-day ban on her return. Penalizing a disabled resident with loss of shelter and a 30-day bar because of an inpatient hospitalization for a life-threatening illness violates the reasonable-modification mandate of 28 C.F.R. § 35.130(b)(7) and the Fair Housing Act, 42 U.S.C. § 3604(f)(3)(B).

3. SPECIFIC ACCOMMODATIONS REQUESTED:
   (a) Written confirmation that neither Ms. Petruccio nor Mr. DiMarcello will be exited, penalized, or subjected to a 30-day re-entry bar due to any past or future disability-related emergency department visit or inpatient hospitalization;
   (b) Placement in a habitable, non-congregate / permanent supportive housing unit (consistent with the integration mandate of Olmstead v. L.C., 527 U.S. 581 (1999)) free from unsealed sub-slab soil exposure; and
   (c) A written explanation of the criteria used for supportive housing placements (including Oasis placements) from which we were excluded despite being original shelter residents.

Please provide a written determination to amd949609@gmail.com within ten (10) business days.`,

  hipaa: `WRITTEN REQUEST FOR DESIGNATED RECORD SET (45 C.F.R. § 164.524) AND REQUEST FOR AMENDMENT OF PROTECTED HEALTH INFORMATION (45 C.F.R. § 164.526)

TO: Health Information Management / Medical Records & Privacy Officer
    Scripps Mercy Hospital
RE: Patient: Elizabeth Tina Petruccio | DOB: 07/29/1964
    Admission Dates: January 12, 2024 – February 17, 2024 (and related outpatient/SNF records)

1. REQUEST FOR AMENDMENT UNDER 45 C.F.R. § 164.526:
Pursuant to 45 C.F.R. § 164.526, I formally request an amendment/addendum to the History & Physical, Physician Progress Notes, Infectious Disease / Pulmonary Consultations, and Discharge Summary (specifically pages 654–983 of the chart) to reflect accurate housing and environmental exposure history already recorded elsewhere in the same chart:
   - On Page 1051 (01/13/2024, Channy RN), Page 1034 (01/15/2024, Ada R., LCSW), and Page 985 (01/19/2024, Bettina S., SW), hospital staff explicitly documented: "SHELTER HISTORY: HB Navigation Center" (17631 Cameron Lane, Huntington Beach, CA) and noted that the shelter exited the patient while hospitalized.
   - However, the intake box and 25+ physician notes erroneously state "homeless, unsheltered" or "squatting with friends" and omit all reference to the Huntington Beach Navigation Center—a facility sited over documented hexavalent chromium soil contamination with a breached asphalt floor cap beneath the patient's bed (photographed November 7, 2023).

Please append this formal clarification and cross-reference Pages 985, 1034, and 1051 to the Discharge Summary and Problem List so that all future treating and reviewing physicians have an accurate environmental and housing history.

2. REQUEST FOR COMPLETE DESIGNATED RECORD SET & AUDIT LOGS (45 C.F.R. § 164.524):
Please provide in electronic format (PDF) any remaining unproduced social work, case management, discharge planning communications with Mercy House Living Centers / Huntington Beach Navigation Center, and EHR access/modification audit logs for the intake housing status field.

Please send written confirmation of this amendment within sixty (60) days pursuant to 45 C.F.R. § 164.526(b)(2) to amd949609@gmail.com.`,

  hold: `NOTICE OF DUTY TO PRESERVE EVIDENCE AND LITIGATION HOLD
RE: Huntington Beach Navigation Center (17631 Cameron Lane / 17642 Beach Blvd, Huntington Beach, CA 92648)
CLAIMANTS: Elizabeth Tina Petruccio & Anthony Michael DiMarcello III

TO: City Attorney & Risk Management, City of Huntington Beach
    County Counsel & Office of Care Coordination, County of Orange
    General Counsel & Executive Director, Mercy House Living Centers

PLEASE TAKE NOTICE that Elizabeth Tina Petruccio and Anthony Michael DiMarcello III anticipate formal legal and administrative proceedings (in addition to pending related federal litigation in Knabb v. City of Huntington Beach et al., No. 8:26-cv-00348-JWH-ADS (C.D. Cal.)) arising from environmental conditions, asphalt cap maintenance failures, disability accommodations, and resident exits at the Huntington Beach Navigation Center.

You are hereby notified of your legal obligation to immediately preserve and suspend any routine deletion, overwriting, or destruction of all physical and electronic records (ESI) relating to:
1. All inspection, maintenance, repair, and warranty records for the 2-inch asphalt pavement cover installed under City Contract Doc ID 20-9041/235642 (Laserfiche #5406552) and the $75,000 Sprung structure base-seal repair allocation in the April 29, 2026 HHAP MOU;
2. All indoor air, dust wipe, soil gas, and sub-slab sampling data or consultant communications for 17631 Cameron Lane from August 2020 to the present;
3. Complete HMIS records, bed logs, intake thumbprint/photo files, grievance logs, medical-exit records, 30-day ban notices, and supportive housing (including Oasis) referral/scoring records for Elizabeth Tina Petruccio, Anthony Michael DiMarcello III, Jesse Knabb, Burt Bell, Brian Bell, and Curtis M. Simcox;
4. All communications between Mercy House staff and Scripps Mercy Hospital, Hoag Hospital, or Mission Hills SNF between October 2023 and April 2024.

Failure to preserve these materials may result in evidentiary sanctions, adverse-inference instructions, and statutory penalties for spoliation of evidence.`
};

export const AilawsMatrixView: React.FC<AilawsMatrixViewProps> = ({ onOpenFileInViewer }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'disability' | 'environmental' | 'elder' | 'constitutional'>('all');
  const [currentTemplateKey, setCurrentTemplateKey] = useState<string>('intake');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  const filteredClaims = selectedCategory === 'all'
    ? STATUTORY_CLAIMS
    : STATUTORY_CLAIMS.filter((c) => c.category === selectedCategory);

  const handleCopyText = () => {
    navigator.clipboard.writeText(TEMPLATES[currentTemplateKey]);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleDownloadTxt = () => {
    const text = TEMPLATES[currentTemplateKey];
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `HBNC_Case3_${currentTemplateKey}_notice.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div id="ailaws-root" className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border-2 border-blue-600/80 rounded-xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-extrabold text-white">
              /ailaws — Interactive Statutory Proof Matrix &amp; Demands
            </h2>
          </div>
          <span className="text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2.5 py-1 rounded font-bold">
            8 Causes of Action &middot; 4 Legal Demand Generators
          </span>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-4 font-serif">
          Every cause of action below is mapped to: <b>(1) Controlling Elements Required to Prove Liability</b>, <b>(2) Exact Evidence Files in the Dossier</b>, and <b>(3) Statutory Remedies &amp; Fee-Shifting Hooks</b>. Clocks are actively running under California Government Code § 911.2 and Code of Civil Procedure § 335.1.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: 'All 8 Claims' },
            { id: 'disability', label: 'Disability & Housing Civil Rights (ADA/FHA/§504)' },
            { id: 'environmental', label: 'Environmental & Toxic Tort (RCRA/Cr6)' },
            { id: 'elder', label: 'Elder & Dependent Adult Neglect (§15657)' },
            { id: 'constitutional', label: '§1983 Monell & Retaliation' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statutory Proof Matrix Cards */}
      <div className="space-y-6 mb-12">
        {filteredClaims.map((claim) => (
          <div
            key={claim.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-6 shadow-lg transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{claim.title}</h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded mt-1 inline-block">
                  {claim.statuteCitation}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{claim.clock}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-4">
              {/* Elements */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Elements to Prove
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {claim.elementsToProve.map((el, idx) => (
                    <li key={idx} className="leading-relaxed">{el}</li>
                  ))}
                </ul>
              </div>

              {/* Record Proof Files */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Record Proof in Dossier
                </h4>
                <div className="space-y-2">
                  {claim.recordProofFiles.map((proof, idx) => (
                    <div key={idx} className="border-b border-slate-900 pb-1.5 last:border-none">
                      <span
                        onClick={() => onOpenFileInViewer(proof.filename)}
                        className="font-mono text-blue-400 font-semibold cursor-pointer hover:underline block truncate"
                      >
                        {proof.filename}
                      </span>
                      <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">{proof.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remedies */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Remedies &amp; Fee-Shifting Hooks
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {claim.remedies.map((rem, idx) => (
                    <li key={idx} className="leading-relaxed">{rem}</li>
                  ))}
                </ul>
                {claim.keyCaseLaw && (
                  <div className="mt-2 pt-2 border-t border-slate-900 text-[10px] text-amber-300 font-mono">
                    Case Law: {claim.keyCaseLaw}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 1-Click Action & Demand Generator */}
      <section id="gen-box-section" className="bg-slate-900 border-2 border-blue-500/80 rounded-xl p-6 sm:p-8 shadow-2xl mb-8">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span>⚡ 1-Click Legal Action &amp; Demand Generator</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Select a template below to load a formal notice populated with the exact contract numbers, dates, and medical record citations:
        </p>

        {/* Template Buttons */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {[
            { id: 'intake', label: '1. Counsel Intake & Case Evaluation Memo' },
            { id: 'ada', label: '2. ADA / FHA Reasonable Accommodation Demand' },
            { id: 'hipaa', label: '3. HIPAA § 164.526 EHR Amendment Request' },
            { id: 'hold', label: '4. Evidence Preservation & Spoliation Hold Notice' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setCurrentTemplateKey(t.id)}
              className={`px-3.5 py-2 rounded-lg font-semibold transition-all ${
                currentTemplateKey === t.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Textarea Output */}
        <textarea
          readOnly
          value={TEMPLATES[currentTemplateKey]}
          rows={14}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 leading-relaxed outline-none focus:border-blue-500 mb-4"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Copy into any word processor, email client, or legal pleading software.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              {copiedSuccess ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSuccess ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download .TXT File</span>
            </button>
          </div>
        </div>
      </section>

      {/* Prominent Legal Disclaimer */}
      <div className="bg-red-950/30 border border-red-800/60 rounded-xl p-4 text-xs text-red-200 leading-relaxed font-sans">
        <strong className="block text-red-300 font-bold mb-1 uppercase tracking-wide">
          Important Evidentiary Disclaimer:
        </strong>
        This <code>/ailaws</code> tool is an organizational and analytical aid prepared by the parties for counsel, investigators, and reviewing agencies. It does not constitute formal legal representation or legal advice. Statutory claim-presentation deadlines under California Government Code § 911.2 and limitations periods under Code of Civil Procedure § 335.1 are jurisdictional and strictly enforced; every deadline must be independently verified by a licensed California attorney based on the actual facts.
      </div>
    </div>
  );
};
