import type { SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Client-side progress helpers.
//
// Pages in the learning zone are statically rendered, so anything that depends
// on the logged-in user (lesson completion, assessment pass/fail) must be
// resolved in a client island reading Supabase. These helpers centralise those
// reads so the status islands stay small and consistent.
//
// Tables (see supabase/migrations):
//   lesson_progress      — user_id, lesson_slug, completed_at
//   assessment_attempts  — user_id, assessment_id, passed, score
//
// `assessment_attempts` is owned by Phase 4. Reads here are defensive: if the
// table is missing or the query fails, callers fall back to lesson-only status
// (locked/available) and badges simply won't show passed/failed yet.
// ---------------------------------------------------------------------------

export type AssessmentStatus = 'locked' | 'available' | 'passed' | 'failed';

export interface AssessmentAttempt {
  passed: boolean;
  score: number | null;
}

/** Resolve the current authenticated user id, or null if signed out / unconfigured. */
export async function getCurrentUserId(supabase: SupabaseClient): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Set of lesson slugs the user has marked complete (completed_at not null). */
export async function fetchCompletedLessons(
  supabase: SupabaseClient,
  userId: string,
): Promise<Set<string>> {
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_slug')
    .eq('user_id', userId)
    .not('completed_at', 'is', null);

  return new Set((data ?? []).map((row) => row.lesson_slug as string));
}

/**
 * Best attempt per assessment_id for the user. A passing attempt always wins;
 * otherwise the highest-scoring attempt is kept. Returns an empty map (never
 * throws) when the table is unavailable so Phase 2 works before Phase 4 lands.
 */
export async function fetchAssessmentAttempts(
  supabase: SupabaseClient,
  userId: string,
): Promise<Map<string, AssessmentAttempt>> {
  const best = new Map<string, AssessmentAttempt>();
  try {
    const { data, error } = await supabase
      .from('assessment_attempts')
      .select('assessment_id, passed, score')
      .eq('user_id', userId);

    if (error || !data) return best;

    for (const row of data) {
      const id = row.assessment_id as string;
      const attempt: AssessmentAttempt = {
        passed: Boolean(row.passed),
        score: typeof row.score === 'number' ? row.score : null,
      };
      const current = best.get(id);
      if (!current) {
        best.set(id, attempt);
        continue;
      }
      // Prefer a passing attempt, then the higher score.
      if (attempt.passed && !current.passed) {
        best.set(id, attempt);
      } else if (attempt.passed === current.passed && (attempt.score ?? 0) > (current.score ?? 0)) {
        best.set(id, attempt);
      }
    }
  } catch {
    // Table missing or network error — treat as no attempts.
  }
  return best;
}

/**
 * Derive the four-state status for a module assessment.
 * - locked    → not every lesson in the module is complete
 * - passed    → an attempt passed
 * - failed    → an attempt exists but none passed
 * - available → lessons complete, no attempt yet
 */
export function deriveAssessmentStatus(
  allLessonsComplete: boolean,
  attempt: AssessmentAttempt | undefined,
): AssessmentStatus {
  if (!allLessonsComplete) return 'locked';
  if (attempt?.passed) return 'passed';
  if (attempt) return 'failed';
  return 'available';
}
