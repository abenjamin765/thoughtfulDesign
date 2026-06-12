import { useEffect, useMemo, useState } from 'react';
import JudgmentMoment from './JudgmentMoment';
import {
  type AnswerMap,
  type Answer,
  type AssessmentData,
  type AssessmentQuestion,
  type ShortRationaleAnswer,
  type UnlockSpec,
  evaluateUnlock,
  fetchProgressSnapshot,
  gradeQuestion,
  isAnswered,
  isScored,
  matchingChoices,
  recordAssessmentAttempt,
  scoreAssessment,
} from '../lib/assessments';

// ---------------------------------------------------------------------------
// AssessmentRunner (wireframe-plan page 6).
//
// One question per screen, pass threshold shown upfront, per-question feedback
// from the YAML `feedback` fields surfaced in an aria-live region, and a
// results screen with retry / review / continue.
//
// Question types handled:
//   multiple_choice, multiple_select, true_false, ordering/ranking
//   (accessible move-up/down baseline), matching (native <select> per row),
//   short_rationale (free text, self-assessed, ungraded), and judgment
//   (delegated to JudgmentMoment — no correct/incorrect, ungraded).
//
// Scoring rule: judgment + short_rationale are excluded from the scored
// denominator (see lib/assessments.ts).
// ---------------------------------------------------------------------------

type Phase = 'loading' | 'locked' | 'intro' | 'inprogress' | 'results';

export type AssessmentRunnerProps = {
  assessment: AssessmentData;
  unlock: UnlockSpec;
  /** Where the "Continue" CTA points once the learner passes. */
  continueHref?: string;
  continueLabel?: string;
  /** Link back out of the focused assessment view. */
  exitHref: string;
  exitLabel?: string;
};

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Initial ordering so an ordering/ranking question is never pre-solved. */
function initialOrder(question: AssessmentQuestion): string[] {
  const items = question.items ?? [];
  const target = question.correct_order ?? items;
  if (items.length < 2) return items;
  let next = shuffle(items);
  const matchesTarget = next.every((item, index) => item === target[index]);
  if (matchesTarget) next = [...next].reverse();
  return next;
}

function buildInitialAnswers(questions: AssessmentQuestion[]): AnswerMap {
  const answers: AnswerMap = {};
  for (const question of questions) {
    switch (question.type) {
      case 'multiple_select':
        answers[question.id] = [] as number[];
        break;
      case 'matching':
        answers[question.id] = {} as Record<string, string>;
        break;
      case 'ordering':
      case 'ranking':
        answers[question.id] = initialOrder(question);
        break;
      case 'short_rationale':
        answers[question.id] = { text: '', acknowledged: false } as ShortRationaleAnswer;
        break;
      default:
        answers[question.id] = undefined;
    }
  }
  return answers;
}

export default function AssessmentRunner({
  assessment,
  unlock,
  continueHref,
  continueLabel = 'Continue',
  exitHref,
  exitLabel = 'Back',
}: AssessmentRunnerProps) {
  const questions = assessment.questions;
  const passPercent = Math.round(assessment.pass_threshold * 100);

  const [phase, setPhase] = useState<Phase>('loading');
  const [lockReason, setLockReason] = useState('');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(() => buildInitialAnswers(questions));
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [moveMessage, setMoveMessage] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [attemptNumber, setAttemptNumber] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    async function init() {
      const snapshot = await fetchProgressSnapshot();
      if (!active) return;
      const result = evaluateUnlock(unlock, snapshot);
      if (result.unlocked) {
        setPhase('intro');
      } else {
        setLockReason(result.reason);
        setPhase('locked');
      }
    }
    void init();
    return () => {
      active = false;
    };
    // unlock is derived from build-time props; re-run only on identity change.
  }, [unlock]);

  const result = useMemo(() => scoreAssessment(assessment, answers), [assessment, answers]);

  function setAnswer(id: string, value: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function startOrRetry() {
    setAnswers(buildInitialAnswers(questions));
    setRevealed(new Set());
    setCurrent(0);
    setSaveError(null);
    setAttemptNumber(null);
    setPhase('inprogress');
  }

  function revealCurrent(id: string) {
    setRevealed((prev) => new Set(prev).add(id));
  }

  async function persistAttempt(score: ReturnType<typeof scoreAssessment>) {
    setSaving(true);
    setSaveError(null);
    const outcome = await recordAssessmentAttempt({
      assessmentId: assessment.id,
      assessmentType: assessment.type,
      score: score.score,
      passed: score.passed,
    });
    setSaving(false);
    if (outcome.ok) {
      setAttemptNumber(outcome.attemptNumber ?? null);
    } else {
      setSaveError(outcome.error ?? 'Your attempt could not be saved.');
    }
  }

  async function goToResults() {
    const score = scoreAssessment(assessment, answers);
    setPhase('results');
    await persistAttempt(score);
  }

  // -------------------------------------------------------------------------
  // Move handlers for ordering/ranking
  // -------------------------------------------------------------------------
  function move(id: string, index: number, direction: -1 | 1) {
    setAnswers((prev) => {
      const order = [...((prev[id] as string[]) ?? [])];
      const target = index + direction;
      if (target < 0 || target >= order.length) return prev;
      const moved = order[index];
      [order[index], order[target]] = [order[target], order[index]];
      setMoveMessage(`Moved ${moved} to position ${target + 1} of ${order.length}.`);
      return { ...prev, [id]: order };
    });
  }

  if (phase === 'loading') {
    return <p className="muted">Checking your progress…</p>;
  }

  if (phase === 'locked') {
    return (
      <section className="card" aria-labelledby="locked-heading">
        <p className="callout__label">Locked</p>
        <h2 id="locked-heading" style={{ marginTop: 0 }}>
          {assessment.title}
        </h2>
        <p>{lockReason}</p>
        <a className="button button--secondary" href={exitHref}>
          {exitLabel}
        </a>
      </section>
    );
  }

  if (phase === 'intro') {
    const scoredCount = questions.filter(isScored).length;
    const reflectiveCount = questions.length - scoredCount;
    return (
      <section className="card" aria-labelledby="intro-heading">
        <p className="callout__label">{assessment.type} assessment</p>
        <h2 id="intro-heading" style={{ marginTop: 0 }}>
          {assessment.title}
        </h2>
        {assessment.scenario_brief && (
          <p style={{ background: 'var(--accent-soft)', padding: '1rem', borderRadius: 'var(--radius)' }}>
            {assessment.scenario_brief}
          </p>
        )}
        <ul className="muted" style={{ paddingLeft: '1.1rem' }}>
          <li>{questions.length} questions, one per screen.</li>
          <li>
            You need <strong>{passPercent}%</strong> to pass
            {assessment.distinction_threshold !== undefined && (
              <> ({Math.round(assessment.distinction_threshold * 100)}% earns distinction)</>
            )}
            .
          </li>
          {reflectiveCount > 0 && (
            <li>
              {scoredCount} {scoredCount === 1 ? 'question is' : 'questions are'} scored. The {reflectiveCount}{' '}
              judgment / written {reflectiveCount === 1 ? 'question is' : 'questions are'} for reflection and are
              not graded right or wrong.
            </li>
          )}
          <li>You can retry as many times as you need.</li>
        </ul>
        <button className="button button--primary" type="button" onClick={startOrRetry}>
          Start assessment
        </button>
      </section>
    );
  }

  if (phase === 'results') {
    return (
      <Results
        assessment={assessment}
        answers={answers}
        result={result}
        passPercent={passPercent}
        saving={saving}
        saveError={saveError}
        attemptNumber={attemptNumber}
        continueHref={continueHref}
        continueLabel={continueLabel}
        exitHref={exitHref}
        exitLabel={exitLabel}
        onRetry={startOrRetry}
        onRetrySave={() => void persistAttempt(result)}
      />
    );
  }

  // phase === 'inprogress'
  const question = questions[current];
  const answer = answers[question.id];
  const isLast = current === questions.length - 1;
  const isJudgment = question.type === 'judgment';
  const needsSubmit = !isJudgment;
  const showFeedback = revealed.has(question.id);
  const answered = isAnswered(question, answer);
  const canProceed = isJudgment ? answered : showFeedback;

  return (
    <div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-valuenow={current + 1}
        aria-label={`Question ${current + 1} of ${questions.length}`}
      >
        <div
          className="progress-bar__fill"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="muted" style={{ marginTop: '1rem' }}>
        Question {current + 1} of {questions.length}
        {question.section && <> · {question.section}</>}
      </p>

      <section className="quiz" aria-labelledby="question-stem">
        <h2 id="question-stem" style={{ fontSize: 'var(--step-2)', marginTop: 0 }}>
          {question.stem}
        </h2>

        {isJudgment ? (
          <JudgmentMoment
            stem=""
            options={question.options ?? []}
            synthesis={question.synthesis}
            withRegion={false}
            selectedIndex={typeof answer === 'number' ? (answer as number) : undefined}
            onAnswered={(index) => setAnswer(question.id, index)}
          />
        ) : (
          <QuestionInput
            question={question}
            answer={answer}
            disabled={showFeedback}
            onChange={(value) => setAnswer(question.id, value)}
            onMove={(index, direction) => move(question.id, index, direction)}
          />
        )}

        {/* Live region: ordering move announcements (spec §3.3). */}
        <p className="visually-hidden" role="status" aria-live="polite">
          {moveMessage}
        </p>

        {/* Live region: per-question feedback (spec §3.1 / §3.4). */}
        <div role="status" aria-live="polite">
          {showFeedback && <Feedback question={question} answer={answer} />}
        </div>
      </section>

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginTop: '1.5rem',
          alignItems: 'center',
        }}
      >
        {current > 0 && (
          <button
            className="button button--ghost"
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          >
            ← Previous
          </button>
        )}

        {needsSubmit && !showFeedback && (
          <button
            className="button button--primary"
            type="button"
            disabled={!answered}
            onClick={() => revealCurrent(question.id)}
          >
            {question.type === 'short_rationale' ? 'See guidance' : 'Submit answer'}
          </button>
        )}

        {canProceed && !isLast && (
          <button
            className="button button--primary"
            type="button"
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
          >
            Next question →
          </button>
        )}

        {canProceed && isLast && (
          <button className="button button--primary" type="button" onClick={() => void goToResults()}>
            See results
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-type inputs
// ---------------------------------------------------------------------------

function QuestionInput({
  question,
  answer,
  disabled,
  onChange,
  onMove,
}: {
  question: AssessmentQuestion;
  answer: Answer;
  disabled: boolean;
  onChange: (value: Answer) => void;
  onMove: (index: number, direction: -1 | 1) => void;
}) {
  switch (question.type) {
    case 'multiple_choice':
    case 'true_false': {
      const selected = answer as number | undefined;
      return (
        <fieldset>
          <legend className="visually-hidden">Select one answer</legend>
          {(question.options ?? []).map((option, index) => (
            <label key={option.text}>
              <input
                type="radio"
                name={`q-${question.id}`}
                value={index}
                checked={selected === index}
                disabled={disabled}
                onChange={() => onChange(index)}
              />
              <span>{option.text}</span>
            </label>
          ))}
        </fieldset>
      );
    }

    case 'multiple_select': {
      const selected = new Set((answer as number[]) ?? []);
      return (
        <fieldset>
          <legend className="visually-hidden">Select all that apply</legend>
          {(question.options ?? []).map((option, index) => (
            <label key={option.text}>
              <input
                type="checkbox"
                name={`q-${question.id}`}
                value={index}
                checked={selected.has(index)}
                disabled={disabled}
                onChange={(event) => {
                  const next = new Set(selected);
                  if (event.target.checked) next.add(index);
                  else next.delete(index);
                  onChange([...next].sort((a, b) => a - b));
                }}
              />
              <span>{option.text}</span>
            </label>
          ))}
        </fieldset>
      );
    }

    case 'matching': {
      const record = (answer as Record<string, string>) ?? {};
      const choices = matchingChoices(question);
      return (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {(question.pairs ?? []).map((pair) => {
            const selectId = `match-${question.id}-${pair.left}`;
            return (
              <div
                key={pair.left}
                style={{ display: 'grid', gap: '0.35rem' }}
              >
                <label htmlFor={selectId} style={{ fontWeight: 600 }}>
                  {pair.left}
                  <span className="visually-hidden"> — match for: {pair.left}</span>
                </label>
                <select
                  id={selectId}
                  value={record[pair.left] ?? ''}
                  disabled={disabled}
                  onChange={(event) =>
                    onChange({ ...record, [pair.left]: event.target.value })
                  }
                  style={{
                    padding: '0.6rem 0.7rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    font: 'inherit',
                  }}
                >
                  <option value="">Choose…</option>
                  {choices.map((choice) => (
                    <option key={choice} value={choice}>
                      {choice}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      );
    }

    case 'ordering':
    case 'ranking': {
      const order = (answer as string[]) ?? [];
      return (
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
          {order.map((item, index) => (
            <li
              key={item}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.8rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <span>
                <span className="muted" aria-hidden="true">
                  {index + 1}.{' '}
                </span>
                {item}
              </span>
              <span style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  className="button button--secondary"
                  disabled={disabled || index === 0}
                  onClick={() => onMove(index, -1)}
                  aria-label={`Move ${item} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="button button--secondary"
                  disabled={disabled || index === order.length - 1}
                  onClick={() => onMove(index, 1)}
                  aria-label={`Move ${item} down`}
                >
                  ↓
                </button>
              </span>
            </li>
          ))}
        </ol>
      );
    }

    case 'short_rationale': {
      const value = (answer as ShortRationaleAnswer) ?? { text: '', acknowledged: false };
      const textId = `rationale-${question.id}`;
      return (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label htmlFor={textId} style={{ fontWeight: 600 }}>
            Your response
          </label>
          <textarea
            id={textId}
            value={value.text}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, text: event.target.value })}
            style={{
              width: '100%',
              minHeight: '7rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.75rem',
              font: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>
      );
    }

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Per-type feedback (never color-only — text prefix carries meaning)
// ---------------------------------------------------------------------------

function ShortRationaleFeedback({ question }: { question: AssessmentQuestion }) {
  const [acknowledged, setAcknowledged] = useState(false);
  return (
    <div className="quiz__feedback" style={{ marginTop: '1rem' }}>
      <p className="callout__label" style={{ marginBottom: '0.5rem' }}>
        What a strong answer includes
      </p>
      {question.guidance && <p className="muted">{question.guidance}</p>}
      <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={() => setAcknowledged((value) => !value)}
        />
        <span>My answer addresses these points. (Self-assessed — not graded.)</span>
      </label>
    </div>
  );
}

function Feedback({ question, answer }: { question: AssessmentQuestion; answer: Answer }) {
  if (question.type === 'short_rationale') {
    return <ShortRationaleFeedback question={question} />;
  }

  const { correct } = gradeQuestion(question, answer);

  if (question.type === 'multiple_choice' || question.type === 'true_false') {
    const index = answer as number | undefined;
    const option = index === undefined ? undefined : question.options?.[index];
    const correctOption = (question.options ?? []).find((o) => o.correct);
    return (
      <div className="quiz__feedback" style={{ marginTop: '1rem' }}>
        <p className={correct ? 'success-text' : 'error-text'}>
          <strong>{correct ? 'Correct — ' : 'Not quite — '}</strong>
          {correct
            ? 'that is the best answer.'
            : `the best answer is: ${correctOption?.text ?? '—'}`}
        </p>
        {option?.feedback && <p className="muted">{option.feedback}</p>}
      </div>
    );
  }

  if (question.type === 'multiple_select') {
    const selected = new Set((answer as number[]) ?? []);
    return (
      <div className="quiz__feedback" style={{ marginTop: '1rem' }}>
        <p className={correct ? 'success-text' : 'error-text'}>
          <strong>{correct ? 'Correct — ' : 'Not quite — '}</strong>
          {correct ? 'you selected exactly the right set.' : 'review the selections below.'}
        </p>
        <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
          {(question.options ?? []).map((option, index) => {
            const chose = selected.has(index);
            const shouldChoose = Boolean(option.correct);
            if (!chose && !shouldChoose) return null;
            return (
              <li key={option.text} className="muted">
                <strong>
                  {shouldChoose ? '✓ ' : '✗ '}
                  {option.text}:{' '}
                </strong>
                {option.feedback}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // matching / ordering / ranking
  return (
    <div className="quiz__feedback" style={{ marginTop: '1rem' }}>
      <p className={correct ? 'success-text' : 'error-text'}>
        <strong>{correct ? 'Correct — ' : 'Not quite — '}</strong>
        {correct ? 'that arrangement matches.' : 'see the explanation below.'}
      </p>
      {!correct && question.type !== 'matching' && question.correct_order && (
        <p className="muted">
          Correct order: {question.correct_order.join(' → ')}
        </p>
      )}
      {!correct && question.type === 'matching' && (
        <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
          {(question.pairs ?? []).map((pair) => (
            <li key={pair.left} className="muted">
              {pair.left} → {pair.right}
            </li>
          ))}
        </ul>
      )}
      {question.feedback && <p className="muted">{question.feedback}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

function Results({
  assessment,
  answers,
  result,
  passPercent,
  saving,
  saveError,
  attemptNumber,
  continueHref,
  continueLabel,
  exitHref,
  exitLabel,
  onRetry,
  onRetrySave,
}: {
  assessment: AssessmentData;
  answers: AnswerMap;
  result: ReturnType<typeof scoreAssessment>;
  passPercent: number;
  saving: boolean;
  saveError: string | null;
  attemptNumber: number | null;
  continueHref?: string;
  continueLabel: string;
  exitHref: string;
  exitLabel: string;
  onRetry: () => void;
  onRetrySave: () => void;
}) {
  const [review, setReview] = useState(false);
  const scorePercent = Math.round(result.score * 100);

  return (
    <div>
      <section className="card" aria-labelledby="results-heading" role="status" aria-live="polite">
        <p className="callout__label">{result.passed ? 'Passed' : 'Not yet'}</p>
        <h2 id="results-heading" style={{ marginTop: 0 }}>
          {result.passed ? 'You passed the assessment' : 'Almost there'}
        </h2>
        <p style={{ fontSize: 'var(--step-3)', fontFamily: 'var(--font-serif)', margin: '0.5rem 0' }}>
          {scorePercent}%
          {result.distinction && (
            <span className="success-text" style={{ fontSize: 'var(--step-0)' }}>
              {' '}— with distinction
            </span>
          )}
        </p>
        <p className="muted">
          {result.correct} of {result.scoredTotal} scored{' '}
          {result.scoredTotal === 1 ? 'question' : 'questions'} correct. Passing is {passPercent}%.
          {result.presentedTotal > result.scoredTotal && (
            <>
              {' '}
              Judgment and written-rationale questions are not graded right or wrong.
            </>
          )}
        </p>

        {result.passed ? (
          <p>Nice work — your understanding of this material is solid.</p>
        ) : (
          <p>
            You are close. Review the questions you missed below, then retry — there is no limit on
            attempts.
          </p>
        )}

        {saving && <p className="muted">Saving your attempt…</p>}
        {attemptNumber !== null && !saving && (
          <p className="muted">Saved as attempt {attemptNumber}.</p>
        )}
        {saveError && (
          <div role="alert">
            <p className="error-text">{saveError}</p>
            <button className="button button--secondary" type="button" onClick={onRetrySave}>
              Try saving again
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button className="button button--secondary" type="button" onClick={() => setReview((r) => !r)}>
            {review ? 'Hide answers' : 'Review answers'}
          </button>
          <button className="button button--secondary" type="button" onClick={onRetry}>
            Retry assessment
          </button>
          {result.passed && continueHref && (
            <a className="button button--primary" href={continueHref}>
              {continueLabel}
            </a>
          )}
          {!result.passed && (
            <a className="button button--ghost" href={exitHref}>
              {exitLabel}
            </a>
          )}
        </div>
      </section>

      {review && (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
          {assessment.questions.map((question, index) => (
            <section key={question.id} className="quiz" aria-label={`Question ${index + 1} review`}>
              <p className="muted" style={{ marginTop: 0 }}>
                Question {index + 1}
                {question.section && <> · {question.section}</>}
              </p>
              <p style={{ fontWeight: 600 }}>{question.stem}</p>
              <AnswerSummary question={question} answer={answers[question.id]} />
              {isScored(question) ? (
                <Feedback question={question} answer={answers[question.id]} />
              ) : question.type === 'judgment' ? (
                question.synthesis && (
                  <details className="reveal" style={{ marginTop: '0.75rem' }}>
                    <summary>What good looks like</summary>
                    <div>
                      <p style={{ marginBottom: 0 }}>{question.synthesis}</p>
                    </div>
                  </details>
                )
              ) : (
                question.guidance && (
                  <p className="muted" style={{ marginTop: '0.75rem' }}>
                    <strong>Guidance: </strong>
                    {question.guidance}
                  </p>
                )
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function AnswerSummary({ question, answer }: { question: AssessmentQuestion; answer: Answer }) {
  let text = '—';
  switch (question.type) {
    case 'multiple_choice':
    case 'true_false':
    case 'judgment': {
      const index = answer as number | undefined;
      text = index === undefined ? 'No answer' : question.options?.[index]?.text ?? '—';
      break;
    }
    case 'multiple_select': {
      const selected = (answer as number[]) ?? [];
      text = selected.length
        ? selected.map((i) => question.options?.[i]?.text ?? '').join('; ')
        : 'No answer';
      break;
    }
    case 'matching': {
      const record = (answer as Record<string, string>) ?? {};
      text = (question.pairs ?? [])
        .map((pair) => `${pair.left} → ${record[pair.left] ?? '—'}`)
        .join('; ');
      break;
    }
    case 'ordering':
    case 'ranking': {
      const order = (answer as string[]) ?? [];
      text = order.join(' → ');
      break;
    }
    case 'short_rationale': {
      const value = answer as ShortRationaleAnswer | undefined;
      text = value?.text?.trim() ? value.text : 'No answer';
      break;
    }
  }
  return (
    <p className="muted" style={{ margin: '0.25rem 0' }}>
      <strong>Your answer: </strong>
      {text}
    </p>
  );
}
