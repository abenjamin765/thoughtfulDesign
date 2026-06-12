import { useState } from 'react';
import { deleteAccountData } from '../lib/account';
import { withBase } from '../lib/paths';

// "Delete my account" affordance (ethics-equity-checklist §1.3). Explains
// exactly what is removed, requires an explicit confirmation, then erases the
// learner's data and signs them out. No confirmshaming, no friction beyond a
// single deliberate confirmation step.

const CONFIRM_WORD = 'DELETE';

export default function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    const result = await deleteAccountData();
    if (result.ok) {
      window.location.href = withBase('/?deleted=1');
      return;
    }
    setBusy(false);
    setError(result.error ?? 'Something went wrong. Please try again or email us.');
  }

  return (
    <div className="card" style={{ borderColor: '#e2c7a8', display: 'grid', gap: '0.85rem' }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Delete your account</h2>
      <p style={{ margin: 0 }}>
        Deleting your account permanently removes your profile, lesson progress and reflections,
        quiz responses, assessment attempts, certificate record, and analytics events. This can't
        be undone.
      </p>
      <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
        Your sign-in record is removed on request — email us from the address on your account and
        we'll confirm full removal within 30 days.
      </p>

      {!open ? (
        <button
          type="button"
          className="button button--secondary"
          style={{ justifySelf: 'start', borderColor: '#9b2c2c', color: '#9b2c2c' }}
          onClick={() => setOpen(true)}
        >
          Delete my account
        </button>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <label style={{ display: 'grid', gap: '0.35rem', fontWeight: 600 }}>
            Type {CONFIRM_WORD} to confirm
            <input
              type="text"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              autoComplete="off"
              style={{
                width: 'min(100%, 18rem)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.6rem 0.7rem',
                font: 'inherit',
              }}
            />
          </label>

          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="button button--primary"
              style={{ background: '#9b2c2c' }}
              disabled={busy || confirm.trim() !== CONFIRM_WORD}
              onClick={() => void handleDelete()}
            >
              {busy ? 'Deleting…' : 'Permanently delete'}
            </button>
            <button
              type="button"
              className="button button--ghost"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                setConfirm('');
                setError(null);
              }}
            >
              Keep my account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
