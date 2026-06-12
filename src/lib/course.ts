import yaml from 'js-yaml';
import { getCollection } from 'astro:content';
import courseYamlRaw from '../../content/course.yaml?raw';
import { getLessonSlug, type LessonEntry } from './lessons';

// ---------------------------------------------------------------------------
// Registry types — mirror the shape of content/course.yaml exactly.
// course.yaml is the canonical source of truth for part/module/lesson ordering,
// core claims, loop steps, resource links, and public-preview lesson selection.
// ---------------------------------------------------------------------------

export interface CourseMeta {
  title: string;
  subtitle: string;
  intro_lesson: string;
}

export interface CourseModule {
  id: string;
  order: number;
  title: string;
  core_claim: string;
  loop_steps: string[];
  scenario?: string;
  resource?: string | null;
  secondary_resource?: string | null;
  preview_lesson?: string;
  lessons: string[];
}

export interface Milestone {
  id: string;
  title: string;
  covers: string[];
}

export interface FinalAssessment {
  id: string;
  title: string;
}

export interface CoursePart {
  id: string;
  name: string;
  order: number;
  modules: CourseModule[];
  milestone?: Milestone;
  final_assessment?: FinalAssessment;
}

export interface LoopStep {
  step: string;
  question: string;
}

export interface Scenario {
  id: string;
  name: string;
}

interface CourseYaml {
  course: CourseMeta;
  parts: CoursePart[];
  loop: LoopStep[];
  scenarios: Scenario[];
}

export type AssessmentType = 'module' | 'milestone' | 'final';

// ---------------------------------------------------------------------------
// Parse once at module load. The registry YAML is inlined at build time via
// Vite's `?raw` import, so it resolves correctly in dev and in the bundle.
// ---------------------------------------------------------------------------

const registry = yaml.load(courseYamlRaw) as CourseYaml;

// ---------------------------------------------------------------------------
// Synchronous registry accessors (no collection join needed)
// ---------------------------------------------------------------------------

export function getCourseMeta(): CourseMeta {
  return registry.course;
}

export function getParts(): CoursePart[] {
  return [...registry.parts].sort((a, b) => a.order - b.order);
}

/** All modules across all parts, in canonical course order. */
export function getAllModules(): CourseModule[] {
  return getParts().flatMap((part) =>
    [...part.modules].sort((a, b) => a.order - b.order)
  );
}

export function getModule(id: string): CourseModule | undefined {
  return getAllModules().find((module) => module.id === id);
}

/** The part a given module belongs to. */
export function getPartForModule(moduleId: string): CoursePart | undefined {
  return getParts().find((part) =>
    part.modules.some((module) => module.id === moduleId)
  );
}

export function getMilestones(): Milestone[] {
  return getParts()
    .map((part) => part.milestone)
    .filter((milestone): milestone is Milestone => Boolean(milestone));
}

export function getMilestone(id: string): Milestone | undefined {
  return getMilestones().find((milestone) => milestone.id === id);
}

export function getFinalAssessment(): FinalAssessment | undefined {
  return getParts()
    .map((part) => part.final_assessment)
    .find((final): final is FinalAssessment => Boolean(final));
}

export function getLoop(): LoopStep[] {
  return registry.loop ?? [];
}

export function getScenarios(): Scenario[] {
  return registry.scenarios ?? [];
}

/**
 * Ordered list of every lesson slug in canonical course order:
 * the intro lesson first, then each module's lessons in registry order.
 */
export function getLessonOrder(): string[] {
  const order: string[] = [];
  const intro = registry.course?.intro_lesson;
  if (intro) order.push(intro);
  for (const module of getAllModules()) {
    for (const slug of module.lessons) order.push(slug);
  }
  return order;
}

/** Map of lesson slug -> global position. Unknown slugs are absent. */
export function getLessonOrderMap(): Map<string, number> {
  return new Map(getLessonOrder().map((slug, index) => [slug, index]));
}

/** Resolve the module a lesson slug belongs to (intro lesson has no module). */
export function getModuleForLesson(slug: string): CourseModule | undefined {
  return getAllModules().find((module) => module.lessons.includes(slug));
}

/**
 * Build the route path for an assessment.
 * Returns a base-relative path; callers apply any site base prefix.
 */
export function getAssessmentPath(type: AssessmentType, id: string): string {
  switch (type) {
    case 'module':
      return `/course/modules/${id}/assessment`;
    case 'milestone':
      return `/course/milestones/${id}/assessment`;
    case 'final':
      return `/course/final/assessment`;
  }
}

// ---------------------------------------------------------------------------
// Collection-join accessors (async). These tie registry slugs to the Astro
// `lessons` content collection so callers get full lesson entries in order.
// ---------------------------------------------------------------------------

async function getLessonsBySlug(): Promise<Map<string, LessonEntry>> {
  const lessons = await getCollection('lessons');
  return new Map(lessons.map((lesson) => [getLessonSlug(lesson), lesson]));
}

/**
 * Lessons for a module, joined to the collection and ordered by the registry.
 * Slugs without a matching (or unpublished) collection entry are skipped.
 */
export async function getModuleLessons(moduleId: string): Promise<LessonEntry[]> {
  const module = getModule(moduleId);
  if (!module) return [];
  const bySlug = await getLessonsBySlug();
  return module.lessons
    .map((slug) => bySlug.get(slug))
    .filter((entry): entry is LessonEntry => Boolean(entry));
}

/**
 * The next lesson after `slug` in canonical course order, joined to the
 * collection. Returns null if `slug` is last or unknown.
 */
export async function getNextLesson(slug: string): Promise<LessonEntry | null> {
  const order = getLessonOrder();
  const index = order.indexOf(slug);
  if (index === -1 || index === order.length - 1) return null;
  const bySlug = await getLessonsBySlug();
  // Skip forward over any slugs missing from the collection.
  for (let i = index + 1; i < order.length; i++) {
    const entry = bySlug.get(order[i]);
    if (entry) return entry;
  }
  return null;
}

/**
 * The previous lesson before `slug` in canonical course order, joined to the
 * collection. Returns null if `slug` is first or unknown.
 */
export async function getPreviousLesson(slug: string): Promise<LessonEntry | null> {
  const order = getLessonOrder();
  const index = order.indexOf(slug);
  if (index <= 0) return null;
  const bySlug = await getLessonsBySlug();
  for (let i = index - 1; i >= 0; i--) {
    const entry = bySlug.get(order[i]);
    if (entry) return entry;
  }
  return null;
}

/**
 * The public-preview lesson for a module, joined to the collection.
 * Returns null if the module has no preview lesson or it is missing/unpublished.
 */
export async function getPreviewLesson(moduleId: string): Promise<LessonEntry | null> {
  const module = getModule(moduleId);
  if (!module?.preview_lesson) return null;
  const bySlug = await getLessonsBySlug();
  return bySlug.get(module.preview_lesson) ?? null;
}
