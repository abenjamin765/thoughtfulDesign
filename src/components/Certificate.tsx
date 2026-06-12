import { useEffect, useState, type CSSProperties } from 'react';
import { getSupabase } from '../lib/supabase';
import { fetchAssessmentStatuses, isAssessmentPassed } from '../lib/assessments';
import { trackEvent } from '../lib/analytics';

// Certificate page island (wireframe page 10). Resolves eligibility client-side
// (lesson pages are static), renders a print-optimised certificate when earned,
// and shows a non-blocking not-earned state otherwise — a client-side state
// swap, never a hard redirect, so static hosting keeps the route reachable.
//
// Eligibility: every required assessment (11 modules + 3 milestones + final)
// must have a passing attempt; `passed` encodes the 80% threshold. Distinction
// is awarded when the average best score across required assessments is >= 0.9.
//
// PDF: dependency-free — a print-optimised layout + window.print(). The page's
// @media print CSS hides the global header/footer and the .no-print actions.

type Props = {
  courseTitle: string;
  requiredAssessmentIds: string[];
  dashboardHref: string;
  /** Base-prefixed path to this page, used to build absolute share URLs. */
  certificatePath: string;
};

type State = 'loading' | 'earned' | 'pending';

const sheetStyle: CSSProperties = {
  position: 'relative',
  display: 'grid',
  gap: '1.25rem',
  textAlign: 'center',
  padding: '3rem 2.5rem',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderTop: '6px solid var(--accent)',
  borderRadius: 'var(--radius)',
  boxShadow: 'var(--shadow)',
  maxWidth: '48rem',
  margin: '0 auto',
};

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Certificate({
  courseTitle,
  requiredAssessmentIds,
  dashboardHref,
  certificatePath,
}: Props) {
  const [state, setState] = useState<State>('loading');
  const [name, setName] = useState('Thoughtful Designer');
  const [issuedAt, setIssuedAt] = useState<Date>(() => new Date());
  const [distinction, setDistinction] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = getSupabase();
      if (!supabase) {
        if (active) setState('pending');
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (active) setState('pending');
        return;
      }

      const [statuses, profile] = await Promise.all([
        fetchAssessmentStatuses(),
        supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle(),
      ]);
      if (!active) return;

      const displayName =
        (profile.data?.display_name as string | undefined) ||
        user.email?.split('@')[0] ||
        'Thoughtful Designer';
      setName(displayName);

      const earned =
        requiredAssessmentIds.length > 0 &&
        requiredAssessmentIds.every((id) => isAssessmentPassed(statuses, id));

      if (!earned) {
        setState('pending');
        return;
      }

      const scores = requiredAssessmentIds.map((id) => statuses.get(id)?.bestScore ?? 0);
      const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
      const earnedDistinction = average >= 0.9;
      setDistinction(earnedDistinction);

      // Idempotent issue: keep the original issued_at if a row already exists.
      const { data: existing } = await supabase
        .from('certificates')
        .select('issued_at')
        .eq('user_id', user.id)
        .maybeSingle();
      const alreadyIssued = Boolean(existing?.issued_at);
      const issued = existing?.issued_at ? new Date(existing.issued_at as string) : new Date();
      await supabase.from('certificates').upsert(
        {
          user_id: user.id,
          issued_at: issued.toISOString(),
          distinction: earnedDistinction,
          average_score: Math.round(average * 10000) / 10000,
        },
        { onConflict: 'user_id' },
      );
      if (!alreadyIssued) {
        void trackEvent('certificate_issued', { distinction: earnedDistinction });
      }
      if (!active) return;
      setIssuedAt(issued);
      setState('earned');
    }
    void load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function shareToLinkedIn() {
    const url = `${window.location.origin}${certificatePath}`;
    const title = `${courseTitle} — Certificate of Completion`;
    const summary = `I completed ${courseTitle}${
      distinction ? ' with distinction' : ''
    }, a modern UX practice for designing complex, intelligent, human-centered systems.`;
    const share = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      url,
    )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    window.open(share, '_blank', 'noopener,noreferrer');
  }

  async function copyLink() {
    const url = `${window.location.origin}${certificatePath}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context / denied) — no-op.
    }
  }

  if (state === 'loading') {
    return (
      <div style={{ ...sheetStyle, minHeight: '20rem' }} aria-hidden="true">
        <span
          style={{
            justifySelf: 'center',
            width: '60%',
            height: '2rem',
            background: 'var(--border)',
            borderRadius: '6px',
            opacity: 0.7,
          }}
        />
        <span
          style={{
            justifySelf: 'center',
            width: '40%',
            height: '1.25rem',
            background: 'var(--border)',
            borderRadius: '6px',
            opacity: 0.7,
          }}
        />
      </div>
    );
  }

  if (state === 'pending') {
    return (
      <div className="card" style={{ display: 'grid', gap: '1rem', maxWidth: '40rem', margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Certificate not earned yet</h1>
        <p style={{ margin: 0 }}>
          Complete the course to earn your certificate: pass all 11 module assessments, the 3
          milestone assessments, and the final assessment — each at 80% or higher.
        </p>
        <a className="button button--primary" href={dashboardHref} style={{ justifySelf: 'start' }}>
          ← Back to your dashboard
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="cert-sheet" style={sheetStyle}>
        <p
          className="muted"
          style={{ margin: 0, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '0.8rem' }}
        >
          Certificate of Completion
        </p>

        <p style={{ margin: 0 }}>This certifies that</p>

        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--step-4, 2rem)',
            lineHeight: 1.1,
          }}
        >
          {name}
        </p>

        <p style={{ margin: 0 }}>has successfully completed</p>

        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--step-2, 1.5rem)',
          }}
        >
          {courseTitle}
        </p>

        {distinction && (
          <p
            style={{
              justifySelf: 'center',
              margin: 0,
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 700,
              letterSpacing: '0.04em',
              fontSize: '0.85rem',
            }}
          >
            ★ Awarded with Distinction
          </p>
        )}

        <p className="muted" style={{ margin: 0 }}>
          Issued {formatDate(issuedAt)}
        </p>
      </div>

      <div
        className="no-print"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}
      >
        <button type="button" className="button button--primary" onClick={() => window.print()}>
          Download PDF
        </button>
        <button type="button" className="button button--secondary" onClick={shareToLinkedIn}>
          Share to LinkedIn
        </button>
        <button type="button" className="button button--ghost" onClick={() => void copyLink()}>
          {copied ? 'Link copied ✓' : 'Copy link'}
        </button>
      </div>

      <p className="no-print muted" style={{ textAlign: 'center', margin: 0 }}>
        <a href={dashboardHref}>← Back to your dashboard</a>
      </p>
    </div>
  );
}
