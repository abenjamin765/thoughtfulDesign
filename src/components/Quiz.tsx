import { useMemo, useState } from 'react';
import { getSupabase } from '../lib/supabase';

export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  feedback?: string;
};

type Props = {
  lessonSlug: string;
  questions: QuizQuestion[];
  onComplete?: () => void;
};

export default function Quiz({ lessonSlug, questions, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const score = useMemo(() => {
    if (!submitted) return null;
    const correct = questions.reduce((count, question, index) => {
      return answers[index] === question.answer ? count + 1 : count;
    }, 0);
    return { correct, total: questions.length };
  }, [answers, questions, submitted]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const unanswered = questions.findIndex((_, index) => answers[index] === undefined);
    if (unanswered !== -1) {
      setError(`Please answer question ${unanswered + 1}.`);
      return;
    }

    setSubmitted(true);

    const supabase = getSupabase();
    if (!supabase) return;

    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const rows = questions.map((question, index) => ({
      user_id: user.id,
      lesson_slug: lessonSlug,
      question_index: index,
      selected_answer: answers[index],
      correct: answers[index] === question.answer,
    }));

    const { error: saveError } = await supabase.from('quiz_responses').upsert(rows, {
      onConflict: 'user_id,lesson_slug,question_index',
    });

    setSaving(false);

    if (saveError) {
      setError(`We couldn't save your answers (${saveError.message}). Your feedback is shown above; check your connection and press “Update answers” to try again.`);
      return;
    }

    const correctCount = questions.reduce((count, question, index) => {
      return answers[index] === question.answer ? count + 1 : count;
    }, 0);

    if (correctCount === questions.length) {
      onComplete?.();
    }
  }

  return (
    <form className="quiz" onSubmit={handleSubmit}>
      <h3>Check your understanding</h3>
      {questions.map((question, index) => (
        <fieldset key={question.prompt}>
          <legend>
            {index + 1}. {question.prompt}
          </legend>
          {question.options.map((option, optionIndex) => (
            <label key={option}>
              <input
                type="radio"
                name={`question-${index}`}
                value={optionIndex}
                checked={answers[index] === optionIndex}
                onChange={() =>
                  setAnswers((current) => ({
                    ...current,
                    [index]: optionIndex,
                  }))
                }
              />
              <span>{option}</span>
            </label>
          ))}
          {submitted && (
            <div className="quiz__feedback" role="status" aria-live="polite">
              <p className={answers[index] === question.answer ? 'success-text' : 'error-text'}>
                <strong>{answers[index] === question.answer ? 'Correct — ' : 'Not quite — '}</strong>
                {answers[index] === question.answer
                  ? 'that matches the best answer.'
                  : `the best answer is: ${question.options[question.answer]}`}
              </p>
              {question.feedback && <p className="muted">{question.feedback}</p>}
            </div>
          )}
        </fieldset>
      ))}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      {submitted && score && (
        <p
          className={score.correct === score.total ? 'success-text' : 'muted'}
          role="status"
          aria-live="polite"
        >
          You got {score.correct} of {score.total} correct.
        </p>
      )}
      <button className="button button--primary" type="submit" disabled={saving}>
        {saving ? 'Saving…' : submitted ? 'Update answers' : 'Submit quiz'}
      </button>
    </form>
  );
}
