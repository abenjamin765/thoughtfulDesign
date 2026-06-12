// ---------------------------------------------------------------------------
// Lightweight analytics — Phase 8 (metrics.md instrumentation hooks).
//
// trackEvent appends one row to public.analytics_events. It is deliberately
// fire-and-forget and defensive:
//   - no-op when Supabase is unconfigured (static preview / local dev)
//   - no-op (silently) when the table is missing or the insert is rejected
//     (e.g. an anonymous visitor whose insert fails RLS — only signed-in
//     events are persisted, which is fine for the launch metrics set)
//   - never throws into the calling island, never blocks a user action
//
// Event names map 1:1 to the 7 launch events in docs/metrics.md:
//   signup · lesson_started · lesson_completed · assessment_passed ·
//   assessment_failed · resource_downloaded · certificate_issued
// ---------------------------------------------------------------------------

import { getSupabase } from './supabase';

export type AnalyticsEvent =
  | 'signup'
  | 'lesson_started'
  | 'lesson_completed'
  | 'assessment_passed'
  | 'assessment_failed'
  | 'resource_downloaded'
  | 'certificate_issued';

export async function trackEvent(
  name: AnalyticsEvent,
  properties: Record<string, unknown> = {},
): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from('analytics_events').insert({
      user_id: user?.id ?? null,
      event_name: name,
      properties,
    });
  } catch {
    // Analytics must never interrupt the learner. Swallow all failures
    // (missing table, RLS rejection, offline) — the action already succeeded.
  }
}
