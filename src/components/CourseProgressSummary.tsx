import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { getCurrentUserId, fetchCompletedLessons } from '../lib/progress';

// Overall course progress headline for the course overview ("X of N modules
// complete"). A module counts as complete when all of its lessons are complete
// — a lesson-based proxy that works today; per-module assessment pass/fail is
// surfaced separately on each card (and folded into completion by Phase 4/7).

type ModuleInput = {
  moduleId: string;
  lessonSlugs: string[];
};

type Props = {
  modules: ModuleInput[];
};

export default function CourseProgressSummary({ modules }: Props) {
  const totalModules = modules.length;
  const [loading, setLoading] = useState(true);
  const [completeModules, setCompleteModules] = useState(0);

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
      const done = await fetchCompletedLessons(supabase, userId);
      if (!active) return;
      const complete = modules.filter(
        (m) => m.lessonSlugs.length > 0 && m.lessonSlugs.every((slug) => done.has(slug)),
      ).length;
      setCompleteModules(complete);
      setLoading(false);
    }
    void load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const percent = totalModules === 0 ? 0 : Math.round((completeModules / totalModules) * 100);

  return (
    <div style={{ display: 'grid', gap: '0.5rem', maxWidth: '32rem' }}>
      <p className="muted" style={{ margin: 0 }}>
        {loading
          ? 'Loading your progress…'
          : `${completeModules} of ${totalModules} modules complete`}
      </p>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={completeModules}
        aria-valuemin={0}
        aria-valuemax={totalModules}
        aria-label={`${percent}% of modules complete`}
      >
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
