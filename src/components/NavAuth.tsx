import { useEffect, useRef, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { withBase } from '../lib/paths';

type SessionState = 'unknown' | 'anonymous' | 'authenticated';

/**
 * Auth-aware primary navigation (wireframe §Global Navigation).
 *
 * - SSR / no-JS default: renders the PUBLIC nav, so the static fallback is
 *   always the safe, link-only public experience.
 * - On hydration it reads the Supabase session and swaps to the authenticated
 *   nav (Course → /course, Dashboard, account menu) when a session exists, and
 *   keeps it in sync via `onAuthStateChange`.
 *
 * Public:        Course (landing #curriculum) · Blog · Resources · [Log in] · [Enroll →]
 * Authenticated: Course (/course) · Dashboard · Blog · Resources · [account menu]
 */
export default function NavAuth() {
  const [session, setSession] = useState<SessionState>('unknown');
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setSession('anonymous');
      return;
    }

    let active = true;

    void supabase.auth.getSession().then(({ data: { session: current } }) => {
      if (!active) return;
      setSession(current ? 'authenticated' : 'anonymous');
      setEmail(current?.user.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, current) => {
      setSession(current ? 'authenticated' : 'anonymous');
      setEmail(current?.user.email ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  async function signOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = withBase('/');
  }

  // Authenticated nav (only after hydration confirms a live session).
  if (session === 'authenticated') {
    const initials = (email ?? '?').trim().charAt(0).toUpperCase() || '?';
    return (
      <nav className="nav-links" aria-label="Primary">
        <a href={withBase('/course')}>Course</a>
        <a href={withBase('/dashboard')}>Dashboard</a>
        <a href={withBase('/blog')}>Blog</a>
        <a href={withBase('/resources')}>Resources</a>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="button button--ghost"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Account menu"
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              width: '2.25rem',
              height: '2.25rem',
              padding: 0,
              borderRadius: '999px',
              border: '1px solid var(--border)',
              fontWeight: 700,
            }}
          >
            {initials}
          </button>
          {menuOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 0.5rem)',
                minWidth: '12rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                padding: '0.5rem',
                zIndex: 20,
              }}
            >
              {email && (
                <p
                  className="muted"
                  style={{ margin: '0 0 0.5rem', padding: '0 0.5rem', fontSize: '0.8rem', wordBreak: 'break-all' }}
                >
                  {email}
                </p>
              )}
              <a
                role="menuitem"
                href={withBase('/dashboard')}
                style={{ display: 'block', padding: '0.5rem', borderRadius: 'var(--radius)', textDecoration: 'none', color: 'inherit' }}
              >
                Dashboard
              </a>
              <a
                role="menuitem"
                href={withBase('/account')}
                style={{ display: 'block', padding: '0.5rem', borderRadius: 'var(--radius)', textDecoration: 'none', color: 'inherit' }}
              >
                Account settings
              </a>
              <button
                role="menuitem"
                type="button"
                onClick={() => void signOut()}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  font: 'inherit',
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Public nav — also the SSR / no-JS fallback (session === 'unknown').
  return (
    <nav className="nav-links" aria-label="Primary">
      <a href={withBase('/#curriculum')}>Course</a>
      <a href={withBase('/blog')}>Blog</a>
      <a href={withBase('/resources')}>Resources</a>
      <a className="button button--secondary" href={withBase('/login')}>Log in</a>
      <a className="button button--primary" href={withBase('/signup')}>Enroll →</a>
    </nav>
  );
}
