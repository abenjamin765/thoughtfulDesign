import { getSupabase } from '../lib/supabase';
import { withBase } from '../lib/paths';

export default function SignOutButton() {
  async function signOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = withBase('/');
  }

  return (
    <button className="button button--ghost" type="button" onClick={() => void signOut()}>
      Sign out
    </button>
  );
}
