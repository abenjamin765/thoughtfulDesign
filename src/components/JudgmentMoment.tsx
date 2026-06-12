import { useId, useState } from 'react';
import type { AssessmentOption } from '../lib/assessments';

// ---------------------------------------------------------------------------
// Design Judgment Moment (typographic-pattern-spec §2.7).
//
// A scenario where more than one answer is defensible — explicitly NOT a
// right/wrong quiz. Selecting an option reveals the trade-off rationale for
// EVERY option (not a "correct" mark), and a disclosure reveals "What good
// looks like" (the synthesis).
//
// Usable two ways:
//   1. Standalone inside a lesson page (drop the island in with client:load).
//   2. Inside AssessmentRunner for questions with `type: judgment`
//      (pass `onAnswered` so the runner can enable its Next button; judgment
//      questions are never scored — see scoring rule in lib/assessments.ts).
// ---------------------------------------------------------------------------

export type JudgmentMomentProps = {
  stem: string;
  options: AssessmentOption[];
  synthesis?: string;
  /** Region label; defaults to the pattern name. */
  label?: string;
  /** Render the labeled <section> wrapper. Off when the runner supplies it. */
  withRegion?: boolean;
  /** Notifies the parent (e.g. AssessmentRunner) once a choice is made. */
  onAnswered?: (optionIndex: number) => void;
  /** Controlled selection (used when the runner restores a prior answer). */
  selectedIndex?: number;
};

export default function JudgmentMoment({
  stem,
  options,
  synthesis,
  label = 'Design judgment moment',
  withRegion = true,
  onAnswered,
  selectedIndex,
}: JudgmentMomentProps) {
  const groupName = useId();
  const labelId = useId();
  const [internalSelected, setInternalSelected] = useState<number | null>(
    selectedIndex ?? null
  );

  const selected = selectedIndex ?? internalSelected;
  const hasChosen = selected !== null && selected !== undefined;

  function choose(index: number) {
    setInternalSelected(index);
    onAnswered?.(index);
  }

  const body = (
    <>
      <p className="callout__label">{label}</p>
      <p style={{ marginTop: 0 }}>{stem}</p>

      <fieldset style={{ border: 0, padding: 0, margin: '1rem 0 0' }}>
        <legend className="visually-hidden">Choose the response you would make</legend>
        {options.map((option, index) => (
          <label
            key={option.text}
            style={{
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'flex-start',
              padding: '0.5rem 0',
            }}
          >
            <input
              type="radio"
              name={groupName}
              value={index}
              checked={selected === index}
              onChange={() => choose(index)}
            />
            <span>{option.text}</span>
          </label>
        ))}
      </fieldset>

      {/*
        No correct/incorrect indicator. Once a choice is made we surface the
        trade-off rationale for every option in a polite live region so the
        meaning is announced without a focus jump and never relies on color.
      */}
      <div role="status" aria-live="polite">
        {hasChosen && (
          <div className="reveal" style={{ marginTop: '1rem' }}>
            <p className="callout__label" style={{ marginBottom: '0.75rem' }}>
              Trade-offs of each response
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              {options.map((option, index) => (
                <li key={option.text}>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {option.text}
                    {selected === index && (
                      <span className="muted" style={{ fontWeight: 400 }}> — your choice</span>
                    )}
                  </p>
                  {option.rationale && (
                    <p className="muted" style={{ margin: '0.25rem 0 0' }}>
                      {option.rationale}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {synthesis && (
        <details className="reveal" style={{ marginTop: '1rem' }}>
          <summary>What good looks like</summary>
          <div>
            <p style={{ marginBottom: 0 }}>{synthesis}</p>
          </div>
        </details>
      )}
    </>
  );

  if (!withRegion) {
    return <div>{body}</div>;
  }

  return (
    <section
      className="callout"
      aria-labelledby={labelId}
      style={{ background: 'var(--surface)' }}
    >
      <h3 id={labelId} className="visually-hidden">
        {label}
      </h3>
      {body}
    </section>
  );
}
