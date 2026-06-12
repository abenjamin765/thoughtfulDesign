// ---------------------------------------------------------------------------
// Account data deletion — Phase 8 (ethics-equity-checklist §1.3).
//
// The Supabase anon client cannot delete the auth.users record (that needs the
// service role), so the most we can do from the browser is erase every row of
// personal data the learner owns, then sign them out. Full removal of the
// sign-in record is handled on request (see /privacy and /contact).
//
// Order matters only in that we clear data tables before profile; all use
// per-user RLS DELETE policies added in migration 002.
// ---------------------------------------------------------------------------

import { getSupabase } from './supabase';

const USER_TABLES = [
  'analytics_events',
  'quiz_responses',
  'lesson_progress',
  'assessment_attempts',
  'certificates',
  'profiles',
] as const;

export interface DeleteAccountResult {
  ok: boolean;
  error?: string;
}

/**
 * Delete all of the signed-in user's data, then sign out.
 * `profiles` is keyed by `id`; every other table is keyed by `user_id`.
 */
export async function deleteAccountData(): Promise<DeleteAccountResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: 'Account management is not available right now. Please email us so we can help.' };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'You need to be signed in to delete your account.' };
  }

  for (const table of USER_TABLES) {
    const column = table === 'profiles' ? 'id' : 'user_id';
    const { error } = await supabase.from(table).delete().eq(column, user.id);
    if (error) {
      return {
        ok: false,
        error: `We couldn't finish deleting your data (${error.message}). Nothing else was changed — please try again, or email us and we'll remove it for you.`,
      };
    }
  }

  await supabase.auth.signOut();
  return { ok: true };
}
