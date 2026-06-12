import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import {
  getCurrentUserId,
  fetchCompletedLessons,
  fetchAssessmentAttempts,
  deriveAssessmentStatus,
  type AssessmentStatus,
} from '../lib/progress';
import AssessmentStatusBadge from './AssessmentStatusBadge';

// Compact module-assessment status strip (wireframe §2.3). One chip per module
// assessment, showing locked / available / passed / failed. assessmentId ===
// module id. Reuses the same status derivation as the module cards so the
// dashboard stays internally consistent (no Shapeshifters).

type ModuleInput = {
  id: string;
  order: number;
  title: string;
  lessonSlugs: string[];
};

type Props = {
  modules: ModuleInput[];
};

type Row = {
  id: string;
  order: number;
  title: string;
  status: AssessmentStatus;
  score: number | null;
};

export default function ModuleAssessmentStrip({ modules }: Props) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

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
      setRows(
        modules.map((module) => {
          const complete =
            module.lessonSlugs.length > 0 && module.lessonSlugs.every((slug) => done.has(slug));
          const attempt = attempts.get(module.id);
          return {
            id: module.id,
            order: module.order,
            title: module.title,
            status: deriveAssessmentStatus(complete, attempt),
            score: attempt?.score ?? null,
          };
        }),
      );
      setLoading(false);
    }
    void load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div
        aria-hidden="true"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
      >
        {modules.map((module) => (
          <span
            key={module.id}
            style={{
              width: '7.5rem',
              height: '2.1rem',
              background: 'var(--border)',
              borderRadius: '999px',
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <ul
      aria-label="Module assessment status"
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.6rem',
      }}
    >
      {rows.map((row) => (
        <li
          key={row.id}
          title={`Module ${row.order}: ${row.title}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.5rem 0.3rem 0.6rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>M{row.order}</span>
          <AssessmentStatusBadge status={row.status} score={row.score} />
        </li>
      ))}
    </ul>
  );
}
