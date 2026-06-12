import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { getCurrentUserId, fetchCompletedLessons } from '../lib/progress';

// Dashboard hero — the most prominent element on /dashboard (wireframe §2.1).
//
// Resume CTA logic (canonical course order is supplied by the page from the
// registry, so this island only resolves per-user completion):
//   - no completed lessons        → "new"      → Start Module 1 →
//   - some incomplete remaining    → "continue" → Continue → first incomplete
//   - every lesson complete        → "complete" → Download your certificate
//
// Completion here is lesson-based (it drives the Resume target). The certificate
// page does the real assessment-aware eligibility check before issuing anything.

type ResumeLesson = {
  slug: string;
  title: string;
  href: string;
  /** "Module 3" for module lessons, "Introduction" for the intro lesson. */
  moduleLabel: string;
};

type Props = {
  lessons: ResumeLesson[];
  certificateHref: string;
};

type Phase = 'loading' | 'new' | 'continue' | 'complete';

const heroStyle: CSSProperties = {
  display: 'grid',
  gap: '1rem',
  padding: '1.75rem',
  background: 'var(--accent-soft)',
  border: '1px solid var(--border)',
  borderLeft: '4px solid var(--accent)',
  borderRadius: 'var(--radius)',
};

const skeletonBar = (width: string, height = '1rem'): CSSProperties => ({
  display: 'block',
  width,
  height,
  background: 'var(--border)',
  borderRadius: '6px',
  opacity: 0.7,
});

export default function DashboardProgress({ lessons, certificateHref }: Props) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [name, setName] = useState<string | null>(null);
  const [target, setTarget] = useState<ResumeLesson | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = getSupabase();
      if (!supabase) {
        if (active) setPhase('new');
        return;
      }
      const userId = await getCurrentUserId(supabase);
      if (!userId) {
        if (active) setPhase('new');
        return;
      }
      const [done, profile] = await Promise.all([
        fetchCompletedLessons(supabase, userId),
        supabase.from('profiles').select('display_name').eq('id', userId).maybeSingle(),
      ]);
      if (!active) return;

      const count = lessons.filter((lesson) => done.has(lesson.slug)).length;
      const firstIncomplete = lessons.find((lesson) => !done.has(lesson.slug)) ?? null;

      setName((profile.data?.display_name as string | undefined) ?? null);
      setCompletedCount(count);

      if (count === 0) {
        setTarget(lessons[0] ?? null);
        setPhase('new');
      } else if (firstIncomplete) {
        setTarget(firstIncomplete);
        setPhase('continue');
      } else {
        setPhase('complete');
      }
    }
    void load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'loading') {
    return (
      <div style={heroStyle} aria-hidden="true">
        <span style={skeletonBar('9rem', '0.85rem')} />
        <span style={skeletonBar('70%', '1.75rem')} />
        <span style={skeletonBar('12rem', '2.75rem')} />
      </div>
    );
  }

  const total = lessons.length;
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const greeting = phase === 'new' ? 'Welcome' : 'Welcome back';

  return (
    <div style={heroStyle}>
      <p className="muted" style={{ margin: 0, fontWeight: 700, letterSpacing: '0.02em' }}>
        {greeting}
        {name ? `, ${name}` : ''}
      </p>

      {phase === 'new' && (
        <>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Ready to begin?</h2>
          <p style={{ margin: 0, maxWidth: '52ch' }}>
            You're enrolled in Thoughtful Design. Start with the first lesson and work through the
            course at your own pace.
          </p>
          {target && (
            <a className="button button--primary" href={target.href} style={{ justifySelf: 'start' }}>
              Start Module 1 →
            </a>
          )}
        </>
      )}

      {phase === 'continue' && target && (
        <>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Pick up where you left off</h2>
          <p className="muted" style={{ margin: 0 }}>
            Next up · {target.moduleLabel}
          </p>
          <a className="button button--primary" href={target.href} style={{ justifySelf: 'start' }}>
            Continue → {target.title}
          </a>
          <Progress completed={completedCount} total={total} percent={percent} />
        </>
      )}

      {phase === 'complete' && (
        <>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>
            You've completed every lesson 🎉
          </h2>
          <p style={{ margin: 0, maxWidth: '52ch' }}>
            Finish any remaining assessments to unlock your certificate, then download and share it.
          </p>
          <a className="button button--primary" href={certificateHref} style={{ justifySelf: 'start' }}>
            Download your certificate
          </a>
          <Progress completed={completedCount} total={total} percent={percent} />
        </>
      )}
    </div>
  );
}

function Progress({ completed, total, percent }: { completed: number; total: number; percent: number }) {
  return (
    <div style={{ display: 'grid', gap: '0.4rem', maxWidth: '32rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span className="muted">
          {completed} of {total} lessons complete
        </span>
        <span className="muted">{percent}%</span>
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${percent}% of lessons complete`}
      >
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
