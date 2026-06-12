// ---------------------------------------------------------------------------
// Assessment runtime helpers — Phase 4.
//
// This module is the single source of truth for:
//   1. Question/answer types shared by the runner + routes
//   2. Scoring (the judgment / short_rationale exclusion rule lives here)
//   3. Client-side unlock evaluation against Supabase progress
//   4. Attempt persistence to public.assessment_attempts
//
// It is imported by the client islands (AssessmentRunner) and by the Astro
// routes that build the props at compile time. It deliberately does NOT import
// `astro:content` or `src/lib/course.ts` so it is safe to bundle into a browser
// island — the routes pass any registry-derived data (lesson slugs, required
// assessment ids) in as plain props.
//
// Phase 2 (module index pages) and Phase 7 (dashboard + certificate) reuse the
// status + unlock exports; keep their signatures stable.
// ---------------------------------------------------------------------------

import { getSupabase } from './supabase';
import { trackEvent } from './analytics';

export type AssessmentType = 'module' | 'milestone' | 'final';

export type QuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'judgment'
  | 'matching'
  | 'ordering'
  | 'ranking'
  | 'short_rationale';

export interface AssessmentOption {
  text: string;
  correct?: boolean;
  feedback?: string;
  rationale?: string;
}

export interface AssessmentPair {
  left: string;
  right: string;
}

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  stem: string;
  difficulty?: string;
  no_single_correct?: boolean;
  options?: AssessmentOption[];
  pairs?: AssessmentPair[];
  items?: string[];
  correct_order?: string[];
  synthesis?: string;
  feedback?: string;
  guidance?: string;
  /** Section title, injected when flattening the final assessment's sections. */
  section?: string;
}

/** Top-level assessment data passed from a route into the runner island. */
export interface AssessmentData {
  id: string;
  title: string;
  type: AssessmentType;
  pass_threshold: number;
  distinction_threshold?: number;
  scenario?: string;
  scenario_brief?: string;
  questions: AssessmentQuestion[];
}

// ---------------------------------------------------------------------------
// Answers
// ---------------------------------------------------------------------------

export interface ShortRationaleAnswer {
  text: string;
  /** Learner self-assessed that their answer matches the guidance. */
  acknowledged: boolean;
}

/**
 * Per-question answer shapes keyed by question type:
 *   multiple_choice / true_false / judgment -> selected option index (number)
 *   multiple_select                         -> selected option indices (number[])
 *   matching                                -> left label -> chosen right value
 *   ordering / ranking                      -> current ordered list of item labels
 *   short_rationale                         -> free text + self-assessment flag
 */
export type Answer =
  | number
  | number[]
  | Record<string, string>
  | string[]
  | ShortRationaleAnswer
  | undefined;

export type AnswerMap = Record<string, Answer>;

// ---------------------------------------------------------------------------
// Scoring
//
// Scoring rule (documented for Phases 2 / 7):
//   - `judgment` and `short_rationale` questions are NEVER scored as
//     right/wrong. They are excluded from BOTH the numerator and the
//     denominator. A judgment moment has no single correct answer; a short
//     rationale is self-assessed against guidance, not auto-graded.
//   - Score = (correct scored questions) / (total scored questions), a 0–1
//     fraction compared directly against `pass_threshold`.
//   - Degenerate case: if an assessment has zero scored questions, score = 1
//     and it passes (there is nothing objective to fail).
// ---------------------------------------------------------------------------

const UNSCORED_TYPES: ReadonlySet<QuestionType> = new Set([
  'judgment',
  'short_rationale',
]);

export function isScored(question: AssessmentQuestion): boolean {
  return !UNSCORED_TYPES.has(question.type);
}

/** The set of distinct right-hand values offered for a matching question. */
export function matchingChoices(question: AssessmentQuestion): string[] {
  const seen = new Set<string>();
  const choices: string[] = [];
  for (const pair of question.pairs ?? []) {
    if (!seen.has(pair.right)) {
      seen.add(pair.right);
      choices.push(pair.right);
    }
  }
  return choices;
}

/** Whether a learner has supplied a usable answer for this question. */
export function isAnswered(question: AssessmentQuestion, answer: Answer): boolean {
  switch (question.type) {
    case 'multiple_choice':
    case 'true_false':
    case 'judgment':
      return typeof answer === 'number';
    case 'multiple_select':
      return Array.isArray(answer) && (answer as number[]).length > 0;
    case 'matching': {
      const record = (answer as Record<string, string>) ?? {};
      const pairs = question.pairs ?? [];
      return pairs.length > 0 && pairs.every((pair) => Boolean(record[pair.left]));
    }
    case 'ordering':
    case 'ranking':
      return Array.isArray(answer) && (answer as string[]).length > 0;
    case 'short_rationale': {
      const value = answer as ShortRationaleAnswer | undefined;
      return Boolean(value && value.text.trim().length > 0);
    }
    default:
      return answer !== undefined;
  }
}

/**
 * Grade one question.
 * Returns `scored: false` for judgment / short_rationale (no correctness).
 * For scored types, `correct` is a boolean.
 */
export function gradeQuestion(
  question: AssessmentQuestion,
  answer: Answer
): { scored: boolean; correct: boolean } {
  if (!isScored(question)) return { scored: false, correct: false };

  switch (question.type) {
    case 'multiple_choice':
    case 'true_false': {
      const index = answer as number | undefined;
      const option = index === undefined ? undefined : question.options?.[index];
      return { scored: true, correct: Boolean(option?.correct) };
    }
    case 'multiple_select': {
      const selected = new Set((answer as number[]) ?? []);
      const options = question.options ?? [];
      const correct = options.every((option, index) =>
        Boolean(option.correct) === selected.has(index)
      );
      return { scored: true, correct };
    }
    case 'matching': {
      const record = (answer as Record<string, string>) ?? {};
      const pairs = question.pairs ?? [];
      const correct =
        pairs.length > 0 && pairs.every((pair) => record[pair.left] === pair.right);
      return { scored: true, correct };
    }
    case 'ordering':
    case 'ranking': {
      const order = (answer as string[]) ?? [];
      const target = question.correct_order ?? [];
      const correct =
        order.length === target.length &&
        order.every((item, index) => item === target[index]);
      return { scored: true, correct };
    }
    default:
      return { scored: true, correct: false };
  }
}

export interface ScoreResult {
  /** Number of scored questions answered correctly. */
  correct: number;
  /** Total number of scored questions (excludes judgment / short_rationale). */
  scoredTotal: number;
  /** Total number of questions presented (for display only). */
  presentedTotal: number;
  /** 0–1 fraction; compared against pass_threshold. */
  score: number;
  passed: boolean;
  distinction: boolean;
}

export function scoreAssessment(
  assessment: AssessmentData,
  answers: AnswerMap
): ScoreResult {
  const questions = assessment.questions;
  let correct = 0;
  let scoredTotal = 0;

  for (const question of questions) {
    const result = gradeQuestion(question, answers[question.id]);
    if (!result.scored) continue;
    scoredTotal += 1;
    if (result.correct) correct += 1;
  }

  const score = scoredTotal === 0 ? 1 : correct / scoredTotal;
  const passed = score >= assessment.pass_threshold;
  const distinction =
    assessment.distinction_threshold !== undefined &&
    score >= assessment.distinction_threshold;

  return {
    correct,
    scoredTotal,
    presentedTotal: questions.length,
    score,
    passed,
    distinction,
  };
}

// ---------------------------------------------------------------------------
// Progress + unlock
// ---------------------------------------------------------------------------

export interface AssessmentStatus {
  assessmentId: string;
  /** True if any attempt for this assessment passed. */
  passed: boolean;
  /** Highest score across all attempts (0–1). */
  bestScore: number;
  /** Number of attempts recorded. */
  attempts: number;
  /** Highest attempt_number seen (next attempt = this + 1). */
  lastAttemptNumber: number;
}

export interface ProgressSnapshot {
  completedLessonSlugs: string[];
  statuses: Map<string, AssessmentStatus>;
}

export interface UnlockSpec {
  kind: AssessmentType;
  /** module: every lesson slug here must be completed. */
  moduleLessonSlugs?: string[];
  /** milestone + final: every assessment id here must be passed. */
  requiredAssessmentIds?: string[];
  /** final: every milestone id here must be passed. */
  requiredMilestoneIds?: string[];
}

export interface UnlockResult {
  unlocked: boolean;
  /** Human-readable reason shown in the locked state. */
  reason: string;
}

export function isAssessmentPassed(
  statuses: Map<string, AssessmentStatus>,
  assessmentId: string
): boolean {
  return statuses.get(assessmentId)?.passed ?? false;
}

/**
 * Evaluate whether an assessment is unlocked for the current learner.
 * Pure over the provided snapshot so it can be unit-tested and reused by
 * Phases 2 / 7.
 */
export function evaluateUnlock(
  spec: UnlockSpec,
  progress: ProgressSnapshot
): UnlockResult {
  if (spec.kind === 'module') {
    const required = spec.moduleLessonSlugs ?? [];
    const done = new Set(progress.completedLessonSlugs);
    const remaining = required.filter((slug) => !done.has(slug));
    if (remaining.length === 0) {
      return { unlocked: true, reason: '' };
    }
    const count = remaining.length;
    return {
      unlocked: false,
      reason: `Complete all ${required.length} lessons in this module to unlock the assessment. ${count} ${
        count === 1 ? 'lesson is' : 'lessons are'
      } still incomplete.`,
    };
  }

  if (spec.kind === 'milestone') {
    const required = spec.requiredAssessmentIds ?? [];
    const remaining = required.filter((id) => !isAssessmentPassed(progress.statuses, id));
    if (remaining.length === 0) {
      return { unlocked: true, reason: '' };
    }
    return {
      unlocked: false,
      reason: `Pass all ${required.length} module assessments in this part to unlock the milestone. ${remaining.length} still to pass.`,
    };
  }

  // final
  const requiredAssessments = spec.requiredAssessmentIds ?? [];
  const requiredMilestones = spec.requiredMilestoneIds ?? [];
  const remainingModules = requiredAssessments.filter(
    (id) => !isAssessmentPassed(progress.statuses, id)
  );
  const remainingMilestones = requiredMilestones.filter(
    (id) => !isAssessmentPassed(progress.statuses, id)
  );
  if (remainingModules.length === 0 && remainingMilestones.length === 0) {
    return { unlocked: true, reason: '' };
  }
  const parts: string[] = [];
  if (remainingModules.length > 0) {
    parts.push(
      `${remainingModules.length} of ${requiredAssessments.length} module assessments`
    );
  }
  if (remainingMilestones.length > 0) {
    parts.push(`${remainingMilestones.length} of ${requiredMilestones.length} milestones`);
  }
  return {
    unlocked: false,
    reason: `Pass all 11 module assessments and 3 milestones to unlock the final. Still to pass: ${parts.join(
      ' and '
    )}.`,
  };
}

// ---------------------------------------------------------------------------
// Supabase reads
// ---------------------------------------------------------------------------

/**
 * Fetch completed lesson slugs for the signed-in user.
 * Returns [] when Supabase is unconfigured or no user is signed in.
 */
export async function fetchCompletedLessonSlugs(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_slug')
    .eq('user_id', user.id)
    .not('completed_at', 'is', null);

  return (data ?? []).map((row) => row.lesson_slug as string);
}

/**
 * Fetch and reduce assessment attempts into a status map keyed by assessment id.
 * Reused by the dashboard (Phase 7) and module pages (Phase 2).
 */
export async function fetchAssessmentStatuses(): Promise<Map<string, AssessmentStatus>> {
  const statuses = new Map<string, AssessmentStatus>();
  const supabase = getSupabase();
  if (!supabase) return statuses;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return statuses;

  const { data } = await supabase
    .from('assessment_attempts')
    .select('assessment_id, score, passed, attempt_number')
    .eq('user_id', user.id);

  for (const row of data ?? []) {
    const id = row.assessment_id as string;
    const score = Number(row.score);
    const passed = Boolean(row.passed);
    const attemptNumber = Number(row.attempt_number);
    const existing = statuses.get(id);
    if (!existing) {
      statuses.set(id, {
        assessmentId: id,
        passed,
        bestScore: score,
        attempts: 1,
        lastAttemptNumber: attemptNumber,
      });
    } else {
      existing.passed = existing.passed || passed;
      existing.bestScore = Math.max(existing.bestScore, score);
      existing.attempts += 1;
      existing.lastAttemptNumber = Math.max(existing.lastAttemptNumber, attemptNumber);
    }
  }

  return statuses;
}

/** Convenience: status for a single assessment id (null if none recorded). */
export async function fetchAssessmentStatus(
  assessmentId: string
): Promise<AssessmentStatus | null> {
  const statuses = await fetchAssessmentStatuses();
  return statuses.get(assessmentId) ?? null;
}

/** Load everything the runner needs to decide unlock + show prior results. */
export async function fetchProgressSnapshot(): Promise<ProgressSnapshot> {
  const [completedLessonSlugs, statuses] = await Promise.all([
    fetchCompletedLessonSlugs(),
    fetchAssessmentStatuses(),
  ]);
  return { completedLessonSlugs, statuses };
}

// ---------------------------------------------------------------------------
// Supabase writes
// ---------------------------------------------------------------------------

export interface RecordAttemptInput {
  assessmentId: string;
  assessmentType: AssessmentType;
  /** 0–1 fraction. */
  score: number;
  passed: boolean;
}

export interface RecordAttemptResult {
  ok: boolean;
  attemptNumber?: number;
  error?: string;
}

/**
 * Persist one scored attempt. Computes the next attempt_number for this
 * user + assessment so retries don't collide with the unique constraint
 * (user_id, assessment_id, attempt_number).
 */
export async function recordAssessmentAttempt(
  input: RecordAttemptInput
): Promise<RecordAttemptResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: 'Progress tracking is not configured.' };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'You must be signed in to save your attempt.' };
  }

  const { data: existing, error: readError } = await supabase
    .from('assessment_attempts')
    .select('attempt_number')
    .eq('user_id', user.id)
    .eq('assessment_id', input.assessmentId)
    .order('attempt_number', { ascending: false })
    .limit(1);

  if (readError) {
    return { ok: false, error: readError.message };
  }

  const lastAttempt = existing?.[0]?.attempt_number ?? 0;
  const attemptNumber = Number(lastAttempt) + 1;

  // Round to the column scale (numeric(5,4)) to avoid precision surprises.
  const score = Math.round(input.score * 10000) / 10000;

  const { error: writeError } = await supabase.from('assessment_attempts').insert({
    user_id: user.id,
    assessment_id: input.assessmentId,
    assessment_type: input.assessmentType,
    score,
    passed: input.passed,
    attempt_number: attemptNumber,
  });

  if (writeError) {
    return { ok: false, error: writeError.message };
  }

  void trackEvent(input.passed ? 'assessment_passed' : 'assessment_failed', {
    assessment_id: input.assessmentId,
    assessment_type: input.assessmentType,
    score,
    attempt_number: attemptNumber,
  });

  return { ok: true, attemptNumber };
}
