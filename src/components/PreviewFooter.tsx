import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import LessonComplete from './LessonComplete';
import ReflectionPrompt from './ReflectionPrompt';

type Props = {
  lessonSlug: string;
  /** Next lesson in registry order — passed through to the tracked footer. */
  nextHref?: string;
  nextTitle?: string;
  /** Reflection prompt, if the lesson defines one. */
  reflectionPrompt?: string;
  /** Where the enrollment CTA points (already base-prefixed). */
  signupHref: string;
};

type Viewer = 'loading' | 'authenticated' | 'anonymous';

/**
 * Footer for `public_preview` lessons. Authenticated learners get the normal
 * tracked experience (reflection + mark-complete). Anonymous preview visitors
 * get an enrollment CTA in place of progress tracking — the inline Quiz still
 * runs client-side for them, just without persistence.
 */
export default function PreviewFooter({
  lessonSlug,
  nextHref,
  nextTitle,
  reflectionPrompt,
  signupHref,
}: Props) {
  const [viewer, setViewer] = useState<Viewer>('loading');

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const supabase = getSupabase();
      if (!supabase) {
        if (active) setViewer('anonymous');
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (active) setViewer(session ? 'authenticated' : 'anonymous');
    }

    void checkSession();
    return () => {
      active = false;
    };
  }, []);

  if (viewer === 'loading') return null;

  if (viewer === 'authenticated') {
    return (
      <>
        {reflectionPrompt && (
          <ReflectionPrompt lessonSlug={lessonSlug} prompt={reflectionPrompt} />
        )}
        <LessonComplete lessonSlug={lessonSlug} nextHref={nextHref} nextTitle={nextTitle} />
      </>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Sign up to save your progress</h3>
      <p className="muted">
        You're previewing a free lesson. Create an account to track completion,
        save your reflections, and unlock the full course.
      </p>
      <a className="button button--primary" href={signupHref}>
        Sign up to save your progress
      </a>
    </div>
  );
}
