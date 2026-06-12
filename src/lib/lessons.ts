import { getCollection, type CollectionEntry } from 'astro:content';
import { getLessonOrderMap } from './course';

export type LessonEntry = CollectionEntry<'lessons'>;

export async function getPublishedLessons() {
  const lessons = await getCollection('lessons');
  const orderMap = getLessonOrderMap();
  const positionFor = (lesson: LessonEntry) =>
    orderMap.get(getLessonSlug(lesson)) ?? Number.POSITIVE_INFINITY;

  return lessons
    .filter((lesson) => lesson.data.published)
    .sort((a, b) => {
      // Primary: canonical course.yaml order (part -> module -> lesson).
      const positionDiff = positionFor(a) - positionFor(b);
      if (positionDiff !== 0) return positionDiff;
      // Fallback for any lesson not present in the registry: keep deterministic
      // by module name then frontmatter order.
      if (a.data.module !== b.data.module) {
        return a.data.module.localeCompare(b.data.module);
      }
      return a.data.order - b.data.order;
    });
}

export function groupLessonsByModule(lessons: LessonEntry[]) {
  const modules = new Map<string, LessonEntry[]>();

  for (const lesson of lessons) {
    const existing = modules.get(lesson.data.module) ?? [];
    existing.push(lesson);
    modules.set(lesson.data.module, existing);
  }

  return [...modules.entries()].map(([name, moduleLessons]) => ({
    name,
    lessons: moduleLessons,
  }));
}

export function getLessonSlug(lesson: LessonEntry) {
  const filename = lesson.id.split('/').pop() ?? lesson.id;
  return filename.replace(/\.mdx?$/, '');
}
