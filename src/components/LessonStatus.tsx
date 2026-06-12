import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { getCurrentUserId, fetchCompletedLessons } from '../lib/progress';

// Small completion indicator for a single lesson, injected into a LessonRow's
// `status` slot. Reads Supabase client-side because lesson pages are static.

type Props = {
  slug: string;
};

export default function LessonStatus({ slug }: Props) {
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = getSupabase();
      if (!supabase) {
        if (active) setCompleted(false);
        return;
      }
      const userId = await getCurrentUserId(supabase);
      if (!userId) {
        if (active) setCompleted(false);
        return;
      }
      const done = await fetchCompletedLessons(supabase, userId);
      if (active) setCompleted(done.has(slug));
    }
    void load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (completed === null) {
    return <span className="muted">…</span>;
  }

  return completed ? (
    <span className="success-text">✓ Complete</span>
  ) : (
    <span className="muted">Not started</span>
  );
}
