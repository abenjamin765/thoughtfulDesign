import { getSupabase } from '../lib/supabase';

export default function SignOutButton() {
  async function signOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <button className="button button--ghost" type="button" onClick={() => void signOut()}>
      Sign out
    </button>
  );
}
