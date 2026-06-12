// ---------------------------------------------------------------------------
// Server-only assessment loader (build time).
//
// Imports `astro:content`, so this must NEVER be imported by a client island.
// The runner island gets plain `AssessmentData` via props built here. Keeping
// the collection access isolated here means lib/assessments.ts stays safe to
// bundle into the browser.
// ---------------------------------------------------------------------------

import { getCollection, type CollectionEntry } from 'astro:content';
import type { AssessmentData, AssessmentType } from './assessments';

type AssessmentEntry = CollectionEntry<'assessments'>;

/** Flatten an assessment entry into the runner's AssessmentData shape. */
export function toAssessmentData(entry: AssessmentEntry): AssessmentData {
  const data = entry.data;
  const questions = data.sections
    ? data.sections.flatMap((section) =>
        section.questions.map((question) => ({ ...question, section: section.title }))
      )
    : data.questions ?? [];

  return {
    id: data.id,
    title: data.title,
    type: data.type,
    pass_threshold: data.pass_threshold,
    distinction_threshold: data.distinction_threshold,
    scenario: data.scenario,
    scenario_brief: data.scenario_brief,
    questions,
  };
}

/** Find the assessment matching a type + id (the YAML `id`). */
export async function loadAssessment(
  type: AssessmentType,
  id: string
): Promise<AssessmentData | null> {
  const entries = await getCollection('assessments');
  const entry = entries.find((item) => item.data.type === type && item.data.id === id);
  return entry ? toAssessmentData(entry) : null;
}
