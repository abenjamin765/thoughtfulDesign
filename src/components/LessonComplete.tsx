import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';

type Props = {
  lessonSlug: string;
};

export default function LessonComplete({ lessonSlug }: Props) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        .select('completed_at')
        .eq('user_id', user.id)
        .eq('lesson_slug', lessonSlug)
        .maybeSingle();

      setCompleted(Boolean(data?.completed_at));
      setLoading(false);
    }

    void loadProgress();
  }, [lessonSlug]);

  async function markComplete() {
    setError(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase is not configured yet.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Sign in to track progress.');
      return;
    }

    const { error: saveError } = await supabase.from('lesson_progress').upsert(
      {
        user_id: user.id,
        lesson_slug: lessonSlug,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_slug' },
    );

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setCompleted(true);
  }

  if (loading) return null;

  return (
    <div className="card">
      {completed ? (
        <p className="success-text">Lesson marked complete. Nice work.</p>
      ) : (
        <>
          <p className="muted">Finished the reading, quiz, and reflection?</p>
          {error && <p className="error-text">{error}</p>}
          <button className="button button--primary" type="button" onClick={() => void markComplete()}>
            Mark lesson complete
          </button>
        </>
      )}
    </div>
  );
}
