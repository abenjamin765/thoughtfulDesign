import { useState } from 'react';
import { getSupabase } from '../lib/supabase';

type Mode = 'login' | 'signup';

type Props = {
  mode: Mode;
  redirectTo?: string;
};

export default function AuthForm({ mode, redirectTo = '/course' }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      setError('Supabase is not configured. Add PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      });

      setLoading(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        window.location.href = redirectTo;
      } else {
        setMessage('Check your email to confirm your account, then sign in.');
      }
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    window.location.href = redirectTo;
  }

  return (
    <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
      <h1>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
      <p className="muted">
        {mode === 'signup'
          ? 'Join Thoughtful Design and track your progress.'
          : 'Sign in to continue learning.'}
      </p>

      {mode === 'signup' && (
        <label>
          Display name
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            autoComplete="name"
          />
        </label>
      )}

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />
      </label>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <button className="button button--primary" type="submit" disabled={loading}>
        {loading ? 'Working…' : mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>
    </form>
  );
}
