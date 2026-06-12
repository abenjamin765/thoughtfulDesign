import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';

type Props = {
  lessonSlug: string;
  /** Next lesson in registry order — surfaces a "Continue" CTA once complete. */
  nextHref?: string;
  nextTitle?: string;
};

export default function LessonComplete({ lessonSlug, nextHref, nextTitle }: Props) {
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
      void trackEvent('lesson_started', { lesson_slug: lessonSlug });
    }

    void loadProgress();
  }, [lessonSlug]);

  async function markComplete() {
    setError(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError("Progress tracking isn't available right now, so this lesson can't be marked complete. Please try again later.");
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
      setError(`We couldn't save your progress: ${saveError.message}. Check your connection and try marking the lesson complete again.`);
      return;
    }

    setCompleted(true);
    void trackEvent('lesson_completed', { lesson_slug: lessonSlug });
  }

  if (loading) return null;

  return (
    <div className="card">
      {completed ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <p className="success-text" style={{ margin: 0 }}>Lesson marked complete. Nice work.</p>
          {nextHref && (
            <a className="button button--primary" href={nextHref}>
              Continue to {nextTitle ?? 'the next lesson'} →
            </a>
          )}
        </div>
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
