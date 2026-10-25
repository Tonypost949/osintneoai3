export interface DemoChapter {
  id: string;
  title: string;
  targetView: 'master' | 'ailaws' | 'outreach' | 'osint' | 'screener' | 'locker';
  targetElementId?: string;
  summaryText: string;
  narrationScript: string;
  durationEstimateSec: number;
}

export const DEMO_CHAPTERS: DemoChapter[] = [
  {
    id: 'intro',
    title: '1. Executive Call to Action & Core Demands',
    targetView: 'master',
    targetElementId: 'cta-action-hero',
    summaryText: 'Overview of the Huntington Beach Navigation Center case, the two claimants, and the 6 immediate actions required.',
    narrationScript: `Welcome to the HBNC Case 3 and OSINT Neo AI Evidentiary Command Center. A sixty-two-year-old disabled former aerospace worker, Elizabeth Petruccio, and her son and caregiver, Anthony DiMarcello, entered a publicly funded shelter in Huntington Beach, California. The facility was constructed over soil containing hexavalent chromium at forty-nine times the state residential screening level. Within nine weeks, Elizabeth was intubated in the intensive care unit with pleural empyema and sepsis, losing forty-four pounds. While she was fighting for her life in the ICU, the shelter terminated her bed and barred her from returning for thirty days. We are not asking for sympathy—every fact in this dossier is indexed to primary government contracts, GPS-stamped photographs, and hospital electronic health records. We are calling on civil rights attorneys, agency investigators, toxicologists, and physicians to inspect the record and take immediate action.`,
    durationEstimateSec: 45,
  },
  {
    id: 'site-smoking-gun',
    title: '2. The Contamination & 3-Document Smoking Gun',
    targetView: 'master',
    targetElementId: 'site-section',
    summaryText: 'Hexavalent chromium at 980 µg/kg, the County conditional approval, and the 1-year asphalt cap warranty with non-HAZWOPER laborers.',
    narrationScript: `Let us examine what lies beneath the sleeping floor. Environmental testing confirmed hexavalent chromium up to nine-hundred-eighty micrograms per kilogram, alongside lead, arsenic, and pesticide residues. County briefing document navigation center zero zero three proves the facility was approved for shelter occupancy only as long as an asphalt pavement cover was maintained over the soil. Yet City Contract Laserfiche five-four-zero-six-five-five-two shows that two-inch asphalt cap was given a warranty of only one year, and contractor proposal twenty-three-ninety explicitly admitted the installation crew was not forty-hour hazardous waste trained. On November seventh, twenty-twenty-three, Elizabeth photographed corroded anchor bolts puncturing that cap directly beneath resident beds, with raw contaminated sub-slab sand and soil spilling onto the sleeping floor. The only engineered barrier had failed.`,
    durationEstimateSec: 48,
  },
  {
    id: 'people-cluster',
    title: '3. The 6-Resident Pathology & Hospitalization Cluster',
    targetView: 'master',
    targetElementId: 'people-section',
    summaryText: 'Six residents in the same Sprung structure suffered severe pulmonary, pleural, septic, or cardiac hospitalizations, including two fatalities.',
    narrationScript: `This was not an isolated incident. Within a fourteen-month window, six residents sleeping in that exact structure were rushed to emergency rooms with pneumonia, pleural disease, sepsis, or cardiac trauma. Burt Bell died in early twenty-twenty-four; his coroner certificate confirmed pneumonia with environmental respiratory vulnerability. Jesse Knabb suffered recurrent chemical pneumonitis and empyema. Brian Bell submitted a signed grievance that shelter management left completely blank, and later died. Anthony DiMarcello suffered four fractured ribs, multiple pulmonary infiltrates, and permanent shoulder disability. And in Elizabeth Petruccio’s hospital record, social workers recorded 'Shelter History: HB Navigation Center' three times, yet across twenty-five physician notes, the shelter was omitted entirely, leaving the toxic exposure differential uninvestigated.`,
    durationEstimateSec: 52,
  },
  {
    id: 'ailaws-matrix',
    title: '4. The /ailaws Statutory Proof Matrix & Remedies',
    targetView: 'ailaws',
    targetElementId: 'ailaws-root',
    summaryText: 'Element-by-element proof mapping across ADA Title II, Fair Housing Act, RCRA § 6972, Elder Abuse § 15657, and § 1983 Monell liability.',
    narrationScript: `Under the ailaws framework, every legal cause of action is mapped directly to its statutory elements and corresponding documentary exhibits. Under ADA Title II and the Fair Housing Act, automatically expelling a hospitalized disabled resident and imposing a thirty-day lockout is a per se violation of reasonable accommodation mandates. Under RCRA citizen suit provisions, the failed asphalt cap over forty-nine times screening levels establishes imminent and substantial endangerment. And under California Welfare and Institutions Code section fifteen-six-fifty-seven, abandoning a dependent adult while in intensive care triggers enhanced remedies, including mandatory attorney's fees. Our one-click legal notice generator produces ready-to-file intake memos, reasonable accommodation demands, and litigation hold notices in seconds.`,
    durationEstimateSec: 50,
  },
  {
    id: 'outreach-telemetry',
    title: '5. Outreach Analytics & Active Federal Dockets',
    targetView: 'outreach',
    targetElementId: 'outreach-root',
    summaryText: '184 cataloged dispatches, 76 public filings, and verified federal control numbers including GAO COMP-26-004512 and FBI 20IC002.',
    narrationScript: `Our outreach dashboard tracks one hundred eighty-four cataloged dispatches between twenty-twenty-one and twenty-twenty-six. This includes seventy-six public sector filings across federal, state, and municipal agencies. The evidentiary significance is profound: we have established constructive administrative notice and legal exhaustion. Active federal control numbers include GAO FraudNet docket C-O-M-P twenty-six zero zero four-five-one-two for federal grant fraud, and FBI IC-three public corruption docket twenty-I-C-zero-zero-two. Secondary referrals span the CFTC, FEMA, and academic law clinics at Loyola, USC, and Stanford.`,
    durationEstimateSec: 42,
  },
  {
    id: 'screener-upload',
    title: '6. Victim Contamination Screener & Direct Upload',
    targetView: 'screener',
    targetElementId: 'screener-root',
    summaryText: 'No-login exposure symptom checker, single file record upload, public comments, and direct email notification to amd949609@gmail.com.',
    narrationScript: `If you or someone you know was a resident, staff member, or visitor at the Huntington Beach Navigation Center, you can use our interactive Contamination Screener right now without logging in. Select your documented symptoms, specify your bed number and stay dates, or upload a single medical record or photograph. Our screening engine cross-references your profile against known toxic endpoints and resident illness clusters. You can leave comments or testimony that the case coordinator will personally review, verify, and moderate. Submissions are transmitted directly to the case coordinator's verified email at a-m-d nine-four-nine six-zero-nine at gmail dot com. You are not alone, and your voice matters.`,
    durationEstimateSec: 46,
  },
];

export class AudioNarrationController {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private currentChapterIndex = 0;
  private playbackRate = 1.0;
  private onChapterChange?: (chapter: DemoChapter, index: number) => void;
  private onStateChange?: (state: { isPlaying: boolean; isPaused: boolean; currentChapterIndex: number }) => void;

  constructor(
    onChapterChange?: (chapter: DemoChapter, index: number) => void,
    onStateChange?: (state: { isPlaying: boolean; isPaused: boolean; currentChapterIndex: number }) => void
  ) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
    this.onChapterChange = onChapterChange;
    this.onStateChange = onStateChange;
  }

  public setRate(rate: number) {
    this.playbackRate = rate;
    if (this.isSpeaking && !this.isPaused) {
      // Restart current chapter with new rate
      const idx = this.currentChapterIndex;
      this.stop();
      this.playChapter(idx);
    }
  }

  public playChapter(index: number) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }
    this.stop();

    if (index < 0 || index >= DEMO_CHAPTERS.length) {
      this.currentChapterIndex = 0;
    } else {
      this.currentChapterIndex = index;
    }

    const chapter = DEMO_CHAPTERS[this.currentChapterIndex];
    if (this.onChapterChange) {
      this.onChapterChange(chapter, this.currentChapterIndex);
    }

    const utterance = new SpeechSynthesisUtterance(chapter.narrationScript);
    utterance.rate = this.playbackRate;
    utterance.pitch = 1.0;

    // Pick best available English voice
    const voices = this.synth.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')))
      || voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notifyState();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyState();
      // Auto-advance to next chapter if available
      if (this.currentChapterIndex < DEMO_CHAPTERS.length - 1) {
        setTimeout(() => {
          this.playChapter(this.currentChapterIndex + 1);
        }, 800);
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyState();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    this.notifyState();
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notifyState();
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyState();
    } else if (!this.isSpeaking) {
      this.playChapter(this.currentChapterIndex);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.notifyState();
  }

  public next() {
    const nextIdx = Math.min(this.currentChapterIndex + 1, DEMO_CHAPTERS.length - 1);
    this.playChapter(nextIdx);
  }

  public prev() {
    const prevIdx = Math.max(this.currentChapterIndex - 1, 0);
    this.playChapter(prevIdx);
  }

  public getCurrentIndex(): number {
    return this.currentChapterIndex;
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isSpeaking && !this.isPaused,
        isPaused: this.isPaused,
        currentChapterIndex: this.currentChapterIndex,
      });
    }
  }
}
