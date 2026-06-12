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

// Per-module progress, injected into a ModuleCard's `status` slot on the course
// overview. Reads Supabase once for this module: lesson completion + best
// assessment attempt. Renders "x/n lessons" + a progress bar + the assessment
// badge. assessmentId === module id.

type Props = {
  moduleId: string;
  assessmentId: string;
  lessonSlugs: string[];
};

export default function ModuleCardStatus({ moduleId, assessmentId, lessonSlugs }: Props) {
  const total = lessonSlugs.length;
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
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
      setCompletedCount(count);
      setAttempt(best);
      setStatus(deriveAssessmentStatus(total > 0 && count === total, best));
      setLoading(false);
    }
    void load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, assessmentId]);

  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
        }}
      >
        <span className="muted">
          {loading ? 'Loading…' : `${completedCount}/${total} lessons`}
        </span>
        <AssessmentStatusBadge status={status} score={attempt?.score ?? null} />
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={completedCount}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${percent}% of lessons complete`}
      >
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
