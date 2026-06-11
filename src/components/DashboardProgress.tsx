import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { withBase } from '../lib/paths';

type Props = {
  lessonSlugs: string[];
};

export default function DashboardProgress({ lessonSlugs }: Props) {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('lesson_progress')
        .select('lesson_slug')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);

      setCompletedSlugs((data ?? []).map((row) => row.lesson_slug));
      setLoading(false);
    }

    void loadProgress();
  }, []);

  const completedCount = completedSlugs.length;
  const totalCount = lessonSlugs.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  if (loading) {
    return <p className="muted">Loading your progress…</p>;
  }

  return (
    <>
      <div className="dashboard-stats">
        <div className="card stat-card">
          <strong>{completedCount}</strong>
          <span className="muted">Lessons completed</span>
        </div>
        <div className="card stat-card">
          <strong>{totalCount - completedCount}</strong>
          <span className="muted">Lessons remaining</span>
        </div>
        <div className="card stat-card">
          <strong>{percent}%</strong>
          <span className="muted">Course progress</span>
        </div>
      </div>

      <div className="progress-bar" aria-hidden="true">
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>

      <ul className="lesson-list" style={{ marginTop: '1.5rem' }}>
        {lessonSlugs.map((slug) => {
          const done = completedSlugs.includes(slug);
          return (
            <li key={slug}>
              <a href={withBase(`/lessons/${slug}`)}>
                <span>{slug.replace(/-/g, ' ')}</span>
                <span className={done ? 'success-text' : 'muted'}>{done ? 'Complete' : 'In progress'}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
