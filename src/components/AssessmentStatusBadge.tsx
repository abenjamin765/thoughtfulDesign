import type { CSSProperties } from 'react';

// Presentational assessment-status pill. Status is passed in by the caller —
// the badge does no data fetching itself, so it can be reused anywhere a status
// is already known (module index, course overview, dashboard — Phases 2/6/7).
//
// Reused by: ModuleCardStatus (course overview), ModuleAssessmentCard (module
// index), and the Phase 7 dashboard assessment strip.

export type AssessmentStatus = 'locked' | 'available' | 'passed' | 'failed';

type Props = {
  status: AssessmentStatus;
  /** Optional score (0–1 fraction or 0–100 percent) shown alongside a pass/fail. */
  score?: number | null;
  className?: string;
};

const LABELS: Record<AssessmentStatus, string> = {
  locked: 'Locked',
  available: 'Available',
  passed: 'Passed',
  failed: 'Try again',
};

// Self-contained styling (React islands can't use Astro scoped styles, and
// global.css is owned elsewhere). Colours echo the global token palette.
const STYLES: Record<AssessmentStatus, CSSProperties> = {
  locked: { background: '#ece8df', color: '#5c5c5c', borderColor: '#ddd6cb' },
  available: { background: '#e8f0ec', color: '#2d5a4a', borderColor: '#c5d9cf' },
  passed: { background: '#2d5a4a', color: '#ffffff', borderColor: '#2d5a4a' },
  failed: { background: '#f8efe4', color: '#8b5a2b', borderColor: '#e2c7a8' },
};

const ICONS: Record<AssessmentStatus, string> = {
  locked: '🔒',
  available: '○',
  passed: '✓',
  failed: '↺',
};

function formatScore(score: number): string {
  const percent = score <= 1 ? Math.round(score * 100) : Math.round(score);
  return `${percent}%`;
}

export default function AssessmentStatusBadge({ status, score, className }: Props) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.25rem 0.6rem',
    borderRadius: '999px',
    border: '1px solid transparent',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
    lineHeight: 1.4,
    ...STYLES[status],
  };

  const showScore =
    typeof score === 'number' && (status === 'passed' || status === 'failed');

  return (
    <span className={className} style={base}>
      <span aria-hidden="true">{ICONS[status]}</span>
      <span>{LABELS[status]}</span>
      {showScore && <span>· {formatScore(score as number)}</span>}
    </span>
  );
}
