import { useEffect, useState, type ReactNode } from 'react';
import { getSupabase } from '../lib/supabase';
import { withBase } from '../lib/paths';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * When true, the guard never gates or redirects — content renders for
   * everyone, authenticated or not. Used for `public_preview` lessons so the
   * full reading is publicly visible; the footer island decides whether to
   * show the tracked experience or an enrollment CTA.
   */
  preview?: boolean;
};

export default function AuthGuard({ children, fallback, preview = false }: Props) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Preview lessons are public: skip the session check and never redirect.
    if (preview) return;

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
        window.location.href = `${withBase('/login')}?redirect=${encodeURIComponent(redirect)}`;
      }
    }

    void checkSession();
  }, [preview]);

  // Public preview: render the lesson immediately, no session gate.
  if (preview) {
    return <>{children}</>;
  }

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
