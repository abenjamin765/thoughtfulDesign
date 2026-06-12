import { useEffect, useState, type CSSProperties } from 'react';
import { fetchAssessmentStatuses, isAssessmentPassed } from '../lib/assessments';

// Conditional certificate block on the dashboard (wireframe §2.4). Earned when
// every required assessment (11 modules + 3 milestones + final) has a passing
// attempt — `passed` already encodes the 80% threshold from when the attempt
// was recorded. When earned, links to the full certificate page; otherwise a
// low-key, non-blocking prompt.

type Props = {
  requiredAssessmentIds: string[];
  certificateHref: string;
};

const earnedStyle: CSSProperties = {
  display: 'grid',
  gap: '0.75rem',
  background: 'var(--accent-soft)',
  borderColor: 'var(--accent)',
};

export default function CertificateCallout({ requiredAssessmentIds, certificateHref }: Props) {
  const [state, setState] = useState<'loading' | 'earned' | 'pending'>('loading');

  useEffect(() => {
    let active = true;
    async function load() {
      const statuses = await fetchAssessmentStatuses();
      if (!active) return;
      const earned =
        requiredAssessmentIds.length > 0 &&
        requiredAssessmentIds.every((id) => isAssessmentPassed(statuses, id));
      setState(earned ? 'earned' : 'pending');
    }
    void load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === 'loading') {
    return (
      <p className="muted" style={{ margin: 0 }}>
        Checking your completion…
      </p>
    );
  }

  if (state === 'earned') {
    return (
      <div className="card" style={earnedStyle}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>You've earned your certificate 🎉</h3>
        <p style={{ margin: 0, maxWidth: '52ch' }}>
          You've passed every module assessment, all three milestones, and the final assessment.
          View, download, and share your certificate.
        </p>
        <a className="button button--primary" href={certificateHref} style={{ justifySelf: 'start' }}>
          View your certificate →
        </a>
      </div>
    );
  }

  return (
    <p className="muted" style={{ margin: 0, maxWidth: '60ch' }}>
      Complete all 11 module assessments, the 3 milestone assessments, and the final assessment —
      each at 80% or higher — to earn your certificate.
    </p>
  );
}
