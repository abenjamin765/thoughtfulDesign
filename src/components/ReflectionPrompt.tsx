import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';

type Props = {
  lessonSlug: string;
  prompt: string;
};

export default function ReflectionPrompt({ lessonSlug, prompt }: Props) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReflection() {
      const supabase = getSupabase();
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('lesson_progress')
        .select('reflection_text')
        .eq('user_id', user.id)
        .eq('lesson_slug', lessonSlug)
        .maybeSingle();

      if (data?.reflection_text) {
        setValue(data.reflection_text);
      }
    }

    void loadReflection();
  }, [lessonSlug]);

  async function saveReflection() {
    setStatus('saving');
    setError(null);

    const supabase = getSupabase();
    if (!supabase) {
      setStatus('error');
      setError('Supabase is not configured yet.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus('error');
      setError('Sign in to save your reflection.');
      return;
    }

    const { error: saveError } = await supabase.from('lesson_progress').upsert(
      {
        user_id: user.id,
        lesson_slug: lessonSlug,
        reflection_text: value,
      },
      { onConflict: 'user_id,lesson_slug' },
    );

    if (saveError) {
      setStatus('error');
      setError(saveError.message);
      return;
    }

    setStatus('saved');
  }

  return (
    <div className="reflection">
      <h3>Reflection</h3>
      <p>{prompt}</p>
      <textarea
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setStatus('idle');
        }}
        placeholder="Write your reflection here…"
      />
      {error && <p className="error-text">{error}</p>}
      {status === 'saved' && <p className="success-text">Reflection saved.</p>}
      <button
        className="button button--secondary"
        type="button"
        onClick={() => void saveReflection()}
        disabled={status === 'saving' || value.trim().length === 0}
      >
        {status === 'saving' ? 'Saving…' : 'Save reflection'}
      </button>
    </div>
  );
}
