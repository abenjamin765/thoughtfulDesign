import { useEffect, useState, type ReactNode } from 'react';
import { getSupabase } from '../lib/supabase';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function AuthGuard({ children, fallback }: Props) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const supabase = getSupabase();
      if (!supabase) {
        setReady(true);
        setAuthenticated(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAuthenticated(Boolean(session));
      setReady(true);

      if (!session) {
        const redirect = `${window.location.pathname}${window.location.search}`;
        window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
      }
    }

    void checkSession();
  }, []);

  if (!ready) {
    return <p className="muted">Checking your session…</p>;
  }

  if (!authenticated) {
    return (
      fallback ?? (
        <p className="muted">
          Redirecting to sign in…
        </p>
      )
    );
  }

  return <>{children}</>;
}
