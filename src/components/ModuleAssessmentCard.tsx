import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import {
  getCurrentUserId,
  fetchCompletedLessons,
  fetchAssessmentAttempts,
  deriveAssessmentStatus,
  type AssessmentStatus,
  type AssessmentAttempt,
} from '../lib/progress';
import AssessmentStatusBadge from './AssessmentStatusBadge';

// Assessment block for the module index page (wireframe §4.3). Resolves the
// four-state status client-side: locked until every module lesson is complete,
// then available / passed / failed from assessment_attempts (Phase 4 persists
// those — until then this reads as available once lessons are done).
//
// `assessmentId` === module id. `assessmentHref` is fully base-prefixed by the
// caller (withBase(getAssessmentPath('module', id))).

type Props = {
  assessmentId: string;
  assessmentHref: string;
  lessonSlugs: string[];
  questionCount: number;
  passThreshold: number; // 0–1 fraction
};

const CTA: Record<AssessmentStatus, string> = {
  locked: 'Complete all lessons to unlock',
  available: 'Start assessment',
  passed: 'Review results',
  failed: 'Retry assessment',
};

export default function ModuleAssessmentCard({
  assessmentId,
  assessmentHref,
  lessonSlugs,
  questionCount,
  passThreshold,
}: Props) {
  const total = lessonSlugs.length;
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<AssessmentStatus>('locked');
  const [attempt, setAttempt] = useState<AssessmentAttempt | undefined>(undefined);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = getSupabase();
      if (!supabase) {
        if (active) setLoading(false);
        return;
      }
      const userId = await getCurrentUserId(supabase);
      if (!userId) {
        if (active) setLoading(false);
        return;
      }
      const [done, attempts] = await Promise.all([
        fetchCompletedLessons(supabase, userId),
        fetchAssessmentAttempts(supabase, userId),
      ]);
      if (!active) return;
      const count = lessonSlugs.filter((slug) => done.has(slug)).length;
      const best = attempts.get(assessmentId);
      setAttempt(best);
      setStatus(deriveAssessmentStatus(total > 0 && count === total, best));
      setLoading(false);
    }
    void load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

  const thresholdPercent = Math.round(passThreshold * 100);
  const locked = status === 'locked';

  return (
    <div className="card" style={{ display: 'grid', gap: '0.85rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <h3 style={{ margin: 0 }}>Module assessment</h3>
        {!loading && <AssessmentStatusBadge status={status} score={attempt?.score ?? null} />}
      </div>

      <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>
        {questionCount} questions · pass at {thresholdPercent}%
      </p>

      {loading ? (
        <p className="muted" style={{ margin: 0 }}>
          Checking your progress…
        </p>
      ) : locked ? (
        <p className="muted" style={{ margin: 0 }}>
          🔒 Complete all lessons in this module to unlock the assessment.
        </p>
      ) : (
        <a className="button button--primary" href={assessmentHref} style={{ justifySelf: 'start' }}>
          {CTA[status]}
        </a>
      )}
    </div>
  );
}
